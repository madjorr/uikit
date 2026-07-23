---
'@acronis-platform/ui-react': minor
---

Theme `Popover`'s container from the new `--ui-popover-container-*` tokens (color, border, radius, min/max width) per Figma node 6364:17907, and add optional `PopoverBody`/`PopoverFooter` parts for the body-rhythm (`--ui-popover-body-*`) and default action-row footer (`--ui-footer-*`) recipe shown in that node.

`PopoverContent` no longer hardcodes `w-72`, `p-4`, or `shadow-md` — width now comes from the token-driven min/max width above, and the flat container no longer renders a shadow. Consumers relying on the old fixed width/padding/shadow should wrap their content in the new `PopoverBody` (and `PopoverFooter` for an action row) to restore the equivalent spacing.
