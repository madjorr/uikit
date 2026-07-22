---
'@acronis-platform/ui-react': patch
---

Fix `CardFilter` (`variant="clickable"`) setting `type="button"`/`aria-pressed` even when composed via `render` onto a non-button element, producing invalid ARIA/HTML on the rendered element (e.g. `render={<a href="/alerts" />}`). Both attributes now only apply to the default `<button>` root; `data-selected` continues to apply regardless of the rendered element.
