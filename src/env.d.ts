/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_SITE_URL: string;
  readonly PUBLIC_SITE_NAME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
