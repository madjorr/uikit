---
'@acronis-platform/ui-react': patch
---

Fix `DialogWelcome` to scroll instead of silently clipping content, the same
class of bug as `Dialog`'s body (see the sibling changeset): the carousel
viewport and the `single` variant's body lacked `flex-1`/`min-h-0`, so a slide
taller than the available height was cut off by the popup's `overflow-hidden`.
Also fixes `CarouselDialog`'s dot indicator, which had no bound — with enough
slides it overflowed the footer and squeezed the Back/Next buttons to zero
width, hiding them entirely. The dots now scroll horizontally on their own
instead, and the Back/Next buttons stay fully visible.
