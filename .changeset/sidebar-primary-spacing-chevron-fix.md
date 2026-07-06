---
'@acronis-platform/ui-react': patch
---

Fix `SidebarPrimary` layout drift from Figma: the first `SidebarPrimarySection` no longer gets an extra top padding/divider (only the last-section-style bottom padding, matching Figma), `SidebarPrimaryFooter` no longer double-pads its rows on top of each item's own padding, and `SidebarPrimaryCollapseTrigger`'s icon now rotates 180° between expanded and collapsed rail states.

Also fixes `SidebarPrimaryMenuItem` and `SidebarPrimaryCollapseTrigger` rendering their trailing affordance nested inside the label's truncating span instead of as a flex sibling, which cramped the shortcut/tag/external-link extras against the label text. Both now take an explicit `extras` prop (a `SidebarPrimaryMenuItemExtras` element) rendered alongside the label. Also adds Figma Code Connect for the `Section` and `MenuItem` sub-components.
