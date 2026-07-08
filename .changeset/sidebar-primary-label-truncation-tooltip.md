---
'@acronis-platform/ui-react': patch
---

Fix `SidebarPrimary` menu labels overflowing instead of truncating with an ellipsis when expanded. Two causes: the label `<span>` was missing `min-w-0` (a prior refactor dropped it, breaking `truncate` inside the flex row), and `SidebarPrimaryContent`'s `ScrollArea` sizes its content to `min-width: fit-content` internally (needed for horizontal-overflow detection), which let any wide row grow past the rail and defeat truncation entirely — now overridden for this vertical-only scroll area.

`SidebarPrimaryMenuItem` and `SidebarPrimaryCollapseTrigger` labels also show a tooltip with the full text when — and only when — the label is actually clipped; hovering the icon or `extras` never opens it.
