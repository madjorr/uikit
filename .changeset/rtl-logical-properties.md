---
'@acronis-platform/ui-react': patch
---

Replace physical CSS properties with logical equivalents for RTL support across
avatar, breadcrumb, chip, data-table, dropdown-menu, input-date-picker,
input-select, input-text, resizable, sidebar-primary, sidebar-secondary, switch,
table, tabs, toast, and widget-placeholder components. Layouts now render
correctly in both LTR and RTL directions.

Add `unicode-bidi: plaintext` to truncated label spans in sidebar-primary and
sidebar-secondary so text-overflow ellipsis clips from the correct end regardless
of layout direction.

Add overflow tooltip to sidebar-secondary menu items, section labels, and
collapse trigger — the tooltip shows the full label only when the text is
actually clipped (matching the existing sidebar-primary behaviour).

Ensure sidebar-secondary section labels truncate with ellipsis instead of
wrapping to multiple lines.
