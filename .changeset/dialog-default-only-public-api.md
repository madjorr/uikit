---
'@acronis-platform/ui-react': major
---

`Dialog`'s composable primitive parts (`Dialog`, `DialogTrigger`, `DialogContent`, `DialogPortal`, `DialogOverlay`, `DialogClose`, `DialogCloseButton`, `DialogTitle`, `DialogDescription`, `DialogHeader`, `DialogBody`, `DialogFooter`, `dialogContentVariants`) are no longer exported from the package root — they're an internal implementation detail `DialogDefault` is built on. `DialogDefault` is now the sole public way to build a dialog; if none of its seven variants fit, that's a gap for a new variant, not a reason to reach for the primitive.

`DialogContent`'s `size` prop is trimmed from six values to just `sm` (512px) — the only width with a Figma-defined token; the others had no design/token backing.

Also adds localization overrides to `DialogDefault`: `title`, `secondaryLabel`, `primaryLabel`, and `closeLabel` props override the variant's canned copy (previously hardcoded with no way to translate them), and the close button's `cursor-pointer` is fixed to match Button/ButtonIcon.

**Migration:** replace any direct `Dialog`/`DialogContent`/... usage with `DialogDefault`, or a `variant` that matches your layout plus the new override props for custom copy.
