/**
 * Locale loader — replaces the monolithic translations.js.
 *
 * en-US is always imported eagerly because it is the universal fallback.
 * Every other locale is loaded on demand via dynamic import() and cached.
 */

import en from './en-US.js';

// ── Fallback chains ────────────────────────────────────────────────────────────
// Stub locales (no separate translation file) defer to the listed locale.
export const LANG_FALLBACK = {
  'en-GB':  'en-US',
  'de-CH':  'de-DE',
  'fr-BE':  'fr-FR',
  'nl-BE':  'nl-NL',
  'es-419': 'es-ES',
};

// ── Dynamic import registry ────────────────────────────────────────────────────
// Add an entry here whenever a new locale file is created.
const LOADERS = {
  'en-US': null,              // eagerly loaded — no dynamic import needed
  'de-DE': () => import('./de-DE.js'),
  'fr-FR': () => import('./fr-FR.js'),
  'nl-NL': () => import('./nl-NL.js'),
  'es-ES': () => import('./es-ES.js'),
  'sv-SE': () => import('./sv-SE.js'),
  'nb-NO': () => import('./nb-NO.js'),
  'da-DK': () => import('./da-DK.js'),
  'fi-FI': () => import('./fi-FI.js'),
  'pl-PL': () => import('./pl-PL.js'),
  'cs-CZ': () => import('./cs-CZ.js'),
  'sk-SK': () => import('./sk-SK.js'),
  'hu-HU': () => import('./hu-HU.js'),
  'ro-RO': () => import('./ro-RO.js'),
  'pt-BR': () => import('./pt-BR.js'),
  'pt-PT': () => import('./pt-PT.js'),
  'it-IT': () => import('./it-IT.js'),
  'tr-TR': () => import('./tr-TR.js'),
  'el-GR': () => import('./el-GR.js'),
  'vi-VN': () => import('./vi-VN.js'),
  'bg-BG': () => import('./bg-BG.js'),
  'sr-RS': () => import('./sr-RS.js'),
  'hr-HR': () => import('./hr-HR.js'),
  'ru-RU': () => import('./ru-RU.js'),
  'uk-UA': () => import('./uk-UA.js'),
  'ko-KR': () => import('./ko-KR.js'),
  'zh-CN': () => import('./zh-CN.js'),
  'ja-JP': () => import('./ja-JP.js'),
  'id-ID': () => import('./id-ID.js'),
};

// ── Cache ──────────────────────────────────────────────────────────────────────
// Populated synchronously for en-US; all others fill in after loadLocale().
const cache = { 'en-US': en };

/** Synchronous cache lookup — returns the locale object or null if not loaded yet. */
export function getLoadedLocale(lang) {
  return cache[lang] ?? null;
}

/**
 * Loads a locale by BCP-47 code and stores it in the cache.
 * Stub locales (e.g. 'en-GB') are resolved to their content locale via LANG_FALLBACK.
 * Safe to call multiple times — repeated calls for the same locale are no-ops.
 * @param {string} lang
 * @returns {Promise<Object>} the locale dictionary
 */
export async function loadLocale(lang) {
  const resolved = LANG_FALLBACK[lang] ?? lang;
  if (cache[resolved]) return cache[resolved];
  const loader = LOADERS[resolved];
  if (!loader) return cache['en-US'];         // unknown locale → fall back to en-US
  const mod = await loader();
  cache[resolved] = mod.default;
  return cache[resolved];
}

/**
 * Preloads one or more locales in parallel.
 * Call this on app startup and whenever the active language changes.
 * @param {...string} langs
 * @returns {Promise<void>}
 */
export async function preloadLocales(...langs) {
  await Promise.all(langs.filter(Boolean).map(loadLocale));
}
