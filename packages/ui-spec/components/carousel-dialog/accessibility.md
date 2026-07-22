# CarouselDialog — Accessibility Requirements

CarouselDialog inherits Dialog's accessibility contract unchanged (focus
trap, scroll lock, `role="dialog"`, Esc-to-close) — see Dialog's own
`accessibility.md` for that baseline. This file covers only what
CarouselDialog adds: the Carousel and its footer.

## ARIA Roles and Attributes

### Content (slide track)

Same as Carousel's own spec: the track is `role="region"` /
`aria-roledescription="carousel"`, each slide is `role="group"` /
`aria-roledescription="slide"`.

### Footer

See `CarouselDialogFooter`'s own `accessibility.md` — its Back/Next/Close
controls and the 3-item position list.

---

## Keyboard Navigation

| Key         | Element                  | Action                                     |
| ----------- | ------------------------ | ------------------------------------------ |
| Esc         | Anywhere in the dialog   | Closes the dialog (Dialog's own behavior)  |
| Tab         | Footer controls          | Moves focus between Back/Next/Close        |
| Enter/Space | Footer controls          | Activates the focused control              |
| ArrowLeft   | Anywhere in the Carousel | Scrolls to the previous slide (horizontal) |
| ArrowRight  | Anywhere in the Carousel | Scrolls to the next slide (horizontal)     |

---

## Screen Reader Requirements

1. The dialog announces as a modal dialog (Dialog's own behavior).
2. The slide track announces its role description ("carousel"); each slide
   announces as a group with the role description "slide".
3. The footer's Back/Next/Close controls and position indicator announce as
   described in `CarouselDialogFooter`'s own accessibility spec.
4. CarouselDialog adds no live-region announcement of the current slide
   index beyond what the footer's `aria-current` position indicator already
   provides.

---

## Testing Checklist

- [ ] Opening focuses inside the popup and traps focus (Dialog's own behavior)
- [ ] Esc closes the dialog from anywhere inside it
- [ ] ArrowLeft/ArrowRight scroll the Carousel when focus is inside it
- [ ] The footer's Close control (last slide) closes the dialog
- [ ] Every rendered control is reachable via Tab and activatable via Enter/Space
