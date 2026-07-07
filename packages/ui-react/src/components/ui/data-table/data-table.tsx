import {
  type CSSProperties,
  type ForwardedRef,
  forwardRef,
  Fragment,
  type ReactNode,
  type SetStateAction,
  useImperativeHandle,
  useState,
} from 'react';
import {
  type Column,
  type ColumnDef,
  type ColumnFiltersState,
  type ColumnSizingState,
  type ExpandedState,
  type Header,
  type PaginationState,
  type Row,
  type SortingState,
  type Table as TanstackTable,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../table';

// Ported from `@acronis-platform/shadcn-uikit`'s `data-table`
// (packages/ui-legacy/src/components/ui/data-table/). A TanStack-react-table v8
// data grid composed over the ui-react Table primitives — sorting, filtering,
// column visibility, row selection, pagination, and optional row expansion. The
// presentational flags (`striped`, `bordered`, `skeleton`, `highlightCurrentRow`)
// are borrowed from the Vue `AvTable`; behavioral features come from TanStack.
// Pair with DataTableToolbar / DataTablePagination / DataTableColumnHeader, which
// take the `table` instance returned to column cells via TanStack context.
// The grid cells/rows/headers are themed by the Table primitives' `--ui-table-*`
// tier; DataTable's own chrome reuses that tier too — the wrapper border matches
// the cell borders (`--ui-table-global-cell-border-color`), the empty-state uses
// the muted table-value color, the current row the active-row color, and stripes
// the secondary surface.

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  /** Enables row expansion for rows that return true. Pair with `renderExpandedRow`. */
  getRowCanExpand?: (row: Row<TData>) => boolean;
  /**
   * Renders expanded content for an expanded row. Used together with
   * `getRowCanExpand`.
   */
  renderExpandedRow?: (row: Row<TData>) => ReactNode;
  /** Alternating row backgrounds. */
  striped?: boolean;
  /** Vertical borders between columns (rows already have horizontal borders). */
  bordered?: boolean;
  /** Highlight the row the user last clicked (the "current" row). */
  highlightCurrentRow?: boolean;
  /** Render placeholder skeleton rows instead of data (loading state). */
  skeleton?: boolean;
  /** Number of skeleton rows to render when `skeleton` is set. */
  skeletonRows?: number;
  /** Initial rows-per-page, before the user (or a bound DataTablePagination) changes it. */
  initialPageSize?: number;
  /** Opt into drag-to-resize column headers. */
  enableColumnResizing?: boolean;
  /**
   * Invoked after any internal grid state changes (sorting, filters,
   * visibility, selection, expansion, column sizing, pagination). The
   * TanStack instance exposed via `ref` mutates in place rather than
   * producing a new reference each time, so a sibling reading it (e.g. a
   * `DataTableToolbar`/`DataTablePagination` driven by that same ref) has no
   * other signal to know it should re-render — call the passed callback
   * (typically a state setter that forces a re-render) to pick up the change.
   */
  onStateChange?: () => void;
}

// Applies a column's explicit `size`/`minSize`/`maxSize` (fixed / min / max /
// auto-fit / auto-fill width strategies) as inline styles, independent of
// `enableColumnResizing`. `column.getSize()` always returns a value (TanStack
// defaults size/minSize/maxSize even when undeclared), so read the raw
// `columnDef` instead — otherwise every column would be forced to a fixed
// width even when the consumer never opted into sizing.
function sizeStyle<TData, TValue>(
  column: Column<TData, TValue>
): CSSProperties {
  const { size, minSize, maxSize } = column.columnDef;
  return {
    ...(size !== undefined && { width: size }),
    ...(minSize !== undefined && { minWidth: minSize }),
    ...(maxSize !== undefined && { maxWidth: maxSize }),
  };
}

// Drag handle for `enableColumnResizing` — a thin, invisible-until-hover strip
// pinned to the header cell's trailing edge, matching the border color idle
// and the shared focus/active token while a drag is in progress.
function ResizeHandle<TData, TValue>({
  header,
}: {
  header: Header<TData, TValue>;
}) {
  return (
    <div
      onMouseDown={header.getResizeHandler()}
      onTouchStart={header.getResizeHandler()}
      className={cn(
        'absolute top-0 right-0 z-10 h-full w-1 -translate-x-1/2 cursor-col-resize touch-none select-none bg-[var(--ui-table-global-cell-border-color)] opacity-0 hover:opacity-100',
        header.column.getIsResizing() &&
          'bg-[var(--ui-focus-primary)] opacity-100'
      )}
    />
  );
}

function DataTableInner<TData, TValue>(
  {
    columns,
    data,
    getRowCanExpand,
    renderExpandedRow,
    striped = false,
    bordered = false,
    highlightCurrentRow = false,
    skeleton = false,
    skeletonRows = 5,
    enableColumnResizing = false,
    initialPageSize = 10,
    onStateChange,
  }: DataTableProps<TData, TValue>,
  ref: ForwardedRef<TanstackTable<TData>>
) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: initialPageSize,
  });
  const [currentRowId, setCurrentRowId] = useState<string>();

  // Wraps a state setter so any grid-state change also notifies the consumer
  // (see `onStateChange` above) — needed for a ref-driven sibling to know it
  // should re-render.
  function notify<T>(setState: (updater: SetStateAction<T>) => void) {
    return (updater: SetStateAction<T>) => {
      setState(updater);
      onStateChange?.();
    };
  }

  const table = useReactTable({
    data,
    columns,
    // TanStack merges its own built-in size/minSize/maxSize (150/20/MAX_SAFE_INTEGER)
    // into every column by default; overriding them to `undefined` here lets
    // `sizeStyle` below tell "column declared no size" apart from "column
    // explicitly sized" — `column.getSize()` (used for resizing) has its own
    // separate fallback, so this doesn't affect resize behavior.
    defaultColumn: { size: undefined, minSize: undefined, maxSize: undefined },
    columnResizeMode: enableColumnResizing ? 'onChange' : 'onEnd',
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowCanExpand,
    onExpandedChange: notify(setExpanded),
    onSortingChange: notify(setSorting),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: notify(setColumnFilters),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: notify(setColumnVisibility),
    onRowSelectionChange: notify(setRowSelection),
    onColumnSizingChange: notify(setColumnSizing),
    onPaginationChange: notify(setPagination),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      expanded,
      columnSizing,
      pagination,
    },
  });

  useImperativeHandle(ref, () => table, [table]);

  const rows = table.getRowModel().rows;
  // Vertical borders are opt-in; a trailing border on the last cell would
  // double up with the wrapper, so suppress it.
  const borderedClass = bordered
    ? '[&_th:not(:last-child)]:border-r [&_td:not(:last-child)]:border-r [&_th]:border-[var(--ui-table-global-cell-border-color)] [&_td]:border-[var(--ui-table-global-cell-border-color)]'
    : undefined;

  return (
    <div
      className={cn(
        'rounded-md border border-[var(--ui-table-global-cell-border-color)]',
        borderedClass
      )}
    >
      <Table
        className={enableColumnResizing ? 'table-fixed' : undefined}
        style={enableColumnResizing ? { width: table.getTotalSize() } : undefined}
      >
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  style={sizeStyle(header.column)}
                  resizeHandle={
                    enableColumnResizing && header.column.getCanResize() ? (
                      <ResizeHandle header={header} />
                    ) : undefined
                  }
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {skeleton ? (
            Array.from({ length: skeletonRows }).map((_, rowIndex) => (
              <TableRow key={`skeleton-${rowIndex}`} className="hover:bg-transparent">
                {table.getVisibleLeafColumns().map((column) => (
                  <TableCell key={column.id}>
                    <div className="h-4 w-full animate-pulse rounded bg-[var(--ui-background-surface-secondary)]" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : rows?.length ? (
            rows.map((row, rowIndex) => {
              const isSelected = row.getIsSelected();
              const isCurrent = highlightCurrentRow && currentRowId === row.id;
              return (
                <Fragment key={row.id}>
                  <TableRow
                    selected={isSelected}
                    onClick={
                      highlightCurrentRow
                        ? () => setCurrentRowId(row.id)
                        : undefined
                    }
                    className={cn(
                      highlightCurrentRow && 'cursor-pointer',
                      striped &&
                        rowIndex % 2 === 1 &&
                        !isSelected &&
                        !isCurrent &&
                        'bg-[var(--ui-background-surface-secondary)]',
                      isCurrent &&
                        !isSelected &&
                        'bg-[var(--ui-table-global-row-color-active)]'
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} style={sizeStyle(cell.column)}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                  {renderExpandedRow && row.getIsExpanded() && (
                    <TableRow className="hover:bg-transparent">
                      {/* TableCell's own padding is fixed on its inner wrapper
                          (className now targets the outer <td>, for text-align
                          to work) — the extra breathing room for detail content
                          is added here instead, on top of that default padding. */}
                      <TableCell colSpan={row.getVisibleCells().length}>
                        <div className="py-1">{renderExpandedRow(row)}</div>
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              );
            })
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center text-[var(--ui-table-data-value-color-disabled)]"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

// `forwardRef` erases generics, so re-cast to preserve `DataTable`'s own
// `<TData, TValue>` type parameters at call sites.
const DataTableWithRef = forwardRef(DataTableInner) as <TData, TValue>(
  props: DataTableProps<TData, TValue> & {
    ref?: ForwardedRef<TanstackTable<TData>>;
  }
) => ReturnType<typeof DataTableInner>;

export { DataTableWithRef as DataTable };
export type { TanstackTable };
