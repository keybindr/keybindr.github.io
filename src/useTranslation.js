import { createContext, useContext } from 'react';
import { TRANSLATIONS, LANG_FALLBACK } from './translations';
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

export function makeT(language) {
  const primary  = TRANSLATIONS[language]                    || {};
  const fallback = TRANSLATIONS[LANG_FALLBACK[language]]     || {};
  const base     = TRANSLATIONS['en-US']                     || {};
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
