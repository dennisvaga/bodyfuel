import nextPlugin from '@next/eslint-plugin-next';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      next: nextPlugin
    },
    rules: {
      'next/core-web-vitals': 'error',
      // Add more custom rules here
    },
    settings: {
      next: {
        rootDir: 'apps/shop/'
      }
    }
  },
  {
    ignores: ['.next/', 'node_modules/']
  }
];