// 104-key QWERTY layout
// Each key: { id, label, x, y, w, h }
// Coordinates in SVG units (1 unit ≈ 1 key width)
// Base key size = 40px, gap = 4px → unit = 44px

const U = 44; // unit
const H = 40; // key height
const G = 4;  // gap

export const KEYBOARD_WIDTH = 1570;
export const KEYBOARD_HEIGHT = 280;

function key(id, label, col, row, w = 1, h = 1, altLabel) {
  return {
    id,
    label,
    altLabel,
    x: col * U + G,
    y: row * U + G,
    w: w * U - G,
    h: h * H - G,
  };
}

export const KEYS = [
  // Row 0: Function keys
  key('Escape', 'Esc', 0, 0),
  key('F1', 'F1', 1.25, 0),
  key('F2', 'F2', 2.25, 0),
  key('F3', 'F3', 3.25, 0),
  key('F4', 'F4', 4.25, 0),
  key('F5', 'F5', 5.5, 0),
  key('F6', 'F6', 6.5, 0),
  key('F7', 'F7', 7.5, 0),
  key('F8', 'F8', 8.5, 0),
  key('F9', 'F9', 9.75, 0),
  key('F10', 'F10', 10.75, 0),
  key('F11', 'F11', 11.75, 0),
  key('F12', 'F12', 12.75, 0),
  key('PrintScreen', 'PrtSc', 14, 0),
  key('ScrollLock', 'Scrl', 15, 0),
  key('Pause', 'Pause', 16, 0),

  // Row 1: Number row
  key('Backquote', '`', 0, 1, 1, 1, '~'),
  key('Digit1', '1', 1, 1, 1, 1, '!'),
  key('Digit2', '2', 2, 1, 1, 1, '@'),
  key('Digit3', '3', 3, 1, 1, 1, '#'),
  key('Digit4', '4', 4, 1, 1, 1, '$'),
  key('Digit5', '5', 5, 1, 1, 1, '%'),
  key('Digit6', '6', 6, 1, 1, 1, '^'),
  key('Digit7', '7', 7, 1, 1, 1, '&'),
  key('Digit8', '8', 8, 1, 1, 1, '*'),
  key('Digit9', '9', 9, 1, 1, 1, '('),
  key('Digit0', '0', 10, 1, 1, 1, ')'),
  key('Minus', '-', 11, 1, 1, 1, '_'),
  key('Equal', '=', 12, 1, 1, 1, '+'),
  key('Backspace', '⌫', 13, 1, 2),

  // Row 2: QWERTY row
  key('Tab', 'Tab', 0, 2, 1.5),
  key('KeyQ', 'Q', 1.5, 2),
  key('KeyW', 'W', 2.5, 2),
  key('KeyE', 'E', 3.5, 2),
  key('KeyR', 'R', 4.5, 2),
  key('KeyT', 'T', 5.5, 2),
  key('KeyY', 'Y', 6.5, 2),
  key('KeyU', 'U', 7.5, 2),
  key('KeyI', 'I', 8.5, 2),
  key('KeyO', 'O', 9.5, 2),
  key('KeyP', 'P', 10.5, 2),
  key('BracketLeft', '[', 11.5, 2, 1, 1, '{'),
  key('BracketRight', ']', 12.5, 2, 1, 1, '}'),
  key('Backslash', '\\', 13.5, 2, 1.5, 1, '|'),

  // Row 3: ASDF row
  key('CapsLock', 'Caps', 0, 3, 1.75),
  key('KeyA', 'A', 1.75, 3),
  key('KeyS', 'S', 2.75, 3),
  key('KeyD', 'D', 3.75, 3),
  key('KeyF', 'F', 4.75, 3),
  key('KeyG', 'G', 5.75, 3),
  key('KeyH', 'H', 6.75, 3),
  key('KeyJ', 'J', 7.75, 3),
  key('KeyK', 'K', 8.75, 3),
  key('KeyL', 'L', 9.75, 3),
  key('Semicolon', ';', 10.75, 3, 1, 1, ':'),
  key('Quote', "'", 11.75, 3, 1, 1, '"'),
  key('Enter', 'Enter', 12.75, 3, 2.25),

  // Row 4: ZXCV row
  key('ShiftLeft', 'Shift', 0, 4, 2.25),
  key('KeyZ', 'Z', 2.25, 4),
  key('KeyX', 'X', 3.25, 4),
  key('KeyC', 'C', 4.25, 4),
  key('KeyV', 'V', 5.25, 4),
  key('KeyB', 'B', 6.25, 4),
  key('KeyN', 'N', 7.25, 4),
  key('KeyM', 'M', 8.25, 4),
  key('Comma', ',', 9.25, 4, 1, 1, '<'),
  key('Period', '.', 10.25, 4, 1, 1, '>'),
  key('Slash', '/', 11.25, 4, 1, 1, '?'),
  key('ShiftRight', 'Shift', 12.25, 4, 2.75),

  // Row 5: Bottom row
  key('ControlLeft', 'Ctrl', 0, 5, 1.5),
  key('MetaLeft', '⊞', 1.5, 5, 1.25),
  key('AltLeft', 'Alt', 2.75, 5, 1.25),
  key('Space', 'Space', 4, 5, 6.25),
  key('AltRight', 'Alt', 10.25, 5, 1.25),
  key('MetaRight', '⊞', 11.5, 5, 1.25),
  key('ContextMenu', '☰', 12.75, 5, 1.25),
  key('ControlRight', 'Ctrl', 14, 5, 1.5),

  // Navigation cluster (offset col 14-16)
  key('Insert', 'Ins', 14, 1),
  key('Home', 'Home', 15, 1),
  key('PageUp', 'PgUp', 16, 1),
  key('Delete', 'Del', 14, 2),
  key('End', 'End', 15, 2),
  key('PageDown', 'PgDn', 16, 2),

  // Arrow keys
  key('ArrowUp', '↑', 15, 4),
  key('ArrowLeft', '←', 14, 5),
  key('ArrowDown', '↓', 15, 5),
  key('ArrowRight', '→', 16, 5),
];

export const KEY_MAP = Object.fromEntries(KEYS.map(k => [k.id, k]));
