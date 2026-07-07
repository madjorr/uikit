import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';
import type { ColumnDef } from '@tanstack/react-table';

import { Checkbox } from '../../checkbox';
import { Tag } from '../../tag';
import {
  DataTable,
  DataTableColumnHeader,
  DataTablePagination,
  type DataTableProps,
  DataTableToolbar,
  type TanstackTable,
} from '../index';

type Payment = {
  id: string;
  amount: number;
  status: 'pending' | 'processing' | 'success' | 'failed';
  email: string;
};

const payments: Payment[] = [
  { id: 'p1', amount: 316, status: 'success', email: 'ken99@example.com' },
  { id: 'p2', amount: 242, status: 'success', email: 'abe45@example.com' },
  { id: 'p3', amount: 837, status: 'processing', email: 'monserrat@example.com' },
  { id: 'p4', amount: 874, status: 'success', email: 'silas22@example.com' },
  { id: 'p5', amount: 721, status: 'failed', email: 'carmella@example.com' },
  { id: 'p6', amount: 100, status: 'pending', email: 'test@example.com' },
  { id: 'p7', amount: 550, status: 'success', email: 'user7@example.com' },
];

const STATUS_VARIANT = {
  success: 'success',
  processing: 'info',
  pending: 'neutral',
  failed: 'danger',
} as const;

const columns: ColumnDef<Payment>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => (
      <Tag variant={STATUS_VARIANT[row.original.status]}>{row.original.status}</Tag>
    ),
  },
  {
    accessorKey: 'email',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Amount" />,
    cell: ({ row }) => (
      <div className="font-medium">${row.original.amount.toFixed(2)}</div>
    ),
  },
];

const meta = {
  title: 'UI/DataTable',
  component: DataTable,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  // DataTable is generic with required `columns`/`data`; each story drives its
  // own data via `render`, so satisfy the args type with an empty cast.
  args: {} as DataTableProps<unknown, unknown>,
} satisfies Meta<typeof DataTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <DataTable columns={columns} data={payments} />,
};

export const Empty: Story = {
  render: () => <DataTable columns={columns} data={[]} />,
};

function WithToolbarAndPagination() {
  // A callback ref (rather than useRef) so the first render after DataTable
  // mounts picks up the live TanStack instance — useRef's value wouldn't
  // trigger a re-render on its own. `onStateChange` keeps this in sync for
  // every later change too (the ref's target mutates in place, which alone
  // doesn't cause this component to re-render).
  const [table, setTable] = useState<TanstackTable<Payment> | null>(null);
  const [, setTick] = useState(0);
  const forceRender = () => setTick((t) => t + 1);

  return (
    <div className="flex flex-col gap-4">
      {table && (
        <DataTableToolbar table={table} searchKey="email" searchPlaceholder="Filter emails…" />
      )}
      <DataTable
        ref={setTable}
        columns={columns}
        data={payments}
        initialPageSize={5}
        onStateChange={forceRender}
      />
      {table && <DataTablePagination table={table} />}
    </div>
  );
}

export const Toolbar: Story = {
  render: () => <WithToolbarAndPagination />,
};

const expandableColumns: ColumnDef<Payment>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'status', header: 'Status' },
];

export const ExpandableRows: Story = {
  render: () => (
    <DataTable
      columns={expandableColumns}
      data={payments.slice(0, 4)}
      getRowCanExpand={() => true}
      renderExpandedRow={(row) => (
        <div className="text-sm text-muted-foreground">
          Detailed payment information for{' '}
          <span className="font-medium text-foreground">{row.original.id}</span> —
          ${row.original.amount.toFixed(2)} via {row.original.email}
        </div>
      )}
    />
  ),
};

export const Striped: Story = {
  render: () => <DataTable columns={columns} data={payments} striped />,
};

export const Bordered: Story = {
  render: () => <DataTable columns={columns} data={payments} bordered striped />,
};

export const Skeleton: Story = {
  render: () => <DataTable columns={columns} data={[]} skeleton skeletonRows={5} />,
};

const widthStrategyColumns: ColumnDef<Payment>[] = [
  // Fixed — always renders at exactly 80px.
  { accessorKey: 'id', header: 'ID', size: 80 },
  // Min/max — flexes between a floor and a ceiling.
  { accessorKey: 'email', header: 'Email', minSize: 160, maxSize: 320 },
  // Auto — no size/minSize/maxSize declared, sizes to content like a plain column.
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'amount', header: 'Amount' },
];

export const ColumnWidthStrategies: Story = {
  render: () => <DataTable columns={widthStrategyColumns} data={payments} />,
};

export const ResizableColumns: Story = {
  render: () => (
    <DataTable columns={widthStrategyColumns} data={payments} enableColumnResizing />
  ),
};

export const CurrentRow: Story = {
  render: () => <DataTable columns={columns} data={payments} highlightCurrentRow />,
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByText('silas22@example.com'));
  },
};
