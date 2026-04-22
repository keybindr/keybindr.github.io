export const KEY_DEFAULT = '#2a2a2a';
export const KEY_BOUND   = '#3d3420';

// Accent colors for physical modifier keys (ShiftLeft/Right, AltLeft/Right, ControlLeft/Right)
export const KEY_ACCENT = {
  ShiftLeft:    '#7b9ee0', ShiftRight:    '#7b9ee0',
  AltLeft:      '#7be09a', AltRight:      '#7be09a',
  ControlLeft:  '#e07b39', ControlRight:  '#e07b39',
};

// Color for each modifier value — used in tags, triangles, and tooltips
export const MOD_COLORS = {
  Shift: '#7b9ee0', ShiftLeft: '#7b9ee0', ShiftRight: '#7b9ee0',
  Alt:   '#7be09a', AltLeft:   '#7be09a', AltRight:   '#7be09a',
  Ctrl:  '#e07b39', CtrlLeft:  '#e07b39', CtrlRight:  '#e07b39',
};

// Maps modifier value → physical key IDs (for color lookups from keyColors)
export const MOD_KEY_IDS = {
  Shift:      ['ShiftLeft', 'ShiftRight'],
  ShiftLeft:  ['ShiftLeft'],   ShiftRight:  ['ShiftRight'],
  Alt:        ['AltLeft', 'AltRight'],
  AltLeft:    ['AltLeft'],     AltRight:    ['AltRight'],
  Ctrl:       ['ControlLeft', 'ControlRight'],
  CtrlLeft:   ['ControlLeft'], CtrlRight:   ['ControlRight'],
};

// Maps modifier value → keyboard corner (for triangle rendering)
export const MOD_CORNER = {
  Shift: 'shift', ShiftLeft: 'shift', ShiftRight: 'shift',
  Alt:   'alt',   AltLeft:   'alt',   AltRight:   'alt',
  Ctrl:  'ctrl',  CtrlLeft:  'ctrl',  CtrlRight:  'ctrl',
};

// Maps split modifier key IDs → unified family name (used for conflict detection)
export const MOD_KEY_FAMILY = {
  ShiftLeft: 'Shift', ShiftRight: 'Shift',
  ControlLeft: 'Ctrl', ControlRight: 'Ctrl',
  AltLeft: 'Alt', AltRight: 'Alt',
};

// Maps modifier value → family name (prevents L+R same-family combos; used in conflict detection)
export const MOD_FAMILY = {
  Shift: 'Shift', ShiftLeft: 'Shift', ShiftRight: 'Shift',
  Alt:   'Alt',   AltLeft:   'Alt',   AltRight:   'Alt',
  Ctrl:  'Ctrl',  CtrlLeft:  'Ctrl',  CtrlRight:  'Ctrl',
};

// Maps physical modifier key IDs to their split-mode display labels
export const SPLIT_LABELS = {
  ShiftLeft:    'LShift', ShiftRight:    'RShift',
  ControlLeft:  'LCtrl',  ControlRight:  'RCtrl',
  AltLeft:      'LAlt',   AltRight:      'RAlt',
};

// Builds the modifier button definitions for modals, respecting split-modifier setting
export function buildModDefs(settings) {
  if (settings.splitModifiers) {
    return [
      { value: 'ShiftLeft',  label: 'LShift', color: MOD_COLORS.ShiftLeft  },
      { value: 'ShiftRight', label: 'RShift', color: MOD_COLORS.ShiftRight },
      { value: 'AltLeft',    label: 'LAlt',   color: MOD_COLORS.AltLeft    },
      { value: 'AltRight',   label: 'RAlt',   color: MOD_COLORS.AltRight   },
      { value: 'CtrlLeft',   label: 'LCtrl',  color: MOD_COLORS.CtrlLeft   },
      { value: 'CtrlRight',  label: 'RCtrl',  color: MOD_COLORS.CtrlRight  },
    ];
  }
  return [
    { value: 'Ctrl',  label: 'Ctrl',  color: MOD_COLORS.Ctrl  },
    { value: 'Shift', label: 'Shift', color: MOD_COLORS.Shift },
    { value: 'Alt',   label: 'Alt',   color: MOD_COLORS.Alt   },
  ];
}

// Blends an accent hex color at 25% over the #1a1a1a background
export function modFill(hex) {
  if (!hex || hex.length < 7) return KEY_DEFAULT;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const bg = 0x1a;
  const h = n => Math.max(0, Math.min(255, n)).toString(16).padStart(2, '0');
  const blend = c => Math.round(bg + (c - bg) * 0.25);
  return `#${h(blend(r))}${h(blend(g))}${h(blend(b))}`;
}
