---
'@acronis-platform/ui-react': minor
---

Add `Carousel` — a composable, Embla-driven slider (`CarouselContent`/`CarouselItem`/`CarouselPrevious`/`CarouselNext`) supporting horizontal/vertical orientation, looping, and keyboard navigation. Initial version ported from `@acronis-platform/shadcn-uikit`'s `Carousel`; no `--ui-carousel-*` token tier exists yet, so the track/item carry no color of their own and the nav controls reuse the already-tokenized `ButtonIcon`. Design reconciliation against Figma is pending.

`Carousel` itself is **not** part of the public API: it's a design-pending v1 only meant to back `CarouselDialog` internally, kept under Storybook's `Internal/` group for reference. `CarouselItem` and the `CarouselApi` type stay exported since building `CarouselDialog` slides requires them.
