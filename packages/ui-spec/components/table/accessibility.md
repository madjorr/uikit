# Table — Accessibility Requirements

Implements the native HTML table semantics (`<table>`/`<thead>`/`<tbody>`/
`<tr>`/`<th>`/`<td>`) rather than the ARIA `grid` pattern — this is a static
data table, not a spreadsheet-style keyboard-navigable grid.

## ARIA Roles and Attributes

### Root (`table`)

| Element   | Role (implicit) | Reason                                  |
| --------- | --------------- | --------------------------------------- |
| `<table>` | `table`         | Exposes the structure to assistive tech |

### Row (`row` part)

| Attribute       | Value            | Reason                           |
| --------------- | ---------------- | -------------------------------- |
| `aria-selected` | `"true"` / unset | Set only when `selected` is true |

### Header cell (`header-cell` part)

- Non-sortable: renders as plain `<th>` content — no extra attributes.
- Sortable: renders a `<button>` inside the `<th>`. The button has no
  `aria-sort` of its own; if a data-grid needs `aria-sort` on the `<th>`, the
  consumer sets it via `className`/`props` passthrough based on the same
  `sortDirection` value passed to `TableHeaderCell`.

### Data cell (`data-cell` part)

| Attribute       | Value    | Reason                           |
| --------------- | -------- | -------------------------------- |
| `aria-disabled` | `"true"` | Set only when `disabled` is true |

### Row actions / column settings

Both are plain icon-only `<button>`s. **The consumer must supply an
`aria-label`** (e.g. "Row actions", "Column settings") — there is no visible
text label, so an accessible name is required for the control to be announced.

---

## Keyboard Navigation

| Key           | Element                                                                           | Action                              |
| ------------- | --------------------------------------------------------------------------------- | ----------------------------------- |
| Tab           | Sortable header cell / row-actions / column-settings / any focusable cell content | Moves focus to the next control     |
| Shift+Tab     | (same)                                                                            | Moves focus to the previous control |
| Enter / Space | Sortable header cell button                                                       | Toggles sort                        |
| Enter / Space | Row-actions / column-settings                                                     | Activates the control               |

Non-interactive cells (plain text, a disabled value) are not in the tab
order. A row itself is never a tab stop — only the interactive controls inside
it are.

---

## Screen Reader Requirements

1. The table's row/column structure is announced natively via
   `<table>`/`<tr>`/`<th>`/`<td>` — no extra ARIA is needed for structure.
2. A sortable header cell's button announces its label text; its sort state
   is visual only in this primitive (see the `aria-sort` note above for
   data-grids that need it announced).
3. Row-actions/column-settings announce via their required `aria-label`.
4. A selected row is not automatically announced as "selected" by all screen
   readers from `aria-selected` alone on a `<tr>` outside a `grid`/`treegrid`
   — data-grids that need this announced should pair it with a visible or
   `sr-only` cue.

---

## Color and Contrast

| Element                                   | Minimum Ratio | Standard        |
| ----------------------------------------- | ------------- | --------------- |
| Header label text vs background           | 4.5:1         | WCAG 1.4.3 (AA) |
| Data value text vs background             | 4.5:1         | WCAG 1.4.3 (AA) |
| Sort icon (active/inactive) vs background | 3:1           | WCAG 1.4.11     |
| Row-actions/column-settings icon          | 3:1           | WCAG 1.4.11     |
| Focus indicator                           | 3:1           | WCAG 1.4.11     |

Selected rows are distinguished by more than color alone via `aria-selected`
for assistive tech, in addition to the background-color change.

---

## Testing Checklist

- [ ] `<table>`/`<thead>`/`<tbody>`/`<tr>`/`<th>`/`<td>` structure, no `role` overrides needed
- [ ] Sortable header cells are real `<button>`s, reachable via Tab, toggle on Enter/Space
- [ ] Non-sortable header cells render no button
- [ ] Selected rows carry `aria-selected="true"`
- [ ] Disabled cells carry `aria-disabled="true"`
- [ ] `TableActions`/`TableSettings` always ship with a consumer-provided `aria-label`
- [ ] Text and icon colors meet the contrast ratios above; focus ring meets 3:1
