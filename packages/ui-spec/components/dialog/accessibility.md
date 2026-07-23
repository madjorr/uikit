# Dialog — accessibility

Dialog inherits the Base UI Dialog primitive's modal semantics, focus
management and keyboard handling (via `DialogContent`/`DialogTitle`/
`DialogClose`). The recipe supplies the accessible name and the action controls.

## Roles & semantics

- The popup (`container`) has `role="dialog"` and `aria-modal="true"` when modal.
- **Name.** Every variant renders a `DialogTitle`, wired to the popup via
  `aria-labelledby`, so the dialog always has an accessible name.
- The close button exposes an accessible name ("Close") via an `sr-only` label
  alongside the icon, and is present in every variant.
- The loading overlay's spinner carries `role="status"` with an accessible name
  ("Loading") so the busy state is announced.
- The `rename` variant's text field must be given an accessible name by the
  consumer (the field renders without a visible label in the design).
- The `wide` variant's `footer` override is free-form — the caller is
  responsible for giving each action button an accessible name (e.g. visible
  label text), the same as any other Button usage.

## Keyboard

- **Tab / Shift+Tab** — focus cycles within the dialog only; the focus trap
  prevents reaching background content while modal.
- **Escape** — closes the dialog (fires the change event).
- On open, focus moves into the dialog; on close, focus returns to the opener.

## Screen reader

- Entering the dialog announces its role and name (title).
- While modal, background content is inert, so assistive tech stays within the
  dialog.

## Contrast

- Title and body text use `--ui-text-on-surface-primary`; the idle close icon
  uses `--ui-text-on-surface-secondary`; both meet WCAG AA against the
  `--ui-background-surface-secondary` container and `--ui-background-surface-primary`
  header/footer in light and dark themes. The close button shows a
  `--ui-focus-primary` ring on keyboard focus.
- **Design-pending geometry.** Colors and typography are tokenized, but the
  container/header/footer geometry has no dedicated `--ui-dialog-*`/
  `--ui-footer-*` tier yet (see tokens.yaml) — re-verify layout against the final
  tokens once that tier ships.
