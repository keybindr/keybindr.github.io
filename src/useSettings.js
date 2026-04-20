import { useState } from 'react';

const SETTINGS_KEY = 'keybindr_settings';

const DEFAULTS = {
  splitModifiers: false,
  physicalLayout: 'ansi-104',
  language: 'en-US',
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
