---
'@acronis-platform/ui-react': minor
---

Add `CarouselDialog` and `CarouselDialogFooter` — a modal, paged walkthrough composing `Dialog` + `Carousel`, with a Back/Next/Close footer (plus a fixed 3-dot slide-position indicator, kept dead-center via Figma's own symmetric two-spacer layout) that derives its first/middle/last treatment from the ambient Carousel context and closes on the last slide via `DialogClose`. `CarouselDialogFooter` is backed by two real Figma nodes (fileKey `lrU3ydIyvPYQNE6ixdsKtJ`, nodes `6353:4858`/`6353:5864`) with a complete Code Connect mapping; `CarouselDialog` itself has no matching node yet. The footer's geometry and fill are themed via the `Footer` and `Carousel` `tokens-pd` tiers (`--ui-footer-global-gap`/`-height`/`-padding-x`, `--ui-footer-carousel-color`, `--ui-carousel-dialog-list-indicator-gap`). Step-position-in-URL sync is intentionally not baked in; `setApi`/`opts.startIndex` are exposed for a consumer to wire their own router.

`Carousel` (the standalone slider — root, content, previous/next arrows, `useCarousel`) is **not** part of the public API: it's a design-pending v1 only meant to back `CarouselDialog` internally, kept under Storybook's `Internal/` group for reference. `CarouselItem` and the `CarouselApi` type stay exported since building `CarouselDialog` slides requires them.

`CarouselDialogFooter`'s visible/accessible text (Back/Next/Close labels, the position indicator's `aria-label`) is overridable via `backLabel`/`nextLabel`/`closeLabel`/`positionLabel` props (defaulting to the original English copy) rather than hardcoded, since there's no i18n library in this repo. `CarouselDialog` forwards the same four props to its inner footer.
