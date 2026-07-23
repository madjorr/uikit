---
'@acronis-platform/tokens-pd': minor
---

Route Tailwind color namespaces from Figma scopes as a fallback. When a
component color token's path carries no routable role word, its Figma scope
(`com.figma.scopes`) now decides the Tailwind namespace (`TEXT_FILL`→`textColor`,
`FRAME_FILL`→`backgroundColor`, `STROKE_COLOR`→`borderColor`, `SHAPE_FILL`/icon
pair→`fill`). This surfaces previously-skipped component color tokens into the
per-brand Tailwind presets under `tokens-pd/tailwind/**` (Avatar, InputDatePicker,
InputSearch, InputSelect, SearchGlobal, Table across the default, virtuozzo and
deep_sky_itkontoret brands). Additions-only — no existing key changed namespace
or value. Tokens whose scope gives no signal (`ALL_SCOPES` / empty) stay in
CSS + tiers but omitted from the preset (warned), and semantic color tokens
remain fatal on route failure.
