---
'@acronis-platform/ui-react': major
---

`Dialog`'s composable primitive parts (`DialogRoot`, `DialogTrigger`, `DialogContent`, `DialogPortal`, `DialogOverlay`, `DialogCloseButton`, `DialogTitle`, `DialogDescription`, `DialogHeaderRoot`, `DialogBodyRoot`, `DialogFooterRoot`, `dialogContentVariants`) are no longer exported from the package root — they're an internal implementation detail the `Dialog` recipe is built on (`DialogClose` stays exported; it's required by the `wide` variant's documented custom-`footer` escape hatch). `Dialog` is now the sole public way to build a dialog; if none of its eight variants fit, that's a gap for a new variant, not a reason to reach for the primitive.

`DialogContent`'s `size` prop is trimmed from six values to two: `sm` (512px, the only width with a Figma-defined token) and `large` (832px, kept for backward compatibility with pre-existing wider dialogs, paired with the `wide` variant) — the other four had no design/token backing.

Also adds localization overrides to `Dialog`: `title`, `secondaryLabel`, `primaryLabel`, and `closeLabel` props override the variant's canned copy (previously hardcoded with no way to translate them), and the close button's `cursor-pointer` is fixed to match Button/ButtonIcon.

**Migration:** replace any direct `DialogRoot`/`DialogContent`/... usage with `Dialog`, or a `variant` that matches your layout plus the new override props for custom copy.
