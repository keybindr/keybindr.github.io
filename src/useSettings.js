import { useState } from 'react';

const SETTINGS_KEY = 'keybindr_settings';

export const DEFAULT_MOD_COLORS = {
  Ctrl:  '#e07b39',
  Shift: '#7b9ee0',
  Alt:   '#7be09a',
};

export const DEFAULT_SPLIT_MOD_COLORS = {
  ShiftLeft:  '#60a0e0', // sky blue
  ShiftRight: '#c060d0', // orchid
  AltLeft:    '#50c878', // emerald
  AltRight:   '#e0c040', // gold
  CtrlLeft:   '#e06040', // coral
  CtrlRight:  '#40c8c0', // teal
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

  function resetSettings() {
    setSettings(() => {
      persist(DEFAULTS);
      return DEFAULTS;
    });
  }

  return { settings, setModColor, setSplitModColor, setSplitModifiers, resetSettings };
}
