/**
 * Storybook global state for the ui-react preview: brand, light/dark, text
 * direction, and locale. The apply* helpers implement the canonical switching
 * model for the `@acronis-platform/tokens-pd` delivery model:
 *
 * - Light/dark is NOT a `.dark` class. The tokens use `light-dark()` resolved by
 *   `color-scheme`; ui-react's `dark:` variant keys off `[data-theme]`. So we set
 *   both `color-scheme` and `[data-theme]` on the root element.
 * - Brand is NOT a class toggle. `default` is the base layer (loaded by
 *   `src/styles/index.css`); `deep_sky_itkontoret` is an override-only `:root`
 *   stylesheet layered on top by injecting it into a managed `<style>` element.
 */

// deep_sky_itkontoret's bundled brand entry — the semantic tier + every
// component tier's override, pre-concatenated by tokens-pd (see
// css/<brand>.all.css and tools/style-dictionary's `composeBundle`). One
// import stays in sync with whatever component tiers ui-react ships, instead
// of a hand-maintained per-component import list.
import DEEP_SKY_OVERRIDES from '@acronis-platform/tokens-pd/css/deep_sky_itkontoret.all.css?raw';

export type Brand = 'default' | 'deep_sky_itkontoret';
export type ColorMode = 'light' | 'dark';
export type Direction = 'auto' | 'ltr' | 'rtl';
export type Locale = 'en' | 'de' | 'fr' | 'ja' | 'ar' | 'he';

// Locales that read right-to-left, used when `direction` is left on 'auto'.
const RTL_LOCALES = new Set<Locale>(['ar', 'he']);

const BRAND_STYLE_ID = 'sb-brand-override';

/** Layer deep_sky_itkontoret's `:root` overrides on the default base, or clear them. */
export function applyBrand(brand: Brand): void {
  const existing = document.getElementById(BRAND_STYLE_ID);
  if (brand === 'default') {
    existing?.remove();
    return;
  }
  const el = existing ?? document.createElement('style');
  el.id = BRAND_STYLE_ID;
  el.textContent = DEEP_SKY_OVERRIDES;
  if (!existing) document.head.appendChild(el);
}

/** Flip light/dark: `color-scheme` drives `light-dark()`; `[data-theme]` drives `dark:`. */
export function applyColorMode(mode: ColorMode): void {
  const html = document.documentElement;
  html.dataset.theme = mode;
  html.style.colorScheme = mode;
}

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
