# DialogWelcome — accessibility

DialogWelcome inherits the Base UI Dialog primitive's modal semantics, focus
management and keyboard handling (via `DialogContent` / `DialogTitle` /
`DialogDescription`). The recipe supplies the accessible name and description.

> The footer carousel (step-dot indicator + Back/Next navigation) is out of
> scope — see the separate Carousel / CarouselDialogFooter component set.

## Roles & semantics

- The popup (`container`) has `role="dialog"` and `aria-modal="true"` when modal.
- **Name.** The `title` renders a `DialogTitle`, wired to the popup via
  `aria-labelledby`, so the dialog has an accessible name. The `description`
  renders a `DialogDescription`, wired via `aria-describedby`.
  - When the body is overridden via the default content slot, the default title
    is not rendered — the consumer must then supply their own accessible name.
- Provide an `alt` on any `image` you pass, or an empty `alt=""` when the image
  is decorative.

## Keyboard

- **Tab / Shift+Tab** — focus cycles within the dialog only; the focus trap
  prevents reaching background content while modal.
- **Escape** — closes the dialog (fires the change event).
- On open, focus moves into the dialog; on close, focus returns to the opener.

## Screen reader

- Entering the dialog announces its role, name (title) and description.
- While modal, background content is inert, so assistive tech stays within the
  dialog.

## Contrast

- Title and description use `--ui-text-on-surface-primary`; both meet WCAG AA
  against the `--ui-background-surface-secondary` container in light and dark
  themes.
- **Design-pending geometry.** Colors and typography are tokenized, but the
  container geometry has no dedicated `--ui-dialog-*` tier yet (see tokens.yaml)
  — re-verify layout against the final tokens once that tier ships.
