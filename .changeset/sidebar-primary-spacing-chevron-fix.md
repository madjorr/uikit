---
'@acronis-platform/ui-react': patch
---

Fix `SidebarPrimary` layout drift from Figma: the first `SidebarPrimarySection` no longer gets an extra top padding/divider (only the last-section-style bottom padding, matching Figma), `SidebarPrimaryFooter` no longer double-pads its rows on top of each item's own padding, and `SidebarPrimaryCollapseTrigger`'s icon now rotates 180° between expanded and collapsed rail states.
