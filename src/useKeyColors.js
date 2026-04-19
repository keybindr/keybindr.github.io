import { useState } from 'react';

const COLORS_KEY = 'keybindr_key_colors';
const RECENT_KEY = 'keybindr_recent_colors';

function load(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}

export function useKeyColors() {
  const [keyColors, setKeyColorsState] = useState(() => load(COLORS_KEY, {}));
  const [recentColors, setRecentColorsState] = useState(() => load(RECENT_KEY, []));

  function setKeyColor(keyId, color) {
    const next = { ...keyColors, [keyId]: color };
    setKeyColorsState(next);
    localStorage.setItem(COLORS_KEY, JSON.stringify(next));
    setRecentColorsState(prev => {
      const next = [color, ...prev.filter(c => c !== color)].slice(0, 5);
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      return next;
    });
  }

  function clearKeyColor(keyId) {
    if (!(keyId in keyColors)) return;
    const next = { ...keyColors };
    delete next[keyId];
    setKeyColorsState(next);
    localStorage.setItem(COLORS_KEY, JSON.stringify(next));
  }

  // Restore without touching recentColors (used for cancel revert)
  function restoreKeyColor(keyId, color) {
    if (color == null) {
      clearKeyColor(keyId);
    } else {
      const next = { ...keyColors, [keyId]: color };
      setKeyColorsState(next);
      localStorage.setItem(COLORS_KEY, JSON.stringify(next));
    }
  }

  return { keyColors, recentColors, setKeyColor, clearKeyColor, restoreKeyColor };
}
