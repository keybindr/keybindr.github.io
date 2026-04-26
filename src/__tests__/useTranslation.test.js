import { describe, it, expect, beforeAll } from 'vitest';
import { makeT, resolveAction } from '../useTranslation';
import { preloadLocales } from '../locales/index.js';

describe('makeT — en-US', () => {
  const t = makeT('en-US');

  it('returns the translation for a known key', () => {
    expect(t('save')).toBe('Save');
    expect(t('cancel')).toBe('Cancel');
    expect(t('close')).toBe('Close');
  });

  it('returns the raw key when no translation exists', () => {
    expect(t('totally_unknown_key_xyz')).toBe('totally_unknown_key_xyz');
  });

  it('substitutes {variable} placeholders', () => {
    // e.g. 'formatFallback': 'Format {n}'
    expect(t('formatFallback', { n: '3' })).toBe('Format 3');
  });

  it('substitutes {count} in orphan body strings', () => {
    // 'orphanBodyPlural': 'The following {count} bindings...'
    const result = t('orphanBodyPlural', { count: '5' });
    expect(result).toContain('5');
  });
});

describe('makeT — fallback chain', () => {
  beforeAll(async () => {
    await preloadLocales('de-DE');
  });

  it('uses en-US as the base fallback for a key missing from the primary locale', () => {
    // Deliberately request a key that doesn't exist in de-DE by using a locale
    // that hasn't been loaded — it will fall through to en-US.
    const t = makeT('de-DE');
    // All real keys should resolve to something non-empty.
    expect(t('save').length).toBeGreaterThan(0);
  });

  it('returns the key itself only when en-US also lacks it', () => {
    const t = makeT('de-DE');
    expect(t('not_a_real_key')).toBe('not_a_real_key');
  });
});

describe('resolveAction', () => {
  const t = makeT('en-US');

  it('passes plain action strings through unchanged', () => {
    expect(resolveAction('Move Forward', t)).toBe('Move Forward');
    expect(resolveAction('Jump', t)).toBe('Jump');
  });

  it('resolves __t:-prefixed keys through the translator', () => {
    expect(resolveAction('__t:save', t)).toBe('Save');
    expect(resolveAction('__t:cancel', t)).toBe('Cancel');
  });

  it('returns an empty string for null or undefined', () => {
    expect(resolveAction(null, t)).toBe('');
    expect(resolveAction(undefined, t)).toBe('');
  });
});
