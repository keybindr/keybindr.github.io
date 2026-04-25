/**
 * splits translations.js into per-locale files under src/locales/
 * Run once: node scripts/split-translations.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from 'fs';

const content = readFileSync('src/translations.js', 'utf-8');

// Variable name inside translations.js → BCP-47 locale code
const VAR_TO_LOCALE = {
  en:   'en-US',
  de:   'de-DE',
  fr:   'fr-FR',
  nl:   'nl-NL',
  es:   'es-ES',
  sv:   'sv-SE',
  nb:   'nb-NO',
  da:   'da-DK',
  fi:   'fi-FI',
  pl:   'pl-PL',
  cs:   'cs-CZ',
  sk:   'sk-SK',
  hu:   'hu-HU',
  ro:   'ro-RO',
  ptBR: 'pt-BR',
  ptPT: 'pt-PT',
  it:   'it-IT',
  tr:   'tr-TR',
  el:   'el-GR',
  vi:   'vi-VN',
  bg:   'bg-BG',
  sr:   'sr-RS',
  hr:   'hr-HR',
  ru:   'ru-RU',
  uk:   'uk-UA',
  ko:   'ko-KR',
  zhCN: 'zh-CN',
  ja:   'ja-JP',
  id:   'id-ID',
};

mkdirSync('src/locales', { recursive: true });

let extracted = 0;
for (const [varName, locale] of Object.entries(VAR_TO_LOCALE)) {
  // Match: const VARNAME = {\n  ...lines...\n};\n
  const re = new RegExp(`^const ${varName} = \\{([\\s\\S]*?)\\n\\};`, 'm');
  const m  = re.exec(content);
  if (!m) { console.error(`MISSING: ${varName}`); continue; }

  const filename = `src/locales/${locale}.js`;
  writeFileSync(filename, `export default {${m[1]}\n};\n`, 'utf-8');
  console.log(`  ${filename}`);
  extracted++;
}

console.log(`\nDone — ${extracted} locale files written to src/locales/`);
