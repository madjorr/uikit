# Table — behavior

Table is a composable, presentational data grid. It holds no sorting or
selection _logic_ — the consumer owns that and drives the relevant props. The
scenarios below describe the affordances the parts provide.

## Sorting

```gherkin
Scenario: A sortable header exposes its state
  Given a TableHead with sortable = true and sort-direction = false
  Then it renders an inactive sort icon and aria-sort = "none"
```

```gherkin
Scenario: Activating a sortable header
  Given a sortable TableHead with an onSort handler
  When the user clicks it (or focuses it and presses Enter / Space)
  Then the sort event fires
  And the consumer updates sort-direction, which swaps the icon (↓ asc / ↑ desc)
  and sets aria-sort to "ascending" / "descending"
```

## Selection

```gherkin
Scenario: A selected row
  Given a TableRow with selected = true
  Then it carries data-state="selected" and the active row background token
```

```gherkin
Scenario: Row selection is consumer-driven
  Given a checkbox rendered inside a leading cell
  When the user toggles it
  Then the consumer updates the row's selected prop (Table does not manage it)
```

```gherkin
Scenario: A row shows keyboard focus
  Given a TableRow containing a focusable control (a checkbox, TableActions, ...)
  When the user tabs into that control
  Then the row renders a 3px focus-within ring, independent of hover/selected
```

## Resizing and sizing

```gherkin
Scenario: A column header renders a resize handle
  Given a TableHead with a resize-handle node
  Then it renders at the header cell's trailing edge
  And Table itself does not implement the drag interaction — the consumer
  (typically DataTable) wires pointer/touch events to it
```

```gherkin
Scenario: A cell or header receives an explicit width via style
  Given a TableHead/TableCell with a `style` prop setting width/minWidth/maxWidth
  Then the column renders at that size, since style passes through to the
  native <th>/<td> (Table has no width prop of its own)
```

## Content-type cells

```gherkin
Scenario: A cell renders a content-type composition
  Given a TableCell with column="iconText" | "status" | "severity" and an icon
  Then it renders the icon followed by the text value, gapped by --ui-table-data-gap
Given a TableCell with column="tag"
  Then its content is wrapped in a Tag
Given a TableCell with column="text" | "date" (or column omitted)
  Then it renders plain, truncated text
```

```gherkin
Scenario: A disabled cell
  Given a TableCell with disabled = true
  Then its text uses --ui-table-data-value-color-disabled and aria-disabled is set
```

## Row actions and column settings

```gherkin
Scenario: Trigger buttons are icon-only
  Given a TableActions or TableSettings button
  Then it renders a default icon (ellipsis / gear) unless children override it
  And it requires an aria-label, since it carries no visible text
```

## Layout

```gherkin
Scenario: Overflow scrolls horizontally
  Given a table wider than its container
  When it renders
  Then the wrapping container scrolls horizontally, keeping the page intact
```

```gherkin
Scenario: Hover feedback
  Given a row in the body
  When the pointer is over it
  Then it takes the hover background token (unless selected, which wins)
```
