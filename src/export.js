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

export function exportJSON(bindings) {
  const blob = new Blob([JSON.stringify(bindings, null, 2)], { type: 'application/json' });
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
        else if (ext === 'xml') resolve(parseXML(text));
        else reject(new Error('Unsupported file type — use .xml or .json'));
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

function parseJSON(text) {
  const data = JSON.parse(text);
  const arr = Array.isArray(data) ? data : (data.bindings ?? []);
  return arr.map(b => ({
    key: String(b.key),
    modifiers: (Array.isArray(b.modifiers) ? b.modifiers : []).slice().sort(),
    action: String(b.action ?? ''),
  }));
}

function parseXML(text) {
  const doc = new DOMParser().parseFromString(text, 'application/xml');
  if (doc.querySelector('parsererror')) throw new Error('Invalid XML');
  return Array.from(doc.querySelectorAll('binding')).map(node => ({
    key: node.getAttribute('key') ?? '',
    modifiers: (node.getAttribute('modifiers') ?? '').split(',').filter(Boolean).sort(),
    action: node.getAttribute('action') ?? '',
  }));
}

export function exportPNG(svgId) {
  const svgEl = document.getElementById(svgId);
  if (!svgEl) return;

  const serializer = new XMLSerializer();
  const svgStr = serializer.serializeToString(svgEl);
  const svgBlob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  const vb = svgEl.viewBox.baseVal;
  const scale = 2;
  const canvas = document.createElement('canvas');
  canvas.width = vb.width * scale;
  canvas.height = vb.height * scale;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const img = new Image();
  img.onload = () => {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    URL.revokeObjectURL(url);
    canvas.toBlob(blob => download(blob, 'keybindings.png'), 'image/png');
  };
  img.src = url;
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
