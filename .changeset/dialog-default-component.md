---
'@acronis-platform/ui-react': minor
---

Add `DialogDefault`: a higher-level dialog "recipe" built on the Dialog
primitive parts. A single `variant` prop selects one of seven canned use-cases
(`default`, `rename`, `save changes`, `reset password`, `discard changes`,
`accept`, `read-only`) — each with its own title, body copy and footer buttons;
`children` overrides the body slot and `hasLoading` shows a spinner overlay
across the body + footer. Colors and typography resolve to shipped semantic
tokens; container/header/footer geometry is applied as Tailwind utilities
pending a dedicated `--ui-dialog-*`/`--ui-footer-*` token tier.
