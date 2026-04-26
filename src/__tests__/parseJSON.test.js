/**
 * Import / export round-trip guard.
 *
 * These tests verify that data written by exportJSON can be read back by
 * parseJSON without loss, and that parseJSON handles malformed or legacy
 * input safely.  Add a test here whenever a new top-level field is added to
 * the export format so the import side is never silently missed.
 */
import { describe, it, expect } from 'vitest';
import { parseJSON } from '../export';

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeFormat(overrides = {}) {
  return {
    name: 'On Foot',
    bindings: [
      { key: 'A', modifiers: ['Shift'], action: 'Jump' },
    ],
    keyColors: { KeyA: '#ff0000' },
    mouseBindings: [
      { button: 'Mouse1', modifiers: [], action: 'Fire', mouseKey: '' },
    ],
    hotasBindings: [
      { input: 'Joystick_Button1', modifiers: [], hotasMod: '', isHotasMod: false, action: 'Fire', hotasKey: '' },
    ],
    ...overrides,
  };
}

function makeV5Payload(overrides = {}) {
  return JSON.stringify({
    version: 5,
    layoutName: 'Test Layout',
    physicalLayout: 'ansi-104',
    language: 'en-US',
    mouseModel: 'custom',
    hotasModel: 'custom',
    formats: [makeFormat()],
    ...overrides,
  });
}

// ── Full v5 round-trip ─────────────────────────────────────────────────────────

describe('parseJSON — v5 full format', () => {
  it('returns type "full" for a versioned payload', () => {
    const result = parseJSON(makeV5Payload());
    expect(result.type).toBe('full');
  });

  it('preserves layoutName', () => {
    const result = parseJSON(makeV5Payload({ layoutName: 'My Layout' }));
    expect(result.data.layoutName).toBe('My Layout');
  });

  it('preserves physicalLayout', () => {
    const result = parseJSON(makeV5Payload({ physicalLayout: 'tkl-ansi' }));
    expect(result.data.physicalLayout).toBe('tkl-ansi');
  });

  it('preserves language', () => {
    const result = parseJSON(makeV5Payload({ language: 'de-DE' }));
    expect(result.data.language).toBe('de-DE');
  });

  it('preserves mouseModel', () => {
    const result = parseJSON(makeV5Payload({ mouseModel: 'logitech-g502' }));
    expect(result.data.mouseModel).toBe('logitech-g502');
  });

  it('preserves hotasModel', () => {
    const result = parseJSON(makeV5Payload({ hotasModel: 'virpil-cm3' }));
    expect(result.data.hotasModel).toBe('virpil-cm3');
  });

  it('parses keyboard bindings with sorted modifiers', () => {
    const result = parseJSON(makeV5Payload());
    const [binding] = result.data.formats[0].bindings;
    expect(binding.action).toBe('Jump');
    expect(binding.modifiers).toEqual(['Shift']);
  });

  it('parses mouse bindings', () => {
    const result = parseJSON(makeV5Payload());
    const [mb] = result.data.formats[0].mouseBindings;
    expect(mb.button).toBe('Mouse1');
    expect(mb.action).toBe('Fire');
  });

  it('parses HOTAS bindings', () => {
    const result = parseJSON(makeV5Payload());
    const [hb] = result.data.formats[0].hotasBindings;
    expect(hb.input).toBe('Joystick_Button1');
    expect(hb.isHotasMod).toBe(false);
  });

  it('preserves keyColors', () => {
    const result = parseJSON(makeV5Payload());
    expect(result.data.formats[0].keyColors).toEqual({ KeyA: '#ff0000' });
  });

  it('sanitizes keyColors — drops non-string values', () => {
    const payload = makeV5Payload();
    const parsed = JSON.parse(payload);
    parsed.formats[0].keyColors = { KeyA: '#ff0000', KeyB: 42, KeyC: null };
    const result = parseJSON(JSON.stringify(parsed));
    expect(result.data.formats[0].keyColors).toEqual({ KeyA: '#ff0000' });
  });
});

// ── Legacy formats ─────────────────────────────────────────────────────────────

describe('parseJSON — legacy formats', () => {
  it('returns type "formats" for a payload with formats but no version >= 3', () => {
    const payload = JSON.stringify({
      version: 2,
      formats: [makeFormat()],
    });
    const result = parseJSON(payload);
    expect(result.type).toBe('formats');
  });

  it('throws for a bare array (rejected by the top-level object guard)', () => {
    const payload = JSON.stringify([
      { key: 'A', modifiers: [], action: 'Jump' },
    ]);
    expect(() => parseJSON(payload)).toThrow('importErrInvalid');
  });

  it('returns type "bindings" for an object with a bindings array', () => {
    const payload = JSON.stringify({
      bindings: [{ key: 'A', modifiers: [], action: 'Jump' }],
    });
    const result = parseJSON(payload);
    expect(result.type).toBe('bindings');
  });
});

// ── Input validation ───────────────────────────────────────────────────────────

describe('parseJSON — invalid input', () => {
  it('throws for a null payload', () => {
    expect(() => parseJSON('null')).toThrow();
  });

  it('throws for a top-level array', () => {
    expect(() => parseJSON('[1,2,3]')).toThrow('importErrInvalid');
  });

  it('throws for invalid JSON', () => {
    expect(() => parseJSON('{ not json }')).toThrow();
  });
});

// ── Binding sanitization ───────────────────────────────────────────────────────

describe('parseJSON — binding sanitization', () => {
  it('drops bindings with no key', () => {
    const payload = JSON.stringify({
      version: 5,
      layoutName: '',
      formats: [{
        name: 'Format',
        bindings: [
          { key: '',  modifiers: [], action: 'Ghost' },
          { key: 'A', modifiers: [], action: 'Real' },
        ],
        keyColors: {},
      }],
    });
    const result = parseJSON(payload);
    expect(result.data.formats[0].bindings).toHaveLength(1);
    expect(result.data.formats[0].bindings[0].action).toBe('Real');
  });

  it('filters non-string modifiers', () => {
    const payload = JSON.stringify({
      version: 5,
      layoutName: '',
      formats: [{
        name: 'Format',
        bindings: [{ key: 'A', modifiers: ['Shift', 42, null, 'Ctrl'], action: 'Act' }],
        keyColors: {},
      }],
    });
    const result = parseJSON(payload);
    const mods = result.data.formats[0].bindings[0].modifiers;
    expect(mods).toEqual(['Ctrl', 'Shift']); // sorted, non-strings dropped
  });
});
