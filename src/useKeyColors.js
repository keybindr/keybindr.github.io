import { useState } from 'react';

const COLORS_KEY = 'keybindr_key_colors';
const RECENT_KEY = 'keybindr_recent_colors';

const DEFAULT_KEY_COLORS = {
  KeyW: '#1a4d2e',
  KeyA: '#1a4d2e',
  KeyS: '#1a4d2e',
  KeyD: '#1a4d2e',
};

function load(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}

function loadKeyColors() {
  const saved = load(COLORS_KEY, null);
  if (!saved) return { ...DEFAULT_KEY_COLORS };
  return { ...DEFAULT_KEY_COLORS, ...saved };
}

export function useKeyColors() {
  const [keyColors, setKeyColorsState] = useState(loadKeyColors);
  const [recentColors, setRecentColorsState] = useState(() => load(RECENT_KEY, []));

  function setKeyColor(keyId, color) {
    setKeyColorsState(prev => {
      const next = { ...prev, [keyId]: color };
      localStorage.setItem(COLORS_KEY, JSON.stringify(next));
      return next;
    });
    setRecentColorsState(prev => {
      const next = [color, ...prev.filter(c => c !== color)].slice(0, 5);
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      return next;
    });
  }

  function clearKeyColor(keyId) {
    setKeyColorsState(prev => {
      if (!(keyId in prev)) return prev;
      const next = { ...prev };
      delete next[keyId];
      localStorage.setItem(COLORS_KEY, JSON.stringify(next));
      return next;
    });
  }

  // Restore to original color without touching recentColors (cancel revert)
  function restoreKeyColor(keyId, color) {
    setKeyColorsState(prev => {
      let next;
      if (color == null) {
        if (!(keyId in prev)) return prev;
        next = { ...prev };
        delete next[keyId];
      } else {
        next = { ...prev, [keyId]: color };
      }
      localStorage.setItem(COLORS_KEY, JSON.stringify(next));
      return next;
    });
  }

  function clearAllKeyColors() {
    setKeyColorsState(() => {
      localStorage.setItem(COLORS_KEY, JSON.stringify(DEFAULT_KEY_COLORS));
      return { ...DEFAULT_KEY_COLORS };
    });
  }

  return { keyColors, recentColors, setKeyColor, clearKeyColor, restoreKeyColor, clearAllKeyColors };
}
