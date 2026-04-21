// One-shot script: adds game preset translation keys to all language blocks.
// Run from repo root: node scripts/add-preset-translations.js
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'translations.js');
let content = fs.readFileSync(filePath, 'utf8');

// Each entry is keyed by the unique formatInVehicle value for that language.
// The script finds that string and appends the 6 new keys directly after it.
const byVehicle = {
  'In Vehicle': {               // en
    gameDefaults:   'Game Defaults',
    formatDefault:  'Default',
    formatVehicle:  'Vehicle',
    formatAircraft: 'Aircraft',
    importWtf:      'Import WoW .wtf',
    exportWtf:      'Export WoW .wtf',
  },
  'Im Fahrzeug': {              // de
    gameDefaults:   'Spiel-Standards',
    formatDefault:  'Standard',
    formatVehicle:  'Fahrzeug',
    formatAircraft: 'Luftfahrzeug',
    importWtf:      'WoW .wtf importieren',
    exportWtf:      'WoW .wtf exportieren',
  },
  'En v\u00e9hicule': {         // fr
    gameDefaults:   'Pr\u00e9r\u00e9glages du jeu',
    formatDefault:  'D\u00e9faut',
    formatVehicle:  'V\u00e9hicule',
    formatAircraft: 'A\u00e9ronef',
    importWtf:      'Importer WoW .wtf',
    exportWtf:      'Exporter WoW .wtf',
  },
  'En veh\u00edculo': {         // es
    gameDefaults:   'Ajustes de juego',
    formatDefault:  'Predeterminado',
    formatVehicle:  'Veh\u00edculo',
    formatAircraft: 'Aeronave',
    importWtf:      'Importar WoW .wtf',
    exportWtf:      'Exportar WoW .wtf',
  },
  'I fordon': {                 // sv
    gameDefaults:   'Spelstandarder',
    formatDefault:  'Standard',
    formatVehicle:  'Fordon',
    formatAircraft: 'Luftfartyg',
    importWtf:      'Importera WoW .wtf',
    exportWtf:      'Exportera WoW .wtf',
  },
  'I kj\u00f8ret\u00f8y': {    // nb
    gameDefaults:   'Spillstandarder',
    formatDefault:  'Standard',
    formatVehicle:  'Kj\u00f8ret\u00f8y',
    formatAircraft: 'Luftfart\u00f8y',
    importWtf:      'Importer WoW .wtf',
    exportWtf:      'Eksporter WoW .wtf',
  },
  'I k\u00f8ret\u00f8j': {     // da
    gameDefaults:   'Spilstandarder',
    formatDefault:  'Standard',
    formatVehicle:  'K\u00f8ret\u00f8j',
    formatAircraft: 'Luftfart\u00f8j',
    importWtf:      'Importer WoW .wtf',
    exportWtf:      'Eksporter WoW .wtf',
  },
  'Ajoneuvossa': {              // fi
    gameDefaults:   'Pelioletukset',
    formatDefault:  'Oletus',
    formatVehicle:  'Ajoneuvo',
    formatAircraft: 'Ilma-alus',
    importWtf:      'Tuo WoW .wtf',
    exportWtf:      'Vie WoW .wtf',
  },
  'In voertuig': {              // nl
    gameDefaults:   'Spelstandaarden',
    formatDefault:  'Standaard',
    formatVehicle:  'Voertuig',
    formatAircraft: 'Luchtvaartuig',
    importWtf:      'WoW .wtf importeren',
    exportWtf:      'WoW .wtf exporteren',
  },
  'W pojezdzie': {              // pl — note: some versions use ź
    gameDefaults:   'Ustawienia gry',
    formatDefault:  'Domy\u015blny',
    formatVehicle:  'Pojazd',
    formatAircraft: 'Samolot',
    importWtf:      'Importuj WoW .wtf',
    exportWtf:      'Eksportuj WoW .wtf',
  },
  'Ve vozidle': {               // cs
    gameDefaults:   'Hern\u00ed v\u00fdchoz\u00ed',
    formatDefault:  'V\u00fdchoz\u00ed',
    formatVehicle:  'Vozidlo',
    formatAircraft: 'Letadlo',
    importWtf:      'Importovat WoW .wtf',
    exportWtf:      'Exportovat WoW .wtf',
  },
  'Vo vozidle': {               // sk
    gameDefaults:   'Hern\u00e9 predvolen\u00e9',
    formatDefault:  'Predvolen\u00e9',
    formatVehicle:  'Vozidlo',
    formatAircraft: 'Lietadlo',
    importWtf:      'Importova\u0165 WoW .wtf',
    exportWtf:      'Exportova\u0165 WoW .wtf',
  },
  'J\u00e1rm\u0171ben': {      // hu
    gameDefaults:   'J\u00e1t\u00e9k alap\u00e9rt\u00e9kek',
    formatDefault:  'Alap\u00e9rtelmezett',
    formatVehicle:  'J\u00e1rm\u0171',
    formatAircraft: 'L\u00e9gij\u00e1rm\u0171',
    importWtf:      'WoW .wtf import\u00e1l\u00e1sa',
    exportWtf:      'WoW .wtf export\u00e1l\u00e1sa',
  },
  '\u00cen vehicul': {          // ro
    gameDefaults:   'Implicite joc',
    formatDefault:  'Implicit',
    formatVehicle:  'Vehicul',
    formatAircraft: 'Aeronav\u0103',
    importWtf:      'Importa\u021bi WoW .wtf',
    exportWtf:      'Exporta\u021bi WoW .wtf',
  },
  'No ve\u00edculo': {          // ptBR
    gameDefaults:   'Padr\u00f5es do jogo',
    formatDefault:  'Padr\u00e3o',
    formatVehicle:  'Ve\u00edculo',
    formatAircraft: 'Aeronave',
    importWtf:      'Importar WoW .wtf',
    exportWtf:      'Exportar WoW .wtf',
  },
  'In veicolo': {               // it
    gameDefaults:   'Impostazioni di gioco',
    formatDefault:  'Predefinito',
    formatVehicle:  'Veicolo',
    formatAircraft: 'Aeromobile',
    importWtf:      'Importa WoW .wtf',
    exportWtf:      'Esporta WoW .wtf',
  },
  'Ara\u00e7ta': {              // tr
    gameDefaults:   'Oyun Varsay\u0131lanlar\u0131',
    formatDefault:  'Varsay\u0131lan',
    formatVehicle:  'Ara\u00e7',
    formatAircraft: 'U\u00e7ak',
    importWtf:      'WoW .wtf i\u00e7e aktar',
    exportWtf:      'WoW .wtf d\u0131\u015fa aktar',
  },
  '\u03a3\u03b5 \u03cc\u03c7\u03b7\u03bc\u03b1': {  // el
    gameDefaults:   '\u03a0\u03c1\u03bf\u03b5\u03c0\u03b9\u03bb\u03bf\u03b3\u03ad\u03c2 \u03c0\u03b1\u03b9\u03c7\u03bd\u03b9\u03b4\u03b9\u03bf\u03cd',
    formatDefault:  '\u03a0\u03c1\u03bf\u03b5\u03c0\u03b9\u03bb\u03bf\u03b3\u03ae',
    formatVehicle:  '\u038c\u03c7\u03b7\u03bc\u03b1',
    formatAircraft: '\u0391\u03b5\u03c1\u03bf\u03c3\u03ba\u03ac\u03c6\u03bf\u03c2',
    importWtf:      '\u0395\u03b9\u03c3\u03b1\u03b3\u03c9\u03b3\u03ae WoW .wtf',
    exportWtf:      '\u0395\u03be\u03b1\u03b3\u03c9\u03b3\u03ae WoW .wtf',
  },
  'Tr\u00ean xe': {             // vi
    gameDefaults:   'M\u1eb7c \u0111\u1ecbnh tr\u00f2 ch\u01a1i',
    formatDefault:  'M\u1eb7c \u0111\u1ecbnh',
    formatVehicle:  'Xe',
    formatAircraft: 'M\u00e1y bay',
    importWtf:      'Nh\u1eadp WoW .wtf',
    exportWtf:      'Xu\u1ea5t WoW .wtf',
  },
  '\u0412 \u043f\u0440\u0435\u0432\u043e\u0437\u043d\u043e \u0441\u0440\u0435\u0434\u0441\u0442\u0432\u043e': {  // bg
    gameDefaults:   '\u0421\u0442\u0430\u043d\u0434\u0430\u0440\u0442\u0438 \u043d\u0430 \u0438\u0433\u0440\u0430\u0442\u0430',
    formatDefault:  '\u041f\u043e \u043f\u043e\u0434\u0440\u0430\u0437\u0431\u0438\u0440\u0430\u043d\u0435',
    formatVehicle:  '\u041f\u0440\u0435\u0432\u043e\u0437\u043d\u043e \u0441\u0440\u0435\u0434\u0441\u0442\u0432\u043e',
    formatAircraft: '\u0421\u0430\u043c\u043e\u043b\u0435\u0442',
    importWtf:      '\u0418\u043c\u043f\u043e\u0440\u0442\u0438\u0440\u0430\u043d\u0435 \u043d\u0430 WoW .wtf',
    exportWtf:      '\u0415\u043a\u0441\u043f\u043e\u0440\u0442\u0438\u0440\u0430\u043d\u0435 \u043d\u0430 WoW .wtf',
  },
  '\u0423 \u0432\u043e\u0437\u0438\u043b\u0443': {   // sr
    gameDefaults:   '\u041f\u043e\u0434\u0440\u0430\u0437\u0443\u043c\u0435\u0432\u0430\u043d\u043e \u0437\u0430 \u0438\u0433\u0440\u0443',
    formatDefault:  '\u041f\u043e\u0434\u0440\u0430\u0437\u0443\u043c\u0435\u0432\u0430\u043d\u043e',
    formatVehicle:  '\u0412\u043e\u0437\u0438\u043b\u043e',
    formatAircraft: '\u0412\u0430\u0437\u0434\u0443\u0445\u043e\u043f\u043b\u043e\u0432',
    importWtf:      '\u0423\u0432\u0435\u0437\u0438 WoW .wtf',
    exportWtf:      '\u0418\u0437\u0432\u0435\u0437\u0438 WoW .wtf',
  },
  'U vozilu': {                 // hr
    gameDefaults:   'Zadane igre',
    formatDefault:  'Zadano',
    formatVehicle:  'Vozilo',
    formatAircraft: 'Zrakoplov',
    importWtf:      'Uvezi WoW .wtf',
    exportWtf:      'Izvezi WoW .wtf',
  },
  '\u0412 \u0442\u0440\u0430\u043d\u0441\u043f\u043e\u0440\u0442\u0435': {  // ru
    gameDefaults:   '\u0421\u0442\u0430\u043d\u0434\u0430\u0440\u0442\u044b \u0438\u0433\u0440\u044b',
    formatDefault:  '\u041f\u043e \u0443\u043c\u043e\u043b\u0447\u0430\u043d\u0438\u044e',
    formatVehicle:  '\u0422\u0440\u0430\u043d\u0441\u043f\u043e\u0440\u0442',
    formatAircraft: '\u0421\u0430\u043c\u043e\u043b\u0451\u0442',
    importWtf:      '\u0418\u043c\u043f\u043e\u0440\u0442 WoW .wtf',
    exportWtf:      '\u042d\u043a\u0441\u043f\u043e\u0440\u0442 WoW .wtf',
  },
  '\u0423 \u0442\u0440\u0430\u043d\u0441\u043f\u043e\u0440\u0442\u0456': {  // uk
    gameDefaults:   '\u0421\u0442\u0430\u043d\u0434\u0430\u0440\u0442\u0438 \u0433\u0440\u0438',
    formatDefault:  '\u0417\u0430 \u0437\u0430\u043c\u043e\u0432\u0447\u0443\u0432\u0430\u043d\u043d\u044f\u043c',
    formatVehicle:  '\u0422\u0440\u0430\u043d\u0441\u043f\u043e\u0440\u0442',
    formatAircraft: '\u041b\u0456\u0442\u0430\u043a',
    importWtf:      '\u0406\u043c\u043f\u043e\u0440\u0442 WoW .wtf',
    exportWtf:      '\u0415\u043a\u0441\u043f\u043e\u0440\u0442 WoW .wtf',
  },
  '\ud0d1\uc2b9 \uc911': {      // ko
    gameDefaults:   '\uac8c\uc784 \uae30\ubcf8\uac12',
    formatDefault:  '\uae30\ubcf8\uac12',
    formatVehicle:  '\ucc28\ub7c9',
    formatAircraft: '\ud56d\uacf5\uae30',
    importWtf:      'WoW .wtf \uac00\uc838\uc624\uae30',
    exportWtf:      'WoW .wtf \ub0b4\ubcf4\ub0b4\uae30',
  },
  '\u9a7e\u8f66': {             // zhCN
    gameDefaults:   '\u6e38\u620f\u9ed8\u8ba4\u8bbe\u7f6e',
    formatDefault:  '\u9ed8\u8ba4',
    formatVehicle:  '\u8f7d\u5177',
    formatAircraft: '\u98de\u884c\u5668',
    importWtf:      '\u5bfc\u5165 WoW .wtf',
    exportWtf:      '\u5bfc\u51fa WoW .wtf',
  },
  '\u8eca\u4e21': {             // ja
    gameDefaults:   '\u30b2\u30fc\u30e0\u306e\u30c7\u30d5\u30a9\u30eb\u30c8',
    formatDefault:  '\u30c7\u30d5\u30a9\u30eb\u30c8',
    formatVehicle:  '\u8eca\u4e21',
    formatAircraft: '\u822a\u7a7a\u6a5f',
    importWtf:      'WoW .wtf \u3092\u30a4\u30f3\u30dd\u30fc\u30c8',
    exportWtf:      'WoW .wtf \u3092\u30a8\u30af\u30b9\u30dd\u30fc\u30c8',
  },
  'Berkendara': {               // id
    gameDefaults:   'Default Game',
    formatDefault:  'Default',
    formatVehicle:  'Kendaraan',
    formatAircraft: 'Pesawat',
    importWtf:      'Impor WoW .wtf',
    exportWtf:      'Ekspor WoW .wtf',
  },
};

// Value starts at column 23 (2-space indent + key + colon + padding)
function formatLine(key, value) {
  const padding = ' '.repeat(Math.max(1, 23 - key.length - 3));
  return `  ${key}:${padding}'${value}',`;
}

let result = content;
let matched = 0;

for (const [inVehicle, keys] of Object.entries(byVehicle)) {
  const needle = `formatInVehicle:     '${inVehicle}',`;
  if (!result.includes(needle)) {
    console.error(`NOT FOUND: formatInVehicle = '${inVehicle}'`);
    continue;
  }
  const addition = Object.entries(keys).map(([k, v]) => formatLine(k, v)).join('\n');
  result = result.replace(needle, `${needle}\n${addition}`);
  matched++;
}

console.log(`Matched ${matched} / ${Object.keys(byVehicle).length} language blocks.`);

// ptPT spreads ptBR — add overrides for the two strings that differ
const ptPTAnchor = `  currentColor:       'Cor actual',\n};`;
const ptPTReplacement =
  `  gameDefaults:        'Predefini\u00e7\u00f5es do jogo',\n` +
  `  formatDefault:       'Predefini\u00e7\u00e3o',\n` +
  `  formatVehicle:       'Ve\u00edculo',\n` +
  `  formatAircraft:      'Aeronave',\n` +
  `  importWtf:           'Importar WoW .wtf',\n` +
  `  exportWtf:           'Exportar WoW .wtf',\n` +
  `  currentColor:       'Cor actual',\n};`;

if (result.includes(ptPTAnchor)) {
  result = result.replace(ptPTAnchor, ptPTReplacement);
  console.log('ptPT overrides added.');
} else {
  console.error('ptPT anchor not found!');
}

fs.writeFileSync(filePath, result, 'utf8');
console.log('translations.js updated.');
