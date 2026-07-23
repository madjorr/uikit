# CarouselDialogFooter

The footer bar for a `CarouselDialog`: a Back/Next/Close action pair
flanking a fixed three-dot slide-position indicator. Renders inside a
`<Carousel>` and derives its first/middle/last treatment from that Carousel's
own context — it takes no `variant` prop.

> Backed by two real Figma nodes (the wrapping bar and its inner row) — see
> `tokens.yaml` for the full token set, including the footer bar's own
> geometry/fill.

## When to use

- As the footer of a `CarouselDialog` — it is normally not used standalone.

## When not to use

- For a plain (non-dialog) `Carousel`'s navigation — use `CarouselPrevious`/
  `CarouselNext` instead; this footer's Close action assumes a Dialog
  ancestor.
- If the design calls for a step count or clickable position dots — this
  v1 always renders exactly 3 fixed, non-interactive slots.

## Parts

| Part    | Element (default)                   | Purpose                                                                     |
| ------- | ----------------------------------- | --------------------------------------------------------------------------- |
| `back`  | `button` (`Button`)                 | Scrolls to the earlier slide. Hidden on the first slide.                    |
| `dots`  | `div`                               | 3-slot slide-position indicator; the active slot's container fills.         |
| `next`  | `button` (`Button`)                 | Scrolls to the later slide. Hidden on the last slide.                       |
| `close` | `button` (`Button` + `DialogClose`) | Closes the ambient Dialog. Shown only on the last slide, in `next`'s place. |

## Example

```tsx
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselDialogFooter,
} from '@acronis-platform/ui-react';

<Carousel opts={{ startIndex: 0 }}>
  <CarouselContent>
    <CarouselItem>Slide 1</CarouselItem>
    <CarouselItem>Slide 2</CarouselItem>
    <CarouselItem>Slide 3</CarouselItem>
  </CarouselContent>
  <CarouselDialogFooter />
</Carousel>;
```

Normally you won't reach for this directly — use `CarouselDialog`, which
composes a `Dialog` + `Carousel` + `CarouselDialogFooter` for you.

## Localization

The repo has no i18n library, so this component's own visible/accessible
text is overridable via props rather than baked in: `backLabel`/`nextLabel`/
`closeLabel` (default "Back"/"Next"/"Close") and `positionLabel` (the `dots`
list's `aria-label`, default "Slide position"). See `api.yaml`.

```tsx
<CarouselDialogFooter
  backLabel="Précédent"
  nextLabel="Suivant"
  closeLabel="Fermer"
  positionLabel="Position de la diapositive"
/>
```
