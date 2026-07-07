# Table — accessibility

Table renders native table semantics (`<table>`/`<thead>`/`<tbody>`/`<tr>`/
`<th>`/`<td>`/`<caption>`), so assistive tech announces rows, columns, and
headers natively. Use the parts as their elements intend.

## Roles & semantics

- The root is a native `<table>` (role `table`); `<th>` are column headers
  (role `columnheader`), `<td>` are cells (role `cell`).
- Provide a `TableCaption` (or an `aria-label`/`aria-labelledby` on the table)
  so the table has an accessible name.
- For row/column header association in complex tables, set `scope="col"` /
  `scope="row"` on the relevant `<th>` (passes through as a native attribute).

## Sorting

- A `sortable` `TableHead` sets **`aria-sort`** on the `<th>`: `none` when
  unsorted, `ascending` / `descending` when sorted — so screen readers announce
  the current sort.
- The sort affordance is a real **`<button>`**, so it is reachable by Tab and
  activates with **Enter / Space**; it shows a `--ui-focus-primary` focus ring.

## Selection

- Selection is expressed by rendering a `Checkbox` in a leading cell; label it
  (`aria-label`) and use an `aria-label="Select all"` checkbox in the header.
- A selected `TableRow` sets `data-state="selected"` for styling — pair it with
  the checkbox's checked state so the visual and programmatic states agree.

## Row focus

- A `TableRow` isn't itself focusable — a control inside it is (a checkbox,
  `TableActions`, `TableSettings`). The row renders a `--ui-focus-primary`
  focus-**within** ring so the whole row highlights when any of its controls
  has keyboard focus, in addition to that control's own focus ring.

## Row actions and column settings

- `TableActions`/`TableSettings` are icon-only buttons — **always** pass an
  `aria-label` (e.g. `"Row actions"` / `"Column settings"`); there's no
  visible text for assistive tech to fall back on.
- Both show a `--ui-focus-primary` focus-visible ring and are reachable by Tab.

## Cells

- `disabled` on a `TableCell` sets `aria-disabled` and mutes the text color —
  it does not remove the cell from the tab order (a cell isn't focusable to
  begin with; disable the interactive control inside it if there is one).
- `column="iconText"`/`"status"`/`"severity"` icons are decorative next to a
  text value already read by assistive tech — no extra `aria-label` is needed
  on the icon itself.

## Contrast

- Cell text uses `--ui-table-data-value-color-idle`, headers
  `--ui-table-header-label-color`, dividers `--ui-table-global-cell-border-color`;
  row hover/active use `--ui-table-global-row-color-{hover,active}`. These meet
  WCAG AA against the page surface in light and dark themes. Re-verify against
  the final palette once the design is confirmed ready for dev.
