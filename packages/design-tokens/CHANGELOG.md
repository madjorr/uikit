# @acronis-platform/design-tokens

## 0.3.0

### Minor Changes

- [#79](https://github.com/acronis/uikit/pull/79) [`40d3d53`](https://github.com/acronis/uikit/commit/40d3d535ed21da9b5c80142e7f496bc22e19dde9) Thanks [@heygabecom](https://github.com/heygabecom)! - Rename the design-data packages to disambiguate them as design-only data: `@acronis-platform/tokens` → `@acronis-platform/design-tokens` and `@acronis-platform/assets` → `@acronis-platform/design-assets`. Update your dependencies and imports to the new package names.

## 0.2.0

### Minor Changes

- [#77](https://github.com/acronis/uikit/pull/77) [`bd04411`](https://github.com/acronis/uikit/commit/bd0441158c54f08acbd99f67648a98af025089f1) Thanks [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)! - Add the `@acronis-platform/design-tokens` design-data package — DTCG-2025.10-conformant design-token JSON (primitives, semantic, components), validated with ajv against `schemas/tokens.schema.json`. Data-only (no build, no runtime API), consumed via its `exports` map.
