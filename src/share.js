const B64_PREFIX = 'b64:';
const GZ_PREFIX  = 'gz:';
const THRESHOLD  = 8000;

function toB64url(str) {
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromB64url(str) {
  return atob(str.replace(/-/g, '+').replace(/_/g, '/'));
}

async function gzipB64(str) {
  const bytes = new TextEncoder().encode(str);
  const cs = new CompressionStream('gzip');
  const writer = cs.writable.getWriter();
  writer.write(bytes);
  writer.close();
  const buf = await new Response(cs.readable).arrayBuffer();
  const b = new Uint8Array(buf);
  let bin = '';
  for (let i = 0; i < b.length; i++) bin += String.fromCharCode(b[i]);
  return toB64url(bin);
}

async function gunzipB64(str) {
  const bin = fromB64url(str);
  const b = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) b[i] = bin.charCodeAt(i);
  const ds = new DecompressionStream('gzip');
  const writer = ds.writable.getWriter();
  writer.write(b);
  writer.close();
  const buf = await new Response(ds.readable).arrayBuffer();
  return new TextDecoder().decode(buf);
}

export async function encodeShareUrl(formats, layoutName) {
  const payload = JSON.stringify({ layoutName, formats });
  let hash;
  if (payload.length > THRESHOLD && typeof CompressionStream !== 'undefined') {
    const encoded = await gzipB64(payload);
    hash = GZ_PREFIX + encoded;
  } else {
    hash = B64_PREFIX + toB64url(payload);
  }
  const url = new URL(window.location.href);
  url.hash = 'layout=' + hash;
  return url.toString();
}

export async function decodeShareHash(hash) {
  if (!hash) return null;
  const match = hash.match(/^#?layout=(.+)$/);
  if (!match) return null;
  const raw = match[1];
  try {
    let json;
    if (raw.startsWith(GZ_PREFIX)) {
      json = await gunzipB64(raw.slice(GZ_PREFIX.length));
    } else if (raw.startsWith(B64_PREFIX)) {
      json = fromB64url(raw.slice(B64_PREFIX.length));
    } else {
      return null;
    }
    return JSON.parse(json);
  } catch {
    return null;
  }
}
