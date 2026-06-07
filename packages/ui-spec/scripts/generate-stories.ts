/**
 * Generate Storybook "All states" stories from component specs.
 *
 * For each spec it reads the variant/size enums and boolean state props from
 * `api.yaml` and emits a story that renders the full prop-driven state matrix —
 * a single comprehensive, snapshot-friendly story per component (a base for
 * visual-regression tests). Output lands next to the React component in
 * `packages/ui-react/src/components/ui/<name>/__stories__/<name>.generated.stories.tsx`.
 *
 * Run: `pnpm --filter @acronis-platform/ui-spec generate:stories`
 *
 * NOTE (spike limitation): the *axes* (which variants/sizes/states exist) are
 * spec-derived; the small per-component "how to instantiate" hint below
 * (sample content, required aria-label) is not yet in the spec. A future
 * `story` hint in `api.yaml` would remove this map.
 */
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { listComponentNames, loadSpec } from '../lib/load';
import type { ApiSpec } from '../types';

const PKG_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const UI_REACT_UI = resolve(PKG_ROOT, '../ui-react/src/components/ui');

interface RenderHint {
  /** Raw JSX or text used as the component's children (empty = self-closing). */
  sample?: string;
  /** Extra import lines the sample needs. */
  extraImports?: string[];
  /** aria-label applied to each instance (for controls with no text). */
  ariaLabel?: string;
}

const RENDER: Record<string, RenderHint> = {
  button: { sample: 'Label' },
  'button-icon': {
    sample: '<PlusIcon />',
    extraImports: [
      "import { PlusIcon } from '@acronis-platform/icons-react/stroke-mono';",
    ],
    ariaLabel: 'Action',
  },
  switch: { ariaLabel: 'Toggle' },
};

const HEADER =
  '// AUTO-GENERATED from @acronis-platform/ui-spec — DO NOT EDIT.\n' +
  '// Regenerate: pnpm --filter @acronis-platform/ui-spec generate:stories\n';

/** String-union members of an `api.yaml` property `type`, e.g. ['sm','lg']. */
function enumMembers(api: ApiSpec, prop: string): string[] {
  const p = api.contract.properties.find((x) => x.name === prop);
  if (!p) return [];
  return [...p.type.matchAll(/'([^']+)'/g)].map((m) => m[1]);
}

function hasProp(api: ApiSpec, name: string): boolean {
  return api.contract.properties.some((p) => p.name === name);
}

function arr(values: string[]): string {
  return `[${values.map((v) => `'${v}'`).join(', ')}] as const`;
}

function buildStories(comp: string, api: ApiSpec, hint: RenderHint): string {
  const variants = enumMembers(api, 'variant');
  const sizes = enumMembers(api, 'size');
  const label = hint.ariaLabel ? ` aria-label="${hint.ariaLabel}"` : '';
  const children = hint.sample ? `${hint.sample}` : '';
  const open = (props: string) =>
    children
      ? `<${comp}${props}>${children}</${comp}>`
      : `<${comp}${props} />`;

  // Shape 1 — variant × size grid (+ a disabled row).
  if (variants.length && sizes.length) {
    return `const VARIANTS = ${arr(variants)};
const SIZES = ${arr(sizes)};

export const Matrix: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: \`repeat(\${SIZES.length + 1}, max-content)\`,
        gap: 12,
        alignItems: 'center',
      }}
    >
      <span />
      {SIZES.map((s) => (
        <span key={s} style={{ fontSize: 12, opacity: 0.6 }}>
          {s}
        </span>
      ))}
      {VARIANTS.flatMap((v) => [
        <span key={\`\${v}-label\`} style={{ fontSize: 12, opacity: 0.6 }}>
          {v}
        </span>,
        ...SIZES.map((s) => (
          ${open(' key={`${v}-${s}`} variant={v} size={s}')}
        )),
      ])}
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
      {VARIANTS.map((v) => (
        ${open(' key={v} variant={v} disabled')}
      ))}
    </div>
  ),
};
`;
  }

  // Shape 2 — on/off toggle (checked × disabled).
  if (hasProp(api, 'checked')) {
    return `export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
      <${comp} aria-label="Off" />
      <${comp} aria-label="On" defaultChecked />
      <${comp} aria-label="Disabled off" disabled />
      <${comp} aria-label="Disabled on" disabled defaultChecked />
    </div>
  ),
};
`;
  }

  // Shape 3 — single style, enabled vs disabled.
  return `export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      ${open(label)}
      ${open(`${label} disabled`)}
    </div>
  ),
};
`;
}

function generate(name: string): boolean {
  const dir = join(UI_REACT_UI, name, '__stories__');
  if (!existsSync(join(UI_REACT_UI, name))) {
    console.warn(`skip ${name}: no @acronis-platform/ui-react component`);
    return false;
  }
  const { index, api } = loadSpec(name);
  const comp = index.component;
  const hint = RENDER[name] ?? {};

  const imports = [
    "import type { Meta, StoryObj } from '@storybook/react-vite';",
    ...(hint.extraImports ?? []),
    `import { ${comp} } from '../${name}';`,
  ].join('\n');

  const file = `${HEADER}
${imports}

const meta = {
  title: 'UI/${comp}/All States (generated)',
  component: ${comp},
} satisfies Meta<typeof ${comp}>;

export default meta;
type Story = StoryObj<typeof meta>;

${buildStories(comp, api, hint)}`;

  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, `${name}.generated.stories.tsx`), file);
  console.log(`generated ${name}.generated.stories.tsx`);
  return true;
}

let count = 0;
for (const name of listComponentNames()) if (generate(name)) count += 1;
console.log(`\n${count} story file(s) generated.`);
