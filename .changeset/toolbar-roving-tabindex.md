---
'@acronis-platform/ui-react': patch
---

`ToolbarActionList` now wires its action row through Base UI's `Toolbar.Root`/`Toolbar.Button` (`@base-ui/react/toolbar`) instead of plain `Button`/`ButtonMenu` children.

The row is now a single Tab stop with arrow-key/Home/End roving-tabindex between visible actions and the "More actions" overflow trigger, matching the WAI-ARIA toolbar pattern. No API changes — `Toolbar`, `ToolbarActions`, and `ToolbarActionList`'s props are unchanged.
