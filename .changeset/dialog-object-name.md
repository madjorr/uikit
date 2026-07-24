---
'@acronis-platform/ui-react': minor
---

Add an `objectName` prop to `Dialog`, interpolated into the `rename`, `discard changes`, and `accept` variants' canned title/body in place of the generic "object name" placeholder (e.g. `variant="rename" objectName="Q3 Report.xlsx"` renders "Rename Q3 Report.xlsx" with the text field prefilled to match). Previously the only way to substitute a real object name was to override `title` and `children` entirely, losing the variant's built-in body structure (the `rename` field, the `discard changes` bold interpolation). Ignored by variants that don't reference an object name.
