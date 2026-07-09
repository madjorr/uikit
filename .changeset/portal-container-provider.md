---
'@acronis-platform/ui-react': minor
---

feat: add `PortalContainerProvider` for shadow-DOM MFE portal redirection (PLTFRM-91950)

New exports: `PortalContainerProvider`, `usePortalContainer`.

Wrap a subtree in `<PortalContainerProvider container={element}>` and every
portaling component (`Popover`, `DropdownMenu`, `Tooltip`, `Dialog`, `Sheet`,
`InputSelect`/`Select`, `Combobox`, `Toaster`) will mount its popup inside the
given container instead of `document.body`. An explicit `portalContainer` prop
on an individual component still takes precedence.

This is the recommended pattern for rendering `@acronis-platform/ui-react`
inside a shadow-DOM MFE: adopt the library's CSS onto the shadow root and wrap
the React tree in `PortalContainerProvider` pointing at a `<div>` inside the
shadow root. Portaled popups will then render inside the shadow boundary, fully
styled, with zero global style leakage.
