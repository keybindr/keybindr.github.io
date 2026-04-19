export function exportXML(bindings) {
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<keybindings layout="104">',
    ...bindings.map(b => {
      const mods = b.modifiers.length ? ` modifiers="${b.modifiers.join(',')}"` : '';
      return `  <binding key="${b.key}"${mods} action="${escapeXml(b.action)}"/>`;
    }),
    '</keybindings>',
  ];
  const blob = new Blob([lines.join('\n')], { type: 'application/xml' });
  download(blob, 'keybindings.xml');
}

export function exportJSON(formats) {
  const data = {
    version: 2,
    formats: formats.map(f => ({ name: f.name, bindings: f.bindings, keyColors: f.keyColors })),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  download(blob, 'keybindings.json');
}

export function importFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const ext = file.name.split('.').pop().toLowerCase();
        if (ext === 'json') resolve(parseJSON(text));
        else if (ext === 'xml') resolve({ type: 'bindings', data: parseXML(text) });
        else reject(new Error('Unsupported file type — use .xml or .json'));
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

function parseBindingsArray(arr) {
  return (Array.isArray(arr) ? arr : []).map(b => ({
    key:       String(b.key ?? ''),
    modifiers: (Array.isArray(b.modifiers) ? b.modifiers : []).slice().sort(),
    action:    String(b.action ?? ''),
  }));
}

function parseJSON(text) {
  const data = JSON.parse(text);
  // Multi-format (v2)
  if (data.formats && Array.isArray(data.formats)) {
    return {
      type: 'formats',
      data: data.formats.slice(0, 3).map(f => ({
        name:      String(f.name ?? ''),
        bindings:  parseBindingsArray(f.bindings),
        keyColors: (f.keyColors && typeof f.keyColors === 'object') ? f.keyColors : {},
      })),
    };
  }
  // Legacy: flat array or { bindings: [...] }
  const arr = Array.isArray(data) ? data : (data.bindings ?? []);
  return { type: 'bindings', data: parseBindingsArray(arr) };
}

function parseXML(text) {
  const doc = new DOMParser().parseFromString(text, 'application/xml');
  if (doc.querySelector('parsererror')) throw new Error('Invalid XML');
  return Array.from(doc.querySelectorAll('binding')).map(node => ({
    key:       node.getAttribute('key') ?? '',
    modifiers: (node.getAttribute('modifiers') ?? '').split(',').filter(Boolean).sort(),
    action:    node.getAttribute('action') ?? '',
  }));
}

export function exportPNG(svgId, bindings = []) {
  const svgEl = document.getElementById(svgId);
  if (!svgEl) return;

  const serializer = new XMLSerializer();
  const svgStr = serializer.serializeToString(svgEl);
  const svgUrl = URL.createObjectURL(new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' }));

  const vb = svgEl.viewBox.baseVal;
  const scale = 2;
  const kbW = vb.width * scale;
  const kbH = vb.height * scale;
  const pad = 32;
  const rowH = 28;
  const headerH = 48;
  const listH = bindings.length > 0 ? headerH + bindings.length * rowH + pad : 0;
  const font = "'Courier New', monospace";

  const canvas = document.createElement('canvas');
  canvas.width = kbW;
  canvas.height = kbH + listH;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const img = new Image();
  img.onload = () => {
    ctx.drawImage(img, 0, 0, kbW, kbH);
    URL.revokeObjectURL(svgUrl);

    if (bindings.length > 0) {
      // Separator
      ctx.strokeStyle = '#3a3a3a';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(pad, kbH + 16);
      ctx.lineTo(kbW - pad, kbH + 16);
      ctx.stroke();

      // Column positions
      const cols = [pad, pad + 300, pad + 520];

      // Header
      ctx.font = `bold 11px ${font}`;
      ctx.fillStyle = '#666';
      ctx.fillText('KEY', cols[0], kbH + 36);
      ctx.fillText('MODIFIERS', cols[1], kbH + 36);
      ctx.fillText('ACTION', cols[2], kbH + 36);

      // Rows
      ctx.font = `13px ${font}`;
      bindings.forEach((b, i) => {
        const rowY = kbH + headerH + i * rowH;
        if (i % 2 === 0) {
          ctx.fillStyle = '#222';
          ctx.fillRect(0, rowY, kbW, rowH);
        }
        const ty = rowY + rowH * 0.68;
        ctx.fillStyle = '#f0c060';
        ctx.fillText(b.key, cols[0], ty);
        ctx.fillStyle = b.modifiers.length ? '#d0d0d0' : '#555';
        ctx.fillText(b.modifiers.join('+') || '—', cols[1], ty);
        ctx.fillStyle = '#d0d0d0';
        ctx.fillText(b.action, cols[2], ty);
      });
    }

    canvas.toBlob(blob => download(blob, 'keybindings.png'), 'image/png');
  };
  img.src = svgUrl;
}

function download(blob, filename) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
