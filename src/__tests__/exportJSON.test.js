/**
 * exportJSON round-trip guard.
 *
 * parseJSON.test.js exercises parseJSON in isolation with hand-built payloads.
 * These tests instead drive the real exportJSON() and feed its actual output
 * back through parseJSON(), so a mismatch between what export writes and what
 * import expects (e.g. a label/key-id table falling out of sync) fails loudly
 * instead of only showing up as a live bug report.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { exportJSON, parseJSON } from '../export';

// ── Harness ──────────────────────────────────────────────────────────────────
//
// jsdom doesn't implement URL.createObjectURL, and letting HTMLAnchorElement
// actually navigate to a blob: URL during a test is pointless — so the
// download() side effect is intercepted here and the Blob content captured.

let capturedBlob = null;
let capturedFilename = null;

beforeEach(() => {
  capturedBlob = null;
  capturedFilename = null;
  URL.createObjectURL = vi.fn(blob => { capturedBlob = blob; return 'blob:mock-url'; });
  URL.revokeObjectURL = vi.fn();
  vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function () {
    capturedFilename = this.download;
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

async function runExportJSON(formats, layoutName, settings) {
  exportJSON(formats, layoutName, settings);
  const text = await capturedBlob.text();
  return { text, data: JSON.parse(text), filename: capturedFilename };
}

function sampleFormats() {
  return [{
    name: 'On Foot',
    bindings: [
      { key: 'KeyA',      modifiers: [],        action: 'Jump' },
      { key: 'ShiftLeft', modifiers: [],        action: '__t:actionAttack' },
      { key: 'KeyB',      modifiers: ['Shift'], action: 'Crouch' },
    ],
    keyColors: { KeyA: '#ff0000' },
    mouseBindings: [
      { button: 'Mouse1', modifiers: [], action: 'Fire', mouseKey: 'KeyR' },
    ],
    hotasBindings: [
      { input: 'Joystick_Button1', modifiers: [], hotasMod: '',                  isHotasMod: false, action: 'Fire',   hotasKey: '' },
      { input: 'Joystick_Button2', modifiers: [], hotasMod: 'Joystick_Button1',  isHotasMod: false, action: 'Reload', hotasKey: 'KeyR' },
    ],
  }];
}

// ── Top-level fields ─────────────────────────────────────────────────────────

describe('exportJSON — top-level fields', () => {
  it('writes the current export version and settings', async () => {
    const { data } = await runExportJSON(sampleFormats(), 'My Layout', {
      physicalLayout: 'iso-105', language: 'de-DE', mouseModel: 'logitech-g502', hotasModel: 'virpil-cm3',
    });
    expect(data.version).toBe(5);
    expect(data.layoutName).toBe('My Layout');
    expect(data.physicalLayout).toBe('iso-105');
    expect(data.language).toBe('de-DE');
    expect(data.mouseModel).toBe('logitech-g502');
    expect(data.hotasModel).toBe('virpil-cm3');
  });

  it('defaults missing settings fields instead of writing undefined', async () => {
    const { data } = await runExportJSON(sampleFormats(), '', {});
    expect(data.physicalLayout).toBe('ansi-104');
    expect(data.language).toBe('en-US');
    expect(data.mouseModel).toBe('custom');
    expect(data.hotasModel).toBe('custom');
  });

  it('names the downloaded file after the sanitized layout name', async () => {
    const { filename } = await runExportJSON(sampleFormats(), 'My "Cool" Layout!!', {});
    expect(filename).toBe('My_Cool_Layout.json');
  });

  it('falls back to a default filename when the layout is unnamed', async () => {
    const { filename } = await runExportJSON(sampleFormats(), '', {});
    expect(filename).toBe('keybindings.json');
  });
});

// ── Translation baking ───────────────────────────────────────────────────────

describe('exportJSON — translation baking', () => {
  it('resolves __t: action keys to literal text at export time', async () => {
    const { data } = await runExportJSON(sampleFormats(), 'Layout', { language: 'en-US' });
    const binding = data.formats[0].bindings.find(b => b.key === 'LShift');
    expect(binding.action).toBe('Attack');
    expect(binding.action).not.toMatch(/^__t:/);
  });

  it('leaves plain-text actions untouched', async () => {
    const { data } = await runExportJSON(sampleFormats(), 'Layout', {});
    const binding = data.formats[0].bindings.find(b => b.key === 'A');
    expect(binding.action).toBe('Jump');
  });
});

// ── Key label round trip ─────────────────────────────────────────────────────

describe('exportJSON — key label round trip', () => {
  it('writes human-readable labels for keyboard binding keys', async () => {
    const { data } = await runExportJSON(sampleFormats(), 'Layout', {});
    const keys = data.formats[0].bindings.map(b => b.key);
    expect(keys).toEqual(['A', 'LShift', 'B']);
  });

  it('writes raw key ids (not labels) for mouse/HOTAS remapped keys', async () => {
    const { data } = await runExportJSON(sampleFormats(), 'Layout', {});
    expect(data.formats[0].mouseBindings[0].mouseKey).toBe('KeyR');
    expect(data.formats[0].hotasBindings[1].hotasKey).toBe('KeyR');
  });

  it('round-trips exported labels back to the original key ids via parseJSON', async () => {
    const { text } = await runExportJSON(sampleFormats(), 'Layout', {});
    const result = parseJSON(text);
    const keys = result.data.formats[0].bindings.map(b => b.key);
    expect(keys).toEqual(['KeyA', 'ShiftLeft', 'KeyB']);
  });
});

// ── Full pipeline round trip ─────────────────────────────────────────────────

describe('exportJSON -> parseJSON — full pipeline', () => {
  it('preserves modifiers, keyColors, mouse and HOTAS fields end to end', async () => {
    const { text } = await runExportJSON(sampleFormats(), 'Layout', {});
    const result = parseJSON(text);

    expect(result.type).toBe('full');
    const format = result.data.formats[0];

    const crouch = format.bindings.find(b => b.key === 'KeyB');
    expect(crouch.modifiers).toEqual(['Shift']);

    expect(format.keyColors).toEqual({ KeyA: '#ff0000' });

    expect(format.mouseBindings).toEqual([
      { button: 'Mouse1', modifiers: [], action: 'Fire', mouseKey: 'KeyR' },
    ]);

    expect(format.hotasBindings).toEqual([
      { input: 'Joystick_Button1', modifiers: [], hotasMod: '',                 isHotasMod: false, action: 'Fire',   hotasKey: '' },
      { input: 'Joystick_Button2', modifiers: [], hotasMod: 'Joystick_Button1', isHotasMod: false, action: 'Reload', hotasKey: 'KeyR' },
    ]);
  });

  it('round-trips multiple formats in order', async () => {
    const formats = [
      { ...sampleFormats()[0], name: 'On Foot' },
      { ...sampleFormats()[0], name: 'In Vehicle', bindings: [{ key: 'KeyW', modifiers: [], action: 'Accelerate' }] },
    ];
    const { text } = await runExportJSON(formats, 'Layout', {});
    const result = parseJSON(text);
    expect(result.data.formats.map(f => f.name)).toEqual(['On Foot', 'In Vehicle']);
    expect(result.data.formats[1].bindings).toEqual([{ key: 'KeyW', modifiers: [], action: 'Accelerate' }]);
  });

  it('caps at MAX_FORMATS (5) on import even if more were somehow exported', async () => {
    const formats = Array.from({ length: 7 }, (_, i) => ({
      name: `Format ${i}`, bindings: [], keyColors: {}, mouseBindings: [], hotasBindings: [],
    }));
    const { text } = await runExportJSON(formats, 'Layout', {});
    const result = parseJSON(text);
    expect(result.data.formats).toHaveLength(5);
  });
});
