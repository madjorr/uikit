import * as React from 'react';
import {
  type Column,
  type ColumnDef,
  type ExpandedState,
  type Row,
  type SortingState,
  type Table as TanstackTable,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from '../table';

// Batteries-included table: owns a TanStack Table instance (sorting, row
// selection, row expansion, row visibility, pagination) and renders it
// through the presentational `table` primitives. API mirrors `ui-legacy`'s
// `DataTable` (`columns`, `data`, `getRowCanExpand`, `renderExpandedRow`) so
// consumers migrating from the legacy package change an import, not their
// call sites. Two additions:
//
// 1. The underlying TanStack Table instance is exposed via `ref` — legacy's
//    own `DataTableToolbar`/`DataTablePagination` take a `table` prop but
//    legacy's `DataTable` never exposed its internal instance, so a toolbar
//    placed next to it in practice drove a *second*, unsynced table. A
//    pagination/toolbar/column-visibility control built against this ref
//    drives the exact same instance the rows render from — see the
//    Pagination/ColumnVisibility stories.
// 2. `getPaginationRowModel`/`columnVisibility` are always wired (so
//    `ref.current.nextPage()` / `column.toggleVisibility()` work out of the
//    box) even though neither renders a built-in control — same reasoning as
//    legacy computing row models it doesn't render controls for. With no
//    controls attached, pagination defaults to one 10-row page (invisible
//    for typical demo-sized data) and all columns stay visible.
//
// Column sizing (`size`/`minSize`/`maxSize` on a `ColumnDef`) is always
// applied as inline width/min-width/max-width when declared — independent of
// `enableColumnResizing`, which is a separate opt-in for the drag handles +
// `table-fixed` layout (no Figma design covers resizing). A column with no
// declared size stays fully browser-auto-sized (hugs its own content, or
// absorbs remaining space if it's the only unconstrained column) — see the
// ColumnWidthStrategies story.
export interface DataTableProps<TData, TValue = unknown> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  /** Enables row expansion for rows that return true. Pair with `renderExpandedRow`. */
  getRowCanExpand?: (row: Row<TData>) => boolean;
  /**
   * Renders expanded content for expanded rows. Used only when a row is
   * expanded and should be used together with `getRowCanExpand`.
   */
  renderExpandedRow?: (row: Row<TData>) => React.ReactNode;
  /**
   * Enables TanStack Table's column resizing (drag handles on each header
   * cell, `table-layout: fixed`). Off by default. Sizing itself
   * (`size`/`minSize`/`maxSize` on a `ColumnDef`) is applied either way —
   * this only adds the interactive drag handle.
   */
  enableColumnResizing?: boolean;
}

/** Inline width/min/max from whichever of `size`/`minSize`/`maxSize` the
 * column's `ColumnDef` declares — `undefined` for an unconstrained column,
 * so it stays fully browser-auto-sized. */
function sizeStyle(column: Column<unknown, unknown>): React.CSSProperties | undefined {
  const def = column.columnDef;
  if (def.size === undefined && def.minSize === undefined && def.maxSize === undefined) {
    return undefined;
  }
  return {
    ...(def.size !== undefined ? { width: column.getSize() } : {}),
    ...(def.minSize !== undefined ? { minWidth: def.minSize } : {}),
    ...(def.maxSize !== undefined ? { maxWidth: def.maxSize } : {}),
  };
}

function DataTableInner<TData, TValue = unknown>(
  {
    columns,
    data,
    getRowCanExpand,
    renderExpandedRow,
    enableColumnResizing,
  }: DataTableProps<TData, TValue>,
  ref: React.ForwardedRef<TanstackTable<TData>>
) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState({});
  const [expanded, setExpanded] = React.useState<ExpandedState>({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowCanExpand,
    onExpandedChange: setExpanded,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    enableColumnResizing,
    columnResizeMode: 'onChange',
    state: { sorting, rowSelection, expanded, columnVisibility },
  });

  React.useImperativeHandle(ref, () => table, [table]);

  const rows = table.getRowModel().rows;
  const visibleColumnCount = table.getVisibleLeafColumns().length;
  const tableStyle = enableColumnResizing
    ? { width: table.getTotalSize() }
    : undefined;

  return (
    <Table
      className={enableColumnResizing ? 'table-fixed' : undefined}
      style={tableStyle}
    >
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHeaderCell
                key={header.id}
                style={sizeStyle(header.column as Column<unknown, unknown>)}
                sortDirection={
                  header.column.getCanSort()
                    ? header.column.getIsSorted()
                    : undefined
                }
                onSort={
                  header.column.getCanSort()
                    ? header.column.getToggleSortingHandler()
                    : undefined
                }
                resizeHandle={
                  enableColumnResizing && header.column.getCanResize() ? (
                    <div
                      onMouseDown={header.getResizeHandler()}
                      onTouchStart={header.getResizeHandler()}
                      className={cn(
                        'absolute top-0 right-0 h-full w-1 cursor-col-resize touch-none select-none bg-[var(--ui-table-global-cell-border-color)] opacity-0 hover:opacity-100',
                        header.column.getIsResizing() &&
                          'bg-[var(--ui-focus-primary)] opacity-100'
                      )}
                    />
                  ) : undefined
                }
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(header.column.columnDef.header, header.getContext())}
              </TableHeaderCell>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {rows.length ? (
          rows.map((row) => (
            <React.Fragment key={row.id}>
              <TableRow selected={row.getIsSelected()}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    style={sizeStyle(cell.column as Column<unknown, unknown>)}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
              {renderExpandedRow && row.getIsExpanded() && (
                <TableRow>
                  <TableCell colSpan={row.getVisibleCells().length} wrap>
                    {renderExpandedRow(row)}
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={visibleColumnCount}
              className="text-center text-[var(--ui-table-data-value-color-idle)]"
            >
              No results.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

const DataTableWithRef = React.forwardRef(DataTableInner);
DataTableWithRef.displayName = 'DataTable';

// `forwardRef` erases the component's generics; re-cast the public export so
// `<DataTable<Payment> columns={...} data={...} ref={...} />` still infers
// `TData`/`TValue` at call sites.
const DataTable = DataTableWithRef as <TData, TValue = unknown>(
  props: DataTableProps<TData, TValue> & {
    ref?: React.ForwardedRef<TanstackTable<TData>>;
  }
) => ReturnType<typeof DataTableInner>;

export { DataTable };
export type { TanstackTable };
