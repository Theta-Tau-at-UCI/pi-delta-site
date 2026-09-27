# Project Structure

Living reference for how the repo is organized. Update when the structure changes.

```
.
├── astro.config.mjs        # Astro config (React island + Tailwind Vite plugin)
├── tsconfig.json           # TypeScript (strict) + path aliases
├── eslint.config.js        # ESLint flat config (TS + Astro + jsx-a11y)
├── .prettierrc.json        # Prettier + Astro/Tailwind plugins
├── .editorconfig           # Cross-editor formatting baseline
├── .nvmrc                  # Pinned Node version
├── .env.example            # Environment variable template (copy to .env)
├── .gitignore
├── CLAUDE.md               # Operating guide for Claude Code sessions
├── CONTRIBUTING.md         # Contributor setup + standards
├── README.md
├── .github/                # CI workflow (ci.yml) + PR template
├── .vscode/                # Recommended editor extensions
├── docs/                   # Project documentation (this folder)
├── public/                 # Static assets served as-is
│   ├── favicon.svg
│   ├── images/             # General images (use astro:assets <Image/> in src for optimization)
│   ├── logos/              # Brand logos (to be provided)
│   └── icons/              # Icons / SVGs
└── src/
    ├── pages/              # Routes: index (home), brothers, recruitment, about
    │                       #   (lean nav, no dead-end pages)
    ├── layouts/            # Page shells (PageLayout.astro)
    ├── components/
    │   ├── layout/         # AnnouncementBanner, Navbar, Footer
    │   ├── sections/       # Astro sections (static, reliable): PageHeader, Pillars,
    │   │                   #   Testimonials, BentoExplore, MajorsChart,
    │   │                   #   BackgroundGradientAnimation
    │   ├── react/          # React islands — only AuroraHero now (ADR-015 moved the
    │   │                   #   rest to static Astro for reliability)
    │   ├── ui/             # Reusable primitives (Section; Button/Card available)
    │   └── SEO.astro       # SEO metadata helper
    ├── content/            # Content collection entries (Markdown/MDX) — empty for now
    ├── content.config.ts   # Content Collections config (scaffold; no collections yet)
    ├── data/               # Structured site data (site.ts — nav, social, config)
    ├── lib/                # Helpers (seo.ts, utils.ts)
    ├── styles/             # global.css (Tailwind v4 + design tokens)
    ├── types/              # Shared TypeScript types
    └── env.d.ts            # Env + Astro client type references
```

## Path aliases (see `tsconfig.json`)

| Alias            | Resolves to       |
| ---------------- | ----------------- |
| `@/*`            | `src/*`           |
| `@components/*`  | `src/components/*`|
| `@layouts/*`     | `src/layouts/*`   |
| `@lib/*`         | `src/lib/*`       |
| `@data/*`        | `src/data/*`      |
| `@styles/*`      | `src/styles/*`    |

> Note: there is intentionally **no** `@types/*` alias — it collides with TypeScript's
> reserved DefinitelyTyped `@types` scope. Import shared types via `@/types/...`.

## Conventions

- `.astro` for static/markup components; `.tsx` React islands only where interactivity is needed.
- Hydrate islands lazily (`client:visible` / `client:idle`).
- Co-locate component-specific types; share cross-cutting types in `src/types`.
