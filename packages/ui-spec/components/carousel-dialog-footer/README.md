# CarouselDialogFooter

The footer bar for a `CarouselDialog`: a Back/Next/Close action pair
flanking a fixed three-dot slide-position indicator. Renders inside a
`<Carousel>` and derives its first/middle/last treatment from that Carousel's
own context — it takes no `variant` prop.

> **Status: draft.** Backed by two real Figma nodes (the wrapping bar and its
> inner row), but five geometry/fill values are still TEMP hardcodes pending
> a `tokens-pd` sync, and the bar's own fill has no Figma-bound value at all
> (an open design decision). See `tokens.yaml`.

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
