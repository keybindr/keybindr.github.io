import React from 'react';

/** Small triangle SVG used in the modifier key legend. */
export default function LegendTri({ color, dir }) {
  const s = 10;
  const pts = dir === 'shift' ? `${s},0 ${s},${s} 0,0`
            : dir === 'alt'   ? `${s},${s} ${s},0 0,${s}`
            :                   `0,${s} 0,0 ${s},${s}`;
  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} style={{ display: 'inline-block', flexShrink: 0 }}>
      <polygon points={pts} fill={color} />
    </svg>
  );
}
