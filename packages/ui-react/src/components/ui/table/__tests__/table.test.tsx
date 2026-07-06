import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Checkbox } from '../../checkbox';
import {
  Table,
  TableActions,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  TableSettings,
} from '../table';

function Grid({
  sortDirection = false as false | 'asc' | 'desc',
  onSort,
  selected = false,
}: {
  sortDirection?: false | 'asc' | 'desc';
  onSort?: () => void;
  selected?: boolean;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHeaderCell sortDirection={sortDirection} onSort={onSort}>
            Name
          </TableHeaderCell>
          <TableHeaderCell>Owner</TableHeaderCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow selected={selected}>
          <TableCell>invoice.pdf</TableCell>
          <TableCell disabled>Unassigned</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

describe('Table', () => {
  it('renders a table with the expected header and cell text', () => {
    render(<Grid />);
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'invoice.pdf' })).toBeInTheDocument();
  });

  it('renders a non-sortable header cell as plain text, not a button', () => {
    render(<Grid />);
    const owner = screen.getByRole('columnheader', { name: 'Owner' });
    expect(owner.querySelector('button')).not.toBeInTheDocument();
  });

  it('renders a sortable header cell as a button with the inactive sort icon', () => {
    render(<Grid onSort={vi.fn()} sortDirection={false} />);
    const button = screen.getByRole('button', { name: 'Name' });
    expect(button.querySelector('svg')).toBeInTheDocument();
  });

  it('calls onSort when the sortable header cell is clicked', async () => {
    const onSort = vi.fn();
    render(<Grid onSort={onSort} />);
    await userEvent.click(screen.getByRole('button', { name: 'Name' }));
    expect(onSort).toHaveBeenCalledOnce();
  });

  it('marks a selected row with aria-selected and the active row token', () => {
    render(<Grid selected />);
    const row = screen.getAllByRole('row')[1];
    expect(row).toHaveAttribute('aria-selected', 'true');
    expect(row).toHaveClass('aria-selected:bg-[var(--ui-table-global-row-color-active)]');
  });

  it('marks a disabled cell with aria-disabled and the disabled value token', () => {
    render(<Grid />);
    const cell = screen.getByRole('cell', { name: 'Unassigned' });
    expect(cell).toHaveAttribute('aria-disabled', 'true');
    expect(cell).toHaveClass('aria-disabled:text-[var(--ui-table-data-value-color-disabled)]');
  });

  it('composes the existing Checkbox in a cell for row selection', () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>
              <Checkbox aria-label="Select row" />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    expect(screen.getByRole('checkbox', { name: 'Select row' })).toBeInTheDocument();
  });

  it('renders TableActions with a default kebab icon and a required accessible name', () => {
    render(<TableActions aria-label="Row actions" />);
    const button = screen.getByRole('button', { name: 'Row actions' });
    expect(button.querySelector('svg')).toBeInTheDocument();
  });

  it('renders TableSettings with a default gear icon and a required accessible name', () => {
    render(<TableSettings aria-label="Column settings" />);
    const button = screen.getByRole('button', { name: 'Column settings' });
    expect(button.querySelector('svg')).toBeInTheDocument();
  });

  it('lets TableActions/TableSettings override the default icon via children', () => {
    render(<TableActions aria-label="Row actions">{<span data-testid="custom" />}</TableActions>);
    expect(screen.getByTestId('custom')).toBeInTheDocument();
  });

  it('forwards refs to the underlying elements', () => {
    const tableRef = createRef<HTMLTableElement>();
    const rowRef = createRef<HTMLTableRowElement>();
    const cellRef = createRef<HTMLTableCellElement>();
    render(
      <Table ref={tableRef}>
        <TableBody>
          <TableRow ref={rowRef}>
            <TableCell ref={cellRef}>Value</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    expect(tableRef.current).toBeInstanceOf(HTMLTableElement);
    expect(rowRef.current).toBeInstanceOf(HTMLTableRowElement);
    expect(cellRef.current).toBeInstanceOf(HTMLTableCellElement);
  });
});
