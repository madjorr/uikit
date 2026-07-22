# CardFilter — Behavior

## Rendering

**Given** a CardFilter with `label` and `value`
**When** it renders with the default `variant="static"`
**Then** the label appears above the value, the value uses the static idle color,
and the card is a presentational `<div>` (no interaction states).

**Given** `variant="static-empty"`
**When** it renders
**Then** no icon is shown and the value is a muted em-dash (`–`) regardless of the
`value` prop — the empty-state placeholder.

**Given** an `icon`
**When** the variant is `static` or `clickable`
**Then** the icon (16px) is rendered before the value with an 8px gap. The icon is
ignored for `static-empty`.

## Interaction (clickable only)

**Given** `variant="clickable"`
**When** it renders
**Then** the card is a native `<button>`, the value uses the link color, and the
card exposes hover, active, and focus-visible treatments.

**Given** a clickable CardFilter
**When** the pointer hovers / presses it
**Then** the container fill and border shift to their `*-hover` / `*-active` tokens.

**Given** a clickable CardFilter
**When** it receives keyboard focus
**Then** a 3px `--ui-focus-primary` ring is painted flush to the edge and the
border takes its focused token; the ring is suppressed for pointer focus.

**Given** a clickable CardFilter
**When** it is activated (click, Enter, or Space)
**Then** a `click` event fires.

**Constraint:** `static` and `static-empty` are non-interactive — they have no
state other than idle (mirrors the Figma constraint).

## Selection (clickable only)

**Given** a clickable CardFilter with `selected={false}`
**When** it renders
**Then** `aria-pressed="false"` and no `data-selected` attribute is present; the
card shows its idle/hover/active treatments only.

**Given** a clickable CardFilter with `selected={true}`
**When** it renders
**Then** `aria-pressed="true"` and `data-selected="true"` are set, and the
container fill/border switch to the active tokens even without pointer hover or
press. The `hover:` and `data-[selected=true]:` utilities are equal-specificity
Tailwind selectors; the selected styling wins on hover only because
`data-[selected=true]:*` is declared after `hover:*` in the `clickable` variant
string, not because of any inherent precedence — reordering that string would
flip the result. No story or test currently exercises the selected+hover
combination; treat this as source-order-dependent until one does.

**Constraint:** `aria-pressed` (and `type="button"`) apply only to the default
`<button>` root. When composed via `render` onto a non-button element (e.g.
`render={<a href="/alerts" />}`), they are omitted — that ARIA/HTML pairing
would be invalid on a link or other element. `data-selected` is a pure styling
hook and is still set regardless of the rendered element.

**Given** a clickable CardFilter
**When** the user activates it
**Then** the card only fires `click` — `selected` does not change on its own. The
consumer flips `selected` in its `onClick` handler (the component is controlled
only; there is no internal selected state).

## Composition

**Given** a `render` prop (e.g. `<a href>`)
**When** the CardFilter renders
**Then** it renders as that element with the card's classes and props merged on —
e.g. a clickable filter that navigates as a link.
