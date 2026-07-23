---
'@acronis-platform/ui-react': patch
---

Rewire `DialogDefault` and `DialogWelcome` (and the shared `Dialog` container / close button) from hardcoded/bridged geometry to the `--ui-dialog-*` and `--ui-footer-*` token tier that `tokens-pd` now ships, reconciled against the current Figma nodes (6343:58898, 6353:6164). The popup container's background, corner radius, minimum width, and `size="sm"` max-width now resolve to `--ui-dialog-container-*`; `DialogDefault`'s header/footer bars resolve to `--ui-dialog-header-*` / `--ui-footer-*`. The shared close button's icon color now comes from `--ui-button-icon-global-icon-color-*` (a constant blue across idle/hover/active in the default brand) instead of the muted-foreground text color, matching the Figma ButtonIcon instance. No visual change in the default brand except the close-icon color; other brands can now diverge these values independently. The `DialogWelcome` footer carousel remains out of scope (tracked separately in #574).
