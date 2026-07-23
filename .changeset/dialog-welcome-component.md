---
'@acronis-platform/ui-react': minor
---

Add `DialogWelcome`: a welcome / onboarding dialog recipe built on the Dialog
primitive. It renders an illustration slot above a centered title and
description, with a `children` override for the text block. Colors and typography
resolve to shipped semantic tokens; container geometry is applied as Tailwind
utilities until a dedicated token tier ships. The footer carousel (step-dot
indicator + Back/Next navigation) is out of scope — it is a separate
Carousel / CarouselDialogFooter component set.
