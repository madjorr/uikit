import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import {
  Table,
  TableActions,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableSettings,
} from '../table';

function InvoiceTable() {
  return (
    <Table>
      <TableCaption>Recent invoices</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>INV001</TableCell>
          <TableCell>Paid</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

describe('Table', () => {
  it('renders a table with header, body, caption, and cells', () => {
    render(<InvoiceTable />);
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Invoice' })
    ).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'INV001' })).toBeInTheDocument();
    expect(screen.getByText('Recent invoices')).toBeInTheDocument();
  });

  it('themes the cells from the --ui-table-* tier', () => {
    render(<InvoiceTable />);
    const cell = screen.getByRole('cell', { name: 'INV001' });
    expect(cell.firstElementChild).toHaveClass(
      'px-[var(--ui-table-global-cell-padding-x)]'
    );
  });

  it('truncates cell content by default and opts into wrapping via `wrap`', () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell data-testid="truncated">Long value</TableCell>
            <TableCell wrap data-testid="wrapped">
              Long value
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    expect(
      screen.getByTestId('truncated').querySelector('span')
    ).toHaveClass('truncate');
    expect(screen.getByTestId('wrapped').querySelector('span')).toHaveClass(
      'whitespace-normal'
    );
  });

  it('marks a disabled cell with aria-disabled and the disabled color token', () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell disabled data-testid="cell">
              Value
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    const cell = screen.getByTestId('cell');
    expect(cell).toHaveAttribute('aria-disabled', 'true');
    expect(cell.firstElementChild).toHaveClass(
      'text-[var(--ui-table-data-value-color-disabled)]'
    );
  });

  it('marks a sortable header with aria-sort and fires onSort on activation', async () => {
    const user = userEvent.setup();
    const onSort = vi.fn();
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead sortable sortDirection={false} onSort={onSort}>
              Name
            </TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    );
    const header = screen.getByRole('columnheader', { name: /Name/ });
    expect(header).toHaveAttribute('aria-sort', 'none');
    await user.click(screen.getByRole('button', { name: /Name/ }));
    expect(onSort).toHaveBeenCalledTimes(1);
  });

  it('reflects the sort direction in aria-sort', () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead sortable sortDirection="asc">
              Name
            </TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    );
    expect(screen.getByRole('columnheader', { name: /Name/ })).toHaveAttribute(
      'aria-sort',
      'ascending'
    );
  });

  it('shows a down arrow for ascending and an up arrow for descending (Figma node 3435-268)', () => {
    const { rerender } = render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead sortable sortDirection="asc">
              Name
            </TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    );
    // ArrowDownIcon's path — asc sorts show the "points down" glyph.
    expect(
      screen.getByRole('columnheader').querySelector('path')
    ).toHaveAttribute('d', 'M12 3v18m-7-7 7 7 7-7');

    rerender(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead sortable sortDirection="desc">
              Name
            </TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    );
    // ArrowUpIcon's path — desc sorts show the "points up" glyph.
    expect(
      screen.getByRole('columnheader').querySelector('path')
    ).toHaveAttribute('d', 'M12 21V3m-7 7 7-7 7 7');
  });

  it('applies the selected (active) row state', () => {
    render(
      <Table>
        <TableBody>
          <TableRow selected data-testid="row">
            <TableCell>Selected</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    const row = screen.getByTestId('row');
    expect(row).toHaveAttribute('data-state', 'selected');
    expect(row).toHaveClass(
      'data-[state=selected]:bg-[var(--ui-table-global-row-color-active)]'
    );
  });

  it('carries a focus-within ring for keyboard focus on a child control (Figma node 4536-699 `focused` state)', async () => {
    const user = userEvent.setup();
    render(
      <Table>
        <TableBody>
          <TableRow data-testid="row">
            <TableCell>
              <button type="button">Focus me</button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    const row = screen.getByTestId('row');
    // happy-dom doesn't evaluate `:focus-within` via matches()/getComputedStyle,
    // so assert the static class (proven correct by the visual/Storybook
    // regression baseline) plus that the child control is actually reachable
    // by keyboard, which is what the ring is meant to indicate.
    expect(row).toHaveClass('focus-within:ring-[3px]');
    await user.tab();
    expect(screen.getByRole('button', { name: 'Focus me' })).toHaveFocus();
  });

  it('forwards the ref to the table element', () => {
    const ref = createRef<HTMLTableElement>();
    render(
      <Table ref={ref}>
        <TableBody>
          <TableRow>
            <TableCell>x</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    expect(ref.current).toBeInstanceOf(HTMLTableElement);
  });
});

describe('TableActions', () => {
  it('renders a default ellipsis icon and fires onClick', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<TableActions aria-label="Row actions" onClick={onClick} />);
    const button = screen.getByRole('button', { name: 'Row actions' });
    expect(button.querySelector('svg')).toBeInTheDocument();
    await user.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders custom children instead of the default icon', () => {
    render(<TableActions aria-label="Row actions">custom</TableActions>);
    expect(screen.getByRole('button', { name: 'Row actions' })).toHaveTextContent(
      'custom'
    );
  });
});

describe('TableSettings', () => {
  it('renders a default gear icon and fires onClick', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<TableSettings aria-label="Column settings" onClick={onClick} />);
    const button = screen.getByRole('button', { name: 'Column settings' });
    expect(button.querySelector('svg')).toBeInTheDocument();
    await user.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders custom children instead of the default icon', () => {
    render(<TableSettings aria-label="Column settings">custom</TableSettings>);
    expect(
      screen.getByRole('button', { name: 'Column settings' })
    ).toHaveTextContent('custom');
  });
});

describe('TableCell column content variants', () => {
  it('renders plain text by default, with no icon slot', () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell data-testid="cell">Simple value</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    const cell = screen.getByTestId('cell');
    expect(cell).toHaveTextContent('Simple value');
    expect(cell.querySelector('svg')).not.toBeInTheDocument();
  });

  it.each(['iconText', 'status', 'severity'] as const)(
    'renders a leading icon + text for column="%s"',
    (column) => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell
                data-testid="cell"
                column={column}
                icon={<svg data-testid="icon" />}
              >
                Value
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      const cell = screen.getByTestId('cell');
      expect(cell.querySelector('[data-testid="icon"]')).toBeInTheDocument();
      expect(cell).toHaveTextContent('Value');
      expect(cell.firstElementChild).toHaveClass(
        'gap-[var(--ui-table-data-gap)]'
      );
    }
  );

  it('wraps the value in a Tag for column="tag"', () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell data-testid="cell" column="tag">
              Label
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    // Tag nests the label in its own inner truncating span, so the Tag
    // itself (with its rounded-pill classes) is that span's parent.
    const label = screen.getByText('Label');
    expect(label.parentElement).toHaveClass(
      'rounded-[var(--ui-tag-global-container-border-radius)]'
    );
  });
});
