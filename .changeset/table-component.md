---
'@acronis-platform/ui-react': minor
---

Add `Table` and `DataTable`.

`Table` ships composable, presentational parts — `Table`, `TableHeader`,
`TableBody`, `TableRow`, `TableHeaderCell`, `TableCell`, `TableActions`,
`TableSettings` — themed by the new `--ui-table-*` token tier. Row selection
reuses the existing `Checkbox` composed inside a cell (no dedicated
`TableCheckbox`); content-type cells (icon+text, status, severity, date, tag)
are composition patterns over `TableCell`, not separate props. `TableHeaderCell`
exposes an optional 3-state sort affordance via `sortDirection`/`onSort`,
mapping 1:1 to TanStack Table's `column.getIsSorted()` /
`getToggleSortingHandler()` — these primitives carry no `@tanstack/react-table`
dependency of their own.

`DataTable` is a batteries-included composition of the same parts that owns a
TanStack Table instance internally (sorting, row selection, row expansion,
pagination, column visibility) from a `columns`/`data` pair. Its core API —
`columns`, `data`, `getRowCanExpand`, `renderExpandedRow` — matches
`@acronis-platform/shadcn-uikit`'s `DataTable` so existing call sites port
over with an import change. Additions:

- `DataTable` exposes its underlying TanStack Table instance via `ref`, so
  pagination/column-visibility/toolbar controls can be built against the
  exact same instance the rows render from (legacy's own toolbar/pagination
  demo never had this and ended up driving a second, unsynced table).
- Pagination and column visibility are always wired internally, so
  `ref.current.nextPage()` / `column.toggleVisibility()` work with no extra
  props.
- `enableColumnResizing` (opt-in, off by default) turns on TanStack Table's
  column resizing — only the header cell gets a resize handle, never data
  cells. `TableHeaderCell` gained a matching `resizeHandle` prop.
- Column sizing (`size`/`minSize`/`maxSize` on a `ColumnDef`) is applied
  whenever declared, independent of `enableColumnResizing` — which now only
  controls the drag handle and `table-layout: fixed`. This supports several
  width strategies without dragging: fixed (all three equal), min-width
  floor, max-width cap, content-based auto-fit (no size declared), and
  auto-fill (no size declared, but sibling columns are fixed under
  `table-layout: fixed` — the unconstrained column absorbs the remainder).

`TableCell` gained a `wrap` prop (default off): its value now truncates to
one line with an ellipsis when it's wider than the cell — needed once
columns can be resized narrower than their content, otherwise the value
would visually overlap the next column. Pass `wrap` for the rare case that
should flow across multiple lines instead (e.g. a full-width expanded-row
description).
