import React from 'react';
import { KEYS, KEYBOARD_WIDTH, KEYBOARD_HEIGHT } from '../keyboardLayout';
import { bindingId } from '../useBindings';
import { DEFAULT_MOD_COLORS, DEFAULT_SPLIT_MOD_COLORS } from '../useSettings';

const KEY_DEFAULT  = '#2a2a2a';
const KEY_BOUND    = '#3d3420';
const KEY_SELECTED = '#5a4a1a';
const BORDER_DEFAULT  = '#444';
const BORDER_BOUND    = '#e0a84b';
const BORDER_SELECTED = '#f0c060';
const TEXT_DEFAULT = '#aaa';
const TEXT_BOUND   = '#f5e0b0';

const SIZE = 10;

const KEY_TO_MOD_UNIFIED = {
  ShiftLeft: 'Shift', ShiftRight: 'Shift',
  ControlLeft: 'Ctrl', ControlRight: 'Ctrl',
  AltLeft: 'Alt', AltRight: 'Alt',
};

const KEY_TO_MOD_SPLIT = {
  ShiftLeft: 'ShiftLeft', ShiftRight: 'ShiftRight',
  ControlLeft: 'CtrlLeft', ControlRight: 'CtrlRight',
  AltLeft: 'AltLeft', AltRight: 'AltRight',
};

const SPLIT_LABELS = {
  ShiftLeft: 'LShift', ShiftRight: 'RShift',
  ControlLeft: 'LCtrl', ControlRight: 'RCtrl',
  AltLeft: 'LAlt', AltRight: 'RAlt',
};

// Blend hex color with the dark keyboard background at 25% for the key fill tint
function modFill(hex) {
  if (!hex || hex.length < 7) return KEY_DEFAULT;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const bg = 0x1a;
  const cap = n => Math.max(0, Math.min(255, n));
  const toHex = n => cap(n).toString(16).padStart(2, '0');
  const blend = c => Math.round(bg + (c - bg) * 0.25);
  return `#${toHex(blend(r))}${toHex(blend(g))}${toHex(blend(b))}`;
}

const MOD_TO_CORNER = {
  Shift: 'shift', ShiftLeft: 'shift', ShiftRight: 'shift',
  Alt: 'alt',   AltLeft: 'alt',   AltRight: 'alt',
  Ctrl: 'ctrl', CtrlLeft: 'ctrl', CtrlRight: 'ctrl',
};

// Perpendicular stripe width; E is the distance along each key edge (= STRIPE_W * √2)
const STRIPE_W = 4;
const STRIPE_E = STRIPE_W * 1.4142;

function splitCornerPoints(corner, k) {
  const { x, y, w, h } = k;
  const e = STRIPE_E;
  // L = full triangle (corner to hypotenuse).
  // R = band that follows both key edges outward from the hypotenuse endpoints,
  //     so it looks like the triangle continues in a second color.
  if (corner === 'shift') {
    // upper-right. Triangle legs: right edge (x+w, y→y+SIZE) and top edge (x+w-SIZE→x+w, y)
    const lPts = `${x+w},${y} ${x+w},${y+SIZE} ${x+w-SIZE},${y}`;
    const rPts = `${x+w},${y+SIZE} ${x+w-SIZE},${y} ${x+w-SIZE-e},${y} ${x+w},${y+SIZE+e}`;
    return [lPts, rPts];
  }
  if (corner === 'alt') {
    // lower-right. Triangle legs: right edge (x+w, y+h-SIZE→y+h) and bottom edge (x+w-SIZE→x+w, y+h)
    const lPts = `${x+w},${y+h} ${x+w},${y+h-SIZE} ${x+w-SIZE},${y+h}`;
    const rPts = `${x+w},${y+h-SIZE} ${x+w-SIZE},${y+h} ${x+w-SIZE-e},${y+h} ${x+w},${y+h-SIZE-e}`;
    return [lPts, rPts];
  }
  // ctrl — lower-left. Triangle legs: left edge (x, y+h-SIZE→y+h) and bottom edge (x→x+SIZE, y+h)
  const lPts = `${x},${y+h} ${x},${y+h-SIZE} ${x+SIZE},${y+h}`;
  const rPts = `${x},${y+h-SIZE} ${x+SIZE},${y+h} ${x+SIZE+e},${y+h} ${x},${y+h-SIZE-e}`;
  return [lPts, rPts];
}

function trianglePoints(mod, k) {
  const { x, y, w, h } = k;
  if (mod === 'Shift' || mod === 'ShiftLeft' || mod === 'ShiftRight')
    return `${x + w},${y} ${x + w},${y + SIZE} ${x + w - SIZE},${y}`;            // upper-right
  if (mod === 'Alt' || mod === 'AltLeft' || mod === 'AltRight')
    return `${x + w},${y + h} ${x + w},${y + h - SIZE} ${x + w - SIZE},${y + h}`; // lower-right
  if (mod === 'Ctrl' || mod === 'CtrlLeft' || mod === 'CtrlRight')
    return `${x},${y + h} ${x},${y + h - SIZE} ${x + SIZE},${y + h}`;             // lower-left
  return `${x},${y} ${x + SIZE},${y} ${x},${y + SIZE}`;
}

const DEFAULT_SETTINGS = {
  splitModifiers: false,
  modColors: DEFAULT_MOD_COLORS,
  splitModColors: DEFAULT_SPLIT_MOD_COLORS,
};

export default function Keyboard({ bindings, selectedId, onKeyClick, keyColors = {}, settings = DEFAULT_SETTINGS }) {
  const { splitModifiers, modColors, splitModColors } = settings;
  const keyToMod   = splitModifiers ? KEY_TO_MOD_SPLIT   : KEY_TO_MOD_UNIFIED;
  const keyModColors = splitModifiers ? splitModColors : modColors;

  const boundMap = {};
  for (const b of bindings) {
    if (!boundMap[b.key]) boundMap[b.key] = [];
    boundMap[b.key].push(b);
  }

  return (
    <svg
      viewBox={`0 0 ${KEYBOARD_WIDTH} ${KEYBOARD_HEIGHT}`}
      width="100%"
      style={{ display: 'block', userSelect: 'none' }}
      xmlns="http://www.w3.org/2000/svg"
      id="keyboard-svg"
    >
      <defs>
        {KEYS.map(k => (
          <clipPath key={k.id} id={`clip-${k.id}`}>
            <rect x={k.x} y={k.y} width={k.w} height={k.h} rx={4} />
          </clipPath>
        ))}
      </defs>
      {KEYS.map(k => {
        const keyBindings = boundMap[k.id] || [];
        const isBound     = keyBindings.length > 0;
        const isSelected  = keyBindings.some(b => bindingId(b.key, b.modifiers) === selectedId);
        const customColor = keyColors[k.id];
        const modRole     = keyToMod[k.id];
        const modColor    = modRole ? keyModColors[modRole] : null;

        const fill   = isSelected  ? KEY_SELECTED
                     : customColor ? customColor
                     : isBound     ? KEY_BOUND
                     : modColor    ? modFill(modColor)
                     : KEY_DEFAULT;
        const stroke = isSelected ? BORDER_SELECTED
                     : isBound    ? BORDER_BOUND
                     : modColor   ? modColor
                     : BORDER_DEFAULT;
        const textColor = isBound ? TEXT_BOUND : TEXT_DEFAULT;

        const mods = [...new Set(keyBindings.flatMap(b => b.modifiers))];
        const label = (splitModifiers && SPLIT_LABELS[k.id]) ? SPLIT_LABELS[k.id] : k.label;

        return (
          <g key={k.id} onClick={() => onKeyClick(k.id)} style={{ cursor: 'pointer' }}>
            <rect
              x={k.x} y={k.y} width={k.w} height={k.h} rx={4}
              fill={fill} stroke={stroke}
              strokeWidth={isBound || isSelected ? 1.5 : 1}
            />
            <text
              x={k.x + k.w / 2} y={k.y + k.h / 2 + 1}
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
                const corner = MOD_TO_CORNER[mod];
                if (!corner) continue;
                const color = modColors[mod] || splitModColors[mod] || '#888';
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
          </g>
        );
      })}
    </svg>
  );
}
