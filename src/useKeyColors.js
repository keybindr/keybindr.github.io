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

  return { keyColors, recentColors, setKeyColor, clearKeyColor, restoreKeyColor };
}
