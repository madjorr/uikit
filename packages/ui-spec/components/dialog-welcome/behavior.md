# DialogWelcome — behavior

DialogWelcome is a recipe over the Dialog primitive: it owns the same `open`
state and modal focus/scroll management, and renders an illustration slot above
a centered title and description.

> The footer carousel (step-dot indicator + Back/Next navigation) is
> intentionally **out of scope**. It is a separate Carousel /
> CarouselDialogFooter component set, composed alongside DialogWelcome when a
> stepped walkthrough footer is needed. DialogWelcome renders no footer.

## Body

```gherkin
Scenario: The image slot renders above the text
  Given a DialogWelcome with an image, title and description
  When it opens
  Then the image is shown at the top of the body
  And the title and description are centered below it
```

```gherkin
Scenario: No image
  Given a DialogWelcome without an image
  When it opens
  Then the media slot is empty and the title + description still render
```

```gherkin
Scenario: Children override the text block
  Given a DialogWelcome with children provided
  When it opens
  Then the body renders the children instead of the title + description
  And the image slot is unchanged
```

## Opening & closing

```gherkin
Scenario: Dismissing with the keyboard
  Given an open modal DialogWelcome
  When the user presses Escape
  Then the dialog closes and open-change(false) fires
```

```gherkin
Scenario: Controlled
  Given a DialogWelcome with a fixed open prop
  When the user attempts to dismiss it
  Then internal state does NOT change on its own
  And open-change fires so the consumer can update the open prop
```
