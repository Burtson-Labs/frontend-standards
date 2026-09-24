import js from '@eslint/js';
import query from '@tanstack/eslint-plugin-query';
import prettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { createRequire } from 'node:module';

import globals from 'globals';
import tseslint from 'typescript-eslint';

// Name the parser and resolver by their resolved paths, not bare names. A
// consumer's package manager may hoist eslint-plugin-import while leaving these
// nested under the standards package; bare names are then looked up from the
// consumer's root, fail, and every import rule reports "invalid interface
// loaded as resolver" or "Cannot find module '@typescript-eslint/parser'"
// instead of linting.
const requireHere = createRequire(import.meta.url);
const TYPESCRIPT_RESOLVER = requireHere.resolve('eslint-import-resolver-typescript');
const TYPESCRIPT_PARSER = createRequire(requireHere.resolve('typescript-eslint')).resolve(
  '@typescript-eslint/parser',
);
const TS_EXTENSIONS = ['.ts', '.cts', '.mts', '.tsx'];

// eslint-plugin-import's TypeScript preset with those paths substituted. It has
// no `files`, so plain JS config files (prettier.config.js importing a package
// `exports` subpath) resolve the same way as TypeScript sources.
const importTypescript = {
  ...importPlugin.flatConfigs.typescript,
  settings: {
    ...importPlugin.flatConfigs.typescript.settings,
    'import/parsers': { [TYPESCRIPT_PARSER]: TS_EXTENSIONS },
    'import/resolver': {
      [TYPESCRIPT_RESOLVER]: { alwaysTryTypes: true },
      node: importPlugin.flatConfigs.typescript.settings['import/resolver'].node,
    },
  },
};

const DEFAULT_FILES = ['src/**/*.{ts,tsx}'];
const DEFAULT_IGNORES = [
  '**/dist/**',
  '**/build/**',
  '**/coverage/**',
  '**/node_modules/**',
  '.vite/**',
];

/**
 * Burtson Labs' TypeScript + React lint baseline.
 *
 * The function form lets each consumer provide its own project root and source
 * globs while keeping the actual rules identical across repositories.
 */
export function defineBurtsonFrontendConfig({
  files = DEFAULT_FILES,
  ignores = [],
  tsconfigRootDir = process.cwd(),
} = {}) {
  return tseslint.config(
    { ignores: [...DEFAULT_IGNORES, ...ignores] },
    js.configs.recommended,
    { settings: { react: { version: 'detect' } } },
    ...tseslint.configs.recommendedTypeChecked,
    importPlugin.flatConfigs.recommended,
    importTypescript,
    react.configs.flat.recommended,
    react.configs.flat['jsx-runtime'],
    jsxA11y.flatConfigs.recommended,
    ...query.configs['flat/recommended'],
    {
      files,
      languageOptions: {
        ecmaVersion: 2022,
        globals: globals.browser,
        parserOptions: {
          projectService: true,
          tsconfigRootDir,
        },
      },
      plugins: {
        'react-hooks': reactHooks,
        'react-refresh': reactRefresh,
      },
      rules: {
        ...reactHooks.configs.recommended.rules,
        ...reactRefresh.configs.recommended.rules,
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            args: 'after-used',
            argsIgnorePattern: '^_',
            caughtErrorsIgnorePattern: '^_',
            destructuredArrayIgnorePattern: '^_',
            varsIgnorePattern: '^_',
          },
        ],
        eqeqeq: ['error', 'always', { null: 'ignore' }],
        'import/default': 'off',
        'import/no-named-as-default': 'off',
        'import/no-named-as-default-member': 'off',
        'import/order': [
          'error',
          {
            alphabetize: { caseInsensitive: true, order: 'asc' },
            groups: [
              'builtin',
              'external',
              'internal',
              'parent',
              'sibling',
              'index',
              'object',
              'unknown',
            ],
            'newlines-between': 'always',
          },
        ],
        'react/prop-types': 'off',
        'react-refresh/only-export-components': 'off',
      },
    },
    {
      files: ['**/*.{js,mjs,cjs}'],
      extends: [tseslint.configs.disableTypeChecked],
      languageOptions: { globals: globals.node },
    },
    {
      files,
      ignores: ['**/index.ts', '**/index.tsx'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            paths: [
              {
                name: '.',
                message: 'Import the module directly instead of its local barrel file.',
              },
              {
                name: './index',
                message: 'Import the module directly instead of its local barrel file.',
              },
            ],
          },
        ],
      },
    },
    prettier,
  );
}

export default defineBurtsonFrontendConfig;
