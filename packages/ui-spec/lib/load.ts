import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { load as parseYaml } from 'js-yaml';

import type {
  AnatomySpec,
  ApiSpec,
  ComponentSpec,
  IndexSpec,
  TokensSpec,
} from '../types';

const PKG_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const COMPONENTS_DIR = join(PKG_ROOT, 'components');
export const SCHEMA_DIR = join(PKG_ROOT, 'schema');

/** The four YAML files of every spec, keyed by the schema that validates them. */
export const YAML_FILES = ['index', 'anatomy', 'api', 'tokens'] as const;
export type YamlFile = (typeof YAML_FILES)[number];

/** Component directory names under `components/`. */
export function listComponentNames(): string[] {
  return readdirSync(COMPONENTS_DIR)
    .filter((entry) => statSync(join(COMPONENTS_DIR, entry)).isDirectory())
    .sort();
}

export function specFilePath(name: string, file: YamlFile): string {
  return join(COMPONENTS_DIR, name, `${file}.yaml`);
}

export function readYaml<T>(absPath: string): T {
  return parseYaml(readFileSync(absPath, 'utf8')) as T;
}

export function readSchema(file: YamlFile): object {
  return JSON.parse(
    readFileSync(join(SCHEMA_DIR, `${file}.schema.json`), 'utf8')
  ) as object;
}

/** Load the full four-file spec for a component. */
export function loadSpec(name: string): ComponentSpec {
  return {
    index: readYaml<IndexSpec>(specFilePath(name, 'index')),
    anatomy: readYaml<AnatomySpec>(specFilePath(name, 'anatomy')),
    api: readYaml<ApiSpec>(specFilePath(name, 'api')),
    tokens: readYaml<TokensSpec>(specFilePath(name, 'tokens')),
  };
}
