import React from 'react';

// ── Colour constants (mirrors keyboard SVG palette) ───────────────────────────
const K_DEF = '#222';
const K_BND = '#2a2f20';
const S_DEF = '#3a3a3a';
const S_BND = '#e0a84b';
const T_DEF = '#666';
const T_BND = '#f5e0b0';

function clamp(str, n) {
  if (!str) return '';
  return str.length > n ? str.slice(0, n - 1) + '…' : str;
}

// ── Registry — add more profile diagrams here when ready ─────────────────────
const DIAGRAMS = {
  'razer-deathadder-v3': DeathAdderV3,
};

export default function MouseDiagram({ profile, mouseBindings }) {
  const Diagram = DIAGRAMS[profile?.id];
  if (!Diagram) return null;
  return <Diagram mouseBindings={mouseBindings} profile={profile} />;
}

// ── Razer DeathAdder V3 ───────────────────────────────────────────────────────
// Top-down view, 160 × 242 viewBox.
// Buttons: Mouse1 (left), Mouse2 (right), Mouse3 (scroll click),
//          Mouse4 (back), Mouse5 (forward), WheelUp, WheelDown.

function DeathAdderV3({ mouseBindings, profile }) {
  const bound = {};
  for (const b of mouseBindings) bound[b.button] = b.action;

  const fill   = id => id in bound ? K_BND : K_DEF;
  const stroke = id => id in bound ? S_BND : S_DEF;
  const tcol   = id => id in bound ? T_BND : T_DEF;
  const lbl    = (id, fb, max) => clamp(id in bound ? bound[id] : fb, max);

  // Mouse body silhouette — ergonomic right-hand shape, top-down view
  const BODY = [
    'M 28,10 L 132,10',
    'C 150,10 154,24 154,40',
    'L 154,120',
    'C 154,150 148,174 136,192',
    'C 122,213 106,225 80,228',
    'C 54,225 38,213 24,192',
    'C 12,174 6,150 6,120',
    'L 6,40',
    'C 6,24 10,10 28,10 Z',
  ].join(' ');

  return (
    <svg
      viewBox="0 0 160 242"
      style={{ width: 130, flexShrink: 0, display: 'block' }}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="DeathAdder V3 mouse diagram"
    >
      <defs>
        <clipPath id="dav3-body">
          <path d={BODY} />
        </clipPath>
      </defs>

      {/* ── Body base fill ───────────────────────────────────────────── */}
      <path d={BODY} fill="#1a1a1a" />

      {/* ── Left button (Mouse1) ─────────────────────────────────────── */}
      <rect x="6" y="10" width="62" height="80"
        clipPath="url(#dav3-body)" fill={fill('Mouse1')} />
      {'Mouse1' in bound && (
        <rect x="7.5" y="11.5" width="59" height="77"
          clipPath="url(#dav3-body)" fill="none" stroke={S_BND} strokeWidth="1.5" />
      )}

      {/* ── Right button (Mouse2) ────────────────────────────────────── */}
      <rect x="92" y="10" width="62" height="80"
        clipPath="url(#dav3-body)" fill={fill('Mouse2')} />
      {'Mouse2' in bound && (
        <rect x="92.5" y="11.5" width="60" height="77"
          clipPath="url(#dav3-body)" fill="none" stroke={S_BND} strokeWidth="1.5" />
      )}

      {/* ── Centre channel (covers any button rect bleed) ────────────── */}
      <rect x="68" y="10" width="24" height="80"
        clipPath="url(#dav3-body)" fill="#1a1a1a" />

      {/* ── WheelUp indicator (triangle above wheel) ─────────────────── */}
      <polygon points="80,13 74,22 86,22" fill={stroke('WheelUp')} />

      {/* ── Scroll wheel (Mouse3) ────────────────────────────────────── */}
      <rect x="73" y="22" width="14" height="36" rx="6"
        fill={fill('Mouse3')} stroke={stroke('Mouse3')} strokeWidth="1" />
      {/* Tactile ridges */}
      {[30, 36, 42, 48].map(y => (
        <line key={y} x1="74" y1={y} x2="86" y2={y} stroke="#1a1a1a" strokeWidth="1.5" />
      ))}

      {/* ── WheelDown indicator (triangle below wheel) ───────────────── */}
      <polygon points="80,68 74,59 86,59" fill={stroke('WheelDown')} />

      {/* ── Button divider line ──────────────────────────────────────── */}
      <line x1="80" y1="10" x2="80" y2="90" stroke="#2a2a2a" strokeWidth="1" />

      {/* ── Side button: Forward (Mouse5, closer to front) ───────────── */}
      <rect x="6" y="94" width="22" height="14" rx="3"
        fill={fill('Mouse5')} stroke={stroke('Mouse5')} strokeWidth="1" />

      {/* ── Side button: Back (Mouse4, further back) ─────────────────── */}
      <rect x="6" y="112" width="22" height="14" rx="3"
        fill={fill('Mouse4')} stroke={stroke('Mouse4')} strokeWidth="1" />

      {/* ── Body outline on top ──────────────────────────────────────── */}
      <path d={BODY} fill="none" stroke="#444" strokeWidth="1.5" />

      {/* ── Labels ──────────────────────────────────────────────────── */}
      {/* Left button */}
      <text x="37" y="52" textAnchor="middle" dominantBaseline="middle"
        fontSize="8" fill={tcol('Mouse1')} fontFamily="'Courier New',monospace">
        {lbl('Mouse1', 'L Button', 9)}
      </text>

      {/* Right button */}
      <text x="123" y="52" textAnchor="middle" dominantBaseline="middle"
        fontSize="8" fill={tcol('Mouse2')} fontFamily="'Courier New',monospace">
        {lbl('Mouse2', 'R Button', 9)}
      </text>

      {/* Scroll click */}
      <text x="80" y="42" textAnchor="middle" dominantBaseline="middle"
        fontSize="6.5" fill={tcol('Mouse3')} fontFamily="'Courier New',monospace">
        {lbl('Mouse3', 'Click', 5)}
      </text>

      {/* WheelUp label (to right of triangle) */}
      <text x="90" y="17" textAnchor="start" dominantBaseline="middle"
        fontSize="6" fill={tcol('WheelUp')} fontFamily="'Courier New',monospace">
        {lbl('WheelUp', '↑', 5)}
      </text>

      {/* WheelDown label (to right of triangle) */}
      <text x="90" y="64" textAnchor="start" dominantBaseline="middle"
        fontSize="6" fill={tcol('WheelDown')} fontFamily="'Courier New',monospace">
        {lbl('WheelDown', '↓', 5)}
      </text>

      {/* Side Forward */}
      <text x="17" y="101" textAnchor="middle" dominantBaseline="middle"
        fontSize="6.5" fill={tcol('Mouse5')} fontFamily="'Courier New',monospace">
        {lbl('Mouse5', 'Fwd', 5)}
      </text>

      {/* Side Back */}
      <text x="17" y="119" textAnchor="middle" dominantBaseline="middle"
        fontSize="6.5" fill={tcol('Mouse4')} fontFamily="'Courier New',monospace">
        {lbl('Mouse4', 'Back', 5)}
      </text>

      {/* Model name */}
      <text x="80" y="240" textAnchor="middle"
        fontSize="7" fill="#3a3a3a" fontFamily="'Courier New',monospace" letterSpacing="0.8">
        DEATHADDER V3
      </text>
    </svg>
  );
}
