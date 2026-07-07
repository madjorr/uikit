# Table

Displays rows and columns of data. Composable from native table parts, with
sortable/resizable column headers, per-cell content-type compositions, and
selected/focused row states.

> Ported from the legacy `@acronis-platform/shadcn-uikit` `Table` and aligned
> to the ui-react Figma Table component family (node 3427-207 and siblings).
> Themed by the `--ui-table-*` token tier. The **TanStack-backed `DataTable`**
> composes these primitives for sorting, filtering, visibility, selection,
> pagination, resizing, and row expansion.

## When to use

- Showing structured, comparable data in rows and columns (lists of workloads,
  invoices, devices, …).
- When you need sortable/resizable columns, content-type cells, row actions,
  and/or row selection on top of native table semantics.

## When not to use

- For a full data grid with built-in sorting/filtering/pagination/resizing
  state — use `DataTable`, which composes these same primitives with that
  logic wired in.
- For non-tabular layout — use CSS grid/flex, not a table.

## Parts

| Part            | Element   | Purpose                                                                  |
| --------------- | --------- | ------------------------------------------------------------------------ |
| `Table`         | `table`   | The table, in a horizontally scrollable container.                       |
| `TableHeader`   | `thead`   | Column-header section.                                                   |
| `TableBody`     | `tbody`   | Data rows section.                                                       |
| `TableFooter`   | `tfoot`   | Summary section with a top divider.                                      |
| `TableRow`      | `tr`      | A row; `selected` applies the active state, focus-within a ring.         |
| `TableHead`     | `th`      | Column header; `sortable` + `sortDirection` + `onSort` + `resizeHandle`. |
| `TableCell`     | `td`      | A data cell; `column` content-type, `wrap`, `disabled`.                  |
| `TableCaption`  | `caption` | Optional caption below the table.                                        |
| `TableActions`  | `button`  | Row-actions trigger (kebab icon). Icon-only — needs `aria-label`.        |
| `TableSettings` | `button`  | Column-settings trigger (gear icon). Icon-only — needs `aria-label`.     |

## Examples

```tsx
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableActions,
  TableSettings,
  Checkbox,
} from '@acronis-platform/ui-react';

// Sortable, resizable header (consumer owns the sort logic and drag wiring)
<TableHead
  sortable
  sortDirection={dir}
  onSort={() => setDir(next(dir))}
  resizeHandle={<MyResizeHandle />}
>
  Name
</TableHead>

// Selectable row with a content-type cell and a trailing row-actions button
<TableRow selected={checked}>
  <TableCell>
    <Checkbox checked={checked} onCheckedChange={setChecked} aria-label="Select row" />
  </TableCell>
  <TableCell>web-server-01</TableCell>
  <TableCell column="tag">Protected</TableCell>
  <TableCell className="p-0">
    <TableActions aria-label="Row actions" />
  </TableCell>
</TableRow>;
```

For sorting/filtering/pagination/resizing state management, use `DataTable`
instead of wiring TanStack around these primitives yourself.
