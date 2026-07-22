---
'@acronis-platform/ui-react': patch
---

Fix `Chip` missing a pointer cursor on the `removable` variant and its remove button. `cursor-pointer` now lives on the shared base class (covering `removable` too, not just `selectable`) and is set explicitly on the remove button, since native buttons reset cursor via the UA stylesheet.
