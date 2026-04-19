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
            {mods.map(mod => (
              <polygon
                key={mod}
                points={trianglePoints(mod, k)}
                fill={modColors[mod] || splitModColors[mod] || '#888'}
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
