---
'@acronis-platform/ui-react': patch
---

Added a global `font-family` declaration (`Inter, system-ui, sans-serif`,
matching the family already baked into `tokens-pd`'s `.ui-typography-*`
utilities) to `:host, :root, body`. Previously nothing set a base font, so
text fell back to the browser's serif default outside of components that
apply a `.ui-typography-*` class.
