/**
 * Generate Storybook stories from component specs.
 *
 * Drives output from each state's `kind` (see anatomy.yaml):
 *   - kind=prop     → static matrix / variations (snapshot by passing props)
 *   - kind=pseudo   → a story per CSS pseudo-state. `:hover`/`:active` emit
 *                     addon-ready `parameters.pseudo` (needs a pseudo-states
 *                     addon to paint); `:focus-visible` is driven by a real
 *                     `play` tab() so it works without one.
 *   - kind=internal → an Interaction `play` story that performs the real
 *                     interaction so the component lands in the after-interaction
 *                     state (e.g. Switch click → checked).
 *
 * Output: packages/ui-react/src/components/ui/<name>/__stories__/<name>.generated.stories.tsx
 * Run:    pnpm --filter @acronis-platform/ui-spec generate:stories
 *
 * NOTE (spike limitation): the state *axes* are spec-derived; the small
 * per-component "how to instantiate" hint below (sample content, aria-label) is
 * not yet in the spec — a future `story` hint in api.yaml would remove it.
 */
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { listComponentNames, loadSpec } from '../lib/load';
import type { AnatomySpec, ApiSpec } from '../types';

const PKG_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const UI_REACT_UI = resolve(PKG_ROOT, '../ui-react/src/components/ui');

interface RenderHint {
  sample?: string;
  extraImports?: string[];
  ariaLabel?: string;
  /** Root component/import to render when it differs from `index.component`
   *  (e.g. Resizable's root export is `ResizablePanelGroup`). */
  root?: string;
  /**
   * Skip the auto Disabled instance even when api.yaml has a `disabled`
   * property — for composable multi-part specs (e.g. Table) where `disabled`
   * belongs to a sub-part, not the root component being instantiated here.
   */
  skipDisabledInstance?: boolean;
}

const RENDER: Record<string, RenderHint> = {
  avatar: {
    extraImports: ["import { AvatarFallback } from '../avatar';"],
    sample: '\n      <AvatarFallback>SN</AvatarFallback>\n    ',
  },
  button: { sample: 'Label' },
  'button-menu': { sample: 'Label' },
  'button-icon': {
    sample: '<PlusIcon />',
    extraImports: [
      "import { PlusIcon } from '@acronis-platform/icons-react/stroke-mono';",
    ],
    ariaLabel: 'Action',
  },
  switch: { ariaLabel: 'Toggle' },
  checkbox: { ariaLabel: 'Accept' },
  radio: {
    ariaLabel: 'Plan',
    extraImports: ["import { Radio } from '../radio';"],
    sample: [
      '',
      '      <Radio value="a" aria-label="Option A" />',
      '      <Radio value="b" aria-label="Option B" />',
      '    ',
    ].join('\n'),
  },
  input: { ariaLabel: 'Email' },
  search: { ariaLabel: 'Search' },
  tooltip: {
    extraImports: [
      "import { TooltipTrigger, TooltipContent } from '../tooltip';",
    ],
    sample: [
      '',
      '      <TooltipTrigger>Hover me</TooltipTrigger>',
      '      <TooltipContent>Helpful hint</TooltipContent>',
      '    ',
    ].join('\n'),
  },
  tag: { sample: 'Label' },
  select: {
    extraImports: [
      "import { SelectTrigger, SelectValue, SelectContent, SelectItem } from '../select';",
    ],
    sample: [
      '',
      '      <SelectTrigger aria-label="Fruit">',
      '        <SelectValue placeholder="Select an option" />',
      '      </SelectTrigger>',
      '      <SelectContent>',
      '        <SelectItem value="apple">Apple</SelectItem>',
      '        <SelectItem value="banana">Banana</SelectItem>',
      '      </SelectContent>',
      '    ',
    ].join('\n'),
  },
  'sidebar-primary': {
    ariaLabel: 'Primary',
    extraImports: [
      "import { SidebarPrimaryHeader, SidebarPrimaryContent, SidebarPrimaryFooter, SidebarPrimarySection, SidebarPrimaryMenu, SidebarPrimaryMenuItem, SidebarPrimaryMenuItemExtras } from '../sidebar-primary';",
      "import { BoxIcon, UsersIcon, CircleHelpIcon } from '@acronis-platform/icons-react/stroke-mono';",
    ],
    sample: [
      '',
      '      <SidebarPrimaryHeader>',
      '        <svg width={24} height={24} />',
      '      </SidebarPrimaryHeader>',
      '      <SidebarPrimaryContent>',
      '        <SidebarPrimarySection>',
      '          <SidebarPrimaryMenu>',
      '            <SidebarPrimaryMenuItem href="#" icon={<BoxIcon />} selected>',
      '              Assets',
      '            </SidebarPrimaryMenuItem>',
      '            <SidebarPrimaryMenuItem href="#" icon={<UsersIcon />}>',
      '              Clients',
      '              <SidebarPrimaryMenuItemExtras variant="shortcut" shortcut="⌘K" />',
      '            </SidebarPrimaryMenuItem>',
      '          </SidebarPrimaryMenu>',
      '        </SidebarPrimarySection>',
      '      </SidebarPrimaryContent>',
      '      <SidebarPrimaryFooter>',
      '        <SidebarPrimaryMenu>',
      '          <SidebarPrimaryMenuItem href="#" icon={<CircleHelpIcon />}>',
      '            Help',
      '          </SidebarPrimaryMenuItem>',
      '        </SidebarPrimaryMenu>',
      '      </SidebarPrimaryFooter>',
      '    ',
    ].join('\n'),
  },
  'sidebar-secondary': {
    ariaLabel: 'Section navigation',
    extraImports: [
      "import { SidebarSecondaryHeader, SidebarSecondaryContent, SidebarSecondaryCollapsedBreadcrumb, SidebarSecondaryFooter, SidebarSecondarySection, SidebarSecondarySectionLabel, SidebarSecondaryMenu, SidebarSecondaryMenuItem, SidebarSecondaryMenuSub, SidebarSecondaryMenuSubTrigger, SidebarSecondaryMenuSubContent, SidebarSecondaryMenuSubItem, SidebarSecondaryMenuItemExtras } from '../sidebar-secondary';",
      "import { LayoutGridIcon, BoxIcon } from '@acronis-platform/icons-react/stroke-mono';",
    ],
    sample: [
      '',
      '      <SidebarSecondaryHeader label="Protection" />',
      '      <SidebarSecondaryContent>',
      '        <SidebarSecondarySection>',
      '          <SidebarSecondarySectionLabel>Overview</SidebarSecondarySectionLabel>',
      '          <SidebarSecondaryMenu>',
      '            <SidebarSecondaryMenuItem href="#" icon={<LayoutGridIcon />} selected>',
      '              Dashboard',
      '              <SidebarSecondaryMenuItemExtras variant="externalLink" />',
      '            </SidebarSecondaryMenuItem>',
      '            <SidebarSecondaryMenuSub defaultOpen>',
      '              <SidebarSecondaryMenuSubTrigger icon={<BoxIcon />}>',
      '                Policies',
      '              </SidebarSecondaryMenuSubTrigger>',
      '              <SidebarSecondaryMenuSubContent>',
      '                <SidebarSecondaryMenuSubItem href="#" selected>',
      '                  Backup',
      '                </SidebarSecondaryMenuSubItem>',
      '                <SidebarSecondaryMenuSubItem href="#">',
      '                  Antivirus',
      '                </SidebarSecondaryMenuSubItem>',
      '              </SidebarSecondaryMenuSubContent>',
      '            </SidebarSecondaryMenuSub>',
      '          </SidebarSecondaryMenu>',
      '        </SidebarSecondarySection>',
      '      </SidebarSecondaryContent>',
      '      <SidebarSecondaryCollapsedBreadcrumb parentLabel="Protection" currentLabel="Dashboard" />',
      '      <SidebarSecondaryFooter>',
      '        <SidebarSecondaryMenu>',
      '          <SidebarSecondaryMenuItem href="#">Settings</SidebarSecondaryMenuItem>',
      '        </SidebarSecondaryMenu>',
      '      </SidebarSecondaryFooter>',
      '    ',
    ].join('\n'),
  },
  resizable: {
    root: 'ResizablePanelGroup',
    ariaLabel: 'Resizable example',
    extraImports: ["import { ResizablePanel, ResizableHandle } from '../resizable';"],
    sample: [
      '',
      '      <ResizablePanel defaultSize={50}>One</ResizablePanel>',
      '      <ResizableHandle withHandle />',
      '      <ResizablePanel defaultSize={50}>Two</ResizablePanel>',
      '    ',
    ].join('\n'),
  },
  breadcrumb: {
    ariaLabel: 'breadcrumb',
    extraImports: [
      "import { BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from '../breadcrumb';",
    ],
    sample: [
      '',
      '      <BreadcrumbList>',
      '        <BreadcrumbItem>',
      '          <BreadcrumbLink href="#">Home</BreadcrumbLink>',
      '        </BreadcrumbItem>',
      '        <BreadcrumbSeparator />',
      '        <BreadcrumbItem>',
      '          <BreadcrumbLink href="#">Products</BreadcrumbLink>',
      '        </BreadcrumbItem>',
      '        <BreadcrumbSeparator />',
      '        <BreadcrumbItem>',
      '          <BreadcrumbPage>Settings</BreadcrumbPage>',
      '        </BreadcrumbItem>',
      '      </BreadcrumbList>',
      '    ',
    ].join('\n'),
  },
  table: {
    // `disabled` in api.yaml is scoped to the data-cell part, not the root
    // `Table` (which has no such prop) — don't auto-add a Disabled instance.
    skipDisabledInstance: true,
    extraImports: [
      "import { Table, TableHeader, TableBody, TableRow, TableHeaderCell, TableCell } from '../table';",
    ],
    sample: [
      '',
      '      <TableHeader>',
      '        <TableRow>',
      '          <TableHeaderCell>Name</TableHeaderCell>',
      '        </TableRow>',
      '      </TableHeader>',
      '      <TableBody>',
      '        <TableRow>',
      '          <TableCell>invoice-0042.pdf</TableCell>',
      '        </TableRow>',
      '      </TableBody>',
      '    ',
    ].join('\n'),
  },
};

const HEADER =
  '// AUTO-GENERATED from @acronis-platform/ui-spec — DO NOT EDIT.\n' +
  '// Regenerate: pnpm --filter @acronis-platform/ui-spec generate:stories\n' +
  '// `:hover` / `:active` stories require a Storybook pseudo-states addon to paint.\n';

const PSEUDO_KEY: Record<string, string> = {
  ':hover': 'hover',
  ':active': 'active',
  ':focus': 'focus',
};

function enumMembers(api: ApiSpec, prop: string): string[] {
  const p = api.contract.properties.find((x) => x.name === prop);
  if (!p) return [];
  return [...p.type.matchAll(/'([^']+)'/g)].map((m) => m[1]);
}

const hasProp = (api: ApiSpec, name: string): boolean =>
  api.contract.properties.some((p) => p.name === name);

const arr = (values: string[]): string =>
  `[${values.map((v) => `'${v}'`).join(', ')}] as const`;

const cap = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);

function buildStories(
  comp: string,
  api: ApiSpec,
  anatomy: AnatomySpec,
  hint: RenderHint
): { body: string; needsPlay: boolean } {
  const variants = enumMembers(api, 'variant');
  const sizes = enumMembers(api, 'size');
  const label = hint.ariaLabel ? ` aria-label="${hint.ariaLabel}"` : '';
  const children = hint.sample ?? '';
  const inst = (props: string) =>
    children ? `<${comp}${props}>${children}</${comp}>` : `<${comp}${props} />`;
  const base = inst(label);

  const parts: string[] = [];

  // ── kind=prop: static matrix / variations ──
  if (variants.length && sizes.length) {
    parts.push(`const VARIANTS = ${arr(variants)};
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
        ...SIZES.map((s) => ${inst(label + ' key={`${v}-${s}`} variant={v} size={s}')}),
      ])}
    </div>
  ),
};`);
    // Only emit the all-variants Disabled grid when the component actually has a
    // `disabled` prop (e.g. Button does; Tag doesn't).
    if (hasProp(api, 'disabled') && !hint.skipDisabledInstance) {
      parts.push(`export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
      {VARIANTS.map((v) => ${inst(label + ' key={v} variant={v} disabled')})}
    </div>
  ),
};`);
    }
  } else if (variants.length) {
    // Variants but no size axis (e.g. Button has a single size): list each variant.
    parts.push(`const VARIANTS = ${arr(variants)};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
      {VARIANTS.map((v) => ${inst(label + ' key={v} variant={v}')})}
    </div>
  ),
};`);
    if (hasProp(api, 'disabled') && !hint.skipDisabledInstance) {
      parts.push(`export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
      {VARIANTS.map((v) => ${inst(label + ' key={v} variant={v} disabled')})}
    </div>
  ),
};`);
    }
  } else if (hasProp(api, 'checked')) {
    parts.push(`export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
      <${comp} aria-label="Off" />
      <${comp} aria-label="On" defaultChecked />
      <${comp} aria-label="Disabled off" disabled />
      <${comp} aria-label="Disabled on" disabled defaultChecked />
    </div>
  ),
};`);
  } else {
    // Only show a disabled instance when the component actually has a
    // `disabled` prop that applies to the root — composable components (e.g.
    // breadcrumb) do not, and some (e.g. Table) have one scoped to a sub-part
    // (opt out via `skipDisabledInstance`).
    const disabledInst =
      hasProp(api, 'disabled') && !hint.skipDisabledInstance
        ? `\n      ${inst(`${label} disabled`)}`
        : '';
    parts.push(`export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      ${inst(label)}${disabledInst}
    </div>
  ),
};`);
  }

  // ── kind=pseudo: one story per distinct pseudo-class ──
  // Multiple states can share a pseudo-class (e.g. Table's row `hover` and
  // its icon-button `icon-button-hover` both use `:hover`) — only the root
  // component is ever instantiated here, so emit each pseudo-class once.
  let needsPlay = false;
  const seenPseudo = new Set<string>();
  for (const state of anatomy.states ?? []) {
    if (state.kind !== 'pseudo' || !state.pseudo || seenPseudo.has(state.pseudo)) continue;
    seenPseudo.add(state.pseudo);
    if (state.pseudo === ':focus-visible') {
      needsPlay = true;
      parts.push(`export const FocusVisible: Story = {
  render: () => ${base},
  // Real keyboard focus — paints :focus-visible without a pseudo-states addon.
  play: async () => {
    await userEvent.tab();
  },
};`);
    } else if (PSEUDO_KEY[state.pseudo]) {
      const key = PSEUDO_KEY[state.pseudo];
      parts.push(`export const ${cap(key)}: Story = {
  parameters: { pseudo: { ${key}: true } },
  render: () => ${base},
};`);
    }
  }

  // ── transitions: drive each interactive transition, land in the new state ──
  const role = anatomy.root.role ?? 'button';
  const rootSelector = `[role="${role}"], ${anatomy.root.element}`;
  for (const t of (anatomy.transitions ?? []).filter((x) => x.interactive)) {
    needsPlay = true;
    const guard = t.guard ? ` [guard: ${t.guard}]` : '';
    parts.push(`// transition "${t.id}": ${t.on} -> ${String(t.to)}${guard}
export const ${cap(t.id)}: Story = {
  render: () => ${base},
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('${rootSelector}');
    if (el) await userEvent.click(el as HTMLElement);
  },
};`);
  }

  return { body: parts.join('\n\n'), needsPlay };
}

function generate(name: string): boolean {
  if (!existsSync(join(UI_REACT_UI, name))) {
    console.warn(`skip ${name}: no @acronis-platform/ui-react component`);
    return false;
  }
  const { index, api, anatomy } = loadSpec(name);
  const hint = RENDER[name] ?? {};
  const comp = hint.root ?? index.component;
  const { body, needsPlay } = buildStories(comp, api, anatomy, hint);

  // Skip the auto root-component import if a hint's extraImports already
  // pulls from the same relative module — the hint is expected to include
  // the root component in that combined import instead of a separate one.
  const samePathImport = new RegExp(`from '\\.\\./${name}';?$`);
  const rootAlreadyImported = (hint.extraImports ?? []).some((line) =>
    samePathImport.test(line.trim())
  );
  const imports = [
    "import type { Meta, StoryObj } from '@storybook/react-vite';",
    ...(needsPlay ? ["import { userEvent } from 'storybook/test';"] : []),
    ...(hint.extraImports ?? []),
    ...(rootAlreadyImported ? [] : [`import { ${comp} } from '../${name}';`]),
  ].join('\n');

  const file = `${HEADER}
${imports}

const meta = {
  title: 'UI/${index.component}/All States (generated)',
  component: ${comp},
} satisfies Meta<typeof ${comp}>;

export default meta;
type Story = StoryObj<typeof meta>;

${body}
`;

  const dir = join(UI_REACT_UI, name, '__stories__');
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, `${name}.generated.stories.tsx`), file);
  console.log(`generated ${name}.generated.stories.tsx`);
  return true;
}

let count = 0;
for (const name of listComponentNames()) if (generate(name)) count += 1;
console.log(`\n${count} story file(s) generated.`);
