import React, { useState, useEffect, useRef } from 'react';
import { KEY_MAP } from '../keyboardLayout';
import { bindingId } from '../useBindings';

const MODIFIERS = ['Ctrl', 'Shift', 'Alt'];

export default function BindModal({
  keyId, existingBindings,
  keyColor, recentColors = [],
  onColorChange,
  onSave, onCancel,
}) {
  const keyDef = KEY_MAP[keyId];
  const [modifier, setModifier] = useState('');
  const [action, setAction] = useState('');
  const [conflict, setConflict] = useState(false);
  const [localColor, setLocalColor] = useState(keyColor ?? '');
  const inputRef = useRef(null);

  const mods = modifier ? [modifier] : [];
  const newId = bindingId(keyId, mods);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
    const existing = existingBindings.find(b => bindingId(b.key, b.modifiers) === newId);
    if (existing) setAction(existing.action);
  }, []);

  useEffect(() => {
    const existing = existingBindings.find(b => bindingId(b.key, b.modifiers) === newId);
    setConflict(!!existing);
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
                className={`mod-btn ${modifier === '' ? 'active' : ''}`}
                onClick={() => setModifier('')}
              >None</button>
              {MODIFIERS.map(m => (
                <button
                  key={m}
                  type="button"
                  className={`mod-btn mod-${m.toLowerCase()} ${modifier === m ? 'active' : ''}`}
                  onClick={() => setModifier(m)}
                >{m}</button>
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
            <div className="color-row">
              <input
                type="color"
                className="color-picker"
                value={localColor || '#4a4a4a'}
                onChange={e => applyColor(e.target.value)}
              />
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
              {localColor && (
                <button type="button" className="btn-clear-color" onClick={() => applyColor('')}>
                  Clear
                </button>
              )}
            </div>
          </div>

          {conflict && (
            <p className="conflict-warn">
              ⚠ This combo already has a binding — saving will overwrite it.
            </p>
          )}

          <div className="modal-combo">
            Binding: <span className="combo-label">
              {modifier ? `${modifier}+` : ''}{keyDef?.label ?? keyId}
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
