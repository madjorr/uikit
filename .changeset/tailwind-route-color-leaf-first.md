---
'@acronis-platform/tokens-pd': patch
---

Fix Tailwind color routing for component tokens with multiple role-like
segments, and normalize leading-underscore key segments.

`routeColor` previously scanned a token path left-to-right and stopped at the
first role-like segment, so `button.icon.background.idle` was misrouted to the
`icon` role instead of `background` — emitting the wrong namespace/key. It now
scans right-to-left, so the role segment **closest to the leaf** wins
(`button-icon-idle` under `backgroundColor`/`textColor`/`borderColor`).

Key segments are now normalized too: leading underscores are stripped, so
`tree._global.background.selected` emits `tree-global-selected` instead of
`tree-_global-selected` — matching the `--ui-*` CSS variable naming the
`name/ui` transform already produces.

Affects the regenerated `button`, `form`, and `tree` Tailwind component
presets (both brands).
