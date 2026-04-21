import React, { useState } from 'react';

// ── Palette (mirrors keyboard SVG / amber theme) ──────────────────────────────
const S_BND   = '#e0a84b';
const S_DEF   = '#3a3a3a';
const AMB     = '#e0a84b';
const AMB_LT  = '#f0c060';
const AMB_DIM = '#f5e0b0';

// ── Registry ──────────────────────────────────────────────────────────────────
const DIAGRAMS = {
  'razer-deathadder-v3': DeathAdderV3,
};

/** Set of profile IDs that have a diagram — import this to guard the wrapper. */
export const MOUSE_DIAGRAM_IDS = new Set(Object.keys(DIAGRAMS));

export default function MouseDiagram({ profile, mouseBindings }) {
  const Diagram = DIAGRAMS[profile?.id];
  if (!Diagram) return null;
  return <Diagram mouseBindings={mouseBindings} profile={profile} />;
}

// ── Callout positions within the 160 × 242 viewBox ───────────────────────────
const DAV3_CALLOUTS = {
  Mouse1:    { cx: 37,  cy: 52,  r: 10 },
  Mouse2:    { cx: 123, cy: 52,  r: 10 },
  Mouse3:    { cx: 80,  cy: 40,  r:  7 },
  Mouse5:    { cx: 17,  cy: 101, r:  7 },
  Mouse4:    { cx: 17,  cy: 119, r:  7 },
  WheelUp:   { cx: 94,  cy: 17,  r:  6 },
  WheelDown: { cx: 94,  cy: 63,  r:  6 },
};

// ── Mouse body path ───────────────────────────────────────────────────────────
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

// ── Razer DeathAdder V3 ───────────────────────────────────────────────────────
function DeathAdderV3({ mouseBindings, profile }) {
  const [hoveredId, setHoveredId] = useState(null);

  // Build bound map: button id → action string
  const bound = {};
  for (const b of mouseBindings) bound[b.button] = b.action;

  const isBoundZone = id => id in bound;
  const zoneStroke  = id => isBoundZone(id) ? S_BND : S_DEF;

  // Button list from profile, numbered 1..N
  const buttons  = profile?.buttons ?? [];
  const numbered = buttons.map((btn, i) => ({ ...btn, num: i + 1 }));

  return (
    <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>

      {/* ── SVG mouse body ─────────────────────────────────────────────────── */}
      <svg
        viewBox="0 0 160 242"
        style={{ width: 190, flexShrink: 0, display: 'block', overflow: 'visible' }}
        xmlns="http://www.w3.org/2000/svg"
        aria-label="DeathAdder V3 mouse diagram"
      >
        <defs>
          <clipPath id="dav3-body">
            <path d={BODY} />
          </clipPath>

          {/* Drop shadow */}
          <filter id="dav3-shadow" x="-20%" y="-15%" width="140%" height="135%">
            <feDropShadow dx="0" dy="5" stdDeviation="7"
              floodColor="#000000" floodOpacity="0.70" />
          </filter>

          {/* ── Body depth: radial, centre lighter → rim dark ── */}
          <radialGradient id="dav3-body-depth"
            cx="80" cy="95" r="108" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#2e2e2e" />
            <stop offset="58%"  stopColor="#1b1b1b" />
            <stop offset="100%" stopColor="#0b0b0b" />
          </radialGradient>

          {/* ── Left button zone ── */}
          <radialGradient id="dav3-l-def"
            cx="36" cy="48" r="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#2d2d2d" />
            <stop offset="100%" stopColor="#131313" />
          </radialGradient>
          {/* ── Right button zone ── */}
          <radialGradient id="dav3-r-def"
            cx="124" cy="48" r="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#2d2d2d" />
            <stop offset="100%" stopColor="#131313" />
          </radialGradient>

          {/* ── Scroll wheel: left-to-right cylinder shading ── */}
          <linearGradient id="dav3-wh-def"
            x1="73" y1="0" x2="87" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#0e0e0e" />
            <stop offset="38%"  stopColor="#2c2c2c" />
            <stop offset="62%"  stopColor="#2c2c2c" />
            <stop offset="100%" stopColor="#0e0e0e" />
          </linearGradient>
          <linearGradient id="dav3-wh-bnd"
            x1="73" y1="0" x2="87" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#182610" />
            <stop offset="38%"  stopColor="#4e6832" />
            <stop offset="62%"  stopColor="#4e6832" />
            <stop offset="100%" stopColor="#182610" />
          </linearGradient>

          {/* ── Side buttons: top-to-bottom bevel ── */}
          <linearGradient id="dav3-sb-def" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#383838" />
            <stop offset="100%" stopColor="#191919" />
          </linearGradient>
          <linearGradient id="dav3-sb-bnd" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#4a6432" />
            <stop offset="100%" stopColor="#1e2e14" />
          </linearGradient>

          {/* ── Centre spine highlight ── */}
          <linearGradient id="dav3-spine"
            x1="65" y1="0" x2="95" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#fff" stopOpacity="0" />
            <stop offset="50%"  stopColor="#fff" stopOpacity="0.055" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </linearGradient>

          {/* ── Specular glint (upper-left light catch) ── */}
          <radialGradient id="dav3-spec"
            cx="62" cy="34" r="30" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.10" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ── 1. Drop shadow (renders behind everything) ─────────────────── */}
        <path d={BODY} fill="#111" filter="url(#dav3-shadow)" />

        {/* ── 2. Body base with depth gradient ──────────────────────────── */}
        <path d={BODY} fill="url(#dav3-body-depth)" />

        {/* ── 3. Button zones (clipped) ──────────────────────────────────── */}
        {/* Left button — always uncoloured; callout circle communicates binding */}
        <rect x="6" y="10" width="62" height="80"
          clipPath="url(#dav3-body)"
          fill="url(#dav3-l-def)" />

        {/* Right button — same */}
        <rect x="92" y="10" width="62" height="80"
          clipPath="url(#dav3-body)"
          fill="url(#dav3-r-def)" />

        {/* Centre channel — re-apply body depth to hide button bleed */}
        <rect x="68" y="10" width="24" height="80"
          clipPath="url(#dav3-body)" fill="url(#dav3-body-depth)" />

        {/* ── 4. Scroll wheel area ───────────────────────────────────────── */}
        {/* WheelUp triangle */}
        <polygon points="80,13 74,22 86,22" fill={zoneStroke('WheelUp')} />

        {/* Wheel body (cylinder gradient) */}
        <rect x="73" y="22" width="14" height="36" rx="6"
          fill={isBoundZone('Mouse3') ? 'url(#dav3-wh-bnd)' : 'url(#dav3-wh-def)'}
          stroke={zoneStroke('Mouse3')} strokeWidth="1" />
        {/* Tactile ridges */}
        {[30, 36, 42, 48].map(y => (
          <line key={y} x1="74" y1={y} x2="86" y2={y}
            stroke="rgba(0,0,0,0.55)" strokeWidth="1.5" />
        ))}
        {/* Ridge highlight (top edge of each ridge) */}
        {[30, 36, 42, 48].map(y => (
          <line key={`h${y}`} x1="74.5" y1={y - 1} x2="85.5" y2={y - 1}
            stroke="rgba(255,255,255,0.06)" strokeWidth="0.75" />
        ))}

        {/* WheelDown triangle */}
        <polygon points="80,68 74,59 86,59" fill={zoneStroke('WheelDown')} />

        {/* ── 5. Button divider ──────────────────────────────────────────── */}
        <line x1="80" y1="10" x2="80" y2="90"
          stroke="#1a1a1a" strokeWidth="2" />
        <line x1="80" y1="10" x2="80" y2="90"
          stroke="rgba(255,255,255,0.04)" strokeWidth="1" />

        {/* ── 6. Side buttons (beveled gradient) ────────────────────────── */}
        {/* Forward (Mouse5) */}
        <rect x="6" y="94" width="22" height="14" rx="3"
          fill={isBoundZone('Mouse5') ? 'url(#dav3-sb-bnd)' : 'url(#dav3-sb-def)'}
          stroke={zoneStroke('Mouse5')} strokeWidth="1" />
        {/* Back (Mouse4) */}
        <rect x="6" y="112" width="22" height="14" rx="3"
          fill={isBoundZone('Mouse4') ? 'url(#dav3-sb-bnd)' : 'url(#dav3-sb-def)'}
          stroke={zoneStroke('Mouse4')} strokeWidth="1" />

        {/* ── 7. Inner rim shadow (dark ring inside body edge) ──────────── */}
        <path d={BODY}
          fill="none"
          stroke="rgba(0,0,0,0.50)"
          strokeWidth="14"
          clipPath="url(#dav3-body)" />

        {/* ── 8. Spine highlight (centre ridge catch) ────────────────────── */}
        <rect x="65" y="10" width="30" height="210"
          clipPath="url(#dav3-body)"
          fill="url(#dav3-spine)" />

        {/* ── 9. Specular glint (upper-left corner light catch) ─────────── */}
        <ellipse cx="62" cy="34" rx="30" ry="18"
          clipPath="url(#dav3-body)"
          fill="url(#dav3-spec)" />

        {/* ── 10. Body outline ───────────────────────────────────────────── */}
        <path d={BODY} fill="none" stroke="#505050" strokeWidth="1.5" />
        {/* Subtle inner highlight on top edge */}
        <path
          d="M 28,10 L 132,10 C 150,10 154,24 154,40"
          fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

        {/* ── 11. Model name ─────────────────────────────────────────────── */}
        <text x="80" y="240" textAnchor="middle"
          fontSize="7" fill="#3a3a3a" fontFamily="'Courier New',monospace" letterSpacing="0.8">
          DEATHADDER V3
        </text>

        {/* ── 12. Callout circles ────────────────────────────────────────── */}
        {numbered.map(btn => {
          const pos = DAV3_CALLOUTS[btn.id];
          if (!pos) return null;
          const isBound   = btn.id in bound;
          const isHovered = btn.id === hoveredId;
          const circleFill   = isHovered ? AMB_LT : isBound ? AMB    : '#252525';
          const circleStroke = isHovered ? AMB_DIM : isBound ? AMB    : '#484848';
          const numFill      = isHovered ? '#1a1a1a' : isBound ? '#1a1a1a' : '#666';
          const fontSize     = pos.r >= 9 ? 8 : pos.r >= 7 ? 7 : 6;
          return (
            <g
              key={btn.id}
              onMouseEnter={() => setHoveredId(btn.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{ cursor: 'default' }}
            >
              {isBound && (
                <title>{btn.label}: {bound[btn.id]}</title>
              )}
              {/* Shadow ring behind callout */}
              <circle cx={pos.cx} cy={pos.cy + 1} r={pos.r + 1}
                fill="rgba(0,0,0,0.4)" />
              <circle
                cx={pos.cx} cy={pos.cy} r={pos.r}
                fill={circleFill}
                stroke={circleStroke}
                strokeWidth="1.5"
              />
              <text
                x={pos.cx} y={pos.cy}
                textAnchor="middle" dominantBaseline="central"
                fontSize={fontSize}
                fill={numFill}
                fontFamily="'Courier New',monospace"
                fontWeight="bold"
                style={{ pointerEvents: 'none', userSelect: 'none' }}
              >
                {btn.num}
              </text>
            </g>
          );
        })}
      </svg>

      {/* ── Legend ─────────────────────────────────────────────────────────── */}
      <div style={{
        display:       'flex',
        flexDirection: 'column',
        gap:           2,
        paddingTop:    2,
        fontFamily:    "'Courier New',monospace",
      }}>
        {numbered.map(btn => {
          const action    = bound[btn.id];
          const isBound   = action !== undefined;
          const isHovered = btn.id === hoveredId;
          return (
            <div
              key={btn.id}
              onMouseEnter={() => setHoveredId(btn.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                display:      'flex',
                alignItems:   'center',
                gap:          7,
                padding:      '3px 8px 3px 4px',
                borderRadius: 4,
                background:   isHovered ? 'rgba(224,168,75,0.10)' : 'transparent',
                border:       `1px solid ${isHovered ? 'rgba(224,168,75,0.25)' : 'transparent'}`,
                cursor:       'default',
                transition:   'background 0.1s',
              }}
            >
              {/* Number badge */}
              <span style={{
                display:        'inline-flex',
                alignItems:     'center',
                justifyContent: 'center',
                width:          18,
                height:         18,
                borderRadius:   '50%',
                flexShrink:     0,
                fontSize:       9,
                fontWeight:     'bold',
                background:     isBound ? AMB     : '#252525',
                color:          isBound ? '#1a1a1a' : '#555',
                border:         `1.5px solid ${isBound ? AMB : '#3a3a3a'}`,
              }}>
                {btn.num}
              </span>

              {/* Button name */}
              <span style={{
                fontSize:   11,
                color:      isBound ? '#ccc' : '#4a4a4a',
                flexShrink: 0,
                minWidth:   90,
              }}>
                {btn.label}
              </span>

              {/* Action (only when bound) */}
              {isBound && (
                <span style={{
                  fontSize:     11,
                  color:        AMB_DIM,
                  whiteSpace:   'nowrap',
                  overflow:     'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth:     160,
                }}>
                  {action}
                </span>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
