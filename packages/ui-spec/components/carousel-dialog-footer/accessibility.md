# CarouselDialogFooter — Accessibility Requirements

## ARIA Roles and Attributes

### Back / Next / Close (`back` / `next` / `close` parts)

- Each is a native `<button>` (via `Button`) with a plain visible label
  ("Back" / "Next" / "Close") that also serves as its accessible name — no
  separate label prop is required.
- `close` composes `Button` with `DialogClose` via Base UI's `render` prop,
  so it inherits `DialogClose`'s own dialog-closing behavior and any ARIA it
  contributes.

### Slide position indicator (`dots` part)

| Attribute      | Value                   | Reason                                                |
| -------------- | ----------------------- | ----------------------------------------------------- |
| `role`         | `"list"` (container)    | Groups the 3 position slots                           |
| `aria-label`   | `"Slide position"`      | Names the group for screen readers                    |
| `role`         | `"listitem"` (each dot) | Identifies each slot as a list member                 |
| `aria-current` | `"true"` (active slot)  | Marks which of the 3 slots reflects the current slide |

The dot glyph itself is `aria-hidden` — it is decorative; the position
information is carried by `aria-current` on its container, not by the glyph.

---

## Keyboard Navigation

| Key         | Element             | Action                           |
| ----------- | ------------------- | -------------------------------- |
| Tab         | Back / Next / Close | Moves focus between the controls |
| Enter/Space | Back / Next / Close | Activates the focused control    |

The dots are not focusable or interactive — they are a status indicator, not
a set of navigation controls (there is no design for clicking a dot to jump
to that slide).

---

## Screen Reader Requirements

1. Back/Next/Close announce their own visible label as their accessible name.
2. The position indicator announces as a list of 3 items, with the current
   one marked via `aria-current`.
3. Closing the dialog is a normal Base UI dialog-close interaction — the
   receiving Dialog owns any close announcement.

---

## Color and Contrast

Back/Next/Close inherit `Button`'s own contrast guarantees (its spec owns the
full state-token set). The dots' active-container vs. idle-container
distinction is a fill-only signal — see `tokens.yaml` for the two tokens
involved; both are drawn from the already-audited `ButtonIcon` tier.

---

## Testing Checklist

- [ ] First state: no Back button; Next button present; dot 1 marked current
- [ ] Middle state: Back and Next both present; dot 2 marked current
- [ ] Last state: Back and Close present, no Next; dot 3 marked current
- [ ] Exactly 3 `listitem` dots are rendered regardless of slide count
- [ ] Activating Close (last state) closes the ambient Dialog
- [ ] All rendered controls are reachable via Tab and activatable via Enter/Space
