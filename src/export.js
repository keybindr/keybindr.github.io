import { KEYS, KEY_MAP, KEYBOARD_WIDTH, KEYBOARD_HEIGHT } from './keyboardLayout';

// Reverse map: human label → internal key ID (for JSON import)
const LABEL_TO_KEY = Object.fromEntries(
  Object.entries(KEY_MAP).filter(([, v]) => v.label).map(([id, v]) => [v.label, id])
);

// ── Keyboard SVG generation ───────────────────────────────────────────────────
// Mirrors the rendering logic in Keyboard.jsx so each format can be rendered
// independently without touching the live DOM.

const KEY_DEFAULT    = '#2a2a2a';
const KEY_BOUND      = '#3d3420';
const BORDER_DEFAULT = '#444';
const BORDER_BOUND   = '#e0a84b';
const TEXT_DEFAULT   = '#aaa';
const TEXT_BOUND     = '#f5e0b0';
const TRI            = 10;

const KEY_ACCENT = {
  ShiftLeft: '#7b9ee0', ShiftRight: '#7b9ee0',
  AltLeft:   '#7be09a', AltRight:   '#7be09a',
  ControlLeft: '#e07b39', ControlRight: '#e07b39',
};

const TRI_COLORS = {
  Shift: '#7b9ee0', ShiftLeft: '#7b9ee0', ShiftRight: '#7b9ee0',
  Alt:   '#7be09a', AltLeft:   '#7be09a', AltRight:   '#7be09a',
  Ctrl:  '#e07b39', CtrlLeft:  '#e07b39', CtrlRight:  '#e07b39',
};

const MOD_KEY_IDS = {
  Shift:  ['ShiftLeft','ShiftRight'], ShiftLeft:  ['ShiftLeft'],    ShiftRight:  ['ShiftRight'],
  Alt:    ['AltLeft','AltRight'],     AltLeft:    ['AltLeft'],      AltRight:    ['AltRight'],
  Ctrl:   ['ControlLeft','ControlRight'], CtrlLeft: ['ControlLeft'], CtrlRight:  ['ControlRight'],
};

const MOD_CORNER = {
  Shift: 'shift', ShiftLeft: 'shift', ShiftRight: 'shift',
  Alt:   'alt',   AltLeft:   'alt',   AltRight:   'alt',
  Ctrl:  'ctrl',  CtrlLeft:  'ctrl',  CtrlRight:  'ctrl',
};

const SPLIT_LABELS = {
  ShiftLeft: 'LShift', ShiftRight: 'RShift',
  ControlLeft: 'LCtrl', ControlRight: 'RCtrl',
  AltLeft: 'LAlt', AltRight: 'RAlt',
};

const MOD_COLORS = {
  Ctrl:  '#e07b39', CtrlLeft:  '#e07b39', CtrlRight:  '#e07b39',
  Shift: '#7b9ee0', ShiftLeft: '#7b9ee0', ShiftRight: '#7b9ee0',
  Alt:   '#7be09a', AltLeft:   '#7be09a', AltRight:   '#7be09a',
};

function modFill(hex) {
  if (!hex || hex.length < 7) return KEY_DEFAULT;
  const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
  const bg = 0x1a;
  const h = n => Math.max(0,Math.min(255,n)).toString(16).padStart(2,'0');
  const blend = c => Math.round(bg + (c - bg) * 0.25);
  return `#${h(blend(r))}${h(blend(g))}${h(blend(b))}`;
}

function triColor(mod, keyColors) {
  for (const id of (MOD_KEY_IDS[mod] || [])) if (keyColors[id]) return keyColors[id];
  return TRI_COLORS[mod] || '#888';
}

function triPts(mod, { x, y, w, h }) {
  const s = TRI;
  if (mod === 'Shift' || mod === 'ShiftLeft' || mod === 'ShiftRight')
    return `${x+w},${y} ${x+w},${y+s} ${x+w-s},${y}`;
  if (mod === 'Alt' || mod === 'AltLeft' || mod === 'AltRight')
    return `${x+w},${y+h} ${x+w},${y+h-s} ${x+w-s},${y+h}`;
  return `${x},${y+h} ${x},${y+h-s} ${x+s},${y+h}`;
}

function splitTriPts(corner, { x, y, w, h }) {
  const s = TRI, e = s * 1.4142;
  if (corner === 'shift') return [
    `${x+w},${y} ${x+w},${y+s} ${x+w-s},${y}`,
    `${x+w},${y+s} ${x+w-s},${y} ${x+w-s-e},${y} ${x+w},${y+s+e}`,
  ];
  if (corner === 'alt') return [
    `${x+w},${y+h} ${x+w},${y+h-s} ${x+w-s},${y+h}`,
    `${x+w},${y+h-s} ${x+w-s},${y+h} ${x+w-s-e},${y+h} ${x+w},${y+h-s-e}`,
  ];
  return [
    `${x},${y+h} ${x},${y+h-s} ${x+s},${y+h}`,
    `${x},${y+h-s} ${x+s},${y+h} ${x+s+e},${y+h} ${x},${y+h-s-e}`,
  ];
}

function buildKeyboardSVG(bindings, keyColors, settings) {
  const { splitModifiers } = settings;
  const bmap = {};
  for (const b of bindings) {
    if (!bmap[b.key]) bmap[b.key] = [];
    bmap[b.key].push(b);
  }

  const clips = KEYS.map(k =>
    `<clipPath id="kc-${k.id}"><rect x="${k.x}" y="${k.y}" width="${k.w}" height="${k.h}" rx="4"/></clipPath>`
  ).join('');

  const keyEls = KEYS.map(k => {
    const bs     = bmap[k.id] || [];
    const bound  = bs.length > 0;
    const custom = keyColors[k.id];
    const accent = KEY_ACCENT[k.id];
    const fill   = custom ? custom : accent ? modFill(accent) : bound ? KEY_BOUND : KEY_DEFAULT;
    const stroke = bound ? BORDER_BOUND : accent ? accent : BORDER_DEFAULT;
    const tcol   = bound ? TEXT_BOUND : TEXT_DEFAULT;
    const label  = escapeXml((splitModifiers && SPLIT_LABELS[k.id]) ? SPLIT_LABELS[k.id] : k.label);
    const fs     = k.w > 60 ? 11 : 10;
    const sw     = bound ? 1.5 : 1;

    const mods = [...new Set(bs.flatMap(b => b.modifiers))];
    const corners = {};
    for (const m of mods) {
      const c = MOD_CORNER[m]; if (!c) continue;
      if (!corners[c]) corners[c] = [];
      corners[c].push({ m, color: triColor(m, keyColors) });
    }

    const polys = Object.entries(corners).flatMap(([corner, ents]) => {
      const cp = `clip-path="url(#kc-${k.id})"`;
      if (ents.length === 1)
        return [`<polygon points="${triPts(ents[0].m, k)}" fill="${ents[0].color}" ${cp}/>`];
      const L = ents.find(e => e.m.endsWith('Left')) ?? ents[0];
      const R = ents.find(e => e !== L) ?? ents[1];
      const [lp, rp] = splitTriPts(corner, k);
      return [
        `<polygon points="${lp}" fill="${L.color}" ${cp}/>`,
        `<polygon points="${rp}" fill="${R.color}" ${cp}/>`,
      ];
    }).join('');

    return `<g><rect x="${k.x}" y="${k.y}" width="${k.w}" height="${k.h}" rx="4" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/><text x="${k.x+k.w/2}" y="${k.y+k.h/2+1}" text-anchor="middle" dominant-baseline="middle" font-size="${fs}" font-family="'Courier New',monospace" fill="${tcol}">${label}</text>${polys}</g>`;
  }).join('');

  const leds = [
    { label: 'NUM', cx: 882 }, { label: 'CAPS', cx: 948 }, { label: 'SCRL', cx: 1014 },
  ].map(({ label, cx }) =>
    `<g><rect x="${cx-14}" y="6" width="28" height="32" rx="4" fill="#1a1a1a" stroke="#333" stroke-width="1"/><circle cx="${cx}" cy="18" r="4" fill="#1c3320" stroke="#2d4d33" stroke-width="1"/><text x="${cx}" y="31" text-anchor="middle" font-size="7" font-family="'Courier New',monospace" fill="#444" letter-spacing="0.5">${label}</text></g>`
  ).join('');

  return `<svg viewBox="0 0 ${KEYBOARD_WIDTH} ${KEYBOARD_HEIGHT}" xmlns="http://www.w3.org/2000/svg"><rect width="${KEYBOARD_WIDTH}" height="${KEYBOARD_HEIGHT}" fill="#1a1a1a"/><defs>${clips}</defs>${keyEls}${leds}</svg>`;
}

// ── Canvas helpers ────────────────────────────────────────────────────────────

function svgToCanvas(ctx, svgStr, x, y, w, h) {
  return new Promise((resolve, reject) => {
    const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const img  = new Image();
    img.onload  = () => { ctx.drawImage(img, x, y, w, h); URL.revokeObjectURL(url); resolve(); };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('SVG render failed')); };
    img.src = url;
  });
}

function drawLegend(ctx, x, y, keyColors, splitModifiers, S) {
  const items = splitModifiers ? [
    { label: 'LShift', color: keyColors['ShiftLeft']    || '#7b9ee0', dir: 'shift' },
    { label: 'RShift', color: keyColors['ShiftRight']   || '#7b9ee0', dir: 'shift' },
    { label: 'LAlt',   color: keyColors['AltLeft']      || '#7be09a', dir: 'alt'   },
    { label: 'RAlt',   color: keyColors['AltRight']     || '#7be09a', dir: 'alt'   },
    { label: 'LCtrl',  color: keyColors['ControlLeft']  || '#e07b39', dir: 'ctrl'  },
    { label: 'RCtrl',  color: keyColors['ControlRight'] || '#e07b39', dir: 'ctrl'  },
  ] : [
    { label: 'Shift', color: keyColors['ShiftLeft']  || keyColors['ShiftRight']   || '#7b9ee0', dir: 'shift' },
    { label: 'Alt',   color: keyColors['AltLeft']    || keyColors['AltRight']     || '#7be09a', dir: 'alt'   },
    { label: 'Ctrl',  color: keyColors['ControlLeft']|| keyColors['ControlRight'] || '#e07b39', dir: 'ctrl'  },
  ];

  const s = 10 * S;
  ctx.font = `${12 * S}px 'Courier New', monospace`;
  let cx = x;

  for (const { label, color, dir } of items) {
    ctx.fillStyle = color;
    ctx.beginPath();
    if (dir === 'shift')      { ctx.moveTo(cx+s, y); ctx.lineTo(cx+s, y+s); ctx.lineTo(cx, y); }
    else if (dir === 'alt')   { ctx.moveTo(cx+s, y+s); ctx.lineTo(cx+s, y); ctx.lineTo(cx, y+s); }
    else                      { ctx.moveTo(cx, y+s); ctx.lineTo(cx, y); ctx.lineTo(cx+s, y+s); }
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#aaa';
    ctx.fillText(label, cx + s + 4*S, y + s * 0.85);
    cx += s + 4*S + ctx.measureText(label).width + 18*S;
  }
}

function roundRectPath(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function fillRoundRect(ctx, x, y, w, h, r, color) {
  ctx.save();
  ctx.fillStyle = color;
  roundRectPath(ctx, x, y, w, h, r);
  ctx.fill();
  ctx.restore();
}

function strokeRoundRect(ctx, x, y, w, h, r, color, lineWidth) {
  ctx.save();
  if (color    != null) ctx.strokeStyle = color;
  if (lineWidth != null) ctx.lineWidth  = lineWidth;
  roundRectPath(ctx, x, y, w, h, r);
  ctx.stroke();
  ctx.restore();
}

function clampText(ctx, text, maxW) {
  if (ctx.measureText(text).width <= maxW) return text;
  while (text.length > 0 && ctx.measureText(text + '…').width > maxW) text = text.slice(0,-1);
  return text + '…';
}

function drawBindingTable(ctx, bindings, x, y, availW, S) {
  const FONT    = `'Courier New', monospace`;
  const rowH    = 26 * S;
  const headerH = 32 * S;
  const colKey  = x + 160 * S;
  const colAct  = x + 260 * S;
  const maxActW = availW - (colAct - x) - 16 * S;

  ctx.font      = `bold ${10 * S}px ${FONT}`;
  ctx.fillStyle = '#555';
  ctx.fillText('MODIFIER', x,      y + headerH * 0.7);
  ctx.fillText('KEY',      colKey, y + headerH * 0.7);
  ctx.fillText('ACTION',   colAct, y + headerH * 0.7);

  ctx.strokeStyle = '#2a2a2a';
  ctx.lineWidth   = S;
  ctx.beginPath();
  ctx.moveTo(x, y + headerH);
  ctx.lineTo(x + availW, y + headerH);
  ctx.stroke();

  for (let i = 0; i < bindings.length; i++) {
    const b    = bindings[i];
    const rowY = y + headerH + i * rowH;
    const ty   = rowY + rowH * 0.68;

    if (i % 2 === 0) {
      ctx.fillStyle = '#1f1f1f';
      ctx.fillRect(x, rowY, availW, rowH);
    }

    if (b.modifiers.length > 0) {
      let mx = x;
      ctx.font = `${9 * S}px ${FONT}`;
      for (const m of b.modifiers) {
        const color = MOD_COLORS[m] || '#888';
        const tw    = ctx.measureText(m).width + 8 * S;
        const tagH  = rowH * 0.55;
        const tagY  = rowY + (rowH - tagH) / 2;
        ctx.save();
        strokeRoundRect(ctx, mx, tagY, tw, tagH, 2 * S, color, S * 0.7);
        ctx.fillStyle = color;
        ctx.fillText(m, mx + 4 * S, ty);
        ctx.restore();
        mx += tw + 3 * S;
      }
    } else {
      ctx.font      = `${12 * S}px ${FONT}`;
      ctx.fillStyle = '#444';
      ctx.fillText('—', x, ty);
    }

    ctx.font      = `bold ${12 * S}px ${FONT}`;
    ctx.fillStyle = '#f0c060';
    ctx.fillText(KEY_MAP[b.key]?.label ?? b.key, colKey, ty);

    ctx.font      = `${12 * S}px ${FONT}`;
    ctx.fillStyle = '#ccc';
    ctx.fillText(clampText(ctx, b.action || '', maxActW), colAct, ty);
  }
}

async function renderFormatToCanvas(format, layoutName, settings) {
  const S    = 2;
  const FONT = `'Fira Code', 'Courier New', monospace`;
  const pad  = 32 * S;

  const bindings = format.bindings || [];
  const kc       = format.keyColors || {};

  // Content width — matches separator line, same on both sides of keyboard/table
  const totalW   = KEYBOARD_WIDTH * S;
  const contentW = totalW - 2 * pad;

  // Keyboard container: keyboard SVG inset with padding inside a rounded box
  const kbInset      = 16 * S;
  const kbDrawW      = contentW - 2 * kbInset;
  const kbDrawH      = Math.round(kbDrawW * KEYBOARD_HEIGHT / KEYBOARD_WIDTH);
  const kbBoxH       = kbDrawH + 2 * kbInset;

  // Binding table container
  const tblInset     = 16 * S;
  const tblInnerW    = contentW - 2 * tblInset;
  const tblRowH      = 26 * S;
  const tblHeaderH   = 32 * S;
  const tblContentH  = bindings.length > 0 ? tblHeaderH + bindings.length * tblRowH : 0;
  const tblBoxH      = bindings.length > 0 ? tblContentH + 2 * tblInset : 0;

  // Section heights (already in canvas px)
  const sTopPad = 24 * S;
  const sTitle  = 28 * S;
  const sGap1   = 10 * S;
  const sSub    = 18 * S;
  const sGap2   = 16 * S;
  const sLegend = 10 * S;
  const sGap3   = 16 * S;
  const sKbBox  = kbBoxH;
  const sGap4   = 20 * S;
  const sSep    =  2 * S;
  const sGap5   = 16 * S;
  const sTblBox = tblBoxH;
  const sGap6   = bindings.length > 0 ? 20 * S : 0;
  const sFooter = 14 * S;
  const sBotPad = 24 * S;

  const totalH = sTopPad + sTitle + sGap1 + sSub + sGap2 + sLegend + sGap3 +
                 sKbBox + sGap4 + sSep + sGap5 + sTblBox + sGap6 + sFooter + sBotPad;

  const canvas = document.createElement('canvas');
  canvas.width  = totalW;
  canvas.height = totalH;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(0, 0, totalW, totalH);

  let y = sTopPad;

  // Layout name — accent color, uppercase, bold, letter-spacing
  y += sTitle;
  ctx.font      = `bold ${22 * S}px ${FONT}`;
  ctx.fillStyle = '#e0a84b';
  if ('letterSpacing' in ctx) ctx.letterSpacing = `${Math.round(0.05 * 22 * S)}px`;
  ctx.fillText((layoutName || 'Keybind Layout').toUpperCase(), pad, y);
  if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';
  y += sGap1;

  // Format name (subtitle)
  y += sSub;
  ctx.font      = `${14 * S}px ${FONT}`;
  ctx.fillStyle = '#777';
  ctx.fillText(format.name || 'Format', pad, y);
  y += sGap2;

  // Legend
  drawLegend(ctx, pad, y, kc, settings.splitModifiers, S);
  y += sLegend + sGap3;

  // Keyboard container box
  fillRoundRect  (ctx, pad, y, contentW, kbBoxH, 8 * S, '#111');
  strokeRoundRect(ctx, pad, y, contentW, kbBoxH, 8 * S, '#3a3a3a', S);
  await svgToCanvas(ctx, buildKeyboardSVG(bindings, kc, settings),
    pad + kbInset, y + kbInset, kbDrawW, kbDrawH);
  y += sKbBox + sGap4;

  // Separator
  ctx.strokeStyle = '#333';
  ctx.lineWidth   = S;
  ctx.beginPath();
  ctx.moveTo(pad, y);
  ctx.lineTo(pad + contentW, y);
  ctx.stroke();
  y += sSep + sGap5;

  // Binding table container box
  if (bindings.length > 0) {
    fillRoundRect  (ctx, pad, y, contentW, tblBoxH, 8 * S, '#1a1a1a');
    strokeRoundRect(ctx, pad, y, contentW, tblBoxH, 8 * S, '#3a3a3a', S);
    drawBindingTable(ctx, bindings, pad + tblInset, y + tblInset, tblInnerW, S);
    y += sTblBox + sGap6;
  }

  // Footer
  ctx.font      = `${10 * S}px ${FONT}`;
  ctx.fillStyle = '#f0c060';
  ctx.fillText('Generated @ keybindr.github.io', pad, totalH - sBotPad);

  return canvas;
}

// ── Public exports ────────────────────────────────────────────────────────────

export function exportJSON(formats, layoutName) {
  const data = {
    version: 3,
    layoutName: layoutName || '',
    formats: formats.map(f => ({
      name: f.name,
      bindings: f.bindings.map(b => ({
        key:       KEY_MAP[b.key]?.label ?? b.key,
        modifiers: b.modifiers,
        action:    b.action,
      })),
      keyColors: f.keyColors,
    })),
  };
  const filename = sanitizeFilename(layoutName || 'keybindings') + '.json';
  download(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }), filename);
}

export async function exportPNG(formats, layoutName, settings) {
  if (formats.length === 1) {
    const canvas = await renderFormatToCanvas(formats[0], layoutName, settings);
    const blob   = await new Promise(res => canvas.toBlob(res, 'image/png'));
    const name   = sanitizeFilename(formats[0].name || layoutName || 'keybindings') + '.png';
    download(blob, name);
    return;
  }

  const { default: JSZip } = await import('jszip');
  const zip = new JSZip();

  for (const format of formats) {
    const canvas = await renderFormatToCanvas(format, layoutName, settings);
    const blob   = await new Promise(res => canvas.toBlob(res, 'image/png'));
    zip.file(`${sanitizeFilename(format.name || 'format')}.png`, blob);
  }

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  download(zipBlob, 'keybind layouts.zip');
}

export function importFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const ext = file.name.split('.').pop().toLowerCase();
        if (ext !== 'json') { reject(new Error('Unsupported file type — use .json')); return; }
        resolve(parseJSON(e.target.result));
      } catch (err) { reject(err); }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

// ── Import parsing ────────────────────────────────────────────────────────────

function parseBindingsArray(arr) {
  return (Array.isArray(arr) ? arr : []).map(b => {
    const raw = String(b.key ?? '');
    return {
      key:       LABEL_TO_KEY[raw] ?? raw,
      modifiers: (Array.isArray(b.modifiers) ? b.modifiers : []).slice().sort(),
      action:    String(b.action ?? ''),
    };
  });
}

function parseJSON(text) {
  const data = JSON.parse(text);
  if (data.formats && Array.isArray(data.formats)) {
    const formats = data.formats.slice(0, 5).map(f => ({
      name:      String(f.name ?? ''),
      bindings:  parseBindingsArray(f.bindings),
      keyColors: (f.keyColors && typeof f.keyColors === 'object') ? f.keyColors : {},
    }));
    if (data.version >= 3 && data.layoutName !== undefined) {
      return { type: 'full', data: { layoutName: String(data.layoutName), formats } };
    }
    return { type: 'formats', data: formats };
  }
  const arr = Array.isArray(data) ? data : (data.bindings ?? []);
  return { type: 'bindings', data: parseBindingsArray(arr) };
}

// ── Utilities ─────────────────────────────────────────────────────────────────

function download(blob, filename) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

function sanitizeFilename(name) {
  return String(name).replace(/[^\w\s\-]/g, '').replace(/\s+/g, '_').slice(0, 60) || 'keybindr';
}

function escapeXml(str) {
  return String(str ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
