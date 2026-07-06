import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
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
import { Tag } from '../../tag';
import {
  Table,
  TableActions,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  TableSettings,
  type TableSortDirection,
} from '../table';

const meta = {
  title: 'UI/Table',
  component: Table,
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: false,
      description:
        'Table structure — typically `TableHeader`/`TableBody` containing `TableRow` and `TableHeaderCell`/`TableCell` parts.',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    className: {
      control: false,
      description: 'Additional classes merged onto the `<table>` element.',
      table: { type: { summary: 'string' }, category: 'Appearance' },
    },
  },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHeaderCell>Name</TableHeaderCell>
          <TableHeaderCell>Owner</TableHeaderCell>
          <TableHeaderCell>Status</TableHeaderCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>invoice-0042.pdf</TableCell>
          <TableCell>Jordan Lee</TableCell>
          <TableCell>Active</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>invoice-0043.pdf</TableCell>
          <TableCell>Priya Nair</TableCell>
          <TableCell>Active</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>invoice-0044.pdf</TableCell>
          <TableCell>Sam Torres</TableCell>
          <TableCell>Archived</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

function SortableHeaderDemo() {
  const [sort, setSort] = useState<TableSortDirection>(false);
  const cycle = () =>
    setSort((current) =>
      current === false ? 'asc' : current === 'asc' ? 'desc' : false
    );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHeaderCell sortDirection={sort} onSort={cycle}>
            Name
          </TableHeaderCell>
          <TableHeaderCell>Owner</TableHeaderCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>invoice-0042.pdf</TableCell>
          <TableCell>Jordan Lee</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

export const SortableHeader: Story = {
  render: () => <SortableHeaderDemo />,
};

export const RowStates: Story = {
  render: () => (
    <Table>
      <TableBody>
        <TableRow>
          <TableCell>Idle row</TableCell>
        </TableRow>
        <TableRow selected>
          <TableCell>Selected row</TableCell>
        </TableRow>
        <TableRow>
          <TableCell disabled>Disabled value in an otherwise idle row</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

export const WithRowSelection: Story = {
  name: 'With row selection (Checkbox composition)',
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHeaderCell className="w-10">
            <Checkbox aria-label="Select all" />
          </TableHeaderCell>
          <TableHeaderCell>Name</TableHeaderCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow selected>
          <TableCell>
            <Checkbox aria-label="Select row" defaultChecked />
          </TableCell>
          <TableCell>invoice-0042.pdf</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Checkbox aria-label="Select row" />
          </TableCell>
          <TableCell>invoice-0043.pdf</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

export const WithRowActionsAndColumnSettings: Story = {
  name: 'With row actions and column settings',
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHeaderCell>Name</TableHeaderCell>
          <TableHeaderCell className="w-10">
            <TableSettings aria-label="Column settings" />
          </TableHeaderCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>invoice-0042.pdf</TableCell>
          <TableCell>
            <TableActions aria-label="Row actions" />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

export const CellContentPatterns: Story = {
  name: 'Cell content patterns (icon+text, status, severity, date, tag)',
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHeaderCell>Type</TableHeaderCell>
          <TableHeaderCell>Content</TableHeaderCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Icon + text</TableCell>
          <TableCell>
            <span className="inline-flex items-center gap-[var(--ui-table-data-gap)]">
              <CalendarIcon size={16} />
              Jun 12, 2026
            </span>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Status</TableCell>
          <TableCell>
            <span className="inline-flex items-center gap-[var(--ui-table-data-gap)]">
              <CircleCheckIcon size={16} />
              Success
            </span>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Severity</TableCell>
          <TableCell>
            <span className="inline-flex items-center gap-[var(--ui-table-data-gap)]">
              <TriangleWarningIcon size={16} />
              Warning
            </span>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Date</TableCell>
          <TableCell>2026-06-12</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Tag</TableCell>
          <TableCell>
            <Tag variant="info" icon={<CircleInfoIcon size={16} />}>
              In review
            </Tag>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

// `Table` has no TanStack dependency, so pagination/selection are just plain
// local state (slicing the data array, a Set of selected ids) — no special
// API. Layout matches `ui-legacy`'s `DataTablePagination` (selected-count
// text, a "Rows per page" Select, "Page X of Y", first/prev/next/last), built
// from ui-react's own Select/ButtonIcon/chevron icons instead.
const FILES = Array.from({ length: 23 }, (_, i) => `invoice-${String(i + 1).padStart(4, '0')}.pdf`);
const PAGE_SIZE_OPTIONS = { '5': '5', '10': '10', '15': '15' };

function PaginationDemo() {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const pageCount = Math.ceil(FILES.length / pageSize);
  const page = FILES.slice(pageIndex * pageSize, pageIndex * pageSize + pageSize);
  const allOnPageSelected = page.length > 0 && page.every((f) => selected.has(f));
  const someOnPageSelected = page.some((f) => selected.has(f));

  const toggleAllOnPage = (checked: boolean) =>
    setSelected((prev) => {
      const next = new Set(prev);
      for (const f of page) {
        if (checked) next.add(f);
        else next.delete(f);
      }
      return next;
    });
  const toggleOne = (file: string, checked: boolean) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (checked) next.add(file);
      else next.delete(file);
      return next;
    });

  return (
    <div className="flex flex-col gap-3">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHeaderCell className="w-10">
              <Checkbox
                aria-label="Select all on page"
                checked={allOnPageSelected}
                indeterminate={!allOnPageSelected && someOnPageSelected}
                onCheckedChange={toggleAllOnPage}
              />
            </TableHeaderCell>
            <TableHeaderCell>Name</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {page.map((name) => (
            <TableRow key={name} selected={selected.has(name)}>
              <TableCell>
                <Checkbox
                  aria-label="Select row"
                  checked={selected.has(name)}
                  onCheckedChange={(checked) => toggleOne(name, checked)}
                />
              </TableCell>
              <TableCell>{name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between px-2">
        <span className="flex-1 text-sm text-[var(--ui-table-data-value-color-idle)]">
          {selected.size} of {FILES.length} row(s) selected.
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
                setPageSize(Number(value));
                setPageIndex(0);
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
              disabled={pageIndex === 0}
              onClick={() => setPageIndex(0)}
            >
              <ChevronFirstIcon />
            </ButtonIcon>
            <ButtonIcon
              aria-label="Previous page"
              variant="ghost"
              disabled={pageIndex === 0}
              onClick={() => setPageIndex((i) => i - 1)}
            >
              <ChevronLeftIcon />
            </ButtonIcon>
            <ButtonIcon
              aria-label="Next page"
              variant="ghost"
              disabled={pageIndex === pageCount - 1}
              onClick={() => setPageIndex((i) => i + 1)}
            >
              <ChevronRightIcon />
            </ButtonIcon>
            <ButtonIcon
              aria-label="Last page"
              variant="ghost"
              disabled={pageIndex === pageCount - 1}
              onClick={() => setPageIndex(pageCount - 1)}
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
  name: 'Pagination (manual — no TanStack dependency)',
  render: () => <PaginationDemo />,
};

export const HorizontalOverflowScroll: Story = {
  name: 'Horizontal overflow scroll (narrow viewport)',
  render: () => (
    <div style={{ width: 320, border: '1px dashed var(--ui-table-global-cell-border-color)' }}>
      <Table>
        <TableHeader>
          <TableRow>
            {['Name', 'Owner', 'Status', 'Amount', 'Created', 'Updated'].map((h) => (
              <TableHeaderCell key={h} className="whitespace-nowrap">
                {h}
              </TableHeaderCell>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="whitespace-nowrap">invoice-0042.pdf</TableCell>
            <TableCell className="whitespace-nowrap">Jordan Lee</TableCell>
            <TableCell className="whitespace-nowrap">Active</TableCell>
            <TableCell className="whitespace-nowrap">$316.00</TableCell>
            <TableCell className="whitespace-nowrap">2026-01-04</TableCell>
            <TableCell className="whitespace-nowrap">2026-06-12</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  ),
};

function ColumnVisibilityDemo() {
  const [visible, setVisible] = useState({ owner: true, status: true });

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-4">
        <Checkbox
          label="Owner"
          checked={visible.owner}
          onCheckedChange={(checked) => setVisible((v) => ({ ...v, owner: checked }))}
        />
        <Checkbox
          label="Status"
          checked={visible.status}
          onCheckedChange={(checked) => setVisible((v) => ({ ...v, status: checked }))}
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Name</TableHeaderCell>
            {visible.owner && <TableHeaderCell>Owner</TableHeaderCell>}
            {visible.status && <TableHeaderCell>Status</TableHeaderCell>}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>invoice-0042.pdf</TableCell>
            {visible.owner && <TableCell>Jordan Lee</TableCell>}
            {visible.status && <TableCell>Active</TableCell>}
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

export const ColumnVisibilityToggle: Story = {
  name: 'Column visibility (conditional rendering — no special API)',
  render: () => <ColumnVisibilityDemo />,
};

// `Table` has no column-sizing API of its own — every strategy below is
// plain CSS on `TableHeaderCell`/`TableCell` (both forward `style`/
// `className` to the underlying `<th>`/`<td>`). Two separate tables because
// `table-layout` is a *table*-level property, not a per-column one, and
// "auto-fill" specifically needs `table-fixed` (see the comment below).
export const ColumnWidthStrategies: Story = {
  name: 'Column width strategies (fixed, min, max, auto-fit, auto-fill)',
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <p className="mb-2 text-sm font-medium text-[var(--ui-table-header-label-color)]">
          Default (table-layout: auto) — fixed / min / max / auto-fit
        </p>
        {/* Not full-width: with nothing forcing extra width, the auto-fit
            column hugs its own content instead of absorbing leftover space. */}
        <div className="inline-block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHeaderCell style={{ width: 140, minWidth: 140, maxWidth: 140 }}>
                  Fixed 140px
                </TableHeaderCell>
                <TableHeaderCell style={{ minWidth: 120 }}>Min 120px</TableHeaderCell>
                <TableHeaderCell style={{ maxWidth: 160 }}>Max 160px</TableHeaderCell>
                <TableHeaderCell>Auto-fit</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell style={{ width: 140, minWidth: 140, maxWidth: 140 }}>
                  Locked width
                </TableCell>
                <TableCell style={{ minWidth: 120 }}>OK</TableCell>
                <TableCell style={{ maxWidth: 160 }}>
                  A value long enough to get clipped by the cap
                </TableCell>
                <TableCell>Hugs me</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <p className="mt-2 max-w-md text-xs text-[var(--ui-table-data-value-color-idle)]">
          Fixed: locked regardless of content (content truncates). Min:
          never narrower than 120px even though &quot;OK&quot; doesn&apos;t
          need it. Max: shrinks to content but never wider than 160px — the
          long value truncates. Auto-fit: sized to its own content, no more.
        </p>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-[var(--ui-table-header-label-color)]">
          table-layout: fixed — auto-fill absorbs the remaining space
        </p>
        {/* Under `table-fixed`, a column with no declared width gets an
            equal share of whatever width the two fixed columns don't use —
            this is the standard, portable way to get a "flex"-like column
            in a plain HTML table. */}
        <Table className="table-fixed">
          <TableHeader>
            <TableRow>
              <TableHeaderCell style={{ width: 140 }}>Fixed 140px</TableHeaderCell>
              <TableHeaderCell style={{ width: 140 }}>Fixed 140px</TableHeaderCell>
              <TableHeaderCell>Auto-fill</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell style={{ width: 140 }}>Locked</TableCell>
              <TableCell style={{ width: 140 }}>Locked</TableCell>
              <TableCell>Takes whatever width is left over in the table</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  ),
};
