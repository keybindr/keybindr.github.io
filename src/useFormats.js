import { useState, useRef } from 'react';
import { DEFAULT_BINDINGS } from './defaultBindings';
import { bindingId } from './useBindings';

const FORMATS_KEY = 'keybindr_formats';
const ACTIVE_KEY  = 'keybindr_active_format';
const RECENT_KEY  = 'keybindr_recent_colors';

export const MAX_FORMATS = 5;

function makeFormat(name = '', empty = false) {
  return {
    name,
    bindings:  empty ? [] : [...DEFAULT_BINDINGS],
    keyColors: {},
  };
}

const DEFAULT_FORMATS = [
  makeFormat('__t:formatOnFoot'),
];

function loadInitial() {
  try {
    const saved = JSON.parse(localStorage.getItem(FORMATS_KEY));
    const formats = Array.isArray(saved) && saved.length > 0 ? saved : (() => {
      // migrate from legacy separate keys
      const oldBindings = JSON.parse(localStorage.getItem('keybindr_bindings'));
      const oldColors   = JSON.parse(localStorage.getItem('keybindr_key_colors'));
      if (oldBindings || oldColors) {
        return [{
          name:      '__t:formatOnFoot',
          bindings:  oldBindings ?? [...DEFAULT_BINDINGS],
          keyColors: oldColors ?? {},
        }];
      }
      return DEFAULT_FORMATS.map(f => ({ ...f, bindings: [...f.bindings] }));
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

const HISTORY_LIMIT = 3;

export function useFormats() {
  const [{ formats, active: activeIndex }, setState] = useState(loadInitial);
  const [recentColors, setRecent] = useState(loadRecent);
  const historyRef = useRef({ past: [], future: [] });

  function mutate(fn) {
    setState(prev => {
      const next = fn(prev);
      historyRef.current = {
        past: [...historyRef.current.past.slice(-(HISTORY_LIMIT - 1)), prev],
        future: [],
      };
      persist(next.formats, next.active);
      return next;
    });
  }

  function undo() {
    setState(current => {
      const { past, future } = historyRef.current;
      if (past.length === 0) return current;
      const prev = past[past.length - 1];
      historyRef.current = {
        past: past.slice(0, -1),
        future: [current, ...future].slice(0, HISTORY_LIMIT),
      };
      persist(prev.formats, prev.active);
      return prev;
    });
  }

  function redo() {
    setState(current => {
      const { past, future } = historyRef.current;
      if (future.length === 0) return current;
      const next = future[0];
      historyRef.current = {
        past: [...past.slice(-(HISTORY_LIMIT - 1)), current],
        future: future.slice(1),
      };
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
      const next = [...s.formats, makeFormat('', true)];
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
    mutateActiveFormat(f => {
      const exists = f.bindings.some(b => bindingId(b.key, b.modifiers) === id);
      if (exists) {
        return {
          ...f,
          bindings: f.bindings.map(b =>
            bindingId(b.key, b.modifiers) === id
              ? { ...b, key, modifiers: modifiers.slice().sort(), action }
              : b
          ),
        };
      }
      return { ...f, bindings: [...f.bindings, { key, modifiers: modifiers.slice().sort(), action }] };
    });
  }

  function reorderBindings(fromIndex, toIndex) {
    mutateActiveFormat(f => {
      const bs = [...f.bindings];
      const [moved] = bs.splice(fromIndex, 1);
      bs.splice(toIndex, 0, moved);
      return { ...f, bindings: bs };
    });
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

  function removeOrphanBindings(validKeySet) {
    mutate(s => ({
      ...s,
      formats: s.formats.map(f => ({
        ...f,
        bindings: f.bindings.filter(b => validKeySet.has(b.key)),
      })),
    }));
  }

  // ── Key colors ────────────────────────────────────────────────────────
  function setKeyColor(keyId, color) {
    mutateActiveFormat(f => ({ ...f, keyColors: { ...f.keyColors, [keyId]: color } }));
  }

  function addRecentColor(color) {
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
    mutateActiveFormat(f => ({ ...f, keyColors: {} }));
  }

  // ── Reset ─────────────────────────────────────────────────────────────
  function resetFormats() {
    const fresh = { formats: DEFAULT_FORMATS.map(f => ({ ...f, bindings: [...f.bindings] })), active: 0 };
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
    keyColors: activeFormat?.keyColors ?? {},
    recentColors,
    addOrUpdate, remove, reorderBindings, updateAction,
    replaceActiveBindings, replaceFormats, removeOrphanBindings,
    setKeyColor, clearKeyColor, restoreKeyColor, clearAllKeyColors, addRecentColor,
    resetFormats,
    undo, redo,
  };
}
