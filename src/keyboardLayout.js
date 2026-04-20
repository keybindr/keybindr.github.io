// Backward-compatibility shim — re-exports ANSI 104 defaults.
// New code should import from keyboardLayouts.js directly.
export { ALL_KEY_MAP as KEY_MAP } from './keyboardLayouts';
export { getLayout } from './keyboardLayouts';

import { LAYOUTS } from './keyboardLayouts';
const ansi = LAYOUTS['ansi-104'];
export const KEYS           = ansi.keys;
export const KEYBOARD_WIDTH  = ansi.width;
export const KEYBOARD_HEIGHT = ansi.height;
