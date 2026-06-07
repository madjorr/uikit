# Switch — Behavior

## Toggling

### Toggles on activation

**Given** an enabled Switch
**When** the user clicks it or presses Space/Enter while focused
**Then** the checked state flips
**And** a `checked-change` event fires with the new boolean value
**And** the thumb slides to the new position.

## Controlled vs uncontrolled

### Uncontrolled

**Given** a Switch with `default-checked` and no `checked`
**When** it renders
**Then** it manages its own state, starting from `default-checked`.

### Controlled

**Given** a Switch with `checked`
**When** the user toggles it
**Then** it emits `checked-change` but does not change visually until the owner
updates `checked`.

## Disabled

**Given** a Switch with `disabled`
**When** the user attempts to toggle it
**Then** the state does not change and no event fires.

## Known gap

The current React implementation renders correctly but is **not yet wired to the
`--ui-switch-*` tokens** (see `tokens.yaml`). It uses the shared semantic bridge
and `opacity-50` for disabled. This spec is the target contract; aligning the
implementation is tracked follow-up.
