// Build-time helper (used by scripts/generate-icons.ts). Lives in src/ so it
// shares the main TS project with its test; excluded from the published types.

/** kebab/underscore asset name → PascalCase, e.g. `chevron-down` → `ChevronDown`. */
export function pascalCase(name: string): string {
  return name
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

/**
 * Map an asset name to a valid React component identifier.
 *
 * Normal names take the `Icon` suffix (`ban` → `BanIcon`). A JS identifier
 * can't start with a digit, so numeric-leading names take the `Icon` prefix
 * instead (`365-sync` → `Icon365Sync`) rather than producing the invalid
 * `365SyncIcon`. The registry still keys icons by the original asset name.
 */
export function toComponentName(name: string): string {
  const base = pascalCase(name);
  return /^[0-9]/.test(base) ? `Icon${base}` : `${base}Icon`;
}
