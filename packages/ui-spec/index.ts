import { listComponentNames, readYaml, specFilePath } from './lib/load';
import type { IndexSpec } from './types';

export type * from './types';
export { loadSpec, listComponentNames } from './lib/load';

export interface ComponentRegistryEntry {
  name: string;
  component: string;
  status: IndexSpec['status'];
  category: string;
  description: string;
}

/** Registry of every component that has a spec, read from each `index.yaml`. */
export const components: ComponentRegistryEntry[] = listComponentNames().map(
  (name) => {
    const index = readYaml<IndexSpec>(specFilePath(name, 'index'));
    return {
      name: index.name,
      component: index.component,
      status: index.status,
      category: index.category,
      description: index.description,
    };
  }
);
