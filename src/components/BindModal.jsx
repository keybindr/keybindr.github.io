import React, { useState, useEffect, useRef } from 'react';
import { KEY_MAP } from '../keyboardLayout';
import { bindingId } from '../useBindings';

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

  const [modifier, setModifier] = useState('');
  const [action, setAction]     = useState('');
  const [localColor, setLocalColor] = useState(keyColor ?? '');
  const inputRef = useRef(null);

  const mods  = modifier ? [modifier] : [];
  const newId = bindingId(keyId, mods);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
    const existing = existingBindings.find(b => bindingId(b.key, b.modifiers) === newId);
    if (existing) setAction(existing.action);
  }, []);

  useEffect(() => {
    const existing = existingBindings.find(b => bindingId(b.key, b.modifiers) === newId);
    if (existing && action === '') setAction(existing.action);
  }, [modifier]);

  function applyColor(color) {
    setLocalColor(color);
    onColorChange(color || null);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!action.trim()) return;
    onSave(keyId, mods, action.trim());
  }

  const activeModDef = modDefs.find(m => m.value === modifier);
  const modLabel     = activeModDef?.label ?? modifier;

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h3 className="modal-title">
          Bind <span className="modal-key">{keyDef?.label ?? keyId}</span>
        </h3>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="modal-row">
            <label>Modifier</label>
            <div className="mod-buttons">
              <button
                type="button"
                className={`mod-btn${modifier === '' ? ' active' : ''}`}
                onClick={() => setModifier('')}
              >None</button>
              {modDefs.map(m => (
                <button
                  key={m.value}
                  type="button"
                  className={`mod-btn${modifier === m.value ? ' active' : ''}`}
                  style={modifier === m.value ? {
                    borderColor: m.color,
                    color: m.color,
                    background: m.color + '22',
                  } : {}}
                  onClick={() => setModifier(m.value)}
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
              <input
                type="color"
                className="color-picker"
                value={localColor || '#4a4a4a'}
                onChange={e => applyColor(e.target.value)}
              />
              {localColor && (
                <button type="button" className="btn-clear-color" onClick={() => applyColor('')}>
                  Clear
                </button>
              )}
            </div>
            {recentColors.length > 0 && (
              <>
                <label className="recently-picked-label">Recently Picked</label>
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

          <div className="modal-combo">
            Binding: <span className="combo-label">
              {modifier ? `${modLabel}+` : ''}{keyDef?.label ?? keyId}
            </span>
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
