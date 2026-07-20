# PageHeader — accessibility

- The region is a `banner` landmark and the title is an `<h1>` — one page title per
  page; ensure it fits the document outline.
- If a breadcrumb is composed above PageHeader, it's a separate `Breadcrumb` with
  its own `<nav aria-label="breadcrumb">` — not a PageHeader part, so it carries
  its own accessibility contract (see the Breadcrumb spec).
- Don't rely on placement alone for actions — give icon-only action buttons labels.
- The edit affordance next to the title or description is a plain `ButtonIcon`;
  give it a descriptive `aria-label` (e.g. "Edit title", "Edit description") since
  the pencil icon alone has no accessible name.

## Contrast

Title uses `--ui-text-on-surface-primary`; description uses
`--ui-text-on-surface-secondary`. Both meet contrast in light and dark.
