import { describe, it, expect } from 'vitest';
import { bindingId } from '../useBindings';

describe('bindingId', () => {
  it('returns just the key when there are no modifiers', () => {
    expect(bindingId('KeyA', [])).toBe('KeyA');
  });

  it('joins key and single modifier with the unit-separator', () => {
    expect(bindingId('KeyA', ['Shift'])).toBe('KeyA\x1FShift');
  });

  it('sorts modifiers so binding ID is stable regardless of argument order', () => {
    const a = bindingId('KeyA', ['Ctrl', 'Shift']);
    const b = bindingId('KeyA', ['Shift', 'Ctrl']);
    expect(a).toBe(b);
  });

  it('handles null/undefined modifiers gracefully', () => {
    expect(bindingId('KeyA', null)).toBe('KeyA');
    expect(bindingId('KeyA', undefined)).toBe('KeyA');
  });

  it('never collides bare key with key+modifier using the same characters', () => {
    // Without a dedicated separator, "Key" + modifier "A" could collide with "KeyA" alone.
    expect(bindingId('Key', ['A'])).not.toBe(bindingId('KeyA', []));
  });

  it('produces distinct IDs for different modifier combinations on the same key', () => {
    const noMod   = bindingId('Space', []);
    const shift   = bindingId('Space', ['Shift']);
    const ctrl    = bindingId('Space', ['Ctrl']);
    const both    = bindingId('Space', ['Ctrl', 'Shift']);
    expect(new Set([noMod, shift, ctrl, both]).size).toBe(4);
  });
});
