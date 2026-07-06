import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ColumnDef } from '@tanstack/react-table';
import { type ComponentProps, useEffect, useRef, useState } from 'react';
import {
  CalendarIcon,
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleCheckIcon,
  CircleInfoIcon,
  TriangleWarningIcon,
} from '@acronis-platform/icons-react/stroke-mono';

import { ButtonIcon } from '../../button-icon';
import { Checkbox } from '../../checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../select';
import { TableActions } from '../../table';
import { Tag } from '../../tag';
import { DataTable, type TanstackTable } from '../data-table';

// `DataTable` is generic (`<TData, TValue>`), which `Meta<typeof DataTable>`
// can't preserve — Storybook's `Meta<T>` erases component generics, so
// `args` typed through it collapses to `ColumnDef<unknown>[]`. Each story
// below uses `render` with an explicitly-typed `DataTable<Payment>` call
// instead, exactly like `ui-legacy`'s own DataTable stories work around the
// same limitation.
const meta = {
  title: 'UI/DataTable',
  component: DataTable,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    columns: {
      control: false,
      description: 'TanStack Table `ColumnDef[]` — same shape as `ui-legacy`’s `DataTable`.',
      table: { type: { summary: 'ColumnDef<TData, TValue>[]' }, category: 'Content' },
    },
    data: {
      control: false,
      description: 'Row data array.',
      table: { type: { summary: 'TData[]' }, category: 'Content' },
    },
    getRowCanExpand: {
      control: false,
      description: 'Enables row expansion for rows that return true. Pair with `renderExpandedRow`.',
      table: { type: { summary: '(row: Row<TData>) => boolean' }, category: 'Behavior' },
    },
    renderExpandedRow: {
      control: false,
      description: 'Renders expanded content for an expanded row.',
      table: { type: { summary: '(row: Row<TData>) => ReactNode' }, category: 'Content' },
    },
  },
} satisfies Meta<typeof DataTable>;

export default meta;
type Story = StoryObj<typeof meta>;

interface Payment {
  id: string;
  amount: number;
  status: 'pending' | 'processing' | 'success' | 'failed';
  email: string;
}

const payments: Payment[] = [
  { id: 'p1', amount: 316, status: 'success', email: 'ken99@example.com' },
  { id: 'p2', amount: 242, status: 'success', email: 'abe45@example.com' },
  { id: 'p3', amount: 837, status: 'processing', email: 'monserrat44@example.com' },
  { id: 'p4', amount: 874, status: 'success', email: 'silas22@example.com' },
  { id: 'p5', amount: 721, status: 'failed', email: 'carmella@example.com' },
];

const columns: ColumnDef<Payment>[] = [
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'email', header: 'Email' },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => `$${row.getValue<number>('amount').toFixed(2)}`,
  },
];

const placeholderArgs = {} as ComponentProps<typeof DataTable>;

export const Default: Story = {
  args: placeholderArgs,
  render: () => <DataTable columns={columns} data={payments} />,
};

export const Empty: Story = {
  args: placeholderArgs,
  render: () => <DataTable columns={columns} data={[]} />,
};

const selectableColumns: ColumnDef<Payment>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        aria-label="Select all"
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={
          !table.getIsAllPageRowsSelected() && table.getIsSomePageRowsSelected()
        }
        onCheckedChange={(checked) => table.toggleAllPageRowsSelected(checked)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        aria-label="Select row"
        checked={row.getIsSelected()}
        onCheckedChange={(checked) => row.toggleSelected(checked)}
      />
    ),
    enableSorting: false,
  },
  ...columns,
];

export const WithRowSelection: Story = {
  args: placeholderArgs,
  render: () => <DataTable columns={selectableColumns} data={payments} />,
};

const columnsWithActions: ColumnDef<Payment>[] = [
  ...columns,
  {
    id: 'actions',
    header: () => null,
    cell: () => <TableActions aria-label="Row actions" />,
    enableSorting: false,
  },
];

export const WithRowActions: Story = {
  args: placeholderArgs,
  render: () => <DataTable columns={columnsWithActions} data={payments} />,
};

const expandableColumns: ColumnDef<Payment>[] = [
  {
    id: 'expand',
    header: () => null,
    cell: ({ row }) => (
      <button
        type="button"
        onClick={row.getToggleExpandedHandler()}
        aria-label={row.getIsExpanded() ? 'Collapse row' : 'Expand row'}
        className="text-[var(--ui-glyph-on-surface-primary)]"
      >
        {row.getIsExpanded() ? '−' : '+'}
      </button>
    ),
    enableSorting: false,
  },
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'status', header: 'Status' },
];

export const ExpandableRows: Story = {
  args: placeholderArgs,
  render: () => (
    <DataTable
      columns={expandableColumns}
      data={payments}
      getRowCanExpand={() => true}
      renderExpandedRow={(row) => (
        <div className="text-[var(--ui-table-data-value-color-idle)]">
          Detailed payment information for{' '}
          <span className="font-medium">{row.original.id}</span>: amount $
          {row.original.amount.toFixed(2)} via {row.original.email}
        </div>
      )}
    />
  ),
};

// A bigger dataset so pagination (default TanStack page size: 10) and
// infinite scroll have more than one page/batch worth of rows to demonstrate.
const manyPayments: Payment[] = Array.from({ length: 24 }, (_, i) => ({
  id: `p${i + 1}`,
  amount: 50 + ((i * 37) % 950),
  status: (['pending', 'processing', 'success', 'failed'] as const)[i % 4],
  email: `user${i + 1}@example.com`,
}));

// DataTable always wires `getPaginationRowModel` (see data-table.tsx), so
// `ref.current` already exposes `nextPage()`/`getCanNextPage()`/`setPageSize()`
// etc. — no DataTable prop change needed. The one thing a consumer must
// handle: the ref is a *stable* TanStack Table instance (mutated in place,
// not replaced each render), so reading `ref.current.getState()` after
// calling a mutator needs an explicit re-render of *this* component —
// DataTable re-renders itself automatically, but an external control reading
// the same ref does not. `useEffect(rerender, [])` also fixes the
// one-render-late issue where the ref is still null during this component's
// first render. Layout matches `ui-legacy`'s `DataTablePagination` (selected-
// count text, a "Rows per page" Select, "Page X of Y", first/prev/next/last),
// built from ui-react's own Select/ButtonIcon/chevron icons instead — and,
// unlike legacy's own demo of that layout, driven by the same table instance
// the rows render from rather than a second, unsynced one.
const PAGE_SIZE_OPTIONS = { '5': '5', '10': '10', '15': '15' };

function PaginationDemo() {
  const tableRef = useRef<TanstackTable<Payment> | null>(null);
  const [, setTick] = useState(0);
  const rerender = () => setTick((n) => n + 1);
  useEffect(rerender, []);

  const table = tableRef.current;
  const pageIndex = table?.getState().pagination.pageIndex ?? 0;
  const pageSize = table?.getState().pagination.pageSize ?? 10;
  const pageCount = table?.getPageCount() ?? 1;
  const selectedCount = table?.getFilteredSelectedRowModel().rows.length ?? 0;
  const totalCount = table?.getFilteredRowModel().rows.length ?? 0;

  const go = (action: (t: TanstackTable<Payment>) => void) => () => {
    if (!table) return;
    action(table);
    rerender();
  };

  return (
    <div className="flex flex-col gap-3">
      <DataTable ref={tableRef} columns={selectableColumns} data={manyPayments} />
      <div className="flex items-center justify-between px-2">
        <span className="flex-1 text-sm text-[var(--ui-table-data-value-color-idle)]">
          {selectedCount} of {totalCount} row(s) selected.
        </span>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-[var(--ui-table-header-label-color)]">
              Rows per page
            </span>
            <Select
              items={PAGE_SIZE_OPTIONS}
              value={String(pageSize)}
              onValueChange={(value) => {
                if (!table) return;
                table.setPageSize(Number(value));
                rerender();
              }}
            >
              <SelectTrigger aria-label="Rows per page" className="h-8 w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(PAGE_SIZE_OPTIONS).map((size) => (
                  <SelectItem key={size} value={size}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium text-[var(--ui-table-header-label-color)]">
            Page {pageIndex + 1} of {pageCount}
          </div>
          <div className="flex items-center gap-1">
            <ButtonIcon
              aria-label="First page"
              variant="ghost"
              disabled={!table?.getCanPreviousPage()}
              onClick={go((t) => t.setPageIndex(0))}
            >
              <ChevronFirstIcon />
            </ButtonIcon>
            <ButtonIcon
              aria-label="Previous page"
              variant="ghost"
              disabled={!table?.getCanPreviousPage()}
              onClick={go((t) => t.previousPage())}
            >
              <ChevronLeftIcon />
            </ButtonIcon>
            <ButtonIcon
              aria-label="Next page"
              variant="ghost"
              disabled={!table?.getCanNextPage()}
              onClick={go((t) => t.nextPage())}
            >
              <ChevronRightIcon />
            </ButtonIcon>
            <ButtonIcon
              aria-label="Last page"
              variant="ghost"
              disabled={!table?.getCanNextPage()}
              onClick={go((t) => t.setPageIndex(t.getPageCount() - 1))}
            >
              <ChevronLastIcon />
            </ButtonIcon>
          </div>
        </div>
      </div>
    </div>
  );
}

export const Pagination: Story = {
  name: 'Pagination (via ref — drives the same instance the rows render from)',
  args: placeholderArgs,
  render: () => <PaginationDemo />,
};

// `size`/`minSize`/`maxSize` on a `ColumnDef` are always applied (see
// `sizeStyle` in data-table.tsx) — independent of `enableColumnResizing`,
// which only adds the drag handle + `table-fixed`. Two DataTables because
// `table-layout` is a *table*-level property: auto-fill (a column that
// absorbs whatever space fixed-width siblings don't use) is a `table-fixed`
// behavior, while fixed/min/max/auto-fit all read naturally under the
// default `table-layout: auto`.
const widthStrategyColumnsAuto: ColumnDef<Payment>[] = [
  { accessorKey: 'status', header: 'Fixed 140px', size: 140, minSize: 140, maxSize: 140 },
  { accessorKey: 'id', header: 'Min 120px', minSize: 120 },
  { accessorKey: 'email', header: 'Max 160px', maxSize: 160 },
  {
    accessorKey: 'amount',
    header: 'Auto-fit',
    cell: ({ row }) => `$${row.original.amount.toFixed(2)}`,
  },
];

const widthStrategyColumnsFixed: ColumnDef<Payment>[] = [
  { accessorKey: 'status', header: 'Fixed 140px', size: 140 },
  { accessorKey: 'id', header: 'Fixed 140px', size: 140 },
  { accessorKey: 'email', header: 'Auto-fill' },
];

export const ColumnWidthStrategies: Story = {
  name: 'Column width strategies (fixed, min, max, auto-fit, auto-fill)',
  args: placeholderArgs,
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <p className="mb-2 text-sm font-medium text-[var(--ui-table-header-label-color)]">
          Default (table-layout: auto) — fixed / min / max / auto-fit
        </p>
        <div className="inline-block">
          <DataTable columns={widthStrategyColumnsAuto} data={payments.slice(0, 2)} />
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-[var(--ui-table-header-label-color)]">
          table-layout: fixed — auto-fill absorbs the remaining space
        </p>
        <DataTable
          columns={widthStrategyColumnsFixed}
          data={payments.slice(0, 2)}
          enableColumnResizing
        />
      </div>
    </div>
  ),
};

// Opt-in via `enableColumnResizing` (off by default, no Figma design covers
// it). Give columns a `size`/`minSize`/`maxSize` to bound the drag range —
// drag a header cell's right edge (only the header shows a resize handle;
// data cells never do). Cell content that no longer fits a shrunk column
// truncates with an ellipsis instead of overlapping the next column (see the
// narrow `email` column below, sized well under its longest value) — fixed
// in `TableCell`/`TableHeaderCell` (table.tsx), not here.
const resizableColumns: ColumnDef<Payment>[] = [
  { accessorKey: 'status', header: 'Status', size: 140, minSize: 80, maxSize: 280 },
  { accessorKey: 'email', header: 'Email', size: 150, minSize: 60 },
  {
    accessorKey: 'amount',
    header: 'Amount',
    size: 120,
    minSize: 80,
    cell: ({ row }) => `$${row.original.amount.toFixed(2)}`,
  },
];

export const ResizableColumns: Story = {
  args: placeholderArgs,
  render: () => (
    <DataTable columns={resizableColumns} data={payments} enableColumnResizing />
  ),
};

const manyColumnColumns: ColumnDef<Payment>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'email', header: 'Email' },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => `$${row.original.amount.toFixed(2)}`,
  },
  { id: 'created', header: 'Created', cell: () => '2026-01-04' },
  { id: 'updated', header: 'Updated', cell: () => '2026-06-12' },
  { id: 'region', header: 'Region', cell: () => 'EU-West' },
];

export const HorizontalOverflowScroll: Story = {
  name: 'Horizontal overflow scroll (narrow viewport)',
  args: placeholderArgs,
  render: () => (
    <div
      style={{ width: 320, border: '1px dashed var(--ui-table-global-cell-border-color)' }}
    >
      <DataTable columns={manyColumnColumns} data={payments} />
    </div>
  ),
};

// `columnVisibility` is always wired in DataTable (see data-table.tsx), so
// `column.toggleVisibility()`/`getIsVisible()` work out of the box via the
// ref — this drives the exact same table instance the rows render from.
function ColumnVisibilityDemo() {
  const tableRef = useRef<TanstackTable<Payment> | null>(null);
  const [, setTick] = useState(0);
  const rerender = () => setTick((n) => n + 1);
  useEffect(rerender, []);

  const leafColumns = tableRef.current?.getAllLeafColumns() ?? [];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-4">
        {leafColumns.map((column) => (
          <Checkbox
            key={column.id}
            label={column.id}
            checked={column.getIsVisible()}
            onCheckedChange={(checked) => {
              column.toggleVisibility(checked);
              rerender();
            }}
          />
        ))}
      </div>
      <DataTable ref={tableRef} columns={columns} data={payments} />
    </div>
  );
}

export const ColumnVisibilityToggle: Story = {
  name: 'Column visibility toggle (via ref — drives the same instance)',
  args: placeholderArgs,
  render: () => <ColumnVisibilityDemo />,
};

// Same content-type patterns as the plain `Table`'s `CellContentPatterns`
// story (icon+text, status, severity, date, tag) — composition over
// `cell` render functions, not a `column`/`type` prop. Modeled as a
// realistic multi-column entity here instead of the Table story's
// type/content matrix, since a DataTable row is one entity with one column
// per field.
interface Asset {
  id: string;
  name: string;
  status: 'success' | 'processing';
  severity: 'warning' | 'none';
  updatedAt: string;
  category: string;
}

const assets: Asset[] = [
  {
    id: 'a1',
    name: 'backup-job-1',
    status: 'success',
    severity: 'none',
    updatedAt: '2026-06-12',
    category: 'Storage',
  },
  {
    id: 'a2',
    name: 'backup-job-2',
    status: 'processing',
    severity: 'warning',
    updatedAt: '2026-06-10',
    category: 'Network',
  },
  {
    id: 'a3',
    name: 'backup-job-3',
    status: 'success',
    severity: 'none',
    updatedAt: '2026-06-08',
    category: 'Compute',
  },
];

const cellContentColumns: ColumnDef<Asset>[] = [
  {
    accessorKey: 'name',
    header: 'Name (icon + text)',
    cell: ({ getValue }) => (
      <span className="inline-flex items-center gap-[var(--ui-table-data-gap)]">
        <CalendarIcon size={16} />
        {getValue<string>()}
      </span>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) =>
      getValue<Asset['status']>() === 'success' ? (
        <span className="inline-flex items-center gap-[var(--ui-table-data-gap)]">
          <CircleCheckIcon size={16} />
          Success
        </span>
      ) : (
        'Processing'
      ),
  },
  {
    accessorKey: 'severity',
    header: 'Severity',
    cell: ({ getValue }) =>
      getValue<Asset['severity']>() === 'warning' ? (
        <span className="inline-flex items-center gap-[var(--ui-table-data-gap)]">
          <TriangleWarningIcon size={16} />
          Warning
        </span>
      ) : (
        '—'
      ),
  },
  { accessorKey: 'updatedAt', header: 'Date' },
  {
    accessorKey: 'category',
    header: 'Tag',
    cell: ({ getValue }) => (
      <Tag variant="info" icon={<CircleInfoIcon size={16} />}>
        {getValue<string>()}
      </Tag>
    ),
  },
];

export const CellContentPatterns: Story = {
  name: 'Cell content patterns (icon+text, status, severity, date, tag)',
  args: placeholderArgs,
  render: () => <DataTable columns={cellContentColumns} data={assets} />,
};
