import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores([
    'dist',
    'build',
    '.react-router',
    'test-results',
    'playwright-report',
    'graphify-out',
  ]),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    // React Router route modules legitimately export meta/links/loader etc.
    // alongside the component; @react-router/dev handles their HMR.
    files: ['src/routes/**/*.tsx', 'src/root.tsx'],
    rules: {
      'react-refresh/only-export-components': [
        'error',
        {
          allowExportNames: [
            'meta',
            'links',
            'headers',
            'handle',
            'loader',
            'clientLoader',
            'action',
            'clientAction',
            'shouldRevalidate',
          ],
        },
      ],
    },
  },
]);
