---
'@acronis-platform/ui-react': major
---

Renamed the public dialog "recipe" component from `DialogDefault` back to `Dialog` — it's now the sole export for building a dialog, matching the Figma component set it maps to (`DialogDefault` in Figma; `Dialog` in code). The internal composable primitive parts (previously exported as `Dialog`, `DialogContent`, etc.) are renamed with a `Root`/unchanged suffix: `Dialog` → `DialogRoot` (all other parts — `DialogTrigger`, `DialogContent`, `DialogPortal`, `DialogOverlay`, `DialogClose`, `DialogCloseButton`, `DialogTitle`, `DialogDescription`, `DialogHeader`, `DialogBody`, `DialogFooter` — keep their names); none of these primitive parts are exported from the package root.

Also adds two backward-compatibility features that predate the Figma `DialogDefault` node:

- `size="large"` (832px) alongside the default `size="sm"` (512px) — a plain arbitrary-width value with no design token, kept only for existing wider-dialog call sites.
- `variant="wide"` — an eighth, canned-preset-free variant paired with a new `footer` prop that replaces the footer's action content entirely with free-form buttons, for legacy call sites that don't fit one of the seven Figma-defined variants. `variant="wide"` defaults `size` to `"large"`.

**Migration:** replace `DialogDefault` imports/usages with `Dialog` (same props, same variants). If you were importing the internal primitive `Dialog` (root) directly — unsupported, but possible via a deep import — rename it to `DialogRoot`.
