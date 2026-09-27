#!/usr/bin/env bash
#
# Point thetatauuci.com at Vercel instead of AWS Amplify.
#
#   apex  thetatauuci.com   A      -> 76.76.21.21          (was an ALIAS to CloudFront)
#   www   www.thetatauuci…  CNAME  -> cname.vercel-dns.com (was the Amplify CloudFront dist)
#
# Before changing anything this script writes a full backup of the hosted zone
# AND a ready-to-apply rollback batch, so undoing the cutover is one command.
# dev.thetatauuci.com is never touched; it stays on Amplify.
#
# Usage:
#   ./scripts/dns-cutover.sh            # show what would change, change nothing
#   ./scripts/dns-cutover.sh --apply    # actually apply it
#   ./scripts/dns-cutover.sh --rollback # restore the records from the backup
#
# Requires AWS credentials with route53:ChangeResourceRecordSets on the zone.
# Authenticate yourself first (this script never handles your password):
#   aws configure            # paste an access key + secret
#   aws sso login            # if the account uses IAM Identity Center
set -euo pipefail

DOMAIN="thetatauuci.com"
APEX_IP="76.76.21.21"
WWW_TARGET="cname.vercel-dns.com"
TTL=60
OUT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/.dns-backup"
MODE="${1:-plan}"

info() { printf '\033[1m%s\033[0m\n' "$*"; }
ok()   { printf '  \033[32m+\033[0m %s\n' "$*"; }
warn() { printf '  \033[33m!\033[0m %s\n' "$*"; }
die()  { printf '\033[31merror:\033[0m %s\n' "$*" >&2; exit 1; }

command -v aws >/dev/null || die "aws CLI not found. brew install awscli"
command -v jq  >/dev/null || die "jq not found. brew install jq"

info "1. Checking AWS credentials"
IDENT=$(aws sts get-caller-identity --output json 2>/dev/null) || die \
"No usable AWS credentials.

Authenticate first, then re-run:
    aws configure      (paste an access key ID + secret access key)
    aws sso login      (if the account uses IAM Identity Center)

If you only have the console root login, sign in at
https://console.aws.amazon.com and create an access key under
IAM > Security credentials, then run 'aws configure'."
ok "authenticated as $(jq -r '.Arn' <<<"$IDENT")"

info "2. Locating the hosted zone for $DOMAIN"
ZONE_ID=$(aws route53 list-hosted-zones-by-name --dns-name "$DOMAIN" \
  --query "HostedZones[?Name=='${DOMAIN}.'].Id | [0]" --output text 2>/dev/null || true)
[ -n "$ZONE_ID" ] && [ "$ZONE_ID" != "None" ] || die "No Route 53 hosted zone found for $DOMAIN on this account."
ZONE_ID="${ZONE_ID#/hostedzone/}"
ok "hosted zone $ZONE_ID"

mkdir -p "$OUT"

info "3. Backing up the current zone"
aws route53 list-resource-record-sets --hosted-zone-id "$ZONE_ID" \
  --output json > "$OUT/zone-before.json"
ok "$OUT/zone-before.json ($(jq '.ResourceRecordSets | length' "$OUT/zone-before.json") records)"

# Build a rollback batch from whatever the apex and www records look like today.
jq --arg d "${DOMAIN}." --arg w "www.${DOMAIN}." '
  { Comment: "Rollback: restore pre-Vercel apex and www records",
    Changes: [ .ResourceRecordSets[]
      | select((.Name == $d and .Type == "A") or (.Name == $w and (.Type == "A" or .Type == "CNAME")))
      | { Action: "UPSERT", ResourceRecordSet: . } ] }' \
  "$OUT/zone-before.json" > "$OUT/rollback.json"
ok "$OUT/rollback.json ($(jq '.Changes | length' "$OUT/rollback.json") records can be restored)"

info "4. Current values"
jq -r --arg d "${DOMAIN}." --arg w "www.${DOMAIN}." '
  .ResourceRecordSets[]
  | select(.Name == $d or .Name == $w or .Name == "dev.\($d)")
  | "  \(.Name)  \(.Type)  -> " +
    (if .AliasTarget then "ALIAS " + .AliasTarget.DNSName
     else ([.ResourceRecords[]?.Value] | join(", ")) end)' "$OUT/zone-before.json"

cat > "$OUT/cutover.json" <<JSON
{
  "Comment": "Point thetatauuci.com at Vercel (was AWS Amplify)",
  "Changes": [
    { "Action": "UPSERT",
      "ResourceRecordSet": {
        "Name": "${DOMAIN}.", "Type": "A", "TTL": ${TTL},
        "ResourceRecords": [{ "Value": "${APEX_IP}" }] } },
    { "Action": "UPSERT",
      "ResourceRecordSet": {
        "Name": "www.${DOMAIN}.", "Type": "CNAME", "TTL": ${TTL},
        "ResourceRecords": [{ "Value": "${WWW_TARGET}" }] } }
  ]
}
JSON

info "5. Proposed change"
echo "  ${DOMAIN}.      A      -> ${APEX_IP}   (ttl ${TTL})"
echo "  www.${DOMAIN}.  CNAME  -> ${WWW_TARGET}  (ttl ${TTL})"
echo "  dev.${DOMAIN}.  untouched, stays on Amplify"

apply_batch() {
  local file="$1" label="$2"
  info "Applying $label"
  local id
  id=$(aws route53 change-resource-record-sets --hosted-zone-id "$ZONE_ID" \
        --change-batch "file://$file" --query 'ChangeInfo.Id' --output text)
  ok "submitted $id"
  info "Waiting for Route 53 to reach INSYNC (usually under 60s)"
  aws route53 wait resource-record-sets-changed --id "$id"
  ok "INSYNC"
}

case "$MODE" in
  --apply)
    apply_batch "$OUT/cutover.json" "the cutover"
    info "6. Verifying"
    for i in $(seq 1 30); do
      apex=$(dig +short "$DOMAIN" A @8.8.8.8 | head -1)
      [ "$apex" = "$APEX_IP" ] && break
      sleep 10
    done
    echo "  apex resolves to: ${apex:-<nothing>}"
    echo "  www resolves to:  $(dig +short "www.$DOMAIN" CNAME @8.8.8.8 | head -1)"
    echo "  https://www.$DOMAIN -> $(curl -sI -m 25 "https://www.$DOMAIN/" | head -1 | tr -d '\r')"
    echo
    warn "TLS may warn for a few minutes until Vercel issues the certificate."
    warn "To undo:  $0 --rollback"
    ;;
  --rollback)
    [ -s "$OUT/rollback.json" ] || die "No backup at $OUT/rollback.json"
    apply_batch "$OUT/rollback.json" "the rollback"
    ok "Records restored to their pre-cutover values."
    ;;
  *)
    echo
    warn "DRY RUN. Nothing was changed."
    warn "Re-run with --apply to perform the cutover."
    ;;
esac
