---
'@acronis-platform/design-tokens': patch
'@acronis-platform/tokens-pd': patch
---

Fixed `text.onSurface.primary`/`.secondary`/`.disabled`/`.link` for the
`deep_sky_itkontoret` brand, which were baked as flat literal colors with no
light/dark distinction. They now alias the primitives Figma's live variable
graph shows for this brand: `primary`/`secondary`/`disabled` alias
`{palette.grayscale.14}`/`{palette.grayscale.7}`/`{palette.grayscale.5}` — the
same primitives `default` already uses. `link` aliases `{palette.grayscale.10}`,
which is _different_ from `default`'s `{palette.blue.7}` — for this brand link
text is neutral gray, not blue. `--ui-text-on-surface-primary` and
`--ui-text-on-surface-link` (and its dependents, e.g. `--ui-link-color-idle`)
now correctly switch between light and dark; `--ui-text-on-surface-secondary`
and `--ui-text-on-surface-disabled` are intentionally identical in both modes,
per Figma.
