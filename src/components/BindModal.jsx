import React, { useState, useEffect, useRef } from 'react';
import { ALL_KEY_MAP } from '../keyboardLayouts';
import { resolveLabel } from '../keylabels';
import { useT, resolveAction } from '../useTranslation';
import { bindingId } from '../useBindings';
import ColorPicker from './ColorPicker';
import { KEY_DEFAULT, KEY_BOUND, KEY_ACCENT, MOD_COLORS, MOD_FAMILY, modFill } from '../modifierConstants';

const PICKER_WIDTH = 252;
const PICKER_GAP   = 12;

const MODIFIER_KEY_IDS = new Set([
  'ShiftLeft', 'ShiftRight', 'ControlLeft', 'ControlRight',
  'AltLeft', 'AltRight', 'MetaLeft', 'MetaRight', 'ContextMenu',
]);

const MOD_KEY_FAMILY = {
  ShiftLeft: 'Shift', ShiftRight: 'Shift',
  ControlLeft: 'Ctrl', ControlRight: 'Ctrl',
  AltLeft: 'Alt', AltRight: 'Alt',
};

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

export default function BindModal({
  keyId, existingBindings,
  keyColor, recentColors = [],
  onColorChange,
  onSave, onCancel,
  settings,
}) {
  const t           = useT();
  const keyDef      = ALL_KEY_MAP[keyId];
  const language    = settings?.language ?? 'en-US';
  const modDefs     = buildModDefs(settings);
  const isModifier  = MODIFIER_KEY_IDS.has(keyId);

  const isBoundKey = existingBindings.some(b => b.key === keyId);
  const accentHex = KEY_ACCENT[keyId];
  const effectiveColor = keyColor
    || (accentHex ? modFill(accentHex) : null)
    || (isBoundKey ? KEY_BOUND : KEY_DEFAULT);

  const [modifiers, setModifiers]   = useState([]);
  const [action, setAction]         = useState('');
  const [localColor, setLocalColor] = useState(keyColor ?? '');
  const [pickerPos, setPickerPos]   = useState(null);

  const inputRef = useRef(null);
  const modalRef = useRef(null);

  const newId = bindingId(keyId, modifiers);

  const currentFamily = MOD_KEY_FAMILY[keyId];
  const hasConflict = (() => {
    if (currentFamily && modifiers.length === 0) {
      return existingBindings.some(b => b.modifiers.some(m => MOD_FAMILY[m] === currentFamily));
    }
    if (modifiers.length > 0) {
      const usedFamilies = new Set(modifiers.map(m => MOD_FAMILY[m]).filter(Boolean));
      return existingBindings.some(b => {
        const fam = MOD_KEY_FAMILY[b.key];
        return fam && b.modifiers.length === 0 && usedFamilies.has(fam);
      });
    }
    return false;
  })();

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
    const existing = existingBindings.find(b => bindingId(b.key, b.modifiers) === newId);
    if (existing) setAction(resolveAction(existing.action, t));
  }, []);

  // When modifier selection changes, auto-fill action if a binding exists for this combo
  useEffect(() => {
    const existing = existingBindings.find(b => bindingId(b.key, b.modifiers) === newId);
    if (existing && action === '') setAction(resolveAction(existing.action, t));
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
  const titleCombo = [...modLabels, resolveLabel(keyId, keyDef, language)].join('+');

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
                <div className="recently-picked-label">{t('recentlyPicked')}</div>
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
          {t('bindVerb')} <span className="modal-key">{titleCombo}</span>
        </h3>

        <form onSubmit={handleSubmit} className="modal-form">
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
              className="modal-input"
            />
          </div>

          <div className="modal-row">
            <label>{t('keyColor')}</label>
            <div className="color-pick-row">
              <div
                className="color-current-swatch"
                style={{ background: localColor || 'var(--surface2)' }}
                title="Current color"
              />
              {localColor && (
                <button type="button" className="btn-clear-color" onClick={() => applyColor('')}>
                  {t('clear')}
                </button>
              )}
            </div>
          </div>

          {hasConflict && (
            <p className="conflict-warn">⚠ {t('modifierConflict')}</p>
          )}

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onCancel}>{t('cancel')}</button>
            <button type="submit" className="btn-primary">{t('save')}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
