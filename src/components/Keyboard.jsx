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

export default function Keyboard({ bindings, selectedId, onKeyClick }) {
  const boundMap = {};
  for (const b of bindings) {
    const key = b.key;
    if (!boundMap[key]) boundMap[key] = [];
    boundMap[key].push(b);
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

        const modRole = KEY_TO_MOD[k.id];
        const fill   = isSelected ? KEY_SELECTED
                     : isBound    ? KEY_BOUND
                     : modRole    ? MOD_KEY_FILL[modRole]
                     : KEY_DEFAULT;
        const stroke = isSelected ? BORDER_SELECTED
                     : isBound    ? BORDER_BOUND
                     : modRole    ? MOD_COLORS[modRole]
                     : BORDER_DEFAULT;
        const textColor = isBound ? TEXT_BOUND : TEXT_DEFAULT;

        // Modifier triangles — one per modifier present
        const mods = [...new Set(keyBindings.flatMap(b => b.modifiers))];

        return (
          <g key={k.id} onClick={() => onKeyClick(k.id)} style={{ cursor: 'pointer' }}>
            <rect
              x={k.x}
              y={k.y}
              width={k.w}
              height={k.h}
              rx={4}
              fill={fill}
              stroke={stroke}
              strokeWidth={isBound || isSelected ? 1.5 : 1}
            />
            {/* Label */}
            <text
              x={k.x + k.w / 2}
              y={k.y + k.h / 2 + 1}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={k.w > 60 ? 11 : 10}
              fontFamily="'Courier New', monospace"
              fill={textColor}
              style={{ pointerEvents: 'none' }}
            >
              {k.label}
            </text>
            {/* Modifier corner triangles */}
            {mods.map((mod, i) => {
              const color = MOD_COLORS[mod] || '#888';
              const size = 8;
              const offset = i * 10;
              const tx = k.x + k.w - size - offset;
              const ty = k.y;
              return (
                <polygon
                  key={mod}
                  points={`${tx + size},${ty} ${tx + size},${ty + size} ${tx},${ty}`}
                  fill={color}
                  clipPath={`url(#clip-${k.id})`}
                  style={{ pointerEvents: 'none' }}
                />
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}
