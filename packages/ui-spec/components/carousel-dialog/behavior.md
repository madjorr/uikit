# CarouselDialog — behavior

CarouselDialog composes a `Dialog` around a `Carousel`, rendering a
`CarouselDialogFooter` inside the `Carousel` so it can drive navigation from
context.

## Navigation

```gherkin
Scenario: Advancing through slides
  Given a CarouselDialog open on its first slide
  When the user activates the footer's Next control
  Then the Carousel scrolls to the following slide
  And the footer re-derives its first/middle/last state from the new position
```

```gherkin
Scenario: Closing on the last slide
  Given a CarouselDialog open on its last slide
  When the user activates the footer's Close control
  Then the dialog closes (onOpenChange(false, …) fires in uncontrolled mode)
```

## Step-position-in-URL (opt-in, not baked in)

```gherkin
Scenario: Seeding the initial slide externally
  Given a consumer reads a step index from their own router/URL
  When they pass it as `opts={{ startIndex }}`
  Then CarouselDialog opens on that slide
```

```gherkin
Scenario: Observing slide changes externally
  Given a consumer passes a `setApi` callback
  When the Embla API initializes
  Then they receive it once, and can subscribe to its `select` event to sync
       their own URL/router on every slide change
```

CarouselDialog bakes in no routing itself — a consumer wires `setApi` +
`opts.startIndex` into their own router.

## Composition

```gherkin
Scenario: Children are the slides
  Given a CarouselDialog with N `<CarouselItem>` children, 1 <= N <= 5
  Then each becomes one slide, wrapped in the Carousel's content track
  And the footer's dot indicator renders exactly N dots
```

```gherkin
Scenario: Too many slides
  Given a CarouselDialog with more than 5 `<CarouselItem>` children
  Then only the first 5 reach the Carousel (and the footer's dot indicator)
  And a development-mode console warning is logged
```

```gherkin
Scenario: Too few slides
  Given a CarouselDialog with fewer than 1 `<CarouselItem>` child
  Then a development-mode console warning is logged
  And nothing is clamped (there is nothing to add)
```

```gherkin
Scenario: Dialog props pass through
  Given a CarouselDialog with `open`/`onOpenChange`/`defaultOpen`/`modal`
  Then it behaves exactly as the equivalent `<Dialog>` root props would
```
