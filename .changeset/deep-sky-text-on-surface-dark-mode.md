---
'@acronis-platform/design-tokens': patch
'@acronis-platform/tokens-pd': patch
---

Fixed `text.onSurface.primary`/`.secondary` for the `deep_sky_itkontoret` brand,
which were baked as flat literal colors with no light/dark distinction. They now
alias `{palette.grayscale.14}`/`{palette.grayscale.7}` — the same primitives
`default` already uses, matching the current Figma source (Figma aliases the
same primitives for both brands on these two tokens). `--ui-text-on-surface-primary`
now correctly switches between light and dark; `--ui-text-on-surface-secondary`
is intentionally identical in both modes, per Figma.
