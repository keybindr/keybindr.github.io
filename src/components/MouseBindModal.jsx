import React, { useState, useEffect, useRef } from 'react';
import { useT, resolveAction } from '../useTranslation';
import { bindingId } from '../useBindings';
import { MOD_COLORS, MOD_FAMILY } from '../modifierConstants';
import { MOUSE_BUTTONS } from '../useFormats';

function buildModDefs(settings) {
  const { splitModifiers } = settings;
  if (splitModifiers) {
    return [
      { value: 'ShiftLeft',  label: 'LShift', color: MOD_COLORS.ShiftLeft  },
      { value: 'ShiftRight', label: 'RShift', color: MOD_COLORS.ShiftRight },
      { value: 'AltLeft',    label: 'LAlt',   color: MOD_COLORS.AltLeft    },
      { value: 'AltRight',   label: 'RAlt',   color: MOD_COLORS.AltRight   },
      { value: 'CtrlLeft',   label: 'LCtrl',  color: MOD_COLORS.CtrlLeft   },
      { value: 'CtrlRight',  label: 'RCtrl',  color: MOD_COLORS.CtrlRight  },
    ];
  }
  return [
    { value: 'Ctrl',  label: 'Ctrl',  color: MOD_COLORS.Ctrl  },
    { value: 'Shift', label: 'Shift', color: MOD_COLORS.Shift },
    { value: 'Alt',   label: 'Alt',   color: MOD_COLORS.Alt   },
  ];
}

export default function MouseBindModal({
  initialButton, initialModifiers, existingBindings = [],
  onSave, onCancel, settings,
}) {
  const t       = useT();
  const modDefs = buildModDefs(settings);

  const [button, setButton]       = useState(initialButton ?? MOUSE_BUTTONS[0]);
  const [modifiers, setModifiers] = useState(initialModifiers ?? []);
  const [action, setAction]       = useState('');

  const inputRef = useRef(null);

  const newId = bindingId(button, modifiers);

  useEffect(() => {
    if (inputRef.current && !('ontouchstart' in window)) inputRef.current.focus();
    const existing = existingBindings.find(b => bindingId(b.button, b.modifiers) === newId);
    if (existing) setAction(resolveAction(existing.action, t));
  }, []);

  useEffect(() => {
    const existing = existingBindings.find(b => bindingId(b.button, b.modifiers) === newId);
    if (existing && action === '') setAction(resolveAction(existing.action, t));
  }, [button, modifiers.join(',')]);

  function toggleModifier(value) {
    setModifiers(prev => {
      if (prev.includes(value)) return prev.filter(m => m !== value);
      const family = MOD_FAMILY[value];
      const filtered = family ? prev.filter(m => MOD_FAMILY[m] !== family) : prev;
      return [...filtered, value].sort();
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!action.trim()) return;
    onSave(button, modifiers, action.trim());
  }

  const modLabels  = modifiers.map(m => modDefs.find(d => d.value === m)?.label ?? m);
  const titleCombo = [...modLabels, button].join('+');

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h3 className="modal-title">
          {t('bindVerb')} <span className="modal-key">{titleCombo}</span>
        </h3>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="modal-row">
            <label>{t('colButton')}</label>
            <select
              className="settings-select"
              value={button}
              onChange={e => setButton(e.target.value)}
            >
              {MOUSE_BUTTONS.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div className="modal-row">
            <label>{t('modifier')}</label>
            <div className="mod-buttons">
              <button
                type="button"
                className={`mod-btn${modifiers.length === 0 ? ' active' : ''}`}
                onClick={() => setModifiers([])}
              >{t('none')}</button>
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
            <label>{t('action')}</label>
            <input
              ref={inputRef}
              type="text"
              placeholder={t('actionPlaceholder')}
              value={action}
              onChange={e => setAction(e.target.value)}
              maxLength={60}
              className="modal-input"
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onCancel}>{t('cancel')}</button>
            <button type="submit" className="btn-primary">{t('save')}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
