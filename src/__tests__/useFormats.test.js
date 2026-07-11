/**
 * Unified/split retagging guard.
 *
 * These cover the pure helpers behind retagModifiers: retagAndDedupe (binding
 * modifier vocabulary + Left-wins conflict resolution) and reconcileKeyColors
 * (forcing an L/R modifier pair's keyColors to match in unified mode). Both
 * back the settings toggle, import, and preset-load paths — see App.jsx.
 */
import { describe, it, expect } from 'vitest';
import { retagAndDedupe, reconcileKeyColors } from '../useFormats';
import { bindingId } from '../useBindings';

const idOf = b => bindingId(b.key, b.modifiers);

describe('retagAndDedupe — unified to split', () => {
  it('maps unified modifier values to their Left-side split equivalent', () => {
    const result = retagAndDedupe(
      [{ key: 'KeyA', modifiers: ['Shift'], action: 'Jump' }],
      true,
      idOf,
    );
    expect(result).toEqual([{ key: 'KeyA', modifiers: ['ShiftLeft'], action: 'Jump' }]);
  });

  it('maps Alt and Ctrl the same way', () => {
    const result = retagAndDedupe(
      [
        { key: 'KeyA', modifiers: ['Alt'], action: 'A' },
        { key: 'KeyB', modifiers: ['Ctrl'], action: 'B' },
      ],
      true,
      idOf,
    );
    expect(result.map(b => b.modifiers)).toEqual([['AltLeft'], ['CtrlLeft']]);
  });

  it('leaves bindings with no modifiers untouched', () => {
    const result = retagAndDedupe(
      [{ key: 'KeyA', modifiers: [], action: 'Jump' }],
      true,
      idOf,
    );
    expect(result).toEqual([{ key: 'KeyA', modifiers: [], action: 'Jump' }]);
  });

  it('does not collide when a unified binding and an already-split binding target different sides', () => {
    const result = retagAndDedupe(
      [
        { key: 'KeyA', modifiers: ['Shift'], action: 'Unified' },
        { key: 'KeyB', modifiers: ['ShiftRight'], action: 'AlreadySplit' },
      ],
      true,
      idOf,
    );
    expect(result).toHaveLength(2);
  });
});

describe('retagAndDedupe — split to unified', () => {
  it('maps Left-side split modifiers to the unified value', () => {
    const result = retagAndDedupe(
      [{ key: 'KeyA', modifiers: ['ShiftLeft'], action: 'Jump' }],
      false,
      idOf,
    );
    expect(result).toEqual([{ key: 'KeyA', modifiers: ['Shift'], action: 'Jump' }]);
  });

  it('maps Right-side split modifiers to the unified value when there is no conflict', () => {
    const result = retagAndDedupe(
      [{ key: 'KeyA', modifiers: ['ShiftRight'], action: 'Jump' }],
      false,
      idOf,
    );
    expect(result).toEqual([{ key: 'KeyA', modifiers: ['Shift'], action: 'Jump' }]);
  });

  it('drops the Right-side binding and keeps Left on an irresolvable conflict', () => {
    const result = retagAndDedupe(
      [
        { key: 'KeyA', modifiers: ['ShiftLeft'],  action: 'LeftAction' },
        { key: 'KeyA', modifiers: ['ShiftRight'], action: 'RightAction' },
      ],
      false,
      idOf,
    );
    expect(result).toEqual([{ key: 'KeyA', modifiers: ['Shift'], action: 'LeftAction' }]);
  });

  it('keeps Left regardless of array order', () => {
    const result = retagAndDedupe(
      [
        { key: 'KeyA', modifiers: ['ShiftRight'], action: 'RightAction' },
        { key: 'KeyA', modifiers: ['ShiftLeft'],  action: 'LeftAction' },
      ],
      false,
      idOf,
    );
    expect(result).toEqual([{ key: 'KeyA', modifiers: ['Shift'], action: 'LeftAction' }]);
  });

  it('resolves conflicts independently per family (Shift vs Ctrl vs Alt)', () => {
    const result = retagAndDedupe(
      [
        { key: 'KeyA', modifiers: ['ShiftLeft'],  action: 'ShiftL' },
        { key: 'KeyA', modifiers: ['ShiftRight'], action: 'ShiftR' },
        { key: 'KeyB', modifiers: ['CtrlLeft'],   action: 'CtrlL' },
        { key: 'KeyB', modifiers: ['CtrlRight'],  action: 'CtrlR' },
      ],
      false,
      idOf,
    );
    expect(result).toEqual([
      { key: 'KeyA', modifiers: ['Shift'], action: 'ShiftL' },
      { key: 'KeyB', modifiers: ['Ctrl'],  action: 'CtrlL' },
    ]);
  });
});

describe('retagAndDedupe — exact duplicates', () => {
  it('keeps the first occurrence when two bindings already share an id', () => {
    const result = retagAndDedupe(
      [
        { key: 'KeyA', modifiers: ['Shift'], action: 'First' },
        { key: 'KeyA', modifiers: ['Shift'], action: 'Second' },
      ],
      true,
      idOf,
    );
    expect(result).toEqual([{ key: 'KeyA', modifiers: ['ShiftLeft'], action: 'First' }]);
  });
});

describe('reconcileKeyColors', () => {
  it('leaves keyColors unchanged when a modifier pair already matches', () => {
    const input = { ShiftLeft: '#629eda', ShiftRight: '#629eda' };
    expect(reconcileKeyColors(input)).toEqual(input);
  });

  it('propagates a Left-only color to the Right side', () => {
    const result = reconcileKeyColors({ ShiftLeft: '#629eda' });
    expect(result).toEqual({ ShiftLeft: '#629eda', ShiftRight: '#629eda' });
  });

  it('propagates a Right-only color to the Left side', () => {
    const result = reconcileKeyColors({ ShiftRight: '#629eda' });
    expect(result).toEqual({ ShiftLeft: '#629eda', ShiftRight: '#629eda' });
  });

  it('prefers the Left side when both are set to different colors', () => {
    const result = reconcileKeyColors({ ShiftLeft: '#629eda', ShiftRight: '#8062da' });
    expect(result).toEqual({ ShiftLeft: '#629eda', ShiftRight: '#629eda' });
  });

  it('reconciles Ctrl and Alt pairs the same way', () => {
    const result = reconcileKeyColors({
      ControlLeft: '#e07b39',
      AltRight:    '#7be09a',
    });
    expect(result).toEqual({
      ControlLeft: '#e07b39', ControlRight: '#e07b39',
      AltLeft:     '#7be09a', AltRight:     '#7be09a',
    });
  });

  it('leaves non-modifier keys untouched', () => {
    const input = { KeyA: '#da6262' };
    expect(reconcileKeyColors(input)).toEqual(input);
  });

  it('leaves an empty object unchanged', () => {
    expect(reconcileKeyColors({})).toEqual({});
  });

  it('does not mutate the input object', () => {
    const input = { ShiftLeft: '#629eda' };
    const snapshot = { ...input };
    reconcileKeyColors(input);
    expect(input).toEqual(snapshot);
  });
});
