import { createContext, useContext } from 'react';
import { getLoadedLocale, LANG_FALLBACK } from './locales/index.js';
import { GAME_ACTION_LABELS } from './gamePresets';

export const TranslationContext = createContext(key => key);

export function useT() {
  return useContext(TranslationContext);
}

export function resolveAction(action, t) {
  if (typeof action === 'string' && action.startsWith('__t:')) return t(action.slice(4));
  if (typeof action === 'string' && action in GAME_ACTION_LABELS) return GAME_ACTION_LABELS[action];
  return action ?? '';
}

/**
 * Builds a synchronous translator for the given BCP-47 language code.
 * The locale (and its fallback) must already be in the cache — call
 * preloadLocales() before invoking makeT() for non-English languages.
 * en-US is always available as the base fallback.
 * @param {string} language
 * @returns {function(string, object=): string}
 */
export function makeT(language) {
  const primary  = getLoadedLocale(language)                      || {};
  const fallback = getLoadedLocale(LANG_FALLBACK[language] ?? '') || {};
  const base     = getLoadedLocale('en-US')                       || {};
  return function t(key, vars) {
    let str = primary[key] ?? fallback[key] ?? base[key] ?? key;
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        str = str.replace(`{${k}}`, v);
      }
    }
    return str;
  };
}
