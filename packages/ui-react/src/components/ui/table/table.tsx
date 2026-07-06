import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ArrowsDownUpIcon,
  CogIcon,
  EllipsisIcon,
} from '@acronis-platform/icons-react/stroke-mono';

import { cn } from '@/lib/utils';

// Composable table primitives mirroring the Figma "Table" component family.
// Cell geometry (padding, min-height, bottom divider) is shared across header
// and data cells via the `--ui-table-global-cell-*` tokens; header and data
// cells each layer their own label/value color and background-state tokens on
// top. Row background states (idle/hover/selected) come from
// `--ui-table-global-row-color-*`; a row's "focused" treatment is the shared
// `--ui-focus-primary` ring (via `:focus-within`), not a Table-specific token
// — no distinct focused row color exists in the design. Content-type cells
// (icon+text, status, severity, date, tag) are composition patterns built from
// `TableCell` + existing primitives (icon components, `Tag`), not separate
// components — the Figma "TableDataCell" variants are content, not structure.
// Row/header selection reuses the existing `Checkbox` component as-is (its
// Figma "TableCheckbox" wrapper adds no styling beyond `TableCell`'s own
// padding). `TableActions` (row kebab) and `TableSettings` (header gear) are
// dedicated components because they wire Table's own header-cell hover/active
// tokens — not `ButtonIcon`'s tokens — matching the Figma spec exactly.
//
// This file has no `@tanstack/react-table` import — these are pure
// presentational primitives. `TableHeaderCell`'s `sortDirection`/`onSort` prop
// pair maps 1:1 to TanStack's `column.getIsSorted()` / `getToggleSortingHandler()`
// so a consumer (or this package's own `DataTable`) can wire sorting without
// this file depending on TanStack's types.

// Border only — no padding, so a sortable header cell's inner `<button>` and
// a plain data cell's own padding never stack. `min-height` deliberately
// lives on each cell's inner flex wrapper, not here: `min-height` on a
// `display: table-cell` box (this `<th>`/`<td>`) is not reliably honored by
// browsers' table row-height algorithm — the property computes correctly but
// the box still renders at content height. A normal flex box does honor it.
const cellBaseClasses =
  'border-b border-[var(--ui-table-global-cell-border-color)] p-0 align-middle';

const Table = React.forwardRef<
  HTMLTableElement,
  React.ComponentPropsWithoutRef<'table'>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn('w-full border-collapse text-sm', className)}
      {...props}
    />
  </div>
));
Table.displayName = 'Table';

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.ComponentPropsWithoutRef<'thead'>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={className} {...props} />
));
TableHeader.displayName = 'TableHeader';

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.ComponentPropsWithoutRef<'tbody'>
>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={className} {...props} />
));
TableBody.displayName = 'TableBody';

export interface TableRowProps extends React.ComponentPropsWithoutRef<'tr'> {
  /** Marks the row selected — e.g. `row.getIsSelected()` from TanStack Table. */
  selected?: boolean;
}

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, selected, ...props }, ref) => (
    <tr
      ref={ref}
      aria-selected={selected || undefined}
      className={cn(
        'bg-[var(--ui-table-global-row-color-idle)] transition-colors not-aria-selected:hover:bg-[var(--ui-table-global-row-color-hover)] aria-selected:bg-[var(--ui-table-global-row-color-active)] focus-within:outline-none focus-within:ring-[3px] focus-within:ring-[var(--ui-focus-primary)]',
        className
      )}
      {...props}
    />
  )
);
TableRow.displayName = 'TableRow';

export type TableSortDirection = false | 'asc' | 'desc';

export interface TableHeaderCellProps
  extends Omit<React.ThHTMLAttributes<HTMLTableCellElement>, 'onClick'> {
  /** Current sort direction — pass `column.getIsSorted()` from TanStack Table. */
  sortDirection?: TableSortDirection;
  /** Toggles sort — pass `column.getToggleSortingHandler()` from TanStack Table. */
  onSort?: React.MouseEventHandler<HTMLButtonElement>;
  /**
   * Optional column-resize handle, rendered as an absolutely-positioned strip
   * along the cell's trailing edge — e.g. wire TanStack Table's
   * `header.getResizeHandler()` to a drag handle here. No Figma design covers
   * resizing; this is a plain, token-driven affordance for consumers who
   * enable TanStack's column resizing.
   */
  resizeHandle?: React.ReactNode;
}

const TableHeaderCell = React.forwardRef<
  HTMLTableCellElement,
  TableHeaderCellProps
>(({ className, children, sortDirection, onSort, resizeHandle, ...props }, ref) => {
  const sortIcon =
    sortDirection === 'asc' ? (
      <ArrowDownIcon
        size={16}
        className="text-[var(--ui-table-header-sort-icon-color-active)]"
      />
    ) : sortDirection === 'desc' ? (
      <ArrowUpIcon
        size={16}
        className="text-[var(--ui-table-header-sort-icon-color-active)]"
      />
    ) : (
      <ArrowsDownUpIcon
        size={16}
        className="text-[var(--ui-table-header-sort-icon-color-inactive)]"
      />
    );

  return (
    <th
      ref={ref}
      className={cn(
        cellBaseClasses,
        'relative text-left font-semibold text-[var(--ui-table-header-label-color)]',
        className
      )}
      {...props}
    >
      {onSort ? (
        <button
          type="button"
          onClick={onSort}
          className="flex min-h-[var(--ui-table-global-cell-min-height)] w-full items-center gap-[var(--ui-table-header-gap)] bg-[var(--ui-table-header-cell-color-idle)] px-[var(--ui-table-global-cell-padding-x)] py-[var(--ui-table-global-cell-padding-y)] text-left font-semibold transition-colors hover:bg-[var(--ui-table-header-cell-color-hover)] active:bg-[var(--ui-table-header-cell-color-active)] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--ui-focus-primary)]"
        >
          <span className="min-w-0 truncate">{children}</span>
          {sortIcon}
        </button>
      ) : (
        <span className="flex min-h-[var(--ui-table-global-cell-min-height)] min-w-0 items-center px-[var(--ui-table-global-cell-padding-x)] py-[var(--ui-table-global-cell-padding-y)]">
          {/* `text-overflow` has no effect on the `flex` box above itself
              (spec: it only applies to block containers) — the truncating
              span below is a flex *item*, which is blockified, so it works. */}
          <span className="min-w-0 truncate">{children}</span>
        </span>
      )}
      {resizeHandle}
    </th>
  );
});
TableHeaderCell.displayName = 'TableHeaderCell';

export interface TableCellProps
  extends React.TdHTMLAttributes<HTMLTableCellElement> {
  /** Renders the cell's value with the disabled text-color token. */
  disabled?: boolean;
  /**
   * Lets the cell's content wrap across multiple lines instead of truncating
   * to one line with an ellipsis (the default) — e.g. a full-width expanded-
   * row description. Default off because a `display: flex` box's child
   * otherwise refuses to shrink below its content width (a standard flexbox
   * gotcha: the implicit `min-width: auto` on a flex child), which is what
   * makes long, unbroken content (a filename, an email) visually overflow
   * into the next cell instead of wrapping or truncating.
   */
  wrap?: boolean;
}

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, disabled, wrap, children, ...props }, ref) => (
    <td
      ref={ref}
      aria-disabled={disabled || undefined}
      className={cn(
        cellBaseClasses,
        'text-left text-[var(--ui-table-data-value-color-idle)] aria-disabled:text-[var(--ui-table-data-value-color-disabled)]',
        className
      )}
      {...props}
    >
      <div className="flex min-h-[var(--ui-table-global-cell-min-height)] min-w-0 items-center overflow-hidden px-[var(--ui-table-global-cell-padding-x)] py-[var(--ui-table-global-cell-padding-y)]">
        {/* `text-overflow` has no effect on the `flex` box above itself
            (spec: it only applies to block containers) — the truncating
            span below is a flex *item*, which is blockified, so it works. */}
        <span className={cn('min-w-0', wrap ? 'whitespace-normal' : 'truncate')}>
          {children}
        </span>
      </div>
    </td>
  )
);
TableCell.displayName = 'TableCell';

// Shared by TableActions/TableSettings: both are 32px icon-only controls that
// reuse Table's own header-cell background tokens (not ButtonIcon's), sized
// to sit inside a trailing/leading `TableCell`.
const tableIconButtonVariants = cva(
  'inline-flex size-8 shrink-0 items-center justify-center rounded-sm text-[var(--ui-glyph-on-surface-primary)] transition-colors bg-[var(--ui-table-header-cell-color-idle)] hover:bg-[var(--ui-table-header-cell-color-hover)] active:bg-[var(--ui-table-header-cell-color-active)] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--ui-focus-primary)] disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0'
);

export interface TableActionsProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof tableIconButtonVariants> {}

/** Per-row "more actions" control. Provide an `aria-label`; icon defaults to the kebab glyph. */
const TableActions = React.forwardRef<HTMLButtonElement, TableActionsProps>(
  ({ className, children, type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(tableIconButtonVariants(), className)}
      {...props}
    >
      {children ?? <EllipsisIcon size={16} />}
    </button>
  )
);
TableActions.displayName = 'TableActions';

export interface TableSettingsProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof tableIconButtonVariants> {}

/** Header column-settings control. Provide an `aria-label`; icon defaults to the gear glyph. */
const TableSettings = React.forwardRef<HTMLButtonElement, TableSettingsProps>(
  ({ className, children, type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(tableIconButtonVariants(), className)}
      {...props}
    >
      {children ?? <CogIcon size={16} />}
    </button>
  )
);
TableSettings.displayName = 'TableSettings';

export {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableCell,
  TableActions,
  TableSettings,
};
