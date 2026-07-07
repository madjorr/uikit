import type { Meta, StoryObj } from '@storybook/react-vite';
import { FolderIcon } from '@acronis-platform/icons-react/stroke-mono';
import {
  CircleInfoBlueIcon,
  DotBlueIcon,
} from '@acronis-platform/icons-react/stroke-multi';
import { expect, userEvent, within } from 'storybook/test';

import { Checkbox } from '../../checkbox';
import { Tag } from '../../tag';
import {
  Table,
  TableActions,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  TableSettings,
} from '../table';

const meta = {
  title: 'UI/Table',
  component: Table,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: false,
      description:
        'Composed parts — `TableHeader`/`TableBody`/`TableFooter` with `TableRow`, `TableHead`, `TableCell`, and an optional `TableCaption`.',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    className: {
      control: false,
      description: 'Additional classes merged onto the `<table>`.',
      table: { type: { summary: 'string' }, category: 'Appearance' },
    },
  },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Table className="w-[520px]">
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">INV001</TableCell>
          <TableCell>Paid</TableCell>
          <TableCell>Credit Card</TableCell>
          <TableCell className="text-right">$250.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">INV002</TableCell>
          <TableCell>Pending</TableCell>
          <TableCell>PayPal</TableCell>
          <TableCell className="text-right">$150.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">INV003</TableCell>
          <TableCell>Unpaid</TableCell>
          <TableCell>Bank Transfer</TableCell>
          <TableCell className="text-right">$350.00</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$750.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
};

// Sortable headers render the sort affordance (inactive ⇅ / active ↑ / active ↓)
// and set `aria-sort`. Wire `onSort` to your own sorting; the direction is fixed
// here for the snapshot.
export const SortableHeaders: Story = {
  render: () => (
    <Table className="w-[520px]">
      <TableHeader>
        <TableRow>
          <TableHead sortable sortDirection="asc">
            Name
          </TableHead>
          <TableHead sortable>Created</TableHead>
          <TableHead sortable sortDirection="desc" className="text-right">
            Size
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Backup archive</TableCell>
          <TableCell>26 Jan, 2026</TableCell>
          <TableCell className="text-right">4 567 890</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Disk image</TableCell>
          <TableCell>24 Jan, 2026</TableCell>
          <TableCell className="text-right">1 204 050</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

// Selection: a leading checkbox column and a `selected` row (active token).
export const Selectable: Story = {
  render: () => (
    <Table className="w-[520px]">
      <TableHeader>
        <TableRow>
          <TableHead>
            <Checkbox aria-label="Select all" />
          </TableHead>
          <TableHead>Workload</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow selected>
          <TableCell>
            <Checkbox defaultChecked aria-label="Select row" />
          </TableCell>
          <TableCell>web-server-01</TableCell>
          <TableCell>
            <Tag>Protected</Tag>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Checkbox aria-label="Select row" />
          </TableCell>
          <TableCell>db-primary</TableCell>
          <TableCell>
            <Tag>Protected</Tag>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

// A trailing TableActions (row menu) per data row and a TableSettings
// (column visibility) trigger in the header — Figma nodes 4536-414 / 3698-497.
export const WithRowActionsAndColumnSettings: Story = {
  render: () => (
    <Table className="w-[520px]">
      <TableHeader>
        <TableRow>
          <TableHead>Workload</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="p-0">
            <TableSettings aria-label="Column settings" />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>web-server-01</TableCell>
          <TableCell>
            <Tag>Protected</Tag>
          </TableCell>
          <TableCell className="p-0">
            <TableActions aria-label="Row actions" />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>db-primary</TableCell>
          <TableCell>
            <Tag>Protected</Tag>
          </TableCell>
          <TableCell className="p-0">
            <TableActions aria-label="Row actions" />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

// TableCell's `column` variant (Figma node 4536-97) — one component, six
// content-type compositions.
export const CellContentPatterns: Story = {
  render: () => (
    <Table className="w-[520px]">
      <TableHeader>
        <TableRow>
          <TableHead>Column</TableHead>
          <TableHead>Rendered value</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>text</TableCell>
          <TableCell>Simple value</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>date</TableCell>
          <TableCell column="date">15 Jun, 2026</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>iconText</TableCell>
          <TableCell column="iconText" icon={<FolderIcon />}>
            Backups
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>status</TableCell>
          <TableCell column="status" icon={<CircleInfoBlueIcon />}>
            Info
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>severity</TableCell>
          <TableCell column="severity" icon={<DotBlueIcon />}>
            Low
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>tag</TableCell>
          <TableCell column="tag">Label</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

// Tabbing into a row's action button shows the row-level `focused` ring
// (Figma node 4536-699) — the row itself isn't focusable, a control inside it is.
export const RowFocused: Story = {
  render: () => (
    <Table className="w-[520px]">
      <TableHeader>
        <TableRow>
          <TableHead>Workload</TableHead>
          <TableHead className="p-0">
            <TableSettings aria-label="Column settings" />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>web-server-01</TableCell>
          <TableCell className="p-0">
            <TableActions aria-label="Row actions" />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>db-primary</TableCell>
          <TableCell className="p-0">
            <TableActions aria-label="Row actions" />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Tab order: TableSettings (header), then each row's TableActions.
    await userEvent.tab();
    await userEvent.tab();
    await expect(canvas.getAllByRole('button', { name: 'Row actions' })[0]).toHaveFocus();
  },
};
