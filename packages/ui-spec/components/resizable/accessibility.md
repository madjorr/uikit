# Resizable — accessibility

## Roles

- The **handle** is a `separator` (`role="separator"`) — a focusable, operable
  window splitter, not a decorative one. It carries `aria-orientation`
  (`vertical` for a horizontal group's vertical divider, `horizontal` for a
  vertical group's horizontal divider).
- The **panel group** is a generic `group` container; **panels** are generic
  regions. Give a panel a meaningful label (`aria-label` / `aria-labelledby`) when
  its content isn't self-describing.

## Keyboard

| Key                    | Action                                                        |
| ---------------------- | ------------------------------------------------------------- |
| `Tab` / `Shift+Tab`    | Move focus to / from the handle.                              |
| `Arrow` along the axis | Resize the adjacent panels by a step (Left/Right or Up/Down). |
| `Home` / `End`         | Resize to the handle's minimum / maximum extent.              |
| `Enter`                | Toggle a collapsible panel between collapsed and expanded.    |

The handle is reachable and fully operable by keyboard — resizing never requires a
pointer.

## Focus

- The handle shows a visible focus ring on `:focus-visible` (3px
  `--ui-focus-primary`), distinct from hover, so keyboard users can see which
  handle is active.
- Focus order follows the DOM: panel content, then the handle, then the next
  panel.

## Screen readers

- As a `separator` with `aria-orientation`, the handle is announced as a
  resizable splitter. `aria-valuenow` / `aria-valuemin` / `aria-valuemax` are
  managed by the underlying panel library to convey the current split.
- The handle has no decorative children — its visual affordance is the cursor
  change and the border color shift on hover/active.

## Contrast

- The divider line uses `--ui-border-on-surface-border` (idle) and
  `--ui-resizable-border-color-hover` / `-active`, which resolve per brand/theme;
  they must keep a visible contrast against the adjacent panel surfaces in both
  light and dark schemes.
