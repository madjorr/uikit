---
'@acronis-platform/ui-react': patch
---

Fix the clear (×) button on `InputSearch`/`Search` and `InputText` missing hover/active background treatments (`InputText`'s was also missing `cursor-pointer`). Both now reuse the existing `--ui-button-icon-global-container-color-hover/active` tokens and size the button to `size-5` so the background pill has room around the icon.
