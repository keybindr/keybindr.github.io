// 104-key QWERTY layout
// Each key: { id, label, x, y, w, h }
// Coordinates in SVG units (1 unit ≈ 1 key width)
// Base unit = 44px (40px key + 4px gap)

const U = 44; // unit
const G = 4;  // gap
const FROW_GAP = 20; // extra space between function row and number row

export const KEYBOARD_WIDTH  = 1040;
export const KEYBOARD_HEIGHT = 288;

function key(id, label, col, row, w = 1, h = 1, altLabel) {
  return {
    id,
    label,
    altLabel,
    x: col * U + G,
    y: row * U + G + (row >= 1 ? FROW_GAP : 0),
    w: w * U - G,
    h: h * U - G,
  };
}

export const KEYS = [
  // Row 0: Function keys
  // Groups: Esc | 1u gap | F1-F4 | 0.5u gap | F5-F8 | 0.5u gap | F9-F12
  // F12 right-edge aligns with Backspace right-edge at col 15
  key('Escape', 'Esc', 0, 0),
  key('F1', 'F1', 2, 0),
  key('F2', 'F2', 3, 0),
  key('F3', 'F3', 4, 0),
  key('F4', 'F4', 5, 0),
  key('F5', 'F5', 6.5, 0),
  key('F6', 'F6', 7.5, 0),
  key('F7', 'F7', 8.5, 0),
  key('F8', 'F8', 9.5, 0),
  key('F9', 'F9', 11, 0),
  key('F10', 'F10', 12, 0),
  key('F11', 'F11', 13, 0),
  key('F12', 'F12', 14, 0),
  key('PrintScreen', 'PrtSc', 16, 0),
  key('ScrollLock', 'Scrl', 17, 0),
  key('Pause', 'Pause', 18, 0),

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

  // Row 5: Bottom row — all modifier keys 1.25u, total = 15u to match other rows
  key('ControlLeft', 'Ctrl', 0, 5, 1.25),
  key('MetaLeft', '⊞', 1.25, 5, 1.25),
  key('AltLeft', 'Alt', 2.5, 5, 1.25),
  key('Space', 'Space', 3.75, 5, 6.25),
  key('AltRight', 'Alt', 10, 5, 1.25),
  key('MetaRight', '⊞', 11.25, 5, 1.25),
  key('ContextMenu', '☰', 12.5, 5, 1.25),
  key('ControlRight', 'Ctrl', 13.75, 5, 1.25),

  // Navigation cluster (cols 16-18, gap after main keyboard)
  key('Insert', 'Ins', 16, 1),
  key('Home', 'Home', 17, 1),
  key('PageUp', 'PgUp', 18, 1),
  key('Delete', 'Del', 16, 2),
  key('End', 'End', 17, 2),
  key('PageDown', 'PgDn', 18, 2),
  key('ArrowUp', '↑', 17, 4),
  key('ArrowLeft', '←', 16, 5),
  key('ArrowDown', '↓', 17, 5),
  key('ArrowRight', '→', 18, 5),

  // Numpad (cols 19.5-22.5)
  key('NumLock', 'NumLk', 19.5, 1),
  key('NumpadDivide', '/', 20.5, 1),
  key('NumpadMultiply', '*', 21.5, 1),
  key('NumpadSubtract', '-', 22.5, 1),
  key('Numpad7', '7', 19.5, 2),
  key('Numpad8', '8', 20.5, 2),
  key('Numpad9', '9', 21.5, 2),
  key('NumpadAdd', '+', 22.5, 2, 1, 2),
  key('Numpad4', '4', 19.5, 3),
  key('Numpad5', '5', 20.5, 3),
  key('Numpad6', '6', 21.5, 3),
  key('Numpad1', '1', 19.5, 4),
  key('Numpad2', '2', 20.5, 4),
  key('Numpad3', '3', 21.5, 4),
  key('NumpadEnter', 'Enter', 22.5, 4, 1, 2),
  key('Numpad0', '0', 19.5, 5, 2),
  key('NumpadDecimal', '.', 21.5, 5),
];

export const KEY_MAP = Object.fromEntries(KEYS.map(k => [k.id, k]));
