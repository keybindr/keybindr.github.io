// ── HOTAS Input Constants ─────────────────────────────────────────────────────
// Discrete press/release events only — no axes.
// Naming convention mirrors the user's spec:
//   Joystick_Button1..N
//   Throttle_Button1..N
//   Pedals_Button1..N
//   Joystick_Hat1_Up/Down/Left/Right/UpRight/UpLeft/DownRight/DownLeft  (8-way)
//   Joystick_Hat2_Up/Down/Left/Right                                    (4-way)
//   Joystick_POV1_Up/Down/Left/Right
//   Throttle_Hat1_Up/Down/Left/Right
//   Throttle_POV1_Up/Down/Left/Right
//   Throttle_Switch1_On/Off
//   Throttle_Switch2_Up/Down
//   Throttle_Rotary1_CW/CCW
//   Throttle_Rotary2_CW/CCW

export const DEFAULT_JOYSTICK_BUTTONS  = 32;
export const DEFAULT_THROTTLE_BUTTONS  = 32;
export const DEFAULT_PEDALS_BUTTONS    = 4;

const HAT1_DIRS  = ['Up','Down','Left','Right','UpRight','UpLeft','DownRight','DownLeft'];
const HAT_DIRS   = ['Up','Down','Left','Right'];
const SWITCH1    = ['On','Off'];
const SWITCH2    = ['Up','Down'];
const ROTARY     = ['CW','CCW'];

function makeButtons(prefix, count) {
  return Array.from({ length: count }, (_, i) => `${prefix}_Button${i + 1}`);
}

// ── Label resolver ────────────────────────────────────────────────────────────

/** Human-readable label for any HOTAS input ID. */
export function getHotasLabel(id) {
  if (!id) return id;
  const parts = id.split('_');  // e.g. ['Joystick','Hat1','Up'] or ['Throttle','Button3']
  const device  = parts[0];
  const type    = parts[1] ?? '';
  const variant = parts[2] ?? '';

  if (type.startsWith('Button')) {
    const num = type.replace('Button', '');
    return `${device} Btn ${num}`;
  }
  if (type.startsWith('Hat') || type.startsWith('POV')) {
    return `${device} ${type} ${variant}`;
  }
  if (type.startsWith('Switch')) {
    return `${device} ${type} ${variant}`;
  }
  if (type.startsWith('Rotary')) {
    return `${device} ${type} ${variant}`;
  }
  return id;
}

// ── Group builders ────────────────────────────────────────────────────────────

function buildJoystickInputs(buttonCount) {
  const btns = makeButtons('Joystick', buttonCount);
  const hat1 = HAT1_DIRS.map(d => `Joystick_Hat1_${d}`);
  const hat2 = HAT_DIRS.map(d  => `Joystick_Hat2_${d}`);
  const pov1 = HAT_DIRS.map(d  => `Joystick_POV1_${d}`);
  return [...btns, ...hat1, ...hat2, ...pov1];
}

function buildThrottleInputs(buttonCount) {
  const btns     = makeButtons('Throttle', buttonCount);
  const hat1     = HAT_DIRS.map(d => `Throttle_Hat1_${d}`);
  const pov1     = HAT_DIRS.map(d => `Throttle_POV1_${d}`);
  const switch1  = SWITCH1.map(s  => `Throttle_Switch1_${s}`);
  const switch2  = SWITCH2.map(s  => `Throttle_Switch2_${s}`);
  const rotary1  = ROTARY.map(d   => `Throttle_Rotary1_${d}`);
  const rotary2  = ROTARY.map(d   => `Throttle_Rotary2_${d}`);
  return [...btns, ...hat1, ...pov1, ...switch1, ...switch2, ...rotary1, ...rotary2];
}

function buildPedalsInputs(buttonCount) {
  return makeButtons('Pedals', buttonCount);
}

/**
 * Build grouped option lists for the HOTAS modal dropdown.
 * Returns [{ label, inputs: [id, ...] }, ...]
 */
export function buildHotasGroups(
  joystickButtonCount = DEFAULT_JOYSTICK_BUTTONS,
  throttleButtonCount = DEFAULT_THROTTLE_BUTTONS,
  pedalsButtonCount   = DEFAULT_PEDALS_BUTTONS,
) {
  return [
    { label: 'Joystick', inputs: buildJoystickInputs(joystickButtonCount) },
    { label: 'Throttle', inputs: buildThrottleInputs(throttleButtonCount) },
    { label: 'Pedals',   inputs: buildPedalsInputs(pedalsButtonCount) },
  ];
}

// ── HOTAS modifier colors ─────────────────────────────────────────────────────
// Four distinct colors for up to 4 numbered HOTAS modifier buttons.
// Chosen to be visually separate from keyboard-modifier colors
// (Shift=#7b9ee0 blue, Alt=#7be09a green, Ctrl=#e07b39 orange-red).
export const HOTAS_MOD_COLORS = [
  '#c47a15',  // amber-gold  — Modifier 1
  '#8b5cf6',  // violet      — Modifier 2
  '#14b8a6',  // teal        — Modifier 3
  '#f43f5e',  // rose        — Modifier 4
];

/**
 * Given an input ID and the full hotasBindings array, return the 1-based index
 * and color for that modifier button.  Returns null if the input is not a modifier.
 */
export function getHotasModInfo(inputId, hotasBindings = []) {
  const modifiers = hotasBindings.filter(b => b.isHotasMod);
  const idx = modifiers.findIndex(b => b.input === inputId);
  if (idx === -1) return null;
  return {
    index: idx + 1,
    color: HOTAS_MOD_COLORS[idx % HOTAS_MOD_COLORS.length],
    label: `MOD ${idx + 1}`,
  };
}

/**
 * Unique ID for a HOTAS binding — input + keyboard modifiers + HOTAS modifier button.
 * Mirrors the keyboard/mouse bindingId() pattern.
 */
export function hotasBindingId(input, modifiers = [], hotasMod = '') {
  const mods = modifiers.slice().sort();
  return [input, ...mods, ...(hotasMod ? [`[${hotasMod}]`] : [])].join('+');
}

/**
 * Flat sorted list of all HOTAS input IDs given button counts.
 * Useful for validation / export.
 */
export function getAllHotasInputs(
  joystickButtonCount = DEFAULT_JOYSTICK_BUTTONS,
  throttleButtonCount = DEFAULT_THROTTLE_BUTTONS,
  pedalsButtonCount   = DEFAULT_PEDALS_BUTTONS,
) {
  return buildHotasGroups(joystickButtonCount, throttleButtonCount, pedalsButtonCount)
    .flatMap(g => g.inputs);
}
