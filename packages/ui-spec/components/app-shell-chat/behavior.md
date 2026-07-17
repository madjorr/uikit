# AppShellChat — Behavior Scenarios

## Structure

### Renders three logical sections

**Given** an AppShellChat wrapping a sidebar rail, a Content column, and a Chat panel
**When** the component renders
**Then** the sections lay out left→right as sidebar → Content → Chat
**And** in `dir="rtl"` they mirror to right→left via CSS logical properties (no JS branch)
**And** Content is `flex-1 min-w-0` while Chat has an explicit pixel width

---

## Sizing independence

### Sidebar interactions never resize Chat

**Given** a Chat panel with a fixed/overridden width
**When** either sidebar expands, collapses, or is resized
**Then** only Content's width changes (it absorbs the delta)
**And** Chat's width is unchanged

> This falls out of the layout: Content is the only flex-growing item, and Chat's
> width is an explicit pixel value (never a percentage), so the sidebars — flex
> siblings outside any resizable group — cannot alter it.

---

## Content ↔ Chat resize

### Drag resizes Chat against Content, down to the min width

**Given** a Chat panel
**When** the user drags the resize edge on Chat's start border toward the row's end
**Then** Chat's width tracks the pointer, down to a floor of 48px
**And** Content reflows to fill the remaining width
**And** the Content/Chat seam recolors on hover / drag / focus
**And** there is no collapse threshold or toggle — the drag simply stops at the floor

### Drag resizes Chat up to full width

**Given** a Chat panel and its sibling Content column
**When** the user drags the resize edge toward the row's start
**Then** Chat's width grows and Content shrinks, down to 0 width if dragged far enough
**And** the resize ceiling is the row's actual available width at drag start (row
width minus the sidebar rail), not a fixed constant — so Chat can reach full
width whenever the row has the room (e.g. both sidebars collapsed), and is
otherwise bounded by whatever space is actually free

### Double-click and keyboard

**Given** the resize edge
**When** the user double-clicks it
**Then** the width resets to the current LIVE breakpoint-driven default
(512px at 1680px+; see **Responsive layout** below) — NOT a fixed 512px
regardless of viewport
**And** ArrowLeft/ArrowRight resize by 16px (inverted in RTL), clamped to
[48px, the same dynamically-measured ceiling used by drag]
**And** Home resets the width the same way double-click does

---

## Icon-only rail at the min width

### Header and body adapt at 48px

**Given** the Chat panel's width is at its 48px floor
**When** it renders
**Then** the panel has `data-state="collapsed"`
**And** the header shows only the Acronis mark, sized to match the header's
height at any other width; the full label appears on hover
**And** the chat body is hidden (`hidden`)
**And** any header `actions` are hidden

**Given** the Chat panel's width is above the 48px floor
**When** it renders
**Then** the panel has `data-state="expanded"`
**And** the header shows the title + any `actions`; the body is visible

---

## Responsive layout

### Chat's width is breakpoint-responsive, and stays LIVE until the user resizes it

**Given** an uncontrolled Chat panel that the user has not yet dragged or
keyboard-resized
**When** the viewport width crosses 1280px or 1680px (the `xl`/`3xl` steps
pinned in `src/styles/index.css` and mirrored in `src/lib/breakpoints.ts`)
**Then** Chat's width reflows immediately, with no page reload or remount:
48px (icon-only rail) below 1280px, 448px from 1280px up to 1680px, 512px at
1680px and up
**And** this reflow keeps happening on every subsequent browser resize —
it is NOT a one-time initial measurement

**Given** the user has dragged the resize handle, nudged it with the arrow
keys, or the `width` prop is controlled
**When** the viewport is resized afterward
**Then** Chat's width no longer reflows — the explicit value (drag/keyboard
override, or the controlled `width`) wins until double-click/Home resets it
back to the live breakpoint-driven value

> Unlike the sidebars below, Chat's responsive width needs no wiring from the
> consumer — it's implemented as plain CSS (`w-12 xl:w-md 3xl:w-lg` on the
> Chat panel), not a hook. There is no design token for these three widths
> (a pure layout composition), so the pixel values live only as JS constants
> in `app-shell-chat.tsx` mirroring the Tailwind classes.

### The sidebars' initial layout is breakpoint-derived, but frozen at mount

**Given** a screen that renders `SidebarPrimary` (+ optionally
`SidebarSecondary`) inside `AppShellChatSidebar`, wiring
`useAppShellChatInitialLayout()`'s `primaryExpanded`/`secondaryExpanded`
fields into each sidebar's `defaultExpanded` prop
**When** the screen first mounts
**Then** at 1680px and up, `SidebarPrimary` starts expanded and
`SidebarSecondary` (if present) starts expanded
**And** below 1680px, `SidebarPrimary` starts collapsed while
`SidebarSecondary` (if present) still starts expanded

**Given** a screen already mounted with that initial layout applied
**When** the viewport is resized, or the user manually expands/collapses a
sidebar
**Then** the sidebars' state is NEVER re-derived from the viewport again —
`useAppShellChatInitialLayout` reads `window.innerWidth` exactly once, at
first render, because `defaultExpanded` is itself a one-shot value on the
sidebar components (a later prop change is silently ignored); re-deriving it
live would fight the user's own sidebar toggle on every resize

> This is the opposite tradeoff from Chat's width, and deliberately so: Chat
> is a pure visual size with no independent "user already chose something"
> state to protect, so it can safely stay live forever. A sidebar's
> expanded/collapsed state IS that kind of state (the user's own toggle), so
> only the very first paint is allowed to be breakpoint-aware.

---

## Controlled / uncontrolled

### Width supports either mode

**Given** `width` (controlled) or the uncontrolled, breakpoint-responsive
default (see **Responsive layout** above)
**When** the resize edge is dragged or operated via keyboard
**Then** uncontrolled state updates internally, controlled state is owned by the consumer
**And** `onWidthChange` always fires with the next value
