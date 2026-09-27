# Contributing

Thanks for helping build the Theta Tau UCI website. This guide keeps the project clean,
consistent, and easy to maintain.

## Getting set up

```bash
nvm use            # use the Node version in .nvmrc (or install Node 20+)
npm install
cp .env.example .env   # PowerShell: Copy-Item .env.example .env
npm run dev            # http://localhost:4321
```

### Optional: UI/UX design-assist skill

This repo intentionally does **not** commit local AI tooling (`.claude/` is git-ignored).
If you use Claude Code and want the UI/UX Pro Max design-assist skill installed locally:

```bash
npx uipro-cli init -a claude
```

## Workflow

1. Create a branch off `main` (e.g. `feat/events-page`, `fix/nav-contrast`).
2. Make focused changes. Keep components small, typed, reusable, and accessible.
3. Run checks before pushing:
   ```bash
   npm run check     # typecheck + lint + format
   npm run build     # make sure it still builds
   ```
4. Open a PR into `main`. CI (`.github/workflows/ci.yml`) runs the same checks.

## Standards

- **TypeScript** everywhere applicable; keep `strict` on.
- **Astro** for markup/static; **React islands** (`.tsx` + `client:*`) only where
  interactivity is genuinely needed — hydrate lazily.
- **Tailwind v4**, configured CSS-first in `src/styles/global.css`. Edit design tokens,
  not scattered hex values.
- **Accessibility first** (WCAG 2.2 AA): semantic HTML, labels, contrast, keyboard support,
  visible focus, `prefers-reduced-motion`.
- **No invented content.** Use clearly-labeled placeholders until real, verified content is
  provided. Track gaps in `docs/TODO.md`.
- **Personal data is sensitive.** Do not commit member names, emails, or photos without
  explicit confirmation and likeness consent (see `CLAUDE.md` / `docs/BRAND_GUIDE.md`).

See [`docs/DEVELOPMENT_GUIDE.md`](docs/DEVELOPMENT_GUIDE.md) and
[`CLAUDE.md`](CLAUDE.md) for more detail.
