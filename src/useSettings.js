import { useState } from 'react';

const SETTINGS_KEY = 'keybindr_settings';

const DEFAULTS = {
  splitModifiers: false,
};

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY));
    if (!saved) return DEFAULTS;
    return { ...DEFAULTS, splitModifiers: !!saved.splitModifiers };
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
    setSettings(prev => {
      const next = { ...prev, splitModifiers: val };
      persist(next);
      return next;
    });
  }

  function resetSettings() {
    setSettings(() => {
      persist(DEFAULTS);
      return DEFAULTS;
    });
  }

  return { settings, setSplitModifiers, resetSettings };
}
