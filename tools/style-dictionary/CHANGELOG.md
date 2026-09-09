# @acronis-platform/style-dictionary

## 0.2.0

### Minor Changes

- [#722](https://github.com/acronis/uikit/pull/722) [`cf79270`](https://github.com/acronis/uikit/commit/cf79270136bdd75d9b511329c5cc4ddb17d6971e) Thanks [@madjorr](https://github.com/madjorr)! - Add a full per-brand CSS bundle so a runtime consumer can re-theme in one step.

  Previously `tokens-pd` only shipped the semantic tier (`css/<brand>.css`) and an
  opt-in component tier (`css/<Component>/<brand>.css`), with no artifact carrying
  "everything for brand X". A consumer that swaps brands at runtime (rather than at
  build time via static imports) could only swap the semantic file, silently
  leaving every component on the default brand's colors.

  `pd-css` now also emits `bundles/<brand>.css` — one file per brand with the
  semantic tier and every component tier merged into a single `:root, :host {}`
  block, always full (never override-only). The brand/component set is derived
  from the same data `tokens.ts` already uses internally (`BRANDS`, the per-slice
  declaration maps), so it can't drift from what's actually built. The files are
  published via `tokens-pd`'s `files` field (`"bundles/**/*.css"`); the
  `./bundles/*` entry in `exports` is present for explicitness but is covered by
  the existing `./*` catch-all.

## 0.1.0

### Minor Changes

- [#93](https://github.com/acronis/uikit/pull/93) [`d7f1ceb`](https://github.com/acronis/uikit/commit/d7f1ceb06de69eae974b9e4533fb92c357a38695) Thanks [@heygabecom](https://github.com/heygabecom)! - Add `@acronis-platform/style-dictionary` — the first inhabitant of the repo's
  `tools/` tier. A private (unpublished) [Style Dictionary v5](https://styledictionary.com/)
  translation pipeline with two build domains, driven by a single CLI
  (`src/index.ts`) keyed by `<filter>-<output>` platform keys:
  - **Tokens → CSS.** Normalizes `@acronis-platform/design-tokens` into 100%-DTCG
    JSON (`pd-dtcg`), then resolves it into per-brand CSS custom properties
    (`pd-css`: `acronis.css`, `brand-b.css`) using the modern `light-dark()` +
    `color-scheme` theming pattern and `.typography-*` utility classes.
  - **Assets → SVG + React.** Resolves `@acronis-platform/design-assets` packs
    (scale/stroke rules, `currentColor` for mono), optimizes with SVGO, and
    generates one tree-shakeable React component per asset with `size`/`variant`
    props (`pd-assets` / `web-assets`).

  Output is written to a gitignored `dist/` (`dist/tokens/`, `dist/assets/`). A
  POC CI pipeline (`assets-detect` / `assets-build` in `.github/workflows/ci.yml`)
  exercises the change-detection → validate → per-pack build contract.
