import { describe, it, expect, beforeAll } from 'vitest';
import { encodeShareUrl, decodeShareHash } from '../share';

// jsdom doesn't implement CompressionStream, so the encode path always uses
// base64 (the graceful fallback).  The decode path handles both prefixes, so
// the round-trip is fully exercised for the b64 case.

const SAMPLE_PAYLOAD = {
  layoutName: 'Test',
  physicalLayout: 'ansi-104',
  language: 'en-US',
  formats: [
    {
      name: 'On Foot',
      bindings: [{ key: 'A', modifiers: ['Shift'], action: 'Jump' }],
      keyColors: {},
      mouseBindings: [],
      hotasBindings: [],
    },
  ],
};

describe('encodeShareUrl + decodeShareHash — round-trip', () => {
  let encoded;

  beforeAll(async () => {
    encoded = await encodeShareUrl(
      SAMPLE_PAYLOAD.formats,
      SAMPLE_PAYLOAD.layoutName,
      { physicalLayout: SAMPLE_PAYLOAD.physicalLayout, language: SAMPLE_PAYLOAD.language },
    );
  });

  it('produces a URL string containing a #layout= hash', () => {
    expect(typeof encoded).toBe('string');
    expect(encoded).toMatch(/#layout=/);
  });

  it('round-trips layoutName', async () => {
    const hash = '#' + encoded.split('#')[1];
    const result = await decodeShareHash(hash);
    expect(result.layoutName).toBe('Test');
  });

  it('round-trips physicalLayout', async () => {
    const hash = '#' + encoded.split('#')[1];
    const result = await decodeShareHash(hash);
    expect(result.physicalLayout).toBe('ansi-104');
  });

  it('round-trips language', async () => {
    const hash = '#' + encoded.split('#')[1];
    const result = await decodeShareHash(hash);
    expect(result.language).toBe('en-US');
  });

  it('round-trips format name and bindings', async () => {
    const hash = '#' + encoded.split('#')[1];
    const result = await decodeShareHash(hash);
    expect(result.formats[0].name).toBe('On Foot');
    expect(result.formats[0].bindings[0].action).toBe('Jump');
  });
});

describe('decodeShareHash — error handling', () => {
  it('returns null for a null/empty hash', async () => {
    expect(await decodeShareHash(null)).toBeNull();
    expect(await decodeShareHash('')).toBeNull();
    expect(await decodeShareHash('#unrelated')).toBeNull();
  });

  it('returns null for a hash with an unrecognised prefix', async () => {
    expect(await decodeShareHash('#layout=BADPREFIX_abc123')).toBeNull();
  });

  it('returns null for malformed base64', async () => {
    expect(await decodeShareHash('#layout=b64:!!invalid!!')).toBeNull();
  });
});
