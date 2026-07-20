---
'@acronis-platform/ui-react': minor
---

`AppShellChat`'s Chat panel now has a breakpoint-responsive width: 512px at
1680px+, 448px from 1280-1679px, and the 48px icon-rail floor below 1280px.
This is genuinely LIVE — driven by plain responsive Tailwind classes
(`w-12 xl:w-md 3xl:w-lg`), reflowing on every browser resize — until the
user drags the resize handle or nudges it with the arrow keys, at which
point that explicit choice wins until double-click/Home resets it.

Also exports `useAppShellChatInitialLayout` (and the pure
`getAppShellChatInitialLayout` helper) so consumers can wire the sidebars'
breakpoint-appropriate INITIAL layout into `SidebarPrimary`/
`SidebarSecondary`'s `defaultExpanded` prop. Unlike Chat's width, this is
resolved ONCE from the viewport width at mount and frozen after that (the
sidebars have their own manual collapse/expand controls, so their state
should not fight a live viewport change): at 1680px+ both sidebars start
open; below that the primary sidebar starts closed (secondary stays open).
