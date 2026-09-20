import assert from 'node:assert/strict';
import test from 'node:test';

import { ESLint } from 'eslint';

import defineConfig from '../eslint.config.js';
import prettier from '../prettier.config.js';

test('exports a flat ESLint configuration', () => {
  const config = defineConfig({ tsconfigRootDir: process.cwd() });
  assert.ok(Array.isArray(config));
  assert.ok(config.length > 5);
});

test('exports Burtson Labs formatting defaults', () => {
  assert.equal(prettier.singleQuote, true);
  assert.equal(prettier.printWidth, 100);
  assert.equal(prettier.trailingComma, 'all');
});

test('plugins execute on the supported ESLint runtime', async () => {
  const eslint = new ESLint({
    overrideConfigFile: true,
    overrideConfig: defineConfig({ tsconfigRootDir: process.cwd() }),
  });
  const [result] = await eslint.lintText('export const value = 1;\n', { filePath: 'fixture.js' });
  assert.equal(result.fatalErrorCount, 0);
});
