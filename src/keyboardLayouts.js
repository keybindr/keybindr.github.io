const U = 44;
const G = 4;
const FROW_GAP = 20;

// Standard key helper (layouts with F-row: rows 0-5, row 0 = function row)
function key(id, label, col, row, w = 1, h = 1, altLabel) {
  return {
    id, label, altLabel,
    x: col * U + G,
    y: row * U + G + (row >= 1 ? FROW_GAP : 0),
    w: w * U - G,
    h: h * U - G,
  };
}

// Compact key helper (layouts without F-row: row 0 = number row, no FROW_GAP)
function keyC(id, label, col, row, w = 1, h = 1, altLabel) {
  return {
    id, label, altLabel,
    x: col * U + G,
    y: row * U + G,
    w: w * U - G,
    h: h * U - G,
  };
}

// ── ANSI main block (rows 0–5, no nav/numpad) ─────────────────────────────────
const ANSI_MAIN = [
  // Row 0: Function keys
  key('Escape', 'Esc', 0, 0),
  key('F1', 'F1', 2, 0), key('F2', 'F2', 3, 0), key('F3', 'F3', 4, 0), key('F4', 'F4', 5, 0),
  key('F5', 'F5', 6.5, 0), key('F6', 'F6', 7.5, 0), key('F7', 'F7', 8.5, 0), key('F8', 'F8', 9.5, 0),
  key('F9', 'F9', 11, 0), key('F10', 'F10', 12, 0), key('F11', 'F11', 13, 0), key('F12', 'F12', 14, 0),

  // Row 1: Number row
  key('Backquote', '`', 0, 1, 1, 1, '~'),
  key('Digit1', '1', 1, 1, 1, 1, '!'), key('Digit2', '2', 2, 1, 1, 1, '@'),
  key('Digit3', '3', 3, 1, 1, 1, '#'), key('Digit4', '4', 4, 1, 1, 1, '$'),
  key('Digit5', '5', 5, 1, 1, 1, '%'), key('Digit6', '6', 6, 1, 1, 1, '^'),
  key('Digit7', '7', 7, 1, 1, 1, '&'), key('Digit8', '8', 8, 1, 1, 1, '*'),
  key('Digit9', '9', 9, 1, 1, 1, '('), key('Digit0', '0', 10, 1, 1, 1, ')'),
  key('Minus', '-', 11, 1, 1, 1, '_'), key('Equal', '=', 12, 1, 1, 1, '+'),
  key('Backspace', '⌫', 13, 1, 2),

  // Row 2: QWERTY
  key('Tab', 'Tab', 0, 2, 1.5),
  key('KeyQ', 'Q', 1.5, 2), key('KeyW', 'W', 2.5, 2), key('KeyE', 'E', 3.5, 2),
  key('KeyR', 'R', 4.5, 2), key('KeyT', 'T', 5.5, 2), key('KeyY', 'Y', 6.5, 2),
  key('KeyU', 'U', 7.5, 2), key('KeyI', 'I', 8.5, 2), key('KeyO', 'O', 9.5, 2),
  key('KeyP', 'P', 10.5, 2),
  key('BracketLeft', '[', 11.5, 2, 1, 1, '{'), key('BracketRight', ']', 12.5, 2, 1, 1, '}'),
  key('Backslash', '\\', 13.5, 2, 1.5, 1, '|'),

  // Row 3: ASDF
  key('CapsLock', 'Caps', 0, 3, 1.75),
  key('KeyA', 'A', 1.75, 3), key('KeyS', 'S', 2.75, 3), key('KeyD', 'D', 3.75, 3),
  key('KeyF', 'F', 4.75, 3), key('KeyG', 'G', 5.75, 3), key('KeyH', 'H', 6.75, 3),
  key('KeyJ', 'J', 7.75, 3), key('KeyK', 'K', 8.75, 3), key('KeyL', 'L', 9.75, 3),
  key('Semicolon', ';', 10.75, 3, 1, 1, ':'), key('Quote', "'", 11.75, 3, 1, 1, '"'),
  key('Enter', 'Enter', 12.75, 3, 2.25),

  // Row 4: ZXCV
  key('ShiftLeft', 'Shift', 0, 4, 2.25),
  key('KeyZ', 'Z', 2.25, 4), key('KeyX', 'X', 3.25, 4), key('KeyC', 'C', 4.25, 4),
  key('KeyV', 'V', 5.25, 4), key('KeyB', 'B', 6.25, 4), key('KeyN', 'N', 7.25, 4),
  key('KeyM', 'M', 8.25, 4), key('Comma', ',', 9.25, 4, 1, 1, '<'),
  key('Period', '.', 10.25, 4, 1, 1, '>'), key('Slash', '/', 11.25, 4, 1, 1, '?'),
  key('ShiftRight', 'Shift', 12.25, 4, 2.75),

  // Row 5: Bottom
  key('ControlLeft', 'Ctrl', 0, 5, 1.25), key('MetaLeft', '⊞', 1.25, 5, 1.25),
  key('AltLeft', 'Alt', 2.5, 5, 1.25), key('Space', 'Space', 3.75, 5, 6.25),
  key('AltRight', 'Alt', 10, 5, 1.25), key('MetaRight', '⊞', 11.25, 5, 1.25),
  key('ContextMenu', '☰', 12.5, 5, 1.25), key('ControlRight', 'Ctrl', 13.75, 5, 1.25),
];

// ── ANSI nav cluster ──────────────────────────────────────────────────────────
const ANSI_NAV = [
  key('PrintScreen', 'PrtSc', 16, 0), key('ScrollLock', 'Scrl', 17, 0), key('Pause', 'Pause', 18, 0),
  key('Insert', 'Ins', 16, 1), key('Home', 'Home', 17, 1), key('PageUp', 'PgUp', 18, 1),
  key('Delete', 'Del', 16, 2), key('End', 'End', 17, 2), key('PageDown', 'PgDn', 18, 2),
  key('ArrowUp', '↑', 17, 4),
  key('ArrowLeft', '←', 16, 5), key('ArrowDown', '↓', 17, 5), key('ArrowRight', '→', 18, 5),
];

// ── Numpad ────────────────────────────────────────────────────────────────────
const NUMPAD = [
  key('NumLock', 'NumLk', 19.5, 1), key('NumpadDivide', '/', 20.5, 1),
  key('NumpadMultiply', '*', 21.5, 1), key('NumpadSubtract', '-', 22.5, 1),
  key('Numpad7', '7', 19.5, 2), key('Numpad8', '8', 20.5, 2),
  key('Numpad9', '9', 21.5, 2), key('NumpadAdd', '+', 22.5, 2, 1, 2),
  key('Numpad4', '4', 19.5, 3), key('Numpad5', '5', 20.5, 3), key('Numpad6', '6', 21.5, 3),
  key('Numpad1', '1', 19.5, 4), key('Numpad2', '2', 20.5, 4), key('Numpad3', '3', 21.5, 4),
  key('NumpadEnter', 'Enter', 22.5, 4, 1, 2),
  key('Numpad0', '0', 19.5, 5, 2), key('NumpadDecimal', '.', 21.5, 5),
];

// ── ISO modifications ─────────────────────────────────────────────────────────
// ISO Enter: L-shaped path spanning row 2 and row 3
// Top section: col 13.5–15, row 2. Bottom section: col 13.75–15, row 3.
const ISO_ENTER = {
  id: 'Enter', label: 'Enter',
  x: 598, y: 112, w: 62, h: 84,
  path: 'M 598,112 L 660,112 L 660,196 L 609,196 L 609,152 L 598,152 Z',
  corners: { tr: [660, 112], br: [660, 196], bl: [609, 196] },
  textX: 634, textY: 174,
};

function applyISO(keys) {
  return keys
    .filter(k => k.id !== 'Backslash' && k.id !== 'Enter' && k.id !== 'ShiftLeft')
    .concat([
      ISO_ENTER,
      key('IntlHash', '#', 12.75, 3, 1, 1, '~'),
      { ...key('ShiftLeft', 'Shift', 0, 4, 1.25) },
      key('IntlBackslash', '\\', 1.25, 4, 1, 1, '|'),
    ]);
}

// ── 75% layout ────────────────────────────────────────────────────────────────
// Full F-row + alpha block + right nav column (Del/PgUp/PgDn) + arrows in matrix
const LAYOUT_75_KEYS = [
  // F-row (no PrtSc/ScrlLk/Pause)
  key('Escape', 'Esc', 0, 0),
  key('F1', 'F1', 2, 0), key('F2', 'F2', 3, 0), key('F3', 'F3', 4, 0), key('F4', 'F4', 5, 0),
  key('F5', 'F5', 6.5, 0), key('F6', 'F6', 7.5, 0), key('F7', 'F7', 8.5, 0), key('F8', 'F8', 9.5, 0),
  key('F9', 'F9', 11, 0), key('F10', 'F10', 12, 0), key('F11', 'F11', 13, 0), key('F12', 'F12', 14, 0),

  // Number row
  key('Backquote', '`', 0, 1, 1, 1, '~'),
  key('Digit1', '1', 1, 1, 1, 1, '!'), key('Digit2', '2', 2, 1, 1, 1, '@'),
  key('Digit3', '3', 3, 1, 1, 1, '#'), key('Digit4', '4', 4, 1, 1, 1, '$'),
  key('Digit5', '5', 5, 1, 1, 1, '%'), key('Digit6', '6', 6, 1, 1, 1, '^'),
  key('Digit7', '7', 7, 1, 1, 1, '&'), key('Digit8', '8', 8, 1, 1, 1, '*'),
  key('Digit9', '9', 9, 1, 1, 1, '('), key('Digit0', '0', 10, 1, 1, 1, ')'),
  key('Minus', '-', 11, 1, 1, 1, '_'), key('Equal', '=', 12, 1, 1, 1, '+'),
  key('Backspace', '⌫', 13, 1, 2),

  // QWERTY row
  key('Tab', 'Tab', 0, 2, 1.5),
  key('KeyQ', 'Q', 1.5, 2), key('KeyW', 'W', 2.5, 2), key('KeyE', 'E', 3.5, 2),
  key('KeyR', 'R', 4.5, 2), key('KeyT', 'T', 5.5, 2), key('KeyY', 'Y', 6.5, 2),
  key('KeyU', 'U', 7.5, 2), key('KeyI', 'I', 8.5, 2), key('KeyO', 'O', 9.5, 2),
  key('KeyP', 'P', 10.5, 2),
  key('BracketLeft', '[', 11.5, 2, 1, 1, '{'), key('BracketRight', ']', 12.5, 2, 1, 1, '}'),
  key('Backslash', '\\', 13.5, 2, 1.5, 1, '|'),

  // ASDF row
  key('CapsLock', 'Caps', 0, 3, 1.75),
  key('KeyA', 'A', 1.75, 3), key('KeyS', 'S', 2.75, 3), key('KeyD', 'D', 3.75, 3),
  key('KeyF', 'F', 4.75, 3), key('KeyG', 'G', 5.75, 3), key('KeyH', 'H', 6.75, 3),
  key('KeyJ', 'J', 7.75, 3), key('KeyK', 'K', 8.75, 3), key('KeyL', 'L', 9.75, 3),
  key('Semicolon', ';', 10.75, 3, 1, 1, ':'), key('Quote', "'", 11.75, 3, 1, 1, '"'),
  key('Enter', 'Enter', 12.75, 3, 2.25),

  // ZXCV row — RShift 1.75u + ArrowUp to fill to 15u
  key('ShiftLeft', 'Shift', 0, 4, 2.25),
  key('KeyZ', 'Z', 2.25, 4), key('KeyX', 'X', 3.25, 4), key('KeyC', 'C', 4.25, 4),
  key('KeyV', 'V', 5.25, 4), key('KeyB', 'B', 6.25, 4), key('KeyN', 'N', 7.25, 4),
  key('KeyM', 'M', 8.25, 4), key('Comma', ',', 9.25, 4, 1, 1, '<'),
  key('Period', '.', 10.25, 4, 1, 1, '>'), key('Slash', '/', 11.25, 4, 1, 1, '?'),
  key('ShiftRight', 'Shift', 12.25, 4, 1.75),
  key('ArrowUp', '↑', 14, 4),

  // Bottom row — arrows replace right modifiers
  key('ControlLeft', 'Ctrl', 0, 5, 1.25), key('MetaLeft', '⊞', 1.25, 5, 1.25),
  key('AltLeft', 'Alt', 2.5, 5, 1.25), key('Space', 'Space', 3.75, 5, 6.25),
  key('AltRight', 'Alt', 10, 5, 1), key('ControlRight', 'Ctrl', 11, 5, 1),
  key('ArrowLeft', '←', 12, 5), key('ArrowDown', '↓', 13, 5), key('ArrowRight', '→', 14, 5),

  // Right nav column (col 15, no gap)
  key('Delete', 'Del', 15, 1),
  key('PageUp', 'PgUp', 15, 2),
  key('PageDown', 'PgDn', 15, 3),
  key('End', 'End', 15, 4),
];

// ── 65% layout ────────────────────────────────────────────────────────────────
// No F-row; number row gets 1u Backspace + 1u Del; arrows in matrix
const LAYOUT_65_KEYS = [
  // Row 0: number row — 1u Backspace + Del
  keyC('Backquote', '`', 0, 0, 1, 1, '~'),
  keyC('Digit1', '1', 1, 0, 1, 1, '!'), keyC('Digit2', '2', 2, 0, 1, 1, '@'),
  keyC('Digit3', '3', 3, 0, 1, 1, '#'), keyC('Digit4', '4', 4, 0, 1, 1, '$'),
  keyC('Digit5', '5', 5, 0, 1, 1, '%'), keyC('Digit6', '6', 6, 0, 1, 1, '^'),
  keyC('Digit7', '7', 7, 0, 1, 1, '&'), keyC('Digit8', '8', 8, 0, 1, 1, '*'),
  keyC('Digit9', '9', 9, 0, 1, 1, '('), keyC('Digit0', '0', 10, 0, 1, 1, ')'),
  keyC('Minus', '-', 11, 0, 1, 1, '_'), keyC('Equal', '=', 12, 0, 1, 1, '+'),
  keyC('Backspace', '⌫', 13, 0),
  keyC('Delete', 'Del', 14, 0),

  // Row 1: QWERTY
  keyC('Tab', 'Tab', 0, 1, 1.5),
  keyC('KeyQ', 'Q', 1.5, 1), keyC('KeyW', 'W', 2.5, 1), keyC('KeyE', 'E', 3.5, 1),
  keyC('KeyR', 'R', 4.5, 1), keyC('KeyT', 'T', 5.5, 1), keyC('KeyY', 'Y', 6.5, 1),
  keyC('KeyU', 'U', 7.5, 1), keyC('KeyI', 'I', 8.5, 1), keyC('KeyO', 'O', 9.5, 1),
  keyC('KeyP', 'P', 10.5, 1),
  keyC('BracketLeft', '[', 11.5, 1, 1, 1, '{'), keyC('BracketRight', ']', 12.5, 1, 1, 1, '}'),
  keyC('Backslash', '\\', 13.5, 1, 1.5, 1, '|'),

  // Row 2: ASDF
  keyC('CapsLock', 'Caps', 0, 2, 1.75),
  keyC('KeyA', 'A', 1.75, 2), keyC('KeyS', 'S', 2.75, 2), keyC('KeyD', 'D', 3.75, 2),
  keyC('KeyF', 'F', 4.75, 2), keyC('KeyG', 'G', 5.75, 2), keyC('KeyH', 'H', 6.75, 2),
  keyC('KeyJ', 'J', 7.75, 2), keyC('KeyK', 'K', 8.75, 2), keyC('KeyL', 'L', 9.75, 2),
  keyC('Semicolon', ';', 10.75, 2, 1, 1, ':'), keyC('Quote', "'", 11.75, 2, 1, 1, '"'),
  keyC('Enter', 'Enter', 12.75, 2, 2.25),

  // Row 3: ZXCV — 1.75u RShift + ArrowUp
  keyC('ShiftLeft', 'Shift', 0, 3, 2.25),
  keyC('KeyZ', 'Z', 2.25, 3), keyC('KeyX', 'X', 3.25, 3), keyC('KeyC', 'C', 4.25, 3),
  keyC('KeyV', 'V', 5.25, 3), keyC('KeyB', 'B', 6.25, 3), keyC('KeyN', 'N', 7.25, 3),
  keyC('KeyM', 'M', 8.25, 3), keyC('Comma', ',', 9.25, 3, 1, 1, '<'),
  keyC('Period', '.', 10.25, 3, 1, 1, '>'), keyC('Slash', '/', 11.25, 3, 1, 1, '?'),
  keyC('ShiftRight', 'Shift', 12.25, 3, 1.75),
  keyC('ArrowUp', '↑', 14, 3),

  // Row 4: bottom — arrows at right
  keyC('ControlLeft', 'Ctrl', 0, 4, 1.25), keyC('MetaLeft', '⊞', 1.25, 4, 1.25),
  keyC('AltLeft', 'Alt', 2.5, 4, 1.25), keyC('Space', 'Space', 3.75, 4, 6.25),
  keyC('AltRight', 'Alt', 10, 4, 1), keyC('ControlRight', 'Ctrl', 11, 4, 1),
  keyC('ArrowLeft', '←', 12, 4), keyC('ArrowDown', '↓', 13, 4), keyC('ArrowRight', '→', 14, 4),
];

// ── 60% layout ────────────────────────────────────────────────────────────────
// No F-row, no nav, standard 2u Backspace, standard bottom row
const LAYOUT_60_KEYS = [
  // Row 0: number row
  keyC('Backquote', '`', 0, 0, 1, 1, '~'),
  keyC('Digit1', '1', 1, 0, 1, 1, '!'), keyC('Digit2', '2', 2, 0, 1, 1, '@'),
  keyC('Digit3', '3', 3, 0, 1, 1, '#'), keyC('Digit4', '4', 4, 0, 1, 1, '$'),
  keyC('Digit5', '5', 5, 0, 1, 1, '%'), keyC('Digit6', '6', 6, 0, 1, 1, '^'),
  keyC('Digit7', '7', 7, 0, 1, 1, '&'), keyC('Digit8', '8', 8, 0, 1, 1, '*'),
  keyC('Digit9', '9', 9, 0, 1, 1, '('), keyC('Digit0', '0', 10, 0, 1, 1, ')'),
  keyC('Minus', '-', 11, 0, 1, 1, '_'), keyC('Equal', '=', 12, 0, 1, 1, '+'),
  keyC('Backspace', '⌫', 13, 0, 2),

  // Row 1: QWERTY
  keyC('Tab', 'Tab', 0, 1, 1.5),
  keyC('KeyQ', 'Q', 1.5, 1), keyC('KeyW', 'W', 2.5, 1), keyC('KeyE', 'E', 3.5, 1),
  keyC('KeyR', 'R', 4.5, 1), keyC('KeyT', 'T', 5.5, 1), keyC('KeyY', 'Y', 6.5, 1),
  keyC('KeyU', 'U', 7.5, 1), keyC('KeyI', 'I', 8.5, 1), keyC('KeyO', 'O', 9.5, 1),
  keyC('KeyP', 'P', 10.5, 1),
  keyC('BracketLeft', '[', 11.5, 1, 1, 1, '{'), keyC('BracketRight', ']', 12.5, 1, 1, 1, '}'),
  keyC('Backslash', '\\', 13.5, 1, 1.5, 1, '|'),

  // Row 2: ASDF
  keyC('CapsLock', 'Caps', 0, 2, 1.75),
  keyC('KeyA', 'A', 1.75, 2), keyC('KeyS', 'S', 2.75, 2), keyC('KeyD', 'D', 3.75, 2),
  keyC('KeyF', 'F', 4.75, 2), keyC('KeyG', 'G', 5.75, 2), keyC('KeyH', 'H', 6.75, 2),
  keyC('KeyJ', 'J', 7.75, 2), keyC('KeyK', 'K', 8.75, 2), keyC('KeyL', 'L', 9.75, 2),
  keyC('Semicolon', ';', 10.75, 2, 1, 1, ':'), keyC('Quote', "'", 11.75, 2, 1, 1, '"'),
  keyC('Enter', 'Enter', 12.75, 2, 2.25),

  // Row 3: ZXCV — standard 2.75u RShift, no arrows
  keyC('ShiftLeft', 'Shift', 0, 3, 2.25),
  keyC('KeyZ', 'Z', 2.25, 3), keyC('KeyX', 'X', 3.25, 3), keyC('KeyC', 'C', 4.25, 3),
  keyC('KeyV', 'V', 5.25, 3), keyC('KeyB', 'B', 6.25, 3), keyC('KeyN', 'N', 7.25, 3),
  keyC('KeyM', 'M', 8.25, 3), keyC('Comma', ',', 9.25, 3, 1, 1, '<'),
  keyC('Period', '.', 10.25, 3, 1, 1, '>'), keyC('Slash', '/', 11.25, 3, 1, 1, '?'),
  keyC('ShiftRight', 'Shift', 12.25, 3, 2.75),

  // Row 4: bottom — standard ANSI bottom row
  keyC('ControlLeft', 'Ctrl', 0, 4, 1.25), keyC('MetaLeft', '⊞', 1.25, 4, 1.25),
  keyC('AltLeft', 'Alt', 2.5, 4, 1.25), keyC('Space', 'Space', 3.75, 4, 6.25),
  keyC('AltRight', 'Alt', 10, 4, 1.25), keyC('MetaRight', '⊞', 11.25, 4, 1.25),
  keyC('ContextMenu', '☰', 12.5, 4, 1.25), keyC('ControlRight', 'Ctrl', 13.75, 4, 1.25),
];

// ── Layout registry ───────────────────────────────────────────────────────────
export const LAYOUTS = {
  'ansi-104': {
    name: 'ANSI 104-key',
    width: 1040,
    height: 288,
    showLeds: true,
    keys: [...ANSI_MAIN, ...ANSI_NAV, ...NUMPAD],
  },
  'iso-105': {
    name: 'ISO 105-key',
    width: 1040,
    height: 288,
    showLeds: true,
    keys: applyISO([...ANSI_MAIN, ...ANSI_NAV, ...NUMPAD]),
  },
  'tkl-ansi': {
    name: 'TKL ANSI 87-key',
    width: 844,
    height: 288,
    showLeds: false,
    keys: [...ANSI_MAIN, ...ANSI_NAV],
  },
  'tkl-iso': {
    name: 'TKL ISO 88-key',
    width: 844,
    height: 288,
    showLeds: false,
    keys: applyISO([...ANSI_MAIN, ...ANSI_NAV]),
  },
  'layout-75': {
    name: '75%',
    width: 712,
    height: 288,
    showLeds: false,
    keys: LAYOUT_75_KEYS,
  },
  'layout-65': {
    name: '65%',
    width: 668,
    height: 228,
    showLeds: false,
    keys: LAYOUT_65_KEYS,
  },
  'layout-60': {
    name: '60%',
    width: 668,
    height: 228,
    showLeds: false,
    keys: LAYOUT_60_KEYS,
  },
};

export const LAYOUT_IDS = Object.keys(LAYOUTS);

export function getLayout(id) {
  return LAYOUTS[id] ?? LAYOUTS['ansi-104'];
}

export function getKeys(id) {
  return getLayout(id).keys;
}

export function getKeyMap(id) {
  return Object.fromEntries(getKeys(id).map(k => [k.id, k]));
}

// Union of every key across all layouts — used for JSON import reverse mapping
export const ALL_KEY_MAP = Object.fromEntries(
  Object.values(LAYOUTS).flatMap(l => l.keys).map(k => [k.id, k])
);
