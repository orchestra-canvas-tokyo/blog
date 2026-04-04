import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import sveltePlugin from 'eslint-plugin-svelte';
import globals from 'globals';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
  {
    ignores: [
      '**/.DS_Store',
      '**/.env',
      '**/.env.*',
      '**/node_modules',
      '**/package-lock.json',
      '**/pnpm-lock.yaml',
      '**/yarn.lock',
      '!**/.env.example',
      '.svelte-kit',
      'build',
      'package'
    ]
  },
  js.configs.recommended,
  ...typescriptEslint.configs['flat/recommended'],
  ...sveltePlugin.configs['flat/recommended'],
  {
    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        ...globals.browser,
        ...globals.node
      },
      sourceType: 'module'
    }
  },
  {
    files: ['**/*.svelte'],
    languageOptions: {
      parserOptions: {
        extraFileExtensions: ['.svelte'],
        parser: tsParser
      }
    }
  },
  prettier,
  {
    rules: {
      'no-irregular-whitespace': 'off'
    }
  }
];
