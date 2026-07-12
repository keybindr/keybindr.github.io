/**
 * importFile() guard — the FileReader-driven entry point used by the
 * "Import JSON" button. parseJSON.test.js covers the parsing logic itself;
 * these tests cover the file-handling wrapper around it (extension check,
 * read errors, translated error messages).
 */
import { describe, it, expect } from 'vitest';
import { importFile } from '../export';

function jsonFile(content, name = 'layout.json') {
  return new File([content], name, { type: 'application/json' });
}

describe('importFile — happy path', () => {
  it('resolves with the parsed result for a valid .json file', async () => {
    const payload = JSON.stringify({
      version: 5,
      layoutName: 'My Layout',
      formats: [{ name: 'On Foot', bindings: [{ key: 'A', modifiers: [], action: 'Jump' }], keyColors: {} }],
    });
    const result = await importFile(jsonFile(payload));
    expect(result.type).toBe('full');
    expect(result.data.layoutName).toBe('My Layout');
  });

  it('is case-insensitive about the .json extension', async () => {
    const payload = JSON.stringify({ bindings: [] });
    const result = await importFile(jsonFile(payload, 'layout.JSON'));
    expect(result.type).toBe('bindings');
  });
});

describe('importFile — rejections', () => {
  it('rejects non-.json files with a translated error, without reading them', async () => {
    await expect(importFile(jsonFile('not json at all', 'layout.txt')))
      .rejects.toThrow('Unsupported file type — use .json');
  });

  it('rejects malformed JSON syntax (raw parser message, not a translation key)', async () => {
    // JSON.parse's own SyntaxError message isn't one of our translation keys,
    // so importFile passes it through as-is rather than mistranslating it.
    await expect(importFile(jsonFile('{ not valid json ')))
      .rejects.toThrow(/json/i);
  });

  it('rejects a well-formed but structurally invalid payload (top-level array)', async () => {
    await expect(importFile(jsonFile('[1,2,3]')))
      .rejects.toThrow('Invalid file — not a keybindr JSON export');
  });

  it('translates the error message using the requested language', async () => {
    // de-DE isn't preloaded in this test environment, so makeT falls back to
    // en-US — this just confirms importFile actually threads `language` through
    // to makeT rather than hardcoding 'en-US'.
    await expect(importFile(jsonFile('not json', 'layout.txt'), 'de-DE'))
      .rejects.toThrow('Unsupported file type — use .json');
  });
});
