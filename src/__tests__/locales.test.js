/**
 * Locale completeness guard.
 *
 * Every key present in en-US.js must also exist in every content locale file.
 * This test will fail whenever a new UI string is added to en-US but the
 * corresponding key is not added to the other locale files — catching the
 * omission before it ships.
 *
 * Stub locales (en-GB, de-CH, fr-BE, nl-BE, es-419) have no separate files and
 * are excluded; they inherit from their content locale via LANG_FALLBACK.
 */
import { describe, it, expect } from 'vitest';
import enUS from '../locales/en-US.js';

// All content locales that ship their own file.
// Update this map whenever a new locale file is added to src/locales/.
const CONTENT_LOCALES = {
  'bg-BG': () => import('../locales/bg-BG.js'),
  'cs-CZ': () => import('../locales/cs-CZ.js'),
  'da-DK': () => import('../locales/da-DK.js'),
  'de-DE': () => import('../locales/de-DE.js'),
  'el-GR': () => import('../locales/el-GR.js'),
  'es-ES': () => import('../locales/es-ES.js'),
  'fi-FI': () => import('../locales/fi-FI.js'),
  'fr-FR': () => import('../locales/fr-FR.js'),
  'hr-HR': () => import('../locales/hr-HR.js'),
  'hu-HU': () => import('../locales/hu-HU.js'),
  'id-ID': () => import('../locales/id-ID.js'),
  'it-IT': () => import('../locales/it-IT.js'),
  'ja-JP': () => import('../locales/ja-JP.js'),
  'ko-KR': () => import('../locales/ko-KR.js'),
  'nb-NO': () => import('../locales/nb-NO.js'),
  'nl-NL': () => import('../locales/nl-NL.js'),
  'pl-PL': () => import('../locales/pl-PL.js'),
  'pt-BR': () => import('../locales/pt-BR.js'),
  'pt-PT': () => import('../locales/pt-PT.js'),
  'ro-RO': () => import('../locales/ro-RO.js'),
  'ru-RU': () => import('../locales/ru-RU.js'),
  'sk-SK': () => import('../locales/sk-SK.js'),
  'sr-RS': () => import('../locales/sr-RS.js'),
  'sv-SE': () => import('../locales/sv-SE.js'),
  'tr-TR': () => import('../locales/tr-TR.js'),
  'uk-UA': () => import('../locales/uk-UA.js'),
  'vi-VN': () => import('../locales/vi-VN.js'),
  'zh-CN': () => import('../locales/zh-CN.js'),
};

const EN_KEYS = Object.keys(enUS);

describe('locale completeness', () => {
  it.each(Object.entries(CONTENT_LOCALES))(
    '%s contains every en-US key',
    async (code, load) => {
      const { default: locale } = await load();
      const missing = EN_KEYS.filter(k => !(k in locale));
      expect(
        missing,
        `${code} is missing ${missing.length} key(s): ${missing.join(', ')}`,
      ).toHaveLength(0);
    },
  );
});

describe('locale index', () => {
  it('en-US is always pre-loaded in the cache', async () => {
    const { getLoadedLocale } = await import('../locales/index.js');
    expect(getLoadedLocale('en-US')).not.toBeNull();
    expect(getLoadedLocale('en-US')['save']).toBe('Save');
  });

  it('loadLocale caches the result (same reference on second call)', async () => {
    const { loadLocale } = await import('../locales/index.js');
    const first  = await loadLocale('de-DE');
    const second = await loadLocale('de-DE');
    expect(first).toBe(second);
  });

  it('stub locales resolve to their content locale', async () => {
    const { loadLocale, getLoadedLocale } = await import('../locales/index.js');
    // en-GB is a stub that maps to en-US
    await loadLocale('en-GB');
    expect(getLoadedLocale('en-US')).not.toBeNull();
  });

  it('unknown locale falls back to en-US', async () => {
    const { loadLocale } = await import('../locales/index.js');
    const result = await loadLocale('xx-XX');
    expect(result['save']).toBe('Save');
  });
});
