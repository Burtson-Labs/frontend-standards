import type { Linter } from 'eslint';

export interface BurtsonFrontendOptions {
  files?: string[];
  ignores?: string[];
  tsconfigRootDir?: string;
}

export function defineBurtsonFrontendConfig(
  options?: BurtsonFrontendOptions,
): Linter.Config[];

export default defineBurtsonFrontendConfig;
