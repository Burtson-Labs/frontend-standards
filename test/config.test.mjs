import assert from 'node:assert/strict';
import test from 'node:test';

import { mkdtempSync, mkdirSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

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

test('import rules resolve a real TypeScript import graph', async () => {
  const root = mkdtempSync(join(tmpdir(), 'bl-standards-'));
  try {
    mkdirSync(join(root, 'src'));
    writeFileSync(
      join(root, 'tsconfig.json'),
      JSON.stringify({
        compilerOptions: { module: 'NodeNext', moduleResolution: 'NodeNext', strict: true },
        include: ['src'],
      }),
    );
    writeFileSync(join(root, 'src/helper.ts'), 'export const helper = (): number => 1;\n');
    writeFileSync(
      join(root, 'src/a.ts'),
      "import { helper } from './helper.js';\n\nexport const value: number = helper();\n",
    );
    writeFileSync(
      join(root, 'src/b.ts'),
      "import { missing } from './nowhere.js';\n\nexport const value: unknown = missing;\n",
    );
    const eslint = new ESLint({
      cwd: root,
      overrideConfigFile: true,
      overrideConfig: defineConfig({ tsconfigRootDir: root }),
    });
    const [a, b] = await eslint.lintFiles(['src/a.ts', 'src/b.ts']);
    const importErrors = (r) =>
      r.messages.filter((m) => m.ruleId?.startsWith('import/') || /resolver/.test(m.message));
    assert.deepEqual(
      importErrors(a).map((m) => m.message),
      [],
    );
    assert.ok(
      importErrors(b).some((m) => m.ruleId === 'import/no-unresolved'),
      'an unresolvable import is still reported',
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('the TypeScript resolver is referenced by an absolute path that exists', () => {
  // Later flat-config entries win; ours is the last to set a resolver.
  const settings = defineConfig({ tsconfigRootDir: process.cwd() })
    .map((c) => c.settings?.['import/resolver'])
    .filter(Boolean)
    .at(-1);
  const key = Object.keys(settings).find((k) => /eslint-import-resolver-typescript/.test(k));
  assert.ok(key.startsWith('/') || /^[A-Za-z]:\\/.test(key), key);
  assert.ok(existsSync(key), key);
});
