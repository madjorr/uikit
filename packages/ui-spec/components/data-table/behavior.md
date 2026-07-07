# DataTable — behavior

DataTable renders a TanStack react-table over the Table primitives. The grid
state (sorting, filtering, visibility, selection, pagination, expansion, column
sizing) lives in the component; it exposes its TanStack `Table` instance via
`ref` so the companion parts (DataTableToolbar / DataTablePagination /
DataTableColumnHeader / DataTableViewOptions) can bind to that exact instance
instead of a second, disconnected `useReactTable` call.

```gherkin
Scenario: Render rows
  Given columns and data
  Then the headers and a row per datum render
```

```gherkin
Scenario: Empty
  Given an empty data array
  Then a single "No results." row spans all columns
```

```gherkin
Scenario: Sort a column in a single click
  Given a column whose header is a DataTableColumnHeader
  And the column is unsorted (a muted up/down arrow)
  When the user clicks the header once
  Then the rows reorder ascending and the header shows a down arrow in the active blue
  When the user clicks the header again
  Then the rows reorder descending and the header shows an up arrow in the active blue
```

```gherkin
Scenario: Hide a column
  Given the toolbar's view-options menu
  When the user unchecks the column
  Then that column is removed from the grid
```

```gherkin
Scenario: Filter via the toolbar
  Given a DataTableToolbar bound (via ref) to a DataTable with searchKey="email"
  When the user types into the search box
  Then only rows whose email matches remain in the same DataTable
  And a Reset button clears the filter
```

```gherkin
Scenario: Paginate
  Given a DataTablePagination bound (via ref) to a DataTable
  When the user clicks next / prev / first / last
  Then the visible page of rows changes in that same DataTable
  And the rows-per-page select changes the page size
  And the DataTable's onStateChange fires so the pagination display re-renders
```

```gherkin
Scenario: Expand a row
  Given getRowCanExpand returns true and renderExpandedRow is provided
  When a row is toggled expanded
  Then a detail row renders beneath it spanning all columns
```

```gherkin
Scenario: Select rows
  Given a selection column with checkboxes
  When rows are checked
  Then they are tinted and the pagination shows "N of M row(s) selected"
```

## Resizing and sizing

```gherkin
Scenario: Resize a column
  Given enableColumnResizing = true
  When the user drags a column header's resize handle
  Then that column's width tracks the drag in real time (columnResizeMode: 'onChange')
  And the table renders with table-fixed layout at its total column width
```

```gherkin
Scenario: A column declares a width strategy
  Given a ColumnDef with size, or minSize/maxSize, set
  Then that column renders at the fixed size, or is free to flex between the
  min/max bounds — independent of whether enableColumnResizing is set
Given a ColumnDef with none of size/minSize/maxSize set
  Then the column sizes to its content, same as before this feature existed
```
