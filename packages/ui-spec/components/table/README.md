# Table

Displays tabular data in rows and columns. Built as a set of composable
presentational parts (`Table`, `TableHeader`, `TableBody`, `TableRow`,
`TableHeaderCell`, `TableCell`) plus two dedicated icon-button controls
(`TableActions`, `TableSettings`) — no `@tanstack/react-table` dependency.
`DataTable` is a separate, batteries-included composition of these same parts
that owns a TanStack Table instance internally (sorting, row selection, row
expansion), for consumers who don't want to wire that up by hand.

## When to Use

- **`Table` + parts** — you already have (or want full control over) the
  data logic — sorting, filtering, pagination — and just need styled,
  accessible markup to render into.
- **`DataTable`** — you want sorting, row selection, and row expansion
  working out of the box from a `columns`/`data` pair, matching the shape of
  `ui-legacy`'s `DataTable` so migrating an existing usage is close to a
  drop-in import change.

## When NOT to Use

- **A handful of key/value pairs** — use a description list, not a table.
- **A single row of summary stats** — use stat tiles/cards.
- **Free-form, non-tabular content** — a table forces a rows-and-columns
  structure; don't force content into it that isn't naturally tabular.

## Parts

| Part              | Element                    | Role                                                       |
| ----------------- | -------------------------- | ---------------------------------------------------------- |
| `Table`           | `<table>`                  | Root, wrapped in a scrollable container                    |
| `TableHeader`     | `<thead>`                  | Column header section                                      |
| `TableBody`       | `<tbody>`                  | Data section                                               |
| `TableRow`        | `<tr>`                     | A row; `selected` prop drives the active background        |
| `TableHeaderCell` | `<th>`                     | A column header; `sortDirection`/`onSort` make it sortable |
| `TableCell`       | `<td>`                     | A data cell; `disabled` prop dims the value text           |
| `TableActions`    | `<button>`                 | Per-row "more actions" kebab control                       |
| `TableSettings`   | `<button>`                 | Header column-settings gear control                        |
| `DataTable`       | (composes the parts above) | Owns a TanStack Table instance from `columns`/`data`       |

## Quick Examples

### React — composable parts

```tsx
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableCell,
} from '@acronis-platform/ui-react';

<Table>
  <TableHeader>
    <TableRow>
      <TableHeaderCell sortDirection={sort} onSort={toggleSort}>
        Name
      </TableHeaderCell>
      <TableHeaderCell>Owner</TableHeaderCell>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow selected>
      <TableCell>invoice-0042.pdf</TableCell>
      <TableCell>Jordan Lee</TableCell>
    </TableRow>
  </TableBody>
</Table>;
```

### React — DataTable

```tsx
import { DataTable } from '@acronis-platform/ui-react';
import type { ColumnDef } from '@tanstack/react-table';

const columns: ColumnDef<Payment>[] = [
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'email', header: 'Email' },
];

<DataTable columns={columns} data={payments} />;
```

`DataTable`'s props (`columns`, `data`, `getRowCanExpand`, `renderExpandedRow`)
match `ui-legacy`'s `DataTable` API. The one addition: pass a `ref` to read
the live TanStack Table instance, so you can build pagination/toolbar
controls against the exact same instance the rows render from — `ui-legacy`'s
own toolbar/pagination demo never had this and ended up driving a second,
unsynced table instance.

## Content-Type Cells

The Figma design shows several "content types" for a data cell (plain text,
icon+text, status, severity dot, date, tag). These are **composition
patterns**, not a `column`/`type` prop:

```tsx
<TableCell>
  <span className="inline-flex items-center gap-[var(--ui-table-data-gap)]">
    <CircleCheckIcon size={16} />
    Success
  </span>
</TableCell>

<TableCell>
  <Tag variant="info">In review</Tag>
</TableCell>
```

By default a `TableCell`'s value truncates to one line with an ellipsis if
it's wider than the cell (most common — a filename, an email, a status
label). Pass `wrap` for the rare case that should flow across multiple lines
instead, e.g. a full-width expanded-row description:

```tsx
<TableCell colSpan={columnCount} wrap>
  A longer description that should wrap normally instead of truncating.
</TableCell>
```

## What DataTable Supports Out of the Box

`DataTable` always wires TanStack Table's pagination row model and
`columnVisibility` state, so these work via `ref` with no extra props —
see the `Pagination` and `ColumnVisibilityToggle` stories:

```tsx
const tableRef = useRef<TanstackTable<Payment>>(null);
<DataTable ref={tableRef} columns={columns} data={data} />;
// tableRef.current.nextPage() / .getCanNextPage() / .setPageSize(20)
// tableRef.current.getAllLeafColumns()[0].toggleVisibility(false)
```

Column **resizing** is opt-in via `enableColumnResizing` (off by default —
give columns a `size`/`minSize`/`maxSize`; see the `ResizableColumns` story).
Only the header cell exposes a resize handle — data cells never do; dragging
a header's trailing edge resizes its whole column. A resized column's cell
content truncates with an ellipsis rather than overlapping the next column
(see `TableCell`'s `wrap` prop below for the one case that should still wrap).

**Sizing itself is independent of resizing.** Whenever a column declares
`size`/`minSize`/`maxSize`, `DataTable` applies the matching CSS
width/min-width/max-width — whether or not `enableColumnResizing` is set.
`enableColumnResizing` only adds the drag handle and switches the table to
`table-layout: fixed`. This lets one `ColumnDef` support several width
strategies without dragging (see the `ColumnWidthStrategies` story on both
`Table` and `DataTable`):

- **Fixed** — `size`/`minSize`/`maxSize` all equal: locked regardless of
  content; overflow truncates.
- **Min-width** — `minSize` only: never narrower than that, but still grows
  for wider content (`table-layout: auto`).
- **Max-width** — `maxSize` only: shrinks to content, capped at that width;
  overflow truncates.
- **Auto-fit** — no size declared: pure content-based width
  (`table-layout: auto`).
- **Auto-fill** — no size declared, but the table uses `table-layout: fixed`
  (e.g. via `enableColumnResizing`) and every _other_ column has a fixed
  width: the unconstrained column absorbs whatever width is left over — the
  standard, portable way to get a "flex"-like column in an HTML table.

Both `Table` and `DataTable` scroll horizontally when their container is
narrower than their content (the outer wrapper `Table` renders is
`overflow-auto`) — see the `HorizontalOverflowScroll` story on each.

## Row Selection

There is no dedicated `TableCheckbox` component — the Figma "TableCheckbox"
node is the existing `Checkbox` with no styling beyond the cell's own padding,
so compose `Checkbox` directly inside a `TableCell`/`TableHeaderCell`:

```tsx
<TableCell>
  <Checkbox
    aria-label="Select row"
    checked={row.getIsSelected()}
    onCheckedChange={row.toggleSelected}
  />
</TableCell>
```

## Spec Files

| File               | Contents                                                          |
| ------------------ | ----------------------------------------------------------------- |
| `index.yaml`       | Identity, status, category, dependencies, Figma link              |
| `anatomy.yaml`     | Root, parts, layout, pseudo/prop states                           |
| `api.yaml`         | Framework-agnostic contract + framework adapters                  |
| `tokens.yaml`      | `--ui-table-*` token references (plus shared focus/glyph tokens)  |
| `behavior.md`      | Given/When/Then behavior scenarios, including `DataTable`         |
| `accessibility.md` | ARIA roles, keyboard map, screen-reader and contrast requirements |
