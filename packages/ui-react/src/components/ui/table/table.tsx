import * as React from 'react';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ArrowsDownUpIcon,
  CogIcon,
  EllipsisIcon,
} from '@acronis-platform/icons-react/stroke-mono';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { Tag } from '../tag';

// Composable table primitives ported from `@acronis-platform/shadcn-uikit`'s
// `table` (packages/ui-legacy/src/components/ui/table.tsx) and informed by the
// "pre-release" Table design in the shadcn-uikit Figma (node 2948-2416). Unlike
// Card/Dialog, a `--ui-table-*` token tier already exists, so these parts theme
// directly from it (imported in styles/index.css):
//   • cell   -> --ui-table-global-cell-{border-color,padding-x,padding-y,min-height}
//   • row    -> --ui-table-global-row-color-{idle,hover,active}  (active = selected)
//   • header -> --ui-table-header-{label-color,cell-color-hover,cell-padding-x,gap}
//   • sort   -> --ui-table-header-sort-icon-{color-active,color-inactive,size}
//   • data   -> --ui-table-data-value-color-{idle,disabled}
// The design's row checkboxes, tags, links and the column-settings button are
// consumer composition (use Checkbox / Tag / Link / ButtonIcon in cells). A
// TanStack-backed `DataTable` (sorting/selection logic over these primitives) is
// a planned follow-up, mirroring legacy's separate `data-table`. Reconcile with
// `/figma-component Table <url> --update` once the design is ready for dev.

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn(
        'w-full caption-bottom border-collapse text-sm text-[var(--ui-table-data-value-color-idle)]',
        className
      )}
      {...props}
    />
  </div>
));
Table.displayName = 'Table';

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn(className)} {...props} />
));
TableHeader.displayName = 'TableHeader';

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn('[&_tr:last-child]:border-0', className)}
    {...props}
  />
));
TableBody.displayName = 'TableBody';

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      'border-t border-[color:var(--ui-table-global-cell-border-color)] font-medium [&>tr]:last:border-b-0',
      className
    )}
    {...props}
  />
));
TableFooter.displayName = 'TableFooter';

export interface TableRowProps
  extends React.HTMLAttributes<HTMLTableRowElement> {
  /** Mark the row as selected — applies the active row token + `data-state`. */
  selected?: boolean;
}

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, selected, ...props }, ref) => (
    <tr
      ref={ref}
      data-state={selected ? 'selected' : undefined}
      className={cn(
        // The row itself isn't focusable — a control inside it is (a checkbox,
        // TableActions/TableSettings) — so the keyboard-focus ring (Figma
        // node 4536-699's `focused` state) is driven by `:focus-within`.
        // `relative`/`z-10` only while focused, so the ring's box-shadow isn't
        // visually clipped by adjacent rows' borders; `ring-inset` keeps it
        // within the row's own box instead of overlapping neighboring rows.
        'border-b border-[color:var(--ui-table-global-cell-border-color)] bg-[var(--ui-table-global-row-color-idle)] transition-colors hover:bg-[var(--ui-table-global-row-color-hover)] focus-within:relative focus-within:z-10 focus-within:outline-none focus-within:ring-[3px] focus-within:ring-inset focus-within:ring-[var(--ui-focus-primary)] data-[state=selected]:bg-[var(--ui-table-global-row-color-active)]',
        className
      )}
      {...props}
    />
  )
);
TableRow.displayName = 'TableRow';

type SortDirection = 'asc' | 'desc' | false;

export interface TableHeadProps
  extends React.ThHTMLAttributes<HTMLTableCellElement> {
  /** Render the column as sortable — adds a sort affordance and `aria-sort`. */
  sortable?: boolean;
  /** Current sort direction for this column (`false` = sortable but unsorted). */
  sortDirection?: SortDirection;
  /** Invoked when the user activates a sortable header (click / Enter / Space). */
  onSort?: () => void;
  /** Optional drag-to-resize affordance, rendered at the cell's trailing edge. */
  resizeHandle?: React.ReactNode;
}

function SortIcon({ direction }: { direction: SortDirection }) {
  const size = 'size-[var(--ui-table-header-sort-icon-size)]';
  // Figma node 3435-268 (TableHeaderSortIcon): active-az (ascending) -> arrow
  // pointing down, active-za (descending) -> arrow pointing up.
  if (direction === 'asc') {
    return <ArrowDownIcon className={cn(size, 'text-[var(--ui-table-header-sort-icon-color-active)]')} />;
  }
  if (direction === 'desc') {
    return <ArrowUpIcon className={cn(size, 'text-[var(--ui-table-header-sort-icon-color-active)]')} />;
  }
  return <ArrowsDownUpIcon className={cn(size, 'text-[var(--ui-table-header-sort-icon-color-inactive)]')} />;
}

const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  (
    {
      className,
      children,
      sortable,
      sortDirection = false,
      onSort,
      resizeHandle,
      ...props
    },
    ref
  ) => (
    <th
      ref={ref}
      aria-sort={
        sortDirection === 'asc'
          ? 'ascending'
          : sortDirection === 'desc'
            ? 'descending'
            : sortable
              ? 'none'
              : undefined
      }
      className={cn(
        // `text-align`/color/font utilities passed via `className` must land
        // here (the real, table-layout-participating box) — a `display:flex`
        // wrapper below doesn't reposition its children from an ancestor's
        // `text-align` (only `justify-content` does), so an inner-targeted
        // className would silently break `text-right`/`text-center` overrides.
        'relative p-0 text-left align-middle text-sm font-semibold text-[var(--ui-table-header-label-color)]',
        sortable &&
          'cursor-pointer transition-colors hover:bg-[var(--ui-table-header-cell-color-hover)]',
        className
      )}
      {...props}
    >
      {sortable ? (
        <button
          type="button"
          onClick={onSort}
          className="inline-flex min-h-[var(--ui-table-global-cell-min-height)] max-w-full min-w-0 items-center gap-[var(--ui-table-header-gap)] rounded-sm px-[var(--ui-table-header-cell-padding-x)] outline-none [&:has([role=checkbox])]:pr-0 focus-visible:ring-[3px] focus-visible:ring-[var(--ui-focus-primary)]"
        >
          <span className="min-w-0 truncate">{children}</span>
          <SortIcon direction={sortDirection} />
        </button>
      ) : (
        // `inline-flex` (not `flex`) so this stays an atomic inline-level box
        // that the <th>'s own `text-align` can reposition — a block-level flex
        // box would default to full width and ignore inherited `text-align`
        // (only `justify-content` repositions a flex box's own children).
        <span className="inline-flex max-w-full min-h-[var(--ui-table-global-cell-min-height)] min-w-0 items-center px-[var(--ui-table-header-cell-padding-x)] [&:has([role=checkbox])]:pr-0">
          <span className="min-w-0 truncate">{children}</span>
        </span>
      )}
      {resizeHandle}
    </th>
  )
);
TableHead.displayName = 'TableHead';

// Figma node 4536-97 (TableDataCell): one component, one `column` variant —
// `iconText`/`status`/`severity` are the same "optional leading icon + text"
// composition (an icon override slot, not a fixed status/severity enum);
// `tag` wraps the value in the existing Tag component; `text`/`date` are
// plain text.
// `inline-flex` (not `flex`) so this stays an atomic inline-level box that the
// <td>'s own `text-align` can reposition — a block-level flex box would
// default to full width and ignore inherited `text-align` (only
// `justify-content` repositions a flex box's own children).
const tableCellContentVariants = cva('inline-flex max-w-full min-w-0 items-center', {
  variants: {
    column: {
      text: '',
      date: '',
      iconText: 'gap-[var(--ui-table-data-gap)]',
      status: 'gap-[var(--ui-table-data-gap)]',
      severity: 'gap-[var(--ui-table-data-gap)]',
      tag: '',
    },
  },
  defaultVariants: { column: 'text' },
});

export interface TableCellProps
  extends
    React.TdHTMLAttributes<HTMLTableCellElement>,
    VariantProps<typeof tableCellContentVariants> {
  /** Allow content to wrap instead of truncating with an ellipsis. */
  wrap?: boolean;
  /** Render the cell's content in a disabled/muted state. */
  disabled?: boolean;
  /** Leading icon for `column="iconText"` / `"status"` / `"severity"`. */
  icon?: React.ReactNode;
}

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, children, wrap, disabled, column, icon, ...props }, ref) => (
    <td
      ref={ref}
      aria-disabled={disabled || undefined}
      // `text-align`/color/font utilities passed via `className` must land
      // here (the real, table-layout-participating box) — a `display:flex`
      // wrapper below doesn't reposition its children from an ancestor's
      // `text-align` (only `justify-content` does), so an inner-targeted
      // className would silently break `text-right`/`text-center` overrides.
      className={cn('p-0 align-middle text-sm', className)}
      {...props}
    >
      <div
        className={cn(
          'min-h-[var(--ui-table-global-cell-min-height)] px-[var(--ui-table-global-cell-padding-x)] py-[var(--ui-table-global-cell-padding-y)] [&:has([role=checkbox])]:pr-0',
          tableCellContentVariants({ column }),
          disabled && 'text-[var(--ui-table-data-value-color-disabled)]'
        )}
      >
        {(column === 'iconText' || column === 'status' || column === 'severity') &&
          icon}
        {column === 'tag' ? (
          <Tag size="sm" className="shrink-0">
            {children}
          </Tag>
        ) : (
          <span className={cn('min-w-0', wrap ? 'whitespace-normal' : 'truncate')}>
            {children}
          </span>
        )}
      </div>
    </td>
  )
);
TableCell.displayName = 'TableCell';

// Shared by TableActions/TableSettings — a flush, full-height/width trailing
// action slot (Figma nodes 4536-414 / 3698-497), not an inset icon button:
// the idle/hover/active backgrounds run edge-to-edge with the row, so (unlike
// ButtonIcon) there's no border-radius on the button itself.
const tableIconButtonVariants = cva(
  'inline-flex h-[var(--ui-table-global-cell-min-height)] w-12 shrink-0 items-center justify-center px-[var(--ui-table-header-cell-padding-x)] outline-none transition-colors ' +
    'bg-[var(--ui-table-header-cell-color-idle)] hover:bg-[var(--ui-table-header-cell-color-hover)] active:bg-[var(--ui-table-header-cell-color-active)] ' +
    'focus-visible:ring-[3px] focus-visible:ring-[var(--ui-focus-primary)] ' +
    '[&_svg]:size-4 [&_svg]:shrink-0'
);

export type TableActionsProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

/** Row-actions trigger (kebab icon). Icon-only — pass an `aria-label`. */
const TableActions = React.forwardRef<HTMLButtonElement, TableActionsProps>(
  ({ className, children, type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(tableIconButtonVariants(), className)}
      {...props}
    >
      {children ?? <EllipsisIcon />}
    </button>
  )
);
TableActions.displayName = 'TableActions';

export type TableSettingsProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

/** Column-settings trigger (gear icon). Icon-only — pass an `aria-label`. */
const TableSettings = React.forwardRef<HTMLButtonElement, TableSettingsProps>(
  ({ className, children, type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(tableIconButtonVariants(), className)}
      {...props}
    >
      {children ?? <CogIcon />}
    </button>
  )
);
TableSettings.displayName = 'TableSettings';

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn('mt-4 text-sm text-muted-foreground', className)}
    {...props}
  />
));
TableCaption.displayName = 'TableCaption';

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  TableActions,
  TableSettings,
};
