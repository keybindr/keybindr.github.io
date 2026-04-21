// ── Mouse Profile Definitions ─────────────────────────────────────────────────
// Each profile lists the physical buttons on a specific mouse model.
// id:            generic button ID from the MOUSE_BUTTONS master list
// label:         friendly display name for this mouse's button
// defaultAction: the factory default behavior (pre-fills the action field)
//
// null buttons → Custom mode: shows full MOUSE_BUTTONS master list with generic labels.

const BASE = [
  { id: 'Mouse1',    label: 'Left Button' },
  { id: 'Mouse2',    label: 'Right Button' },
  { id: 'Mouse3',    label: 'Scroll Click' },
  { id: 'Mouse4',    label: 'Back',    defaultAction: 'Back' },
  { id: 'Mouse5',    label: 'Forward', defaultAction: 'Forward' },
  { id: 'WheelUp',   label: 'Scroll Up' },
  { id: 'WheelDown', label: 'Scroll Down' },
];

export const MOUSE_PROFILES = [
  {
    id:      'custom',
    label:   'Custom Mouse',
    buttons: null,
  },

  // ── Razer ──────────────────────────────────────────────────────────────────
  {
    id:    'razer-deathadder-v3',
    label: 'Razer DeathAdder V3',
    buttons: BASE,
  },
  {
    id:    'razer-viper-v3-pro',
    label: 'Razer Viper V3 Pro',
    buttons: [
      ...BASE,
      { id: 'Mouse6', label: 'DPI Up',   defaultAction: 'DPI Up' },
      { id: 'Mouse7', label: 'DPI Down', defaultAction: 'DPI Down' },
    ],
  },
  {
    id:    'razer-basilisk-v3-pro',
    label: 'Razer Basilisk V3 Pro',
    buttons: [
      ...BASE,
      { id: 'Mouse6',  label: 'DPI Up',           defaultAction: 'DPI Up' },
      { id: 'Mouse7',  label: 'DPI Down',          defaultAction: 'DPI Down' },
      { id: 'Mouse8',  label: 'Scroll Mode Cycle', defaultAction: 'Scroll Mode Cycle' },
      { id: 'Mouse9',  label: 'Scroll Tilt Left' },
      { id: 'Mouse10', label: 'Scroll Tilt Right' },
    ],
  },
  {
    id:    'razer-naga-v2-pro',
    label: 'Razer Naga V2 Pro',
    buttons: [
      { id: 'Mouse1',    label: 'Left Button' },
      { id: 'Mouse2',    label: 'Right Button' },
      { id: 'Mouse3',    label: 'Scroll Click' },
      { id: 'Mouse4',    label: 'Back',    defaultAction: 'Back' },
      { id: 'Mouse5',    label: 'Forward', defaultAction: 'Forward' },
      { id: 'Mouse6',    label: 'DPI Up',   defaultAction: 'DPI Up' },
      { id: 'Mouse7',    label: 'DPI Down', defaultAction: 'DPI Down' },
      { id: 'Mouse8',    label: 'Num 1' },
      { id: 'Mouse9',    label: 'Num 2' },
      { id: 'Mouse10',   label: 'Num 3' },
      { id: 'Mouse11',   label: 'Num 4' },
      { id: 'Mouse12',   label: 'Num 5' },
      { id: 'Mouse13',   label: 'Num 6' },
      { id: 'Mouse14',   label: 'Num 7' },
      { id: 'Mouse15',   label: 'Num 8' },
      { id: 'Mouse16',   label: 'Num 9' },
      { id: 'Mouse17',   label: 'Num 10' },
      { id: 'Mouse18',   label: 'Num 11' },
      { id: 'Mouse19',   label: 'Num 12' },
      { id: 'WheelUp',   label: 'Scroll Up' },
      { id: 'WheelDown', label: 'Scroll Down' },
    ],
  },
  {
    id:    'razer-cobra-pro',
    label: 'Razer Cobra Pro',
    buttons: [
      ...BASE,
      { id: 'Mouse6',  label: 'DPI Up',        defaultAction: 'DPI Up' },
      { id: 'Mouse7',  label: 'DPI Down',       defaultAction: 'DPI Down' },
      { id: 'Mouse8',  label: 'Profile Switch', defaultAction: 'Profile Switch' },
      { id: 'Mouse9',  label: 'Bottom Button' },
      { id: 'Mouse10', label: 'Scroll Tilt Left' },
      { id: 'Mouse11', label: 'Scroll Tilt Right' },
    ],
  },
  {
    id:    'razer-orochi-v2',
    label: 'Razer Orochi V2',
    buttons: [
      ...BASE,
      { id: 'Mouse6', label: 'DPI Cycle', defaultAction: 'DPI Cycle' },
    ],
  },

  // ── Logitech ───────────────────────────────────────────────────────────────
  {
    id:    'logitech-g-pro-x-superlight-2',
    label: 'Logitech G Pro X Superlight 2',
    buttons: BASE,
  },
  {
    id:    'logitech-g502x-plus',
    label: 'Logitech G502 X Plus',
    buttons: [
      ...BASE,
      { id: 'Mouse6',  label: 'DPI Up',             defaultAction: 'DPI Up' },
      { id: 'Mouse7',  label: 'DPI Down',            defaultAction: 'DPI Down' },
      { id: 'Mouse8',  label: 'Sniper / DPI Shift',  defaultAction: 'DPI Shift' },
      { id: 'Mouse9',  label: 'G4 Button' },
      { id: 'Mouse10', label: 'Scroll Tilt Left' },
      { id: 'Mouse11', label: 'Scroll Tilt Right' },
    ],
  },
  {
    id:    'logitech-g305',
    label: 'Logitech G305',
    buttons: [
      ...BASE,
      { id: 'Mouse6', label: 'DPI Toggle', defaultAction: 'DPI Toggle' },
    ],
  },
  {
    id:    'logitech-g403-hero',
    label: 'Logitech G403 Hero',
    buttons: [
      ...BASE,
      { id: 'Mouse6', label: 'G5 Button' },
    ],
  },
  {
    id:    'logitech-mx-master-3s',
    label: 'Logitech MX Master 3S',
    buttons: [
      { id: 'Mouse1',    label: 'Left Button' },
      { id: 'Mouse2',    label: 'Right Button' },
      { id: 'Mouse3',    label: 'Scroll Click' },
      { id: 'Mouse4',    label: 'Back',              defaultAction: 'Back' },
      { id: 'Mouse5',    label: 'Forward',            defaultAction: 'Forward' },
      { id: 'Mouse6',    label: 'Gesture Button' },
      { id: 'Mouse7',    label: 'App-Switch Button',  defaultAction: 'App Switch' },
      { id: 'Mouse8',    label: 'Thumbwheel Left' },
      { id: 'Mouse9',    label: 'Thumbwheel Right' },
      { id: 'WheelUp',   label: 'Scroll Up' },
      { id: 'WheelDown', label: 'Scroll Down' },
    ],
  },
  {
    id:    'logitech-g604',
    label: 'Logitech G604',
    buttons: [
      ...BASE,
      { id: 'Mouse6',  label: 'G4 Button' },
      { id: 'Mouse7',  label: 'G5 Button' },
      { id: 'Mouse8',  label: 'G6 Button' },
      { id: 'Mouse9',  label: 'G7 Button' },
      { id: 'Mouse10', label: 'G8 Button' },
      { id: 'Mouse11', label: 'G9 Button' },
      { id: 'Mouse12', label: 'DPI Up',   defaultAction: 'DPI Up' },
      { id: 'Mouse13', label: 'DPI Down', defaultAction: 'DPI Down' },
      { id: 'Mouse14', label: 'Scroll Tilt Left' },
      { id: 'Mouse15', label: 'Scroll Tilt Right' },
    ],
  },

  // ── Others ─────────────────────────────────────────────────────────────────
  {
    id:    'steelseries-rival-5',
    label: 'SteelSeries Rival 5',
    buttons: [
      ...BASE,
      { id: 'Mouse6', label: 'P1 Button' },
      { id: 'Mouse7', label: 'P2 Button' },
      { id: 'Mouse8', label: 'P3 Button' },
      { id: 'Mouse9', label: 'P4 Button' },
    ],
  },
  {
    id:    'corsair-m65-rgb-elite',
    label: 'Corsair M65 RGB Elite',
    buttons: [
      ...BASE,
      { id: 'Mouse6', label: 'DPI Up',   defaultAction: 'DPI Up' },
      { id: 'Mouse7', label: 'DPI Down', defaultAction: 'DPI Down' },
      { id: 'Mouse8', label: 'Sniper',   defaultAction: 'Sniper / DPI Shift' },
    ],
  },
  {
    id:    'corsair-scimitar-elite',
    label: 'Corsair Scimitar Elite',
    buttons: [
      { id: 'Mouse1',    label: 'Left Button' },
      { id: 'Mouse2',    label: 'Right Button' },
      { id: 'Mouse3',    label: 'Scroll Click' },
      { id: 'Mouse4',    label: 'Side Button 1' },
      { id: 'Mouse5',    label: 'Side Button 2' },
      { id: 'Mouse6',    label: 'Side Button 3' },
      { id: 'Mouse7',    label: 'Side Button 4' },
      { id: 'Mouse8',    label: 'Side Button 5' },
      { id: 'Mouse9',    label: 'Side Button 6' },
      { id: 'Mouse10',   label: 'Side Button 7' },
      { id: 'Mouse11',   label: 'Side Button 8' },
      { id: 'Mouse12',   label: 'Side Button 9' },
      { id: 'Mouse13',   label: 'Side Button 10' },
      { id: 'Mouse14',   label: 'Side Button 11' },
      { id: 'Mouse15',   label: 'Side Button 12' },
      { id: 'Mouse16',   label: 'DPI Up',   defaultAction: 'DPI Up' },
      { id: 'Mouse17',   label: 'DPI Down', defaultAction: 'DPI Down' },
      { id: 'Mouse18',   label: 'Sniper',   defaultAction: 'Sniper / DPI Shift' },
      { id: 'WheelUp',   label: 'Scroll Up' },
      { id: 'WheelDown', label: 'Scroll Down' },
    ],
  },
  {
    id:    'asus-rog-gladius-iii',
    label: 'ASUS ROG Gladius III',
    buttons: [
      ...BASE,
      { id: 'Mouse6', label: 'ROG Button' },
      { id: 'Mouse7', label: 'DPI Cycle', defaultAction: 'DPI Cycle' },
    ],
  },
  {
    id:    'hyperx-pulsefire-haste-2',
    label: 'HyperX Pulsefire Haste 2',
    buttons: [
      ...BASE,
      { id: 'Mouse6', label: 'DPI Cycle', defaultAction: 'DPI Cycle' },
    ],
  },
  {
    id:    'glorious-model-o-2',
    label: 'Glorious Model O 2',
    buttons: [
      ...BASE,
      { id: 'Mouse6', label: 'DPI Change', defaultAction: 'DPI Cycle' },
    ],
  },
  {
    id:    'zowie-ec3-cw',
    label: 'Zowie EC3-CW',
    buttons: BASE,
  },
  {
    id:    'endgame-gear-xm2w',
    label: 'Endgame Gear XM2w',
    buttons: BASE,
  },
];

/** Look up a profile by id; falls back to Custom if not found. */
export function getMouseProfile(id) {
  return MOUSE_PROFILES.find(p => p.id === id) ?? MOUSE_PROFILES[0];
}

/** Set of button IDs defined by a profile (null → empty set, meaning all are valid). */
export function getProfileButtonSet(profile) {
  if (!profile?.buttons) return null; // null = custom, all valid
  return new Set(profile.buttons.map(b => b.id));
}
