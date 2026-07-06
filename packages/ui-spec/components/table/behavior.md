# Table — Behavior Scenarios

## Structure

### Renders a table with header and body sections

**Given** a Table wrapping a TableHeader and TableBody
**When** the component renders
**Then** the root is a `<table>` inside a scrollable container
**And** the header renders as `<thead>`, the body as `<tbody>`

### Row is a plain function of its props

**Given** a TableRow with no `selected` prop
**When** it renders
**Then** it uses the idle row background token
**And** it switches to the hover token on pointer hover (a CSS pseudo-state,
no re-render)

---

## Sorting

### Renders a plain header cell when not sortable

**Given** a TableHeaderCell with no `sortDirection`/`onSort`
**When** it renders
**Then** its content renders as plain text, not a button
**And** no sort icon appears

### Renders an interactive header cell when sortable

**Given** a TableHeaderCell with `sortDirection={false}` and an `onSort` handler
**When** it renders
**Then** its content renders inside a `<button>`
**And** the inactive (unsorted) sort icon appears

### Cycles the sort icon with sortDirection

**Given** a sortable TableHeaderCell
**When** `sortDirection` is `'asc'`
**Then** the ascending sort icon renders in the active color
**When** `sortDirection` is `'desc'`
**Then** the descending sort icon renders in the active color

### Calls onSort when clicked

**Given** a sortable TableHeaderCell
**When** the header button is clicked
**Then** `onSort` is called with the click event
**And** the component itself does not track sort state — the consumer (or
`DataTable`) owns it

---

## Row Selection

### Selected row uses the active row token

**Given** a TableRow with `selected`
**When** it renders
**Then** `aria-selected="true"` is set
**And** the row background switches to the active token, overriding hover

### Selection is composed, not built in

**Given** a design that needs a selection checkbox column
**When** authoring the table
**Then** a `Checkbox` is placed inside a `TableCell`/`TableHeaderCell` like
any other cell content — there is no dedicated `TableCheckbox` component,
since the Figma "TableCheckbox" node adds no styling beyond the cell's own
padding

---

## Cell Content

### Disabled cell value

**Given** a TableCell with `disabled`
**When** it renders
**Then** `aria-disabled="true"` is set
**And** the value text switches to the disabled color token

### Content-type cells are composition, not variants

**Given** a design calling for an icon+text, status, severity, date, or tag
cell
**When** authoring the table
**Then** the consumer composes the desired content (icon components, `Tag`,
plain text) as children of `TableCell` — there is no `column`/`type` prop
selecting a built-in layout

---

## Row Actions / Column Settings

### Default icons, overridable via children

**Given** a `TableActions` or `TableSettings` with no children
**When** it renders
**Then** the kebab (`TableActions`) or gear (`TableSettings`) icon renders
**When** children are provided
**Then** they replace the default icon entirely

---

## DataTable (TanStack Table composition)

### Renders headers and rows from columns/data

**Given** a `DataTable` with `columns` and `data`
**When** it renders
**Then** one `TableHeaderCell` renders per column, one `TableRow` per data item
**And** a "No results." row renders when `data` is empty

### Sorting is wired automatically per column

**Given** a `DataTable` column with `enableSorting` not set to `false`
**When** its header is clicked
**Then** the column's `TableHeaderCell` toggles through
`inactive → ascending → descending → inactive`
**And** the rendered rows re-sort accordingly

### Row expansion

**Given** `getRowCanExpand` and `renderExpandedRow` props
**When** a row's expand control (defined in a column's `cell`) is activated
**Then** an additional `TableRow` renders directly below it, containing the
expanded content in a single full-width `TableCell`

### Exposes the underlying table instance

**Given** a `ref` passed to `DataTable`
**When** the component mounts or its data changes
**Then** the ref holds the live TanStack Table instance, so a consumer can
build pagination/toolbar controls against the exact same table the rows are
rendered from
