---
'@acronis-platform/ui-react': patch
---

`DataTable`: fix grouped column headers. A column definition that nests leaf columns in a `columns` array now renders a correct multi-row header — the group-parent cell spans its leaf columns (`colSpan` is forwarded to every `TableHead`) and the placeholder cells beneath it render empty. A group-parent cell also gets no resize handle, since it spans more than one column and has no single boundary to drag. Likewise, when `enableColumnReordering` is on, a group-parent header cell gets no drag affordance — no grab cursor and no "Reorder" tooltip hint — because dragging a header that spans sub-columns would reorder nothing. Flat (non-grouped) column definitions are unaffected, and no new props were added.
