# CarouselDialog

A modal, paged walkthrough: a `Dialog` wrapping a `Carousel`, with a
`CarouselDialogFooter` (Back/Next/Close + a one-dot-per-slide position
indicator) driving navigation and closing on the last slide. Accepts between
1 and 5 slides.

> **Status: draft.** No single Figma node backs this composite — only its
> footer does (see `CarouselDialogFooter`). The dialog chrome itself stays on
> `Dialog`'s own pre-existing no-Figma-node bypass.

## When to use

- A short, linear, modal walkthrough or onboarding flow the user steps
  through one screen at a time, closing on completion.

## When not to use

- For a single-screen modal with no paging — use `Dialog` directly.
- If slide position needs to be a URL param — CarouselDialog stays routing-
  agnostic; wire it yourself via `setApi` + `opts.startIndex`.
- No autoplay, no looping — this v1 supports neither (not requested; no
  design to size the tradeoff).
- For more than 5 steps — CarouselDialog caps at 5 slides (dev-warns and
  renders only the first 5 beyond that); split a longer flow into multiple
  dialogs or steps instead.

## Slide count

`children` must resolve to between 1 and 5 `<CarouselItem>`s — the footer's
dot indicator renders exactly one dot per slide, so an unbounded count would
grow the indicator without bound. Outside that range CarouselDialog logs a
development-mode console warning; above 5 it also renders only the first 5
children, dropping the rest.

## Parts

| Part                   | Purpose                                                                 |
| ---------------------- | ----------------------------------------------------------------------- |
| `Dialog`               | Modal chrome — overlay, focus trap, scroll lock (unchanged).            |
| `Carousel`             | The slide track; `children` become one `CarouselItem` each.             |
| `CarouselDialogFooter` | Back/Next/Close + the 3-dot position indicator; reads Carousel context. |

`Carousel` itself is **internal** — not exported from the package; only
`CarouselDialog` composes it. `CarouselItem` (and the `CarouselApi` type, for
typing a `setApi` callback) are re-exported for building slides, but the rest
of the `Carousel` family (`Carousel`, `CarouselContent`, `CarouselPrevious`,
`CarouselNext`, `useCarousel`) stays internal — there's no supported
standalone paged-slider export yet.

## Example

```tsx
import { CarouselDialog, CarouselItem } from '@acronis-platform/ui-react';

<CarouselDialog open onOpenChange={setOpen}>
  <CarouselItem>Welcome to the new dashboard.</CarouselItem>
  <CarouselItem>Here's where your alerts live now.</CarouselItem>
  <CarouselItem>You're all set.</CarouselItem>
</CarouselDialog>;
```

Seeding the initial slide (e.g. from a URL param) and observing slide changes
externally:

```tsx
<CarouselDialog
  open
  opts={{ startIndex }}
  setApi={(api) => api?.on('select', () => syncUrl(api.selectedScrollSnap()))}
>
  {/* … */}
</CarouselDialog>
```
