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

function buildModDefs(settings) {
  const { splitModifiers, modColors, splitModColors } = settings;
  if (splitModifiers) {
    return [
      { value: 'ShiftLeft',  label: 'LShift', color: splitModColors.ShiftLeft  },
      { value: 'ShiftRight', label: 'RShift', color: splitModColors.ShiftRight },
      { value: 'AltLeft',    label: 'LAlt',   color: splitModColors.AltLeft    },
      { value: 'AltRight',   label: 'RAlt',   color: splitModColors.AltRight   },
      { value: 'CtrlLeft',   label: 'LCtrl',  color: splitModColors.CtrlLeft   },
      { value: 'CtrlRight',  label: 'RCtrl',  color: splitModColors.CtrlRight  },
    ];
  }
  return [
    { value: 'Ctrl',  label: 'Ctrl',  color: modColors.Ctrl  },
    { value: 'Shift', label: 'Shift', color: modColors.Shift },
    { value: 'Alt',   label: 'Alt',   color: modColors.Alt   },
  ];
}

export default function BindModal({
  keyId, existingBindings,
  keyColor, recentColors = [],
  onColorChange,
  onSave, onCancel,
  settings,
}) {
  const keyDef  = KEY_MAP[keyId];
  const modDefs = buildModDefs(settings);

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
    if (!action.trim()) return;
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
            <ColorPicker color={localColor || '#4a4a4a'} onChange={applyColor} />
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
            <button type="submit" className="btn-primary" disabled={!action.trim()}>Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
