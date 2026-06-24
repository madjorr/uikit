---
'@acronis-platform/design-tokens': minor
'@acronis-platform/tokens-pd': minor
---

Align the `palette.electricblue` ramp with the naming convention used by every other
palette ramp (`palette.blue.0…14`, `palette.green.0…14`, …): the stops
`palette.electricblue.blue-0…blue-14` — including `blue-7-primary` and `blue-13-brand`
— are now `palette.electricblue.0…14` (the `blue-` prefix and the `-primary`/`-brand`
labels are dropped).

This is not a breaking change: palette tokens are not consumed directly, and every
semantic- and component-tier token that referenced the old electricblue stops is
repointed to the new names in this same PR. Token values are unchanged.
