import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ColumnDef, Table as TanstackTable } from '@tanstack/react-table';
import { describe, expect, it } from 'vitest';

import { Checkbox } from '../../checkbox';
import { DataTable } from '../data-table';

interface Payment {
  id: string;
  amount: number;
  status: string;
}

const payments: Payment[] = [
  { id: 'p1', amount: 100, status: 'success' },
  { id: 'p2', amount: 200, status: 'pending' },
  { id: 'p3', amount: 50, status: 'failed' },
];

const columns: ColumnDef<Payment>[] = [
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'amount', header: 'Amount' },
];

describe('DataTable', () => {
  it('renders a header per column and a row per data item', () => {
    render(<DataTable columns={columns} data={payments} />);
    expect(screen.getByRole('columnheader', { name: 'Status' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Amount' })).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(1 + payments.length);
    expect(screen.getByRole('cell', { name: 'success' })).toBeInTheDocument();
  });

  it('renders a "No results." row when data is empty', () => {
    render(<DataTable columns={columns} data={[]} />);
    expect(screen.getByText('No results.')).toBeInTheDocument();
  });

  it('sorts a column when its header is clicked, toggling asc/desc/inactive', async () => {
    const sortableColumns: ColumnDef<Payment>[] = [
      { accessorKey: 'amount', header: 'Amount', enableSorting: true },
    ];
    render(<DataTable columns={sortableColumns} data={payments} />);
    const header = screen.getByRole('button', { name: 'Amount' });

    // TanStack Table's default toggle cycle is desc-first for this column.
    await userEvent.click(header);
    let cells = screen.getAllByRole('cell').map((c) => c.textContent);
    expect(cells).toEqual(['200', '100', '50']);

    await userEvent.click(header);
    cells = screen.getAllByRole('cell').map((c) => c.textContent);
    expect(cells).toEqual(['50', '100', '200']);
  });

  it('renders a non-sortable column header as plain text, not a button', () => {
    const unsortable: ColumnDef<Payment>[] = [
      { accessorKey: 'status', header: 'Status', enableSorting: false },
    ];
    render(<DataTable columns={unsortable} data={payments} />);
    expect(
      screen.queryByRole('button', { name: 'Status' })
    ).not.toBeInTheDocument();
  });

  it('supports row selection via a consumer-defined checkbox column', async () => {
    const selectableColumns: ColumnDef<Payment>[] = [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            aria-label="Select all"
            checked={table.getIsAllRowsSelected()}
            onCheckedChange={(checked) => table.toggleAllRowsSelected(checked)}
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
      { accessorKey: 'status', header: 'Status' },
    ];
    render(<DataTable columns={selectableColumns} data={payments} />);

    const [firstRowCheckbox] = screen.getAllByRole('checkbox', {
      name: 'Select row',
    });
    await userEvent.click(firstRowCheckbox);

    const rows = screen.getAllByRole('row');
    expect(rows[1]).toHaveAttribute('aria-selected', 'true');
  });

  it('renders expanded content for expanded rows via getRowCanExpand/renderExpandedRow', async () => {
    const expandableColumns: ColumnDef<Payment>[] = [
      {
        id: 'expand',
        header: () => null,
        cell: ({ row }) => (
          <button
            type="button"
            onClick={row.getToggleExpandedHandler()}
            aria-label="Expand row"
          >
            +
          </button>
        ),
        enableSorting: false,
      },
      { accessorKey: 'id', header: 'ID' },
    ];
    render(
      <DataTable
        columns={expandableColumns}
        data={payments}
        getRowCanExpand={() => true}
        renderExpandedRow={(row) => <span>Details for {row.original.id}</span>}
      />
    );

    expect(screen.queryByText('Details for p1')).not.toBeInTheDocument();
    const [firstExpandButton] = screen.getAllByRole('button', {
      name: 'Expand row',
    });
    await userEvent.click(firstExpandButton);
    expect(screen.getByText('Details for p1')).toBeInTheDocument();
  });

  it('exposes the underlying TanStack Table instance via ref', () => {
    const tableRef = createRef<TanstackTable<Payment>>();
    render(<DataTable columns={columns} data={payments} ref={tableRef} />);
    expect(tableRef.current).not.toBeNull();
    expect(tableRef.current?.getRowModel().rows).toHaveLength(payments.length);
  });
});
