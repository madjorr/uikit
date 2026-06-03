import { createRequire } from 'node:module';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { PACKS, type PackConfig } from './packs.ts';

const require = createRequire(import.meta.url);
const here = dirname(fileURLToPath(import.meta.url));
const srcPacks = resolve(here, '..', 'src', 'packs');

// design-assets ships JSON manifests + SVG sources; resolve its root from the
// package.json export and read packs/rules off the filesystem.
const assetsRoot = dirname(
  require.resolve('@acronis-platform/design-assets/package.json')
);

interface Rule {
  kind: 'scale' | 'stroke';
  target: { value: number; unit: string };
}
interface Manifest {
  name: string;
  values: Record<string, { default?: boolean; $rules?: string[] }>;
  assets: Record<string, { values: Record<string, { $file?: string }> }>;
}

function pascalCase(name: string): string {
  return name
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function round(n: number): number {
  return Math.round(n * 1000) / 1000;
}

async function loadRules(): Promise<Map<string, Rule>> {
  const names = [
    'scale-16',
    'scale-32',
    'scale-96',
    'stroke-1-6',
    'stroke-2-5',
  ];
  const rules = new Map<string, Rule>();
  for (const name of names) {
    const file = resolve(assetsRoot, 'rules', `${name}.json`);
    const rule = JSON.parse(await readFile(file, 'utf8')) as Rule;
    rules.set(name, rule);
  }
  return rules;
}

/** Strip a 24px master SVG down to JSX-ready inner markup (paths only). */
function toInnerJsx(svg: string, mode: PackConfig['mode']): string {
  const inner = svg.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i)?.[1] ?? '';
  let out = inner;
  if (mode === 'stroke') {
    // The component sets stroke/stroke-width/linecaps + fill on the <svg>;
    // drop the baked ones so they inherit (and color becomes currentColor).
    out = out
      .replace(/\s(?:stroke|fill)="[^"]*"/g, '')
      .replace(/\sstroke-width="[^"]*"/g, '')
      .replace(/\sstroke-linecap="[^"]*"/g, '')
      .replace(/\sstroke-linejoin="[^"]*"/g, '');
  } else {
    out = out.replace(/\sfill="[^"]*"/g, '');
  }
  // Hyphenated SVG attributes that survive must be camelCased for JSX.
  out = out
    .replace(/\sfill-rule="/g, ' fillRule="')
    .replace(/\sclip-rule="/g, ' clipRule="')
    .replace(/\sstroke-miterlimit="/g, ' strokeMiterlimit="');
  return out
    .split(/(?<=\/>|>)\s*(?=<)/)
    .map((line) => line.trim())
    .filter(Boolean)
    .join('\n      ');
}

async function generatePack(
  pack: PackConfig,
  rules: Map<string, Rule>
): Promise<number> {
  const manifest = JSON.parse(
    await readFile(
      resolve(assetsRoot, 'packs', `${pack.assetPack}.json`),
      'utf8'
    )
  ) as Manifest;

  const defaultSize = Object.entries(manifest.values).find(
    ([, v]) => v.default
  )?.[0];
  if (!defaultSize)
    throw new Error(`${pack.assetPack}: no default size in manifest`);

  const outDir = resolve(srcPacks, pack.name);
  await rm(outDir, { recursive: true, force: true });
  await mkdir(resolve(outDir, 'icons'), { recursive: true });

  const assetNames = Object.keys(manifest.assets).sort();
  let viewBox = '0 0 24 24';
  let masterStroke = 2;

  // Per-icon files.
  const components: { name: string; component: string; file: string }[] = [];
  for (const assetName of assetNames) {
    const file = manifest.assets[assetName].values[defaultSize]?.$file;
    if (!file) continue;
    const svg = await readFile(resolve(assetsRoot, file), 'utf8');
    viewBox = svg.match(/viewBox="([^"]*)"/)?.[1] ?? viewBox;
    masterStroke = Number(
      svg.match(/stroke-width="([\d.]+)"/)?.[1] ?? masterStroke
    );

    const component = `${pascalCase(assetName)}Icon`;
    const inner = toInnerJsx(svg, pack.mode);
    const body =
      `import { PackIcon, type IconProps } from '../icon';\n\n` +
      `export function ${component}(props: IconProps) {\n` +
      `  return (\n    <PackIcon viewBox="${viewBox}" {...props}>\n      ${inner}\n    </PackIcon>\n  );\n}\n`;
    await writeFile(resolve(outDir, 'icons', `${assetName}.tsx`), body);
    components.push({
      name: assetName,
      component,
      file: `./icons/${assetName}`,
    });
  }

  // Stroke-width map: rendered px (from rules) → viewBox user units.
  const viewBoxSize = Number(viewBox.split(/\s+/)[2]) || 24;
  const strokeMap: Record<number, number> = {};
  for (const [sizeKey, value] of Object.entries(manifest.values)) {
    const renderSize = Number(sizeKey);
    const strokeRuleName = value.$rules?.find(
      (r) => rules.get(r)?.kind === 'stroke'
    );
    const strokePx = strokeRuleName
      ? rules.get(strokeRuleName)!.target.value
      : masterStroke;
    strokeMap[renderSize] = round((strokePx * viewBoxSize) / renderSize);
  }

  // Pack wrapper — bakes mode + the rule-derived stroke map once.
  if (pack.mode === 'stroke') {
    const wrapper =
      `import { SvgIcon, type IconProps, type SvgIconProps } from '../../lib/svg-icon';\n\n` +
      `const STROKE_WIDTH_BY_SIZE: Record<number, number> = ${JSON.stringify(strokeMap)};\n\n` +
      `export type { IconProps };\n\n` +
      `export function PackIcon(props: Omit<SvgIconProps, 'mode' | 'strokeWidthBySize'>) {\n` +
      `  return <SvgIcon mode="stroke" strokeWidthBySize={STROKE_WIDTH_BY_SIZE} {...props} />;\n}\n`;
    await writeFile(resolve(outDir, 'icon.tsx'), wrapper);
  } else {
    const wrapper =
      `import { SvgIcon, type IconProps, type SvgIconProps } from '../../lib/svg-icon';\n\n` +
      `export type { IconProps };\n\n` +
      `export function PackIcon(props: Omit<SvgIconProps, 'mode'>) {\n` +
      `  return <SvgIcon mode="solid" {...props} />;\n}\n`;
    await writeFile(resolve(outDir, 'icon.tsx'), wrapper);
  }

  // Pack barrel: named exports + registry + IconName.
  const imports = components
    .map((c) => `import { ${c.component} } from '${c.file}';`)
    .join('\n');
  const exportList = `export {\n${components.map((c) => `  ${c.component},`).join('\n')}\n};`;
  const registry =
    `export const icons = {\n` +
    components.map((c) => `  '${c.name}': ${c.component},`).join('\n') +
    `\n} as const;`;
  const index =
    `// Generated by scripts/generate-icons.ts from @acronis-platform/design-assets. Do not edit.\n` +
    `export type { IconProps } from './icon';\n\n` +
    `${imports}\n\n${exportList}\n\n${registry}\n\n` +
    `export type IconName = keyof typeof icons;\n`;
  await writeFile(resolve(outDir, 'index.ts'), index);

  return components.length;
}

async function main(): Promise<void> {
  const rules = await loadRules();
  await mkdir(srcPacks, { recursive: true });
  for (const pack of PACKS) {
    const count = await generatePack(pack, rules);
    console.log(`✓ icons-react: ${pack.name} — ${count} icons`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
