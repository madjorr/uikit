# DataTable

A data grid built on TanStack react-table v8, composed over the Table
primitives — sorting, filtering, column visibility, row selection, pagination,
resizing, column width strategies, and optional row expansion.

> Ported from the legacy `@acronis-platform/shadcn-uikit` `data-table`. Adds no
> color of its own — it composes already-themed ui-react components.

## When to use

- Tabular data that needs interaction — sorting, filtering, selection, paging,
  resizing.

## When not to use

- A simple static table — use the `Table` primitives directly.
- A key/value list or cards layout — a table is the wrong shape.

## Parts

| Export                  | Purpose                                                                             |
| ----------------------- | ----------------------------------------------------------------------------------- |
| `DataTable`             | The grid. Owns table state; takes `columns` / `data`.                               |
| `DataTableColumnHeader` | A sortable column header — single-click toggle (↓/↑/⇅). Use in a column's `header`. |
| `DataTableToolbar`      | Search box + Reset + view options. Takes a `table` instance.                        |
| `DataTablePagination`   | Selection count, rows-per-page, page controls. Takes a `table`.                     |
| `DataTableViewOptions`  | Column-visibility menu. Takes a `table`.                                            |

`DataTable` manages its own table state and exposes the live TanStack `Table`
instance via `ref` (typed as `TanstackTable<TData>`). Bind the companion parts
to that same ref — not a second, independently-built `useReactTable` instance —
so they read and drive the exact grid that's rendered. Since the ref's target
mutates in place, pass `onStateChange` too so the components holding the ref
re-render when state changes (see the example below).

## Example

```tsx
import { DataTable, DataTableColumnHeader } from '@acronis-platform/ui-react';
import type { ColumnDef } from '@tanstack/react-table';

const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  // A fixed width, and a min/max range — omit both for content-based sizing.
  { accessorKey: 'amount', header: 'Amount', size: 120 },
];

<DataTable columns={columns} data={payments} enableColumnResizing />;
```

## Toolbar + pagination bound to the same grid

```tsx
import { useState } from 'react';
import {
  DataTable,
  DataTablePagination,
  DataTableToolbar,
  type TanstackTable,
} from '@acronis-platform/ui-react';

function Example() {
  const [table, setTable] = useState<TanstackTable<Payment> | null>(null);
  const [, setTick] = useState(0);
  const forceRender = () => setTick((t) => t + 1);

  return (
    <div className="flex flex-col gap-4">
      {table && (
        <DataTableToolbar
          table={table}
          searchKey="email"
          searchPlaceholder="Filter emails…"
        />
      )}
      <DataTable
        ref={setTable}
        columns={columns}
        data={payments}
        onStateChange={forceRender}
      />
      {table && <DataTablePagination table={table} />}
    </div>
  );
}
```

A callback ref (`setTable`, not `useRef`) is what lets the first render after
`DataTable` mounts already have the live instance to hand to the toolbar and
pagination — a plain ref object wouldn't trigger a re-render on its own.
