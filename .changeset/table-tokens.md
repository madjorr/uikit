---
'@acronis-platform/design-tokens': minor
'@acronis-platform/tokens-pd': minor
---

Add the `Table` component token tier (sourced from the upstream Figma sync in
[acronis/uikit#493](https://github.com/acronis/uikit/pull/493), plus two cell
spacing tokens — `_global.cell.tag.marginY` and `_global.cell.icon.marginY`
— pulled directly from Figma variables, since they weren't present in that
export). Covers row background states (idle/hover/active), header-cell
background states, sort-icon colors, cell borders/padding/min-height, and data
value text colors, per brand (`acronis`, `deep-sky`).

Dropped `Header.cell.paddingX` from that same PR's export: the current Figma
design binds the header cell's horizontal padding to `_global.cell.paddingX`
(the same token data cells use) rather than a header-specific one — confirmed
against Figma's own generated CSS. Both resolved to the same 16px value, so
this is a token-naming correction, not a visual change.
