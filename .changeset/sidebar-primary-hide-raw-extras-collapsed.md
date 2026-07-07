---
'@acronis-platform/ui-react': patch
---

Fix `SidebarPrimaryMenuItem` and `SidebarPrimaryCollapseTrigger` not hiding their `extras` slot in collapsed/rail mode when passed a raw node instead of `SidebarPrimaryMenuItemExtras` — the collapse-aware hiding now lives in the parent, so it applies regardless of what's passed as `extras`.
