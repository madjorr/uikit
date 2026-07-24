---
'@acronis-platform/ui-react': minor
---

Add `hasHeader`/`hasFooter` boolean props to `Dialog` (both default `true`), letting the header (title + close button) and/or footer (action buttons) be hidden for a body-only dialog — beyond the strict Figma `DialogDefault` contract, which always shows both. When the header is hidden, the title still renders off-screen (`sr-only`) so the dialog keeps an accessible name, and the loading overlay's inset adjusts accordingly.

Internally, the generic composable primitives previously exported as `DialogHeader`, `DialogFooter`, and `DialogBody` are renamed to `DialogHeaderRoot`, `DialogFooterRoot`, and `DialogBodyRoot` to make room for new recipe-local `DialogHeader`/`DialogBody` components (not exported) that back the public `Dialog`, reconciled against the Figma "DialogHeader" node (4220:3516). This only affects the internal `DialogRoot` composable API, which was already internal-only — no change to `Dialog`'s public props beyond the two additions above.
