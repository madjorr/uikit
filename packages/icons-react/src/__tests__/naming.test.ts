import { describe, expect, it } from 'vitest';

import { pascalCase, toComponentName } from '../lib/naming';

describe('toComponentName', () => {
  it('suffixes normal names with Icon', () => {
    expect(toComponentName('ban')).toBe('BanIcon');
    expect(toComponentName('chevron-down')).toBe('ChevronDownIcon');
    expect(toComponentName('circle-check-solid')).toBe('CircleCheckSolidIcon');
  });

  it('keeps the suffix when a digit appears mid-name (still a valid identifier)', () => {
    expect(toComponentName('office-365')).toBe('Office365Icon');
    expect(toComponentName('microsoft-365')).toBe('Microsoft365Icon');
  });

  it('prefixes numeric-leading names with Icon to stay a valid identifier', () => {
    expect(toComponentName('365-sync')).toBe('Icon365Sync');
    expect(toComponentName('3d-view')).toBe('Icon3dView');
    // every result must be a legal JS identifier (not start with a digit)
    for (const name of ['365-sync', '3d-view', '1-2-3']) {
      expect(toComponentName(name)).toMatch(/^[A-Za-z_$]/);
    }
  });

  it('pascalCase drops empty segments from stray separators', () => {
    expect(pascalCase('a--b_c')).toBe('ABC');
  });
});
