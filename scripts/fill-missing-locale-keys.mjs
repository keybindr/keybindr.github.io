/**
 * Adds any key present in en-US.js but missing from another locale file,
 * using the English value as a placeholder so the app no longer silently
 * falls back.  Safe to re-run — already-present keys are never touched.
 *
 * Usage:  node scripts/fill-missing-locale-keys.mjs
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { fileURLToPath, pathToFileURL } from 'url';
import { join, dirname } from 'path';

const ROOT    = join(dirname(fileURLToPath(import.meta.url)), '..');
const LOCALES = join(ROOT, 'src', 'locales');

// ── Load en-US as the source of truth ─────────────────────────────────────────
const enModule = await import(pathToFileURL(join(LOCALES, 'en-US.js')).href);
const en = enModule.default;

// ── Helpers ────────────────────────────────────────────────────────────────────

function escapeValue(v) {
  // Escape single quotes and wrap in single quotes.
  return "'" + String(v).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
}

function longestKey(keys) {
  return keys.reduce((m, k) => Math.max(m, k.length), 0);
}

// ── Process each content locale ────────────────────────────────────────────────

const files = readdirSync(LOCALES)
  .filter(f => f.endsWith('.js') && f !== 'en-US.js' && f !== 'index.js');

let totalAdded = 0;

for (const file of files) {
  const path = join(LOCALES, file);
  const src  = readFileSync(path, 'utf8');

  // Dynamically import to get the resolved (spread-merged) locale object.
  const mod    = await import(pathToFileURL(path).href);
  const locale = mod.default;

  const missingKeys = Object.keys(en).filter(k => !(k in locale));
  if (missingKeys.length === 0) continue;

  const pad = longestKey(missingKeys) + 2; // +2 for the surrounding quotes

  const additions = missingKeys.map(k => {
    const quoted = `'${k}'`;
    return `  ${quoted.padEnd(pad)}: ${escapeValue(en[k])},  // TODO: translate`;
  }).join('\n');

  // Insert before the final `};`
  const updated = src.replace(/\n\};\s*$/, `\n\n  // ── Keys added by fill-missing-locale-keys (pending translation) ──\n${additions}\n};\n`);

  if (updated === src) {
    console.warn(`⚠  Could not insert into ${file} — closing pattern not found`);
    continue;
  }

  writeFileSync(path, updated, 'utf8');
  console.log(`✓  ${file.padEnd(12)} — added ${missingKeys.length} key(s): ${missingKeys.join(', ')}`);
  totalAdded += missingKeys.length;
}

console.log(`\nDone. ${totalAdded} total key additions across ${files.length} locale files.`);
