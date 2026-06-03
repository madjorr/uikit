# @acronis-platform/ui-react

## 0.2.0

### Minor Changes

- [#80](https://github.com/acronis/uikit/pull/80) [`1687cc9`](https://github.com/acronis/uikit/commit/1687cc9336de74d53521d8e6ef9097763a0a9bb0) Thanks [@leonid](https://github.com/leonid)! - Introduce two new published packages:
  - `@acronis-platform/design-theme` — generates consumable CSS / SCSS / JS theme
    artifacts from `@acronis-platform/design-tokens` via Style Dictionary, resolving
    the per-scheme (light/dark) and per-brand token matrix into `--av-*` CSS
    custom properties.
  - `@acronis-platform/ui-react` — the next-generation Acronis React
    component library built on Base UI (`@base-ui/react`) and themed by
    `@acronis-platform/design-theme`. Ships `Button` and `Switch` with tests and
    Storybook stories as the reference pattern.

### Patch Changes

- Updated dependencies [[`1687cc9`](https://github.com/acronis/uikit/commit/1687cc9336de74d53521d8e6ef9097763a0a9bb0)]:
  - @acronis-platform/design-theme@0.2.0
