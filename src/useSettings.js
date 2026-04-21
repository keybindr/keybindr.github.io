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

const isTouchDevice = 'ontouchstart' in window;

const DEFAULTS = {
  splitModifiers: false,
  physicalLayout: isTouchDevice ? 'layout-60' : localeUsesISO(detectedLocale) ? 'iso-105' : 'ansi-104',
  language: detectedLocale,
  uiLanguage: detectedLocale,
  warnCrossFormatConflicts: false,
  showMouseBindings: true,
  mouseModel: 'custom',
  showHotasBindings: false,
  joystickButtonCount: 32,
  throttleButtonCount: 32,
  pedalsButtonCount: 4,
};

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY));
    if (!saved) return DEFAULTS;
    return {
      ...DEFAULTS,
      splitModifiers:            !!saved.splitModifiers,
      physicalLayout:            saved.physicalLayout            ?? DEFAULTS.physicalLayout,
      language:                  saved.language                  ?? DEFAULTS.language,
      uiLanguage:                saved.uiLanguage                ?? detectedLocale,
      warnCrossFormatConflicts:  !!saved.warnCrossFormatConflicts,
      showMouseBindings:         saved.showMouseBindings ?? true,
      mouseModel:                saved.mouseModel        ?? 'custom',
      showHotasBindings:         saved.showHotasBindings ?? false,
      joystickButtonCount:       saved.joystickButtonCount ?? 32,
      throttleButtonCount:       saved.throttleButtonCount ?? 32,
      pedalsButtonCount:         saved.pedalsButtonCount   ?? 4,
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

  function setUiLanguage(val) {
    setSettings(prev => { const next = { ...prev, uiLanguage: val }; persist(next); return next; });
  }

  function setWarnCrossFormatConflicts(val) {
    setSettings(prev => { const next = { ...prev, warnCrossFormatConflicts: val }; persist(next); return next; });
  }

  function setShowMouseBindings(val) {
    setSettings(prev => { const next = { ...prev, showMouseBindings: val }; persist(next); return next; });
  }

  function setMouseModel(val) {
    setSettings(prev => { const next = { ...prev, mouseModel: val }; persist(next); return next; });
  }

  function setShowHotasBindings(val) {
    setSettings(prev => { const next = { ...prev, showHotasBindings: val }; persist(next); return next; });
  }

  function setJoystickButtonCount(val) {
    setSettings(prev => { const next = { ...prev, joystickButtonCount: Number(val) }; persist(next); return next; });
  }

  function setThrottleButtonCount(val) {
    setSettings(prev => { const next = { ...prev, throttleButtonCount: Number(val) }; persist(next); return next; });
  }

  function setPedalsButtonCount(val) {
    setSettings(prev => { const next = { ...prev, pedalsButtonCount: Number(val) }; persist(next); return next; });
  }

  function resetSettings() {
    setSettings(() => { persist(DEFAULTS); return DEFAULTS; });
  }

  return { settings, setSplitModifiers, setPhysicalLayout, setLanguage, setUiLanguage, setWarnCrossFormatConflicts, setShowMouseBindings, setMouseModel, setShowHotasBindings, setJoystickButtonCount, setThrottleButtonCount, setPedalsButtonCount, resetSettings };
}
