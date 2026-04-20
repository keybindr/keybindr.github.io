import React, { useState, useRef, useEffect } from 'react';

// ── Color math ────────────────────────────────────────────────────────────────

function hsvToRgb(h, s, v) {
  s /= 100; v /= 100;
  const i = Math.floor(h / 60) % 6;
  const f = (h / 60) - Math.floor(h / 60);
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  return [[v,t,p],[q,v,p],[p,v,t],[p,q,v],[t,p,v],[v,p,q]][i].map(x => Math.round(x * 255));
}

function rgbToHsv(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  let h = 0;
  if (d) {
    if (max === r)      h = ((g - b) / d + 6) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else                h = (r - g) / d + 4;
    h *= 60;
  }
  return [h, max ? (d / max) * 100 : 0, max * 100];
}

function hexToRgb(hex) {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  if (hex.length !== 6 || /[^0-9a-fA-F]/.test(hex)) return null;
  const n = parseInt(hex, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => Math.max(0, Math.min(255, Math.round(x))).toString(16).padStart(2, '0')).join('');
}

export function parseColor(color) {
  if (!color) return { r: 74, g: 74, b: 74, a: 1 };
  const m = color.match(/rgba?\(\s*(\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\s*\)/);
  if (m) return { r: +m[1], g: +m[2], b: +m[3], a: m[4] !== undefined ? +m[4] : 1 };
  const rgb = hexToRgb(color);
  if (rgb) return { r: rgb[0], g: rgb[1], b: rgb[2], a: 1 };
  return { r: 74, g: 74, b: 74, a: 1 };
}

export function colorToString(r, g, b, a) {
  const ri = Math.round(r), gi = Math.round(g), bi = Math.round(b);
  if (a >= 0.996) return rgbToHex(ri, gi, bi);
  return `rgba(${ri}, ${gi}, ${bi}, ${parseFloat(a.toFixed(2))})`;
}

function clamp(val, lo, hi) { return Math.max(lo, Math.min(hi, val)); }

function initFromColor(col) {
  const { r, g, b, a } = parseColor(col);
  const [h, s, v] = rgbToHsv(r, g, b);
  return { h, s, v, a, hexStr: rgbToHex(r, g, b).slice(1) };
}

// ── ColorPicker ───────────────────────────────────────────────────────────────

export default function ColorPicker({ color, onChange }) {
  const [st, setSt] = useState(() => initFromColor(color));
  const stRef           = useRef(st);
  stRef.current         = st;
  const internalChange  = useRef(false);
  const pickerRef       = useRef(null);
  const dragging        = useRef(false);

  useEffect(() => {
    if (internalChange.current) { internalChange.current = false; return; }
    setSt(initFromColor(color));
  }, [color]);

  function emit(h, s, v, a) {
    const [r, g, b] = hsvToRgb(h, s, v);
    setSt({ h, s, v, a, hexStr: rgbToHex(r, g, b).slice(1) });
    internalChange.current = true;
    onChange(colorToString(r, g, b, a));
  }

  // Stable drag handler reads from ref so the effect dep array stays empty
  const moveHandler = useRef(null);
  moveHandler.current = (e) => {
    const rect = pickerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;
    const { h, a } = stRef.current;
    const s = clamp((cx - rect.left) / rect.width  * 100, 0, 100);
    const v = clamp((1 - (cy - rect.top) / rect.height) * 100, 0, 100);
    emit(h, s, v, a);
  };

  useEffect(() => {
    const onMove = (e) => { if (dragging.current) moveHandler.current(e); };
    const onUp   = ()  => { dragging.current = false; };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup',   onUp);
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('touchend',  onUp);
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup',   onUp);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend',  onUp);
    };
  }, []);

  const { h, s, v, a, hexStr } = st;
  const [r, g, b] = hsvToRgb(h, s, v);
  const pureHex    = rgbToHex(r, g, b);
  const currentStr = colorToString(r, g, b, a);

  function handleHexInput(val) {
    setSt(prev => ({ ...prev, hexStr: val }));
    const rgb = hexToRgb(val);
    if (rgb) {
      const [nh, ns, nv] = rgbToHsv(rgb[0], rgb[1], rgb[2]);
      emit(nh, ns, nv, stRef.current.a);
    }
  }

  function handleRgb(ch, val) {
    const n = clamp(parseInt(val, 10) || 0, 0, 255);
    const rgb2 = [r, g, b]; rgb2[ch] = n;
    const [nh, ns, nv] = rgbToHsv(...rgb2);
    emit(nh, ns, nv, a);
  }

  const hueBg = `linear-gradient(to right,
    hsl(0,100%,50%),hsl(60,100%,50%),hsl(120,100%,50%),
    hsl(180,100%,50%),hsl(240,100%,50%),hsl(300,100%,50%),hsl(360,100%,50%))`;

  const alphaBg = `linear-gradient(to right, transparent, ${pureHex}),
    repeating-conic-gradient(#3a3a3a 0% 25%, #222 0% 50%) 0 0 / 8px 8px`;

  return (
    <div className="cpk">
      {/* 2D saturation / value area */}
      <div
        ref={pickerRef}
        className="cpk-sv"
        style={{ background: `hsl(${h}, 100%, 50%)` }}
        onMouseDown={e => { dragging.current = true; moveHandler.current(e); }}
        onTouchStart={e => { dragging.current = true; moveHandler.current(e); e.preventDefault(); }}
      >
        <div className="cpk-sv-white" />
        <div className="cpk-sv-black" />
        <div className="cpk-cursor" style={{ left: `${s}%`, top: `${100 - v}%` }} />
      </div>

      {/* Row 1: color preview swatch + hue slider */}
      <div className="cpk-color-row">
        <div className="cpk-preview-wrap">
          <div className="cpk-checker" />
          <div className="cpk-preview" style={{ background: currentStr }} />
        </div>
        <div className="cpk-track-wrap" style={{ background: hueBg }}>
          <input type="range" min={0} max={360} step={1}
            className="cpk-range"
            value={Math.round(h)}
            onChange={e => emit(+e.target.value, s, v, a)}
          />
        </div>
      </div>

      {/* Row 2: opacity number input + opacity slider */}
      <div className="cpk-alpha-row">
        <input
          type="number" min={0} max={100}
          className="cpk-input cpk-alpha-input"
          value={Math.round(a * 100)}
          onChange={e => emit(h, s, v, clamp(parseInt(e.target.value, 10) || 0, 0, 100) / 100)}
        />
        <div className="cpk-track-wrap" style={{ background: alphaBg }}>
          <input type="range" min={0} max={100} step={1}
            className="cpk-range"
            value={Math.round(a * 100)}
            onChange={e => emit(h, s, v, +e.target.value / 100)}
          />
        </div>
      </div>

      {/* Inputs */}
      <div className="cpk-inputs">
        <div className="cpk-field">
          <span className="cpk-label">HEX</span>
          <input className="cpk-input" value={hexStr}
            onChange={e => handleHexInput(e.target.value)}
            maxLength={6} spellCheck={false} />
        </div>
        {[['R', r, 0], ['G', g, 1], ['B', b, 2]].map(([lbl, val, idx]) => (
          <div key={lbl} className="cpk-field cpk-field-num">
            <span className="cpk-label">{lbl}</span>
            <input className="cpk-input" type="number" min={0} max={255} value={val}
              onChange={e => handleRgb(idx, e.target.value)} />
          </div>
        ))}
      </div>
    </div>
  );
}
