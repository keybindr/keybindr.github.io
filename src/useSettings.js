import { useState } from 'react';

const SETTINGS_KEY = 'keybindr_settings';

export const DEFAULT_MOD_COLORS = {
  Ctrl:  '#e07b39',
  Shift: '#7b9ee0',
  Alt:   '#7be09a',
};

export const DEFAULT_SPLIT_MOD_COLORS = {
  CtrlLeft:   '#e07b39',
  CtrlRight:  '#e07b39',
  ShiftLeft:  '#7b9ee0',
  ShiftRight: '#7b9ee0',
  AltLeft:    '#7be09a',
  AltRight:   '#7be09a',
};

const DEFAULTS = {
  splitModifiers: false,
  modColors: { ...DEFAULT_MOD_COLORS },
  splitModColors: { ...DEFAULT_SPLIT_MOD_COLORS },
};

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY));
    if (!saved) return DEFAULTS;
    return {
      ...DEFAULTS,
      ...saved,
      modColors:      { ...DEFAULTS.modColors,      ...saved.modColors },
      splitModColors: { ...DEFAULTS.splitModColors, ...saved.splitModColors },
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

  function setModColor(key, color) {
    setSettings(prev => {
      const next = { ...prev, modColors: { ...prev.modColors, [key]: color } };
      persist(next);
      return next;
    });
  }

  function setSplitModColor(key, color) {
    setSettings(prev => {
      const next = { ...prev, splitModColors: { ...prev.splitModColors, [key]: color } };
      persist(next);
      return next;
    });
  }

  function setSplitModifiers(val) {
    setSettings(prev => {
      const next = { ...prev, splitModifiers: val };
      persist(next);
      return next;
    });
  }

  return { settings, setModColor, setSplitModColor, setSplitModifiers };
}
