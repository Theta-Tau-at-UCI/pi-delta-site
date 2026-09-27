// ESLint flat config for an Astro + TypeScript + React-islands project.
// Docs: https://docs.astro.build/en/editor-setup/ and https://typescript-eslint.io
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import globals from 'globals';

export default tseslint.config(
  // Ignore build output and generated files.
  {
    ignores: ['dist/', '.astro/', 'node_modules/', '.output/'],
  },

  // Base JS + TypeScript recommended rules.
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // Astro components (.astro) — official recommended config.
  ...astro.configs.recommended,

  // Accessibility rules for React islands (.jsx/.tsx).
  {
    files: ['**/*.{jsx,tsx}'],
    ...jsxA11y.flatConfigs.recommended,
  },

  // Triple-slash references are the correct idiom inside .d.ts files
  // (e.g. Astro's generated env.d.ts), so allow them there.
  {
    files: ['**/*.d.ts'],
    rules: {
      '@typescript-eslint/triple-slash-reference': 'off',
    },
  },

  // Browser + Node globals where appropriate.
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
);
