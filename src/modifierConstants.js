export const KEY_DEFAULT = '#2a2a2a';
export const KEY_BOUND   = '#3d3420';

// Sentinel stored in keyColors to mean "explicitly no color" — distinct from
// an absent entry, which falls back to the generic KEY_BOUND/accent styling.
// Lets the "no color" swatch make a bound key render exactly like an unbound
// one (fill, border, and text) instead of the default bound treatment.
export const KEY_COLOR_NONE = 'none';

// Blends a hex color toward the #1a1a1a board background by `ratio` (0 =
// background, 1 = the pure color). Shared by modifier fills and the
// key-color palette so both can be tuned with the same knob.
function blendToBg(hex, ratio) {
  if (!hex || hex.length < 7) return KEY_DEFAULT;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const bg = 0x1a;
  const h = n => Math.max(0, Math.min(255, n)).toString(16).padStart(2, '0');
  const c = n => Math.round(bg + (n - bg) * ratio);
  return `#${h(c(r))}${h(c(g))}${h(c(b))}`;
}

// Accent colors for physical modifier keys (ShiftLeft/Right, AltLeft/Right,
// ControlLeft/Right) when the two sides are shown as one unified logical key
// (settings.splitModifiers off) — both physical keys share a single color.
export const KEY_ACCENT = {
  ShiftLeft:    '#7b9ee0', ShiftRight:    '#7b9ee0',
  AltLeft:      '#7be09a', AltRight:      '#7be09a',
  ControlLeft:  '#e07b39', ControlRight:  '#e07b39',
};

// Accent colors for the same physical keys when split mode is on and each
// side is bound independently — same hue per pair, left brighter/lighter
// and right deeper/richer so the two sides read as visually distinct.
export const KEY_ACCENT_SPLIT = {
  ShiftLeft:    '#99b6eb', ShiftRight:    '#5681d2',
  AltLeft:      '#99ebb1', AltRight:      '#56d27b',
  ControlLeft:  '#ea9257', ControlRight:  '#c96826',
};

// Resolves the accent color for a physical modifier key, honoring the
// unified vs. split display mode.
export function resolveAccent(keyId, splitModifiers) {
  if (splitModifiers) return KEY_ACCENT_SPLIT[keyId] || null;
  return KEY_ACCENT[keyId] || null;
}

// Color for each modifier value — used in tags, triangles, and tooltips.
// Unified values (Shift/Alt/Ctrl) mirror KEY_ACCENT; split values
// (ShiftLeft/ShiftRight/AltLeft/AltRight/CtrlLeft/CtrlRight) mirror
// KEY_ACCENT_SPLIT so bindings made in split mode pick up the distinct
// left/right colors automatically.
export const MOD_COLORS = {
  Shift: KEY_ACCENT.ShiftLeft, ShiftLeft: KEY_ACCENT_SPLIT.ShiftLeft, ShiftRight: KEY_ACCENT_SPLIT.ShiftRight,
  Alt:   KEY_ACCENT.AltLeft,   AltLeft:   KEY_ACCENT_SPLIT.AltLeft,   AltRight:   KEY_ACCENT_SPLIT.AltRight,
  Ctrl:  KEY_ACCENT.ControlLeft, CtrlLeft: KEY_ACCENT_SPLIT.ControlLeft, CtrlRight: KEY_ACCENT_SPLIT.ControlRight,
};

// Display label for each modifier value — used anywhere a binding's
// modifier is rendered as text (tags, tooltips). Split values render as
// LShift/RShift/etc. rather than their raw ShiftLeft/ShiftRight value.
export const MOD_LABELS = {
  Shift: 'Shift', Alt: 'Alt', Ctrl: 'Ctrl',
  ShiftLeft: 'LShift', ShiftRight: 'RShift',
  AltLeft:   'LAlt',   AltRight:   'RAlt',
  CtrlLeft:  'LCtrl',  CtrlRight:  'RCtrl',
};

// Pure, unblended modifier accent colors as they actually appear on the
// keyboard layout (corner triangles / KEY_ACCENT) — offered as a second row
// of key-color swatches so a key can be colored to match a modifier exactly.
export const KEY_TRUE_COLORS = [
  { id: 'shift-true', label: 'Shift Blue', hex: MOD_COLORS.Shift },
  { id: 'ctrl-true',  label: 'Ctrl Red',   hex: MOD_COLORS.Ctrl  },
  { id: 'alt-true',   label: 'Alt Green',  hex: MOD_COLORS.Alt   },
];

// Split-mode counterpart: each side's own distinct default color, offered
// when settings.splitModifiers is on so left/right can be picked separately.
export const KEY_TRUE_COLORS_SPLIT = [
  { id: 'shift-left-true',  label: 'LShift Blue', hex: KEY_ACCENT_SPLIT.ShiftLeft    },
  { id: 'shift-right-true', label: 'RShift Blue', hex: KEY_ACCENT_SPLIT.ShiftRight   },
  { id: 'ctrl-left-true',   label: 'LCtrl Red',   hex: KEY_ACCENT_SPLIT.ControlLeft  },
  { id: 'ctrl-right-true',  label: 'RCtrl Red',   hex: KEY_ACCENT_SPLIT.ControlRight },
  { id: 'alt-left-true',    label: 'LAlt Green',  hex: KEY_ACCENT_SPLIT.AltLeft      },
  { id: 'alt-right-true',   label: 'RAlt Green',  hex: KEY_ACCENT_SPLIT.AltRight     },
];

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

// Per-accent blend ratio toward the #1a1a1a background — muted enough to sit
// alongside the dark key-color palette, but saturated enough to still read
// as the same hue as the full-strength legend/corner color. Orange runs a
// bit hotter than blue/green since it reads as "brownish" at the same ratio.
const MOD_FILL_RATIO = {
  [MOD_COLORS.Shift]: 0.58,
  [MOD_COLORS.Alt]:   0.58,
  [MOD_COLORS.Ctrl]:  0.7,
  [KEY_ACCENT_SPLIT.ShiftLeft]:   0.58,
  [KEY_ACCENT_SPLIT.ShiftRight]:  0.58,
  [KEY_ACCENT_SPLIT.AltLeft]:     0.58,
  [KEY_ACCENT_SPLIT.AltRight]:    0.58,
  [KEY_ACCENT_SPLIT.ControlLeft]: 0.7,
  [KEY_ACCENT_SPLIT.ControlRight]: 0.7,
};

export function modFill(hex) {
  return blendToBg(hex, MOD_FILL_RATIO[hex] ?? 0.5);
}

// Pure/vivid base hues for the key-color palette — same idea as KEY_ACCENT
// for modifiers. Ids are internal (and referenced by gamePresets.js) and
// stay put on the ROYGBIV wheel; labels below describe what each one
// actually renders as, since every band is now tuned to approximate one of
// the original named colors rather than its literal rainbow hue.
// "yellow" and "green" intentionally swap their pure hue/ratio pair (see
// PALETTE_RATIO_OVERRIDES) so `movement` can move onto the "green" id while
// keeping the same olive color it always had, freeing "yellow" up for `ui`.
const PALETTE_BASE = [
  { id: 'red',    label: 'Wine',   hex: '#da6262' },
  { id: 'orange', label: 'Brass',  hex: '#daa262' },
  { id: 'yellow', label: 'Forest', hex: '#62da80' },
  { id: 'green',  label: 'Olive',  hex: '#dad062' },
  { id: 'blue',   label: 'Indigo', hex: '#629eda' },
  { id: 'indigo', label: 'Slate',  hex: '#8062da' },
  { id: 'violet', label: 'Plum',   hex: '#c662da' },
];

// Default blend ratio for the palette; override per-id here if a specific
// color needs to run hotter/cooler than the rest (mirrors MOD_FILL_RATIO).
// Each override is tuned to land close to that color's pre-ROYGBIV
// equivalent (e.g. orange -> the old "brass"), rather than the flat 0.58.
const PALETTE_FILL_RATIO = 0.58;
const PALETTE_RATIO_OVERRIDES = {
  red:    0.31, // -> old "wine"
  orange: 0.3,  // -> old "brass"
  yellow: 0.28, // -> old "teal" (now used by ui)
  green:  0.2,  // -> old "olive" (now used by movement)
  blue:   0.29, // -> old "indigo"
  indigo: 0.26, // -> old "slate"
  violet: 0.28, // -> old "plum"
};

// Curated key-color palette — mapped onto the game-preset categories (see
// gamePresets.js), kept here as the single source of truth so both stay in
// sync.
export const KEY_PALETTE = PALETTE_BASE.map(c => ({
  ...c,
  hex: blendToBg(c.hex, PALETTE_RATIO_OVERRIDES[c.id] ?? PALETTE_FILL_RATIO),
}));
