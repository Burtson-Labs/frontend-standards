<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://cdn.burtson.ai/logos/burtson-labs-logo-alt.png" />
    <source media="(prefers-color-scheme: light)" srcset="https://cdn.burtson.ai/logos/burtson-labs-logo.png" />
    <img src="https://cdn.burtson.ai/logos/burtson-labs-logo-alt.png" alt="Burtson Labs" width="220" />
  </picture>

  # Frontend Standards

  **One dependable TypeScript and React baseline for every frontend.**

  Type-aware ESLint, accessible React rules, deterministic imports, and a shared Prettier style.

  [![CI](https://github.com/Burtson-Labs/frontend-standards/actions/workflows/ci.yml/badge.svg)](https://github.com/Burtson-Labs/frontend-standards/actions/workflows/ci.yml)
  [![License](https://img.shields.io/badge/license-MIT-a60ee5)](LICENSE)
  [![ESLint](https://img.shields.io/badge/ESLint-flat%20config-4B32C3?logo=eslint)](https://eslint.org/)
  [![Prettier](https://img.shields.io/badge/Prettier-100%20columns-F7B93E?logo=prettier&logoColor=111)](https://prettier.io/)

  **<img src="https://api.iconify.design/lucide/heart-handshake.svg?color=%23a60ee5&width=16" align="absmiddle" alt=""> Open standards, courtesy of [Burtson Labs](https://burtson.ai).**
</div>

---

## <picture><source media="(prefers-color-scheme: dark)" srcset="https://api.iconify.design/lucide/sparkles.svg?color=%23f0f6fc&height=22"/><img src="https://api.iconify.design/lucide/sparkles.svg?color=%230d1117&height=22" align="center" alt=""/></picture> What you get

| Standard | What it protects |
|---|---|
| Type-aware TypeScript | Finds mistakes that syntax-only linting cannot see. |
| React Hooks | Enforces hook ordering and catches unsafe component patterns. |
| Accessibility | Applies `jsx-a11y` defaults to JSX and TSX. |
| TanStack Query | Checks query construction and dependency behavior. |
| Import discipline | Groups and alphabetizes imports; prevents self-referencing local barrels. |
| Prettier | Uses one mechanical style across application code, tests, scripts, and CI. |

Prettier is loaded last, so formatting rules never fight correctness rules.

---

## <picture><source media="(prefers-color-scheme: dark)" srcset="https://api.iconify.design/lucide/package-plus.svg?color=%23f0f6fc&height=22"/><img src="https://api.iconify.design/lucide/package-plus.svg?color=%230d1117&height=22" align="center" alt=""/></picture> Install

Until the first npm release, install directly from GitHub:

```bash
npm install --save-dev github:Burtson-Labs/frontend-standards eslint prettier react typescript
```

After publication:

```bash
npm install --save-dev @burtson-labs/frontend-standards eslint prettier react typescript
```

The first release targets ESLint 9, the newest major currently supported by the React, import, and accessibility plugin stack. ESLint 10 support will follow when those upstream peer contracts are compatible.

---

## <picture><source media="(prefers-color-scheme: dark)" srcset="https://api.iconify.design/lucide/scan-code.svg?color=%23f0f6fc&height=22"/><img src="https://api.iconify.design/lucide/scan-code.svg?color=%230d1117&height=22" align="center" alt=""/></picture> ESLint

Create `eslint.config.js`:

```js
import { defineBurtsonFrontendConfig } from '@burtson-labs/frontend-standards';

export default defineBurtsonFrontendConfig({
  tsconfigRootDir: import.meta.dirname,
});
```

For a monorepo, pass every authored source tree:

```js
export default defineBurtsonFrontendConfig({
  files: ['src/**/*.{ts,tsx}', 'apps/*/src/**/*.{ts,tsx}'],
  tsconfigRootDir: import.meta.dirname,
});
```

Recommended scripts:

```json
{
  "scripts": {
    "lint": "eslint src --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "npm run lint -- --fix"
  }
}
```

---

## <picture><source media="(prefers-color-scheme: dark)" srcset="https://api.iconify.design/lucide/paintbrush.svg?color=%23f0f6fc&height=22"/><img src="https://api.iconify.design/lucide/paintbrush.svg?color=%230d1117&height=22" align="center" alt=""/></picture> Prettier

Create `prettier.config.js`:

```js
export { default } from '@burtson-labs/frontend-standards/prettier';
```

The shared style uses:

- Single quotes and semicolons
- 100-column lines
- Two-space indentation
- Trailing commas everywhere supported
- LF line endings
- Preserved prose wrapping

Add a blocking check in CI:

```json
{
  "scripts": {
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "check": "npm run typecheck && npm run lint && npm run format:check"
  }
}
```

---

## <picture><source media="(prefers-color-scheme: dark)" srcset="https://api.iconify.design/lucide/shield-check.svg?color=%23f0f6fc&height=22"/><img src="https://api.iconify.design/lucide/shield-check.svg?color=%230d1117&height=22" align="center" alt=""/></picture> House rules

- TypeScript is the source of truth for component props.
- Imports are grouped, alphabetized, and never self-reference a local barrel.
- Accessibility and React hook correctness are build-time concerns.
- Intentionally unused parameters begin with `_`.
- Repository-specific exceptions stay in the consuming repository and include a reason.
- CI runs with `--max-warnings 0`; a warning is unfinished work, not background noise.

---

## <picture><source media="(prefers-color-scheme: dark)" srcset="https://api.iconify.design/lucide/workflow.svg?color=%23f0f6fc&height=22"/><img src="https://api.iconify.design/lucide/workflow.svg?color=%230d1117&height=22" align="center" alt=""/></picture> Contributing

Issues and pull requests are welcome. Rule changes should include a concrete example, explain the behavior they protect, and avoid forcing repository-specific architecture on every consumer.

```bash
npm install
npm run check
npm run pack:check
```

---

<div align="center">
  <sub>Built in the open by <a href="https://burtson.ai">Burtson Labs</a> · MIT licensed</sub>
</div>
