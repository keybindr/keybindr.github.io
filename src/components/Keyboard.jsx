import React, { useState } from 'react';
import { getKeys, getLayout } from '../keyboardLayouts';
import { resolveLabel } from '../keylabels';
import { bindingId } from '../useBindings';
import { KEY_DEFAULT, KEY_BOUND, KEY_ACCENT, MOD_COLORS, MOD_KEY_IDS, MOD_CORNER, SPLIT_LABELS, modFill } from '../modifierConstants';
import { useT, resolveAction } from '../useTranslation';
import { getHotasLabel, hotasBindingId } from '../hotasConstants';

const KEY_SELECTED    = '#5a4a1a';
const BORDER_DEFAULT  = '#444';
const BORDER_BOUND    = '#e0a84b';
const BORDER_SELECTED = '#f0c060';
const TEXT_DEFAULT    = '#aaa';
const TEXT_BOUND      = '#f5e0b0';

const SIZE = 10;

function modTriangleColor(mod, keyColors) {
  for (const kid of (MOD_KEY_IDS[mod] || [])) {
    if (keyColors[kid]) return keyColors[kid];
  }
  return MOD_COLORS[mod] || '#888';
}

const TOOLTIP_MOD_LABEL = {
  Ctrl: 'Ctrl', CtrlLeft: 'LCtrl', CtrlRight: 'RCtrl',
  Shift: 'Shift', ShiftLeft: 'LShift', ShiftRight: 'RShift',
  Alt: 'Alt', AltLeft: 'LAlt', AltRight: 'RAlt',
};

const TOOLTIP_WIDTH = 220;


const STRIPE_W = 4;
const STRIPE_E = STRIPE_W * 1.4142;

// Returns effective rect for a key (bounding box for path-based keys)
function keyRect(k) {
  return { x: k.x, y: k.y, w: k.w, h: k.h };
}

// For keys with a `corners` property (ISO Enter), use those for triangle anchor points
function triCorner(k, corner) {
  if (k.corners) {
    if (corner === 'shift') return k.corners.tr;
    if (corner === 'alt')   return k.corners.br;
    if (corner === 'ctrl')  return k.corners.bl;
  }
  const { x, y, w, h } = k;
  if (corner === 'shift') return [x + w, y];
  if (corner === 'alt')   return [x + w, y + h];
  return [x, y + h];
}

function splitCornerPoints(corner, k) {
  const { x, y, w, h } = keyRect(k);
  // Use actual corner points if available
  const tl = k.corners ? [k.x, k.y] : [x, y];
  const tr = k.corners ? k.corners.tr : [x + w, y];
  const br = k.corners ? k.corners.br : [x + w, y + h];
  const bl = k.corners ? k.corners.bl : [x, y + h];

  const e = STRIPE_E;
  if (corner === 'shift') {
    const [tx, ty] = tr;
    const lPts = `${tx},${ty} ${tx},${ty+SIZE} ${tx-SIZE},${ty}`;
    const rPts = `${tx},${ty+SIZE} ${tx-SIZE},${ty} ${tx-SIZE-e},${ty} ${tx},${ty+SIZE+e}`;
    return [lPts, rPts];
  }
  if (corner === 'alt') {
    const [bx, by] = br;
    const lPts = `${bx},${by} ${bx},${by-SIZE} ${bx-SIZE},${by}`;
    const rPts = `${bx},${by-SIZE} ${bx-SIZE},${by} ${bx-SIZE-e},${by} ${bx},${by-SIZE-e}`;
    return [lPts, rPts];
  }
  // ctrl
  const [blx, bly] = bl;
  const lPts = `${blx},${bly} ${blx},${bly-SIZE} ${blx+SIZE},${bly}`;
  const rPts = `${blx},${bly-SIZE} ${blx+SIZE},${bly} ${blx+SIZE+e},${bly} ${blx},${bly-SIZE-e}`;
  return [lPts, rPts];
}

function trianglePoints(mod, k) {
  const corner = MOD_CORNER[mod];
  if (!corner) return '';
  const [cx, cy] = triCorner(k, corner);
  if (mod === 'Shift' || mod === 'ShiftLeft' || mod === 'ShiftRight')
    return `${cx},${cy} ${cx},${cy+SIZE} ${cx-SIZE},${cy}`;
  if (mod === 'Alt' || mod === 'AltLeft' || mod === 'AltRight')
    return `${cx},${cy} ${cx},${cy-SIZE} ${cx-SIZE},${cy}`;
  // Ctrl
  return `${cx},${cy} ${cx},${cy-SIZE} ${cx+SIZE},${cy}`;
}

export default function Keyboard({ bindings, selectedId, onKeyClick, keyColors = {}, settings = {}, mouseBindings = [], hotasBindings = [] }) {
  const { splitModifiers, physicalLayout = 'ansi-104', language = 'en-US' } = settings;
  const t = useT();
  const [tooltip, setTooltip] = useState(null);

  const layout = getLayout(physicalLayout);
  const KEYS   = layout.keys;

  const boundMap = {};
  for (const b of bindings) {
    if (!boundMap[b.key]) boundMap[b.key] = [];
    boundMap[b.key].push(b);
  }

  // Build map of keyboard keys that are remapped from mouse buttons
  const mouseRemapMap = {};
  for (const mb of mouseBindings) {
    if (mb.mouseKey) {
      if (!mouseRemapMap[mb.mouseKey]) mouseRemapMap[mb.mouseKey] = [];
      mouseRemapMap[mb.mouseKey].push(mb);
    }
  }

  // Build map of keyboard keys that are remapped from HOTAS buttons
  const hotasRemapMap = {};
  for (const hb of hotasBindings) {
    if (hb.hotasKey) {
      if (!hotasRemapMap[hb.hotasKey]) hotasRemapMap[hb.hotasKey] = [];
      hotasRemapMap[hb.hotasKey].push(hb);
    }
  }

  function handleMouseEnter(e, keyId) {
    if ((boundMap[keyId] || []).length === 0 && (mouseRemapMap[keyId] || []).length === 0 && (hotasRemapMap[keyId] || []).length === 0) return;
    setTooltip({ keyId, x: e.clientX, y: e.clientY });
  }
  function handleMouseMove(e, keyId) {
    if ((boundMap[keyId] || []).length === 0 && (mouseRemapMap[keyId] || []).length === 0 && (hotasRemapMap[keyId] || []).length === 0) return;
    setTooltip({ keyId, x: e.clientX, y: e.clientY });
  }

  const tooltipBindings      = tooltip ? (boundMap[tooltip.keyId]      || []) : [];
  const tooltipMouseBindings = tooltip ? (mouseRemapMap[tooltip.keyId] || []) : [];
  const tooltipHotasBindings = tooltip ? (hotasRemapMap[tooltip.keyId] || []) : [];
  const tipX = tooltip
    ? (tooltip.x + 16 + TOOLTIP_WIDTH > window.innerWidth ? tooltip.x - TOOLTIP_WIDTH - 16 : tooltip.x + 16)
    : 0;
  const tipY = tooltip ? tooltip.y - 12 : 0;

  return (
    <>
    <svg
      viewBox={`0 0 ${layout.width} ${layout.height}`}
      width="100%"
      style={{ display: 'block', userSelect: 'none' }}
      xmlns="http://www.w3.org/2000/svg"
      id="keyboard-svg"
    >
      <defs>
        {KEYS.map(k => (
          <clipPath key={k.id} id={`clip-${k.id}`}>
            {k.path
              ? <path d={k.path} />
              : <rect x={k.x} y={k.y} width={k.w} height={k.h} rx={4} />
            }
          </clipPath>
        ))}
      </defs>

      {KEYS.map(k => {
        const keyBindings = boundMap[k.id] || [];
        const isBound     = keyBindings.length > 0;
        const isSelected  = keyBindings.some(b => bindingId(b.key, b.modifiers) === selectedId);
        const customColor = keyColors[k.id];
        const accentColor = KEY_ACCENT[k.id] || null;

        const fill   = customColor ? customColor
                     : accentColor ? modFill(accentColor)
                     : isBound     ? KEY_BOUND
                     : KEY_DEFAULT;
        const stroke = isSelected  ? BORDER_SELECTED
                     : isBound     ? BORDER_BOUND
                     : accentColor ? accentColor
                     : BORDER_DEFAULT;
        const textColor = isBound ? TEXT_BOUND : TEXT_DEFAULT;

        const mods = [...new Set(keyBindings.flatMap(b => b.modifiers))];
        const mouseRemaps = mouseRemapMap[k.id] || [];
        const hotasRemaps = hotasRemapMap[k.id] || [];

        // Label: split modifier display → locale override → layout default
        let label;
        if (splitModifiers && SPLIT_LABELS[k.id]) {
          label = SPLIT_LABELS[k.id];
        } else {
          label = resolveLabel(k.id, k, language);
        }

        // Text position: path-based keys (ISO Enter) use explicit textX/textY
        const textX = k.textX ?? (k.x + k.w / 2);
        const textY = k.textY ?? (k.y + k.h / 2 + 1);

        return (
          <g
            key={k.id}
            onClick={() => onKeyClick(k.id)}
            onMouseEnter={e => handleMouseEnter(e, k.id)}
            onMouseMove={e => handleMouseMove(e, k.id)}
            onMouseLeave={() => setTooltip(null)}
            style={{ cursor: 'pointer' }}
          >
            {k.path ? (
              <path
                d={k.path}
                fill={fill} stroke={stroke}
                strokeWidth={isBound || isSelected ? 1.5 : 1}
                rx={4}
              />
            ) : (
              <rect
                x={k.x} y={k.y} width={k.w} height={k.h} rx={4}
                fill={fill} stroke={stroke}
                strokeWidth={isBound || isSelected ? 1.5 : 1}
              />
            )}
            <text
              x={textX} y={textY}
              textAnchor="middle" dominantBaseline="middle"
              fontSize={k.w > 60 ? 11 : 10}
              fontFamily="'Courier New', monospace"
              fill={textColor}
              style={{ pointerEvents: 'none' }}
            >
              {label}
            </text>

            {(() => {
              const corners = {};
              for (const mod of mods) {
                const corner = MOD_CORNER[mod];
                if (!corner) continue;
                const color = modTriangleColor(mod, keyColors);
                if (!corners[corner]) corners[corner] = [];
                corners[corner].push({ mod, color });
              }
              return Object.entries(corners).flatMap(([corner, entries]) => {
                const clip = { clipPath: `url(#clip-${k.id})`, style: { pointerEvents: 'none' } };
                if (entries.length === 1) {
                  return [<polygon key={entries[0].mod} points={trianglePoints(entries[0].mod, k)} fill={entries[0].color} {...clip} />];
                }
                const lEntry = entries.find(e => e.mod.endsWith('Left')) ?? entries[0];
                const rEntry = entries.find(e => e !== lEntry) ?? entries[1];
                const [lPts, rPts] = splitCornerPoints(corner, k);
                return [
                  <polygon key={lEntry.mod} points={lPts} fill={lEntry.color} {...clip} />,
                  <polygon key={rEntry.mod} points={rPts} fill={rEntry.color} {...clip} />,
                ];
              });
            })()}

            {mouseRemaps.length > 0 && (
              <text
                x={k.x + 2}
                y={k.y + 8}
                fontSize={7}
                fontFamily="'Courier New', monospace"
                fill="#b0c8ff"
                style={{ pointerEvents: 'none' }}
                clipPath={`url(#clip-${k.id})`}
              >🖱</text>
            )}
            {hotasRemaps.length > 0 && (
              <text
                x={k.x + (mouseRemaps.length > 0 ? 12 : 2)}
                y={k.y + 8}
                fontSize={7}
                fontFamily="'Courier New', monospace"
                fill="#b0c8ff"
                style={{ pointerEvents: 'none' }}
                clipPath={`url(#clip-${k.id})`}
              >🕹</text>
            )}
          </g>
        );
      })}

      {layout.showLeds && [
        { label: 'NUM', cx: 882 }, { label: 'CAPS', cx: 948 }, { label: 'SCRL', cx: 1014 },
      ].map(({ label, cx }) => (
        <g key={label} style={{ pointerEvents: 'none' }}>
          <rect x={cx - 14} y={6} width={28} height={32} rx={4}
            fill="#1a1a1a" stroke="#333" strokeWidth={1} />
          <circle cx={cx} cy={18} r={4} fill="#1c3320" stroke="#2d4d33" strokeWidth={1} />
          <text x={cx} y={31} textAnchor="middle" fontSize={7}
            fontFamily="'Courier New', monospace" fill="#444" letterSpacing="0.5">{label}</text>
        </g>
      ))}
    </svg>

    {tooltip && (tooltipBindings.length > 0 || tooltipMouseBindings.length > 0 || tooltipHotasBindings.length > 0) && (
      <div className="key-tooltip" style={{ left: tipX, top: tipY }}>
        {tooltipBindings.map((b, i) => (
          <div key={bindingId(b.key, b.modifiers)} className={`tooltip-row${i > 0 ? ' tooltip-row-sep' : ''}`}>
            {b.modifiers.length > 0 && (
              <>
                {b.modifiers.map(m => (
                  <span key={m} className="tooltip-mod-tag"
                    style={{ borderColor: MOD_COLORS[m] || '#888', color: MOD_COLORS[m] || '#888' }}>
                    {TOOLTIP_MOD_LABEL[m] || m}
                  </span>
                ))}
                <span className="tooltip-arrow">→</span>
              </>
            )}
            <span className="tooltip-action">{resolveAction(b.action, t)}</span>
          </div>
        ))}
        {tooltipMouseBindings.map((mb, i) => (
          <div key={bindingId(mb.button, mb.modifiers)} className={`tooltip-row tooltip-row-sep tooltip-mouse-row`}>
            <span className="tooltip-mouse-icon">🖱</span>
            {mb.modifiers.length > 0 && (
              <>
                {mb.modifiers.map(m => (
                  <span key={m} className="tooltip-mod-tag"
                    style={{ borderColor: MOD_COLORS[m] || '#888', color: MOD_COLORS[m] || '#888' }}>
                    {TOOLTIP_MOD_LABEL[m] || m}
                  </span>
                ))}
                <span className="tooltip-arrow">→</span>
              </>
            )}
            <span className="tooltip-action">{mb.button}: {resolveAction(mb.action, t)}</span>
          </div>
        ))}
        {tooltipHotasBindings.map(hb => (
          <div key={hotasBindingId(hb.input, hb.modifiers ?? [], hb.hotasMod ?? '')} className="tooltip-row tooltip-row-sep tooltip-mouse-row">
            <span className="tooltip-mouse-icon">🕹</span>
            {(hb.modifiers ?? []).length > 0 && (
              <>
                {(hb.modifiers ?? []).map(m => (
                  <span key={m} className="tooltip-mod-tag"
                    style={{ borderColor: MOD_COLORS[m] || '#888', color: MOD_COLORS[m] || '#888' }}>
                    {TOOLTIP_MOD_LABEL[m] || m}
                  </span>
                ))}
                <span className="tooltip-arrow">→</span>
              </>
            )}
            <span className="tooltip-action">{getHotasLabel(hb.input)}: {resolveAction(hb.action, t)}</span>
          </div>
        ))}
      </div>
    )}
    </>
  );
}
