import React from 'react';
import { KEYS, KEYBOARD_WIDTH, KEYBOARD_HEIGHT } from '../keyboardLayout';
import { bindingId } from '../useBindings';

const MOD_COLORS = {
  Ctrl:  '#e07b39',
  Shift: '#7b9ee0',
  Alt:   '#7be09a',
};

const KEY_DEFAULT  = '#2a2a2a';
const KEY_BOUND    = '#3d3420';
const KEY_SELECTED = '#5a4a1a';
const BORDER_DEFAULT  = '#444';
const BORDER_BOUND    = '#e0a84b';
const BORDER_SELECTED = '#f0c060';
const TEXT_DEFAULT = '#aaa';
const TEXT_BOUND   = '#f5e0b0';

const KEY_TO_MOD = {
  ShiftLeft:    'Shift',
  ShiftRight:   'Shift',
  ControlLeft:  'Ctrl',
  ControlRight: 'Ctrl',
  AltLeft:      'Alt',
  AltRight:     'Alt',
};

const MOD_KEY_FILL = {
  Ctrl:  '#2e1a0e',
  Shift: '#0e1a2e',
  Alt:   '#0e2e1a',
};

const SIZE = 10;

// Each modifier gets a fixed corner. Points are ordered so the right angle
// sits exactly in that corner, letting the clipPath round it.
function trianglePoints(mod, k) {
  const { x, y, w, h } = k;
  switch (mod) {
    case 'Shift': // upper-right
      return `${x + w},${y} ${x + w},${y + SIZE} ${x + w - SIZE},${y}`;
    case 'Alt':   // lower-right
      return `${x + w},${y + h} ${x + w},${y + h - SIZE} ${x + w - SIZE},${y + h}`;
    case 'Ctrl':  // lower-left
      return `${x},${y + h} ${x},${y + h - SIZE} ${x + SIZE},${y + h}`;
    default:      // upper-left fallback
      return `${x},${y} ${x + SIZE},${y} ${x},${y + SIZE}`;
  }
}

export default function Keyboard({ bindings, selectedId, onKeyClick, keyColors = {} }) {
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
        const isBound = keyBindings.length > 0;
        const isSelected = keyBindings.some(b => bindingId(b.key, b.modifiers) === selectedId);
        const customColor = keyColors[k.id];
        const modRole = KEY_TO_MOD[k.id];

        const fill   = isSelected  ? KEY_SELECTED
                     : customColor ? customColor
                     : isBound     ? KEY_BOUND
                     : modRole     ? MOD_KEY_FILL[modRole]
                     : KEY_DEFAULT;
        const stroke = isSelected ? BORDER_SELECTED
                     : isBound    ? BORDER_BOUND
                     : modRole    ? MOD_COLORS[modRole]
                     : BORDER_DEFAULT;
        const textColor = isBound ? TEXT_BOUND : TEXT_DEFAULT;

        const mods = [...new Set(keyBindings.flatMap(b => b.modifiers))];

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
              {k.label}
            </text>
            {mods.map(mod => (
              <polygon
                key={mod}
                points={trianglePoints(mod, k)}
                fill={MOD_COLORS[mod] || '#888'}
                clipPath={`url(#clip-${k.id})`}
                style={{ pointerEvents: 'none' }}
              />
            ))}
          </g>
        );
      })}
    </svg>
  );
}
