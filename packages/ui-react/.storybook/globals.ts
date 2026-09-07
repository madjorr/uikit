/**
 * Storybook global state for the ui-react preview: brand, light/dark, text
 * direction, and locale. The apply* helpers implement the canonical switching
 * model for the `@acronis-platform/tokens-pd` delivery model:
 *
 * - Light/dark is NOT a `.dark` class. The tokens use `light-dark()` resolved by
 *   `color-scheme`; ui-react's `dark:` variant keys off `[data-theme]`. So we set
 *   both `color-scheme` and `[data-theme]` on the root element.
 * - Brand is NOT a class toggle, and it is NOT a per-tier override list either
 *   (that used to mean hand-listing every component tier here and keeping it in
 *   sync with `src/styles/index.css` — exactly the drift `tokens-pd`'s
 *   `bundles/<brand>.css` exists to prevent). `default` is the base layer
 *   (loaded by `src/styles/index.css`); every other brand is swapped in wholesale
 *   by injecting its full bundle — semantics + every component tier in one
 *   file — into a managed `<style>` element. This is the same runtime
 *   brand-switching pattern documented in `apps/docs/content/docs/theming.mdx`.
 */

import bundleDeepSky from '@acronis-platform/tokens-pd/bundles/deep_sky_itkontoret.css?raw';
import bundleLightGray from '@acronis-platform/tokens-pd/bundles/light-gray.css?raw';
import bundleTelstra from '@acronis-platform/tokens-pd/bundles/telstra.css?raw';
import bundleVirtuozzo from '@acronis-platform/tokens-pd/bundles/virtuozzo.css?raw';
import bundleYellow1c from '@acronis-platform/tokens-pd/bundles/yellow-1c.css?raw';

export type Brand =
  | 'default'
  | 'deep_sky_itkontoret'
  | 'light-gray'
  | 'telstra'
  | 'virtuozzo'
  | 'yellow-1c';
export type ColorMode = 'light' | 'dark';
export type Direction = 'auto' | 'ltr' | 'rtl';
export type Locale = 'en' | 'de' | 'fr' | 'ja' | 'ar' | 'he';

/** Every non-default brand's full bundle, keyed for `applyBrand`. */
const BRAND_BUNDLES: Record<Exclude<Brand, 'default'>, string> = {
  deep_sky_itkontoret: bundleDeepSky,
  'light-gray': bundleLightGray,
  telstra: bundleTelstra,
  virtuozzo: bundleVirtuozzo,
  'yellow-1c': bundleYellow1c,
};

const BRAND_STYLE_ID = 'sb-brand-override';

/**
 * Swap in a brand's full bundle (semantics + every component tier), or clear
 * the override to fall back to the default brand `src/styles/index.css`
 * already loads. A bundle is full-strength, not an override-only diff, so it
 * replaces rather than layers — one `<style>` element holds at most one brand.
 */
export function applyBrand(brand: Brand): void {
  const existing = document.getElementById(BRAND_STYLE_ID);
  if (brand === 'default') {
    existing?.remove();
    return;
  }
  const el = existing ?? document.createElement('style');
  el.id = BRAND_STYLE_ID;
  el.textContent = BRAND_BUNDLES[brand];
  if (!existing) document.head.appendChild(el);
}

/** Flip light/dark: `color-scheme` drives `light-dark()`; `[data-theme]` drives `dark:`. */
export function applyColorMode(mode: ColorMode): void {
  const html = document.documentElement;
  html.dataset.theme = mode;
  html.style.colorScheme = mode;
}

// Locales that read right-to-left, used when `direction` is left on 'auto'.
const RTL_LOCALES = new Set<Locale>(['ar', 'he']);

/** Set `lang` + `dir`. With direction 'auto', RTL locales flip to rtl. */
export function applyLocaleAndDirection(
  locale: Locale,
  direction: Direction
): void {
  const html = document.documentElement;
  html.lang = locale;
  html.dir =
    direction === 'auto'
      ? RTL_LOCALES.has(locale)
        ? 'rtl'
        : 'ltr'
      : direction;
}
