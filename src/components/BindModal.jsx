import React, { useState, useEffect, useRef } from 'react';
import { KEY_MAP } from '../keyboardLayout';
import { bindingId } from '../useBindings';
import ColorPicker from './ColorPicker';

const PICKER_WIDTH = 252;
const PICKER_GAP   = 12;

// Which family each modifier belongs to — prevents L+R same-family combos
const MOD_FAMILY = {
  Shift: 'Shift', ShiftLeft: 'Shift', ShiftRight: 'Shift',
  Alt:   'Alt',   AltLeft:   'Alt',   AltRight:   'Alt',
  Ctrl:  'Ctrl',  CtrlLeft:  'Ctrl',  CtrlRight:  'Ctrl',
};

const MODIFIER_KEY_IDS = new Set([
  'ShiftLeft', 'ShiftRight', 'ControlLeft', 'ControlRight',
  'AltLeft', 'AltRight', 'MetaLeft', 'MetaRight', 'ContextMenu',
]);

// Effective display color when no custom color is set
const KEY_ACCENT_COLORS = {
  ShiftLeft: '#7b9ee0', ShiftRight: '#7b9ee0',
  AltLeft:   '#7be09a', AltRight:   '#7be09a',
  ControlLeft: '#e07b39', ControlRight: '#e07b39',
};
const KEY_BOUND_DEFAULT   = '#3d3420';
const KEY_UNBOUND_DEFAULT = '#2a2a2a';

// Mirrors the modFill blend used in Keyboard rendering (25% accent over #1a1a1a)
function modFill(hex) {
  const h = n => Math.max(0, Math.min(255, n)).toString(16).padStart(2, '0');
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const bg = 0x1a;
  const blend = c => Math.round(bg + (c - bg) * 0.25);
  return `#${h(blend(r))}${h(blend(g))}${h(blend(b))}`;
}

const MOD_BUTTON_COLORS = {
  Ctrl:  '#e07b39', CtrlLeft:  '#e07b39', CtrlRight:  '#e07b39',
  Shift: '#7b9ee0', ShiftLeft: '#7b9ee0', ShiftRight: '#7b9ee0',
  Alt:   '#7be09a', AltLeft:   '#7be09a', AltRight:   '#7be09a',
};

function buildModDefs(settings) {
  const { splitModifiers } = settings;
  if (splitModifiers) {
    return [
      { value: 'ShiftLeft',  label: 'LShift', color: MOD_BUTTON_COLORS.ShiftLeft  },
      { value: 'ShiftRight', label: 'RShift', color: MOD_BUTTON_COLORS.ShiftRight },
      { value: 'AltLeft',    label: 'LAlt',   color: MOD_BUTTON_COLORS.AltLeft    },
      { value: 'AltRight',   label: 'RAlt',   color: MOD_BUTTON_COLORS.AltRight   },
      { value: 'CtrlLeft',   label: 'LCtrl',  color: MOD_BUTTON_COLORS.CtrlLeft   },
      { value: 'CtrlRight',  label: 'RCtrl',  color: MOD_BUTTON_COLORS.CtrlRight  },
    ];
  }
  return [
    { value: 'Ctrl',  label: 'Ctrl',  color: MOD_BUTTON_COLORS.Ctrl  },
    { value: 'Shift', label: 'Shift', color: MOD_BUTTON_COLORS.Shift },
    { value: 'Alt',   label: 'Alt',   color: MOD_BUTTON_COLORS.Alt   },
  ];
}

export default function BindModal({
  keyId, existingBindings,
  keyColor, recentColors = [],
  onColorChange,
  onSave, onCancel,
  settings,
}) {
  const keyDef      = KEY_MAP[keyId];
  const modDefs     = buildModDefs(settings);
  const isModifier  = MODIFIER_KEY_IDS.has(keyId);

  const isBoundKey = existingBindings.some(b => b.key === keyId);
  const accentHex = KEY_ACCENT_COLORS[keyId];
  const effectiveColor = keyColor
    || (accentHex ? modFill(accentHex) : null)
    || (isBoundKey ? KEY_BOUND_DEFAULT : KEY_UNBOUND_DEFAULT);

  const [modifiers, setModifiers]   = useState([]);
  const [action, setAction]         = useState('');
  const [localColor, setLocalColor] = useState(keyColor ?? '');
  const [pickerPos, setPickerPos]   = useState(null);

  const inputRef = useRef(null);
  const modalRef = useRef(null);

  const newId = bindingId(keyId, modifiers);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
    const existing = existingBindings.find(b => bindingId(b.key, b.modifiers) === newId);
    if (existing) setAction(existing.action);
  }, []);

  // When modifier selection changes, auto-fill action if a binding exists for this combo
  useEffect(() => {
    const existing = existingBindings.find(b => bindingId(b.key, b.modifiers) === newId);
    if (existing && action === '') setAction(existing.action);
  }, [modifiers.join(',')]);

  useEffect(() => {
    if (!modalRef.current) return;
    const rect = modalRef.current.getBoundingClientRect();
    setPickerPos({
      top:  rect.top,
      left: Math.max(8, rect.left - PICKER_WIDTH - PICKER_GAP),
      height: rect.height,
    });
  }, []);

  function toggleModifier(value) {
    setModifiers(prev => {
      if (prev.includes(value)) {
        // Deselect if already active
        return prev.filter(m => m !== value);
      }
      const family = MOD_FAMILY[value];
      // Replace any existing mod from the same family, then add new one
      const filtered = family ? prev.filter(m => MOD_FAMILY[m] !== family) : prev;
      return [...filtered, value].sort();
    });
  }

  function applyColor(color) {
    setLocalColor(color);
    onColorChange(color || null);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!action.trim()) {
      // Modifier key with no action: just commit the color and close
      onSave(keyId, modifiers, null);
      return;
    }
    onSave(keyId, modifiers, action.trim());
  }

  // Build title: e.g. "Ctrl+Shift+A"
  const modLabels = modifiers.map(m => modDefs.find(d => d.value === m)?.label ?? m);
  const titleCombo = [...modLabels, keyDef?.label ?? keyId].join('+');

  return (
    <div className="modal-backdrop" onClick={onCancel}>

      {pickerPos && (
        <div
          className="cpk-panel"
          style={{
            position: 'fixed',
            top:    pickerPos.top,
            left:   pickerPos.left,
            height: pickerPos.height,
            zIndex: 101,
          }}
          onClick={e => e.stopPropagation()}
        >
          <div className="cpk-panel-body">
            <ColorPicker color={localColor || effectiveColor} onChange={applyColor} />
            {recentColors.length > 0 && (
              <>
                <div className="recently-picked-label">Recently Picked</div>
                <div className="recent-colors-row">
                  {recentColors.map(c => (
                    <button
                      key={c}
                      type="button"
                      className={`color-swatch${c === localColor ? ' active' : ''}`}
                      style={{ background: c }}
                      title={c}
                      onClick={() => applyColor(c)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div className="modal" ref={modalRef} onClick={e => e.stopPropagation()}>
        <h3 className="modal-title">
          Bind <span className="modal-key">{titleCombo}</span>
        </h3>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="modal-row">
            <label>Modifier</label>
            <div className="mod-buttons">
              <button
                type="button"
                className={`mod-btn${modifiers.length === 0 ? ' active' : ''}`}
                onClick={() => setModifiers([])}
              >None</button>
              {modDefs.map(m => (
                <button
                  key={m.value}
                  type="button"
                  className={`mod-btn${modifiers.includes(m.value) ? ' active' : ''}`}
                  style={modifiers.includes(m.value) ? {
                    borderColor: m.color,
                    color: m.color,
                    background: m.color + '22',
                  } : {}}
                  onClick={() => toggleModifier(m.value)}
                >{m.label}</button>
              ))}
            </div>
          </div>

          <div className="modal-row">
            <label>Action</label>
            <input
              ref={inputRef}
              type="text"
              placeholder="e.g. Move Forward"
              value={action}
              onChange={e => setAction(e.target.value)}
              className="modal-input"
            />
          </div>

          <div className="modal-row">
            <label>Key Color</label>
            <div className="color-pick-row">
              <div
                className="color-current-swatch"
                style={{ background: localColor || 'var(--surface2)' }}
                title="Current color"
              />
              {localColor && (
                <button type="button" className="btn-clear-color" onClick={() => applyColor('')}>
                  Clear
                </button>
              )}
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>
            <button type="submit" className="btn-primary">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
