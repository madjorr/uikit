/**
 * Single source of truth for which @acronis-platform/design-assets packs
 * this library generates, shared by the generator and the Vite lib config.
 *
 * `assetPack` is the manifest name in design-assets; `name` is the published
 * subpath (the `icons-` prefix is dropped); `mode` selects how the generated
 * component applies color/stroke (`stroke` → `currentColor` + rule-driven
 * stroke width; `solid` → `currentColor` fill).
 *
 * First iteration ships only `icons-stroke-mono`; the others (solid-mono,
 * stroke-multi, solid-multi) are one entry away once multi-color handling
 * is decided.
 */
export interface PackConfig {
  assetPack: string;
  name: string;
  mode: 'stroke' | 'solid';
}

export const PACKS: PackConfig[] = [
  { assetPack: 'icons-stroke-mono', name: 'stroke-mono', mode: 'stroke' },
];
