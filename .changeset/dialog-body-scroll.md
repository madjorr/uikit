---
'@acronis-platform/ui-react': patch
---

Fix `Dialog`'s body to scroll instead of silently clipping content: the popup
already grew with its content up to the Figma-defined viewport margin, but
the body lacked `flex-1`/`min-w-0`, so once clamped, overflowing content was
cut off by the popup's `overflow-hidden` instead of scrolling. The body now
scrolls both vertically (tall content) and horizontally (wide, non-wrapping
content against the fixed popup width) while the header and footer stay
pinned.
