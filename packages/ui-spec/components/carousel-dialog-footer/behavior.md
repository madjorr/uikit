# CarouselDialogFooter — behavior

CarouselDialogFooter renders inside a `<Carousel>` and reads
`canScrollPrev`/`canScrollNext`/`scrollPrev`/`scrollNext` from its context via
`useCarousel()`. It has no `variant`/`state` prop — the row always reflects
the Carousel's real position.

## State derivation

```gherkin
Scenario: First slide
  Given a CarouselDialogFooter inside a Carousel on its first slide
  Then no Back control is rendered
  And the first of the 3 dots is active
  And a Next control is rendered, calling scrollNext() on activation
```

```gherkin
Scenario: A middle slide
  Given a CarouselDialogFooter inside a Carousel on a slide that is neither
        first nor last
  Then a Back control is rendered, calling scrollPrev() on activation
  And the second of the 3 dots is active
  And a Next control is rendered, calling scrollNext() on activation
```

```gherkin
Scenario: Last slide
  Given a CarouselDialogFooter inside a Carousel on its last slide
  Then a Back control is rendered, calling scrollPrev() on activation
  And the third of the 3 dots is active
  And no Next control is rendered
  And a Close control is rendered in its place
```

```gherkin
Scenario: The indicator never grows or shrinks with slide count
  Given a Carousel with any number of slides (not just 3)
  Then CarouselDialogFooter always renders exactly 3 dot slots
```

## Closing

```gherkin
Scenario: Close actually closes the dialog
  Given a CarouselDialogFooter on its last slide, rendered within a Dialog
  When the user activates the Close control
  Then the ambient Dialog closes (Base UI composition via DialogClose's
       `render` prop — not a manual onClick handler)
```

## Composition

```gherkin
Scenario: Requires a Carousel ancestor
  Given a CarouselDialogFooter rendered without a wrapping Carousel
  Then it throws "useCarousel must be used within a <Carousel />" (inherited
       from Carousel's own useCarousel() guard)
```
