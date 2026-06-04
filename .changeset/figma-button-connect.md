---
'@acronis-platform/ui-react': minor
'@acronis-platform/design-tokens': minor
'@acronis-platform/design-theme': minor
---

Add Figma Code Connect support to `ui-react` and align the Button with the
Figma "Button" component.

- **`ui-react`**: new Figma Code Connect setup (`figma.config.json`,
  co-located `*.figma.tsx` files, `figma:connect*` scripts) linking
  components to their Figma counterparts. The `Button` is fully connected and
  its variants now match the Figma `Style` set: added `ai` (gradient) and
  `inverted` variants, and re-pointed `default` / `secondary` / `ghost` /
  `destructive` to the colors used in the mockup via button-local
  `--color-btn-*` token bridges (the shared `--color-*` tokens are unchanged).
  The legacy-only `outline` / `link` / `translucent` variants are retained for
  parity with the shared demos.
- **`design-tokens`**: added the `colors.background.inverted-surface` semantic
  tokens (idle / hover / active / disabled) that back the inverted button.
- **`design-theme`**: emits the new
  `--av-colors-background-inverted-surface-*` custom properties.
