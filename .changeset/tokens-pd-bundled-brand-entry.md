---
'@acronis-platform/tokens-pd': minor
---

Added a bundled per-brand CSS entry, `css/<brand>.all.css`, that concatenates a
brand's semantic-tier file with all of its component-tier files (semantic
first, then components alphabetically). Previously theming a brand fully meant
importing the semantic override plus every per-component override file by
hand; now a single `@import '@acronis-platform/tokens-pd/css/<brand>.all.css'`
covers everything. The existing semantic-only and per-component files are
unchanged and remain the partial-theming path.
