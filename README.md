# Burtson Labs Frontend Standards

Reusable ESLint and Prettier rules for TypeScript and React projects, published by Burtson Labs for anyone to use.

The baseline favors code that is type-aware, accessible, consistently imported, and mechanically formatted. It uses ESLint's flat configuration format and keeps Prettier last so formatting rules cannot fight correctness rules.

The first release targets ESLint 9, the newest major currently supported by the React, import, and accessibility plugin stack. ESLint 10 support will follow when those upstream peer contracts are compatible.

## Install

Until the first npm release, install directly from GitHub:

```bash
npm install --save-dev github:Burtson-Labs/frontend-standards eslint prettier react typescript
```

After publication:

```bash
npm install --save-dev @burtson-labs/frontend-standards eslint prettier react typescript
```

## ESLint

Create `eslint.config.js`:

```js
import { defineBurtsonFrontendConfig } from '@burtson-labs/frontend-standards';

export default defineBurtsonFrontendConfig({
  tsconfigRootDir: import.meta.dirname,
});
```

Monorepos can provide additional source globs:

```js
export default defineBurtsonFrontendConfig({
  files: ['src/**/*.{ts,tsx}', 'apps/*/src/**/*.{ts,tsx}'],
  tsconfigRootDir: import.meta.dirname,
});
```

## Prettier

Create `prettier.config.js`:

```js
export { default } from '@burtson-labs/frontend-standards/prettier';
```

The shared style uses single quotes, semicolons, 100-column lines, two spaces, trailing commas, and LF endings.

## Philosophy

- TypeScript is the source of truth for component props.
- Imports are grouped, alphabetized, and do not self-reference a local barrel.
- Accessibility and React hook correctness are build-time concerns.
- Intentionally unused parameters start with `_`.
- Repository-specific exceptions belong in the consuming repository and should include a reason.

## License

MIT. Courtesy of Burtson Labs.
