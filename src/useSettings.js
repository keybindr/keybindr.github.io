import { useState } from 'react';
import { LOCALE_IDS, localeUsesISO } from './keylabels';

const SETTINGS_KEY = 'keybindr_settings';

function detectLocale() {
  const langs = navigator.languages?.length ? navigator.languages : [navigator.language ?? 'en-US'];
  for (const lang of langs) {
    if (LOCALE_IDS.includes(lang)) return lang;
    const prefix = lang.split('-')[0];
    const match = LOCALE_IDS.find(id => id.startsWith(prefix + '-'));
    if (match) return match;
  }
  return 'en-US';
}

const detectedLocale = detectLocale();

const DEFAULTS = {
  splitModifiers: false,
  physicalLayout: localeUsesISO(detectedLocale) ? 'iso-105' : 'ansi-104',
  language: detectedLocale,
};

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY));
    if (!saved) return DEFAULTS;
    return {
      ...DEFAULTS,
      splitModifiers: !!saved.splitModifiers,
      physicalLayout: saved.physicalLayout ?? DEFAULTS.physicalLayout,
      language:       saved.language       ?? DEFAULTS.language,
    };
  } catch {
    return DEFAULTS;
  }
}

function persist(s) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
}

export function useSettings() {
  const [settings, setSettings] = useState(load);

  function setSplitModifiers(val) {
    setSettings(prev => { const next = { ...prev, splitModifiers: val }; persist(next); return next; });
  }

  function setPhysicalLayout(val) {
    setSettings(prev => { const next = { ...prev, physicalLayout: val }; persist(next); return next; });
  }

  function setLanguage(val) {
    setSettings(prev => { const next = { ...prev, language: val }; persist(next); return next; });
  }

  function resetSettings() {
    setSettings(() => { persist(DEFAULTS); return DEFAULTS; });
  }

  return { settings, setSplitModifiers, setPhysicalLayout, setLanguage, resetSettings };
}
