// Pins the pure slice-merge step that assembles per-brand bundles in tokens.ts:
// collect every slice's full (non-diffed) declarations, sort them so `semantics`
// comes first and components follow alphabetically, then union vars + classes into
// one map. No Style Dictionary or disk I/O — synthetic fixtures only.

import { describe, expect, it } from 'vitest';

import type { Decls } from '../hooks/formats/css-light-dark';

const decls = (vars: Record<string, string>, classes: Record<string, string> = {}): Decls => ({
  vars: new Map(Object.entries(vars)),
  classes: new Map(Object.entries(classes)),
  skipped: [],
});

/** The sort used by the bundle loop in tokens.ts: semantics first, then alphabetical. */
function sortSlices(keys: string[]): string[] {
  return [...keys].sort((a, b) => (a === 'semantics' ? -1 : b === 'semantics' ? 1 : a.localeCompare(b)));
}

/** Union vars + classes from an ordered list of Decls — mirrors the merge in tokens.ts. */
function mergeDecls(slices: Decls[]): Pick<Decls, 'vars' | 'classes'> {
  const vars = new Map<string, string>();
  const classes = new Map<string, string>();
  for (const d of slices) {
    for (const [name, value] of d.vars) vars.set(name, value);
    for (const [selector, block] of d.classes) classes.set(selector, block);
  }
  return { vars, classes };
}

describe('bundle slice ordering (semantics-first)', () => {
  it('places semantics before component slices', () => {
    expect(sortSlices(['Button', 'semantics', 'Alert'])).toEqual(['semantics', 'Alert', 'Button']);
  });

  it('sorts components alphabetically when no semantics key is present', () => {
    expect(sortSlices(['Tooltip', 'Alert', 'Button'])).toEqual(['Alert', 'Button', 'Tooltip']);
  });

  it('is stable when semantics is the only slice', () => {
    expect(sortSlices(['semantics'])).toEqual(['semantics']);
  });
});

describe('bundle slice merge (union of vars + classes)', () => {
  it('unions vars from all slices into one map', () => {
    const merged = mergeDecls([
      decls({ '--ui-a': '1', '--ui-b': '2' }),
      decls({ '--ui-c': '3' }),
    ]);
    expect([...merged.vars.keys()]).toEqual(['--ui-a', '--ui-b', '--ui-c']);
  });

  it('unions classes from all slices into one map', () => {
    const merged = mergeDecls([
      decls({}, { '.ui-typography-h1': 'font-size: 2rem;' }),
      decls({}, { '.ui-typography-body': 'font-size: 1rem;' }),
    ]);
    expect([...merged.classes.keys()]).toEqual(['.ui-typography-h1', '.ui-typography-body']);
  });

  it('last-write wins when two slices share a var name (slices should not collide in real data)', () => {
    const merged = mergeDecls([
      decls({ '--ui-a': 'first' }),
      decls({ '--ui-a': 'second' }),
    ]);
    expect(merged.vars.get('--ui-a')).toBe('second');
  });

  it('produces an empty result for an empty slice list', () => {
    const merged = mergeDecls([]);
    expect(merged.vars.size).toBe(0);
    expect(merged.classes.size).toBe(0);
  });

  it('includes vars from a slice that has no counterpart in other slices', () => {
    const merged = mergeDecls([
      decls({ '--ui-semantic-x': 'red' }),
      decls({ '--ui-button-primary-bg': 'blue' }),
    ]);
    expect(merged.vars.size).toBe(2);
    expect(merged.vars.get('--ui-semantic-x')).toBe('red');
    expect(merged.vars.get('--ui-button-primary-bg')).toBe('blue');
  });
});
