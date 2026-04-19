import { useState } from 'react';
import { DEFAULT_BINDINGS } from './defaultBindings';
import { bindingId } from './useBindings';

const FORMATS_KEY = 'keybindr_formats';
const ACTIVE_KEY  = 'keybindr_active_format';
const RECENT_KEY  = 'keybindr_recent_colors';

export const MAX_FORMATS = 5;

const DEFAULT_KEY_COLORS = { KeyW: '#1a4d2e', KeyA: '#1a4d2e', KeyS: '#1a4d2e', KeyD: '#1a4d2e' };

function makeFormat(empty = false) {
  return {
    name:      '',
    bindings:  empty ? [] : [...DEFAULT_BINDINGS],
    keyColors: empty ? {} : { ...DEFAULT_KEY_COLORS },
  };
}

function loadInitial() {
  try {
    const saved = JSON.parse(localStorage.getItem(FORMATS_KEY));
    const formats = Array.isArray(saved) && saved.length > 0 ? saved : (() => {
      // migrate from legacy separate keys
      const oldBindings = JSON.parse(localStorage.getItem('keybindr_bindings'));
      const oldColors   = JSON.parse(localStorage.getItem('keybindr_key_colors'));
      return [{
        name:      '',
        bindings:  oldBindings ?? [...DEFAULT_BINDINGS],
        keyColors: { ...DEFAULT_KEY_COLORS, ...(oldColors ?? {}) },
      }];
    })();
    const rawActive = parseInt(localStorage.getItem(ACTIVE_KEY), 10);
    const active = isNaN(rawActive) ? 0 : Math.min(rawActive, formats.length - 1);
    return { formats, active };
  } catch {
    return { formats: [makeFormat()], active: 0 };
  }
}

function loadRecent() {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY)) ?? []; } catch { return []; }
}

function persist(formats, active) {
  localStorage.setItem(FORMATS_KEY, JSON.stringify(formats));
  localStorage.setItem(ACTIVE_KEY,  String(active));
}

export function useFormats() {
  const [{ formats, active: activeIndex }, setState] = useState(loadInitial);
  const [recentColors, setRecent] = useState(loadRecent);

  function mutate(fn) {
    setState(prev => {
      const next = fn(prev);
      persist(next.formats, next.active);
      return next;
    });
  }

  function mutateActiveFormat(fn) {
    mutate(s => ({ ...s, formats: s.formats.map((f, i) => i === s.active ? fn(f) : f) }));
  }

  // ── Format management ─────────────────────────────────────────────────
  function switchTo(i) {
    mutate(s => ({ ...s, active: i }));
  }

  function addFormat() {
    mutate(s => {
      if (s.formats.length >= MAX_FORMATS) return s;
      const next = [...s.formats, makeFormat(true)];
      return { formats: next, active: next.length - 1 };
    });
  }

  function setFormatName(i, name) {
    mutate(s => ({ ...s, formats: s.formats.map((f, idx) => idx === i ? { ...f, name } : f) }));
  }

  function removeFormat(i) {
    if (i === 0) return;
    mutate(s => {
      if (s.formats.length <= 1) return s;
      const formats = s.formats.filter((_, idx) => idx !== i);
      const active  = s.active >= i ? Math.max(0, s.active - 1) : s.active;
      return { formats, active };
    });
  }

  // ── Bindings ──────────────────────────────────────────────────────────
  function addOrUpdate(key, modifiers, action) {
    const id = bindingId(key, modifiers);
    mutateActiveFormat(f => ({
      ...f,
      bindings: [
        ...f.bindings.filter(b => bindingId(b.key, b.modifiers) !== id),
        { key, modifiers: modifiers.slice().sort(), action },
      ],
    }));
  }

  function remove(key, modifiers) {
    const id = bindingId(key, modifiers);
    mutateActiveFormat(f => ({ ...f, bindings: f.bindings.filter(b => bindingId(b.key, b.modifiers) !== id) }));
  }

  function updateAction(key, modifiers, action) {
    const id = bindingId(key, modifiers);
    mutateActiveFormat(f => ({
      ...f,
      bindings: f.bindings.map(b => bindingId(b.key, b.modifiers) === id ? { ...b, action } : b),
    }));
  }

  function replaceActiveBindings(bindings) {
    mutateActiveFormat(f => ({ ...f, bindings }));
  }

  function replaceFormats(newFormats) {
    mutate(() => ({ formats: newFormats.slice(0, MAX_FORMATS), active: 0 }));
  }

  // ── Key colors ────────────────────────────────────────────────────────
  function setKeyColor(keyId, color) {
    mutateActiveFormat(f => ({ ...f, keyColors: { ...f.keyColors, [keyId]: color } }));
    setRecent(prev => {
      const next = [color, ...prev.filter(c => c !== color)].slice(0, 5);
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      return next;
    });
  }

  function clearKeyColor(keyId) {
    mutateActiveFormat(f => {
      if (!(keyId in f.keyColors)) return f;
      const kc = { ...f.keyColors };
      delete kc[keyId];
      return { ...f, keyColors: kc };
    });
  }

  function restoreKeyColor(keyId, color) {
    mutateActiveFormat(f => {
      if (color == null) {
        if (!(keyId in f.keyColors)) return f;
        const kc = { ...f.keyColors };
        delete kc[keyId];
        return { ...f, keyColors: kc };
      }
      return { ...f, keyColors: { ...f.keyColors, [keyId]: color } };
    });
  }

  function clearAllKeyColors() {
    mutateActiveFormat(f => ({ ...f, keyColors: { ...DEFAULT_KEY_COLORS } }));
  }

  // ── Reset ─────────────────────────────────────────────────────────────
  function resetFormats() {
    const fresh = { formats: [makeFormat()], active: 0 };
    setState(fresh);
    persist(fresh.formats, fresh.active);
    setRecent([]);
    localStorage.setItem(RECENT_KEY, '[]');
  }

  const activeFormat = formats[activeIndex];

  return {
    formats, activeIndex,
    switchTo, addFormat, setFormatName, removeFormat,
    bindings:  activeFormat?.bindings  ?? [],
    keyColors: activeFormat?.keyColors ?? { ...DEFAULT_KEY_COLORS },
    recentColors,
    addOrUpdate, remove, updateAction,
    replaceActiveBindings, replaceFormats,
    setKeyColor, clearKeyColor, restoreKeyColor, clearAllKeyColors,
    resetFormats,
  };
}
