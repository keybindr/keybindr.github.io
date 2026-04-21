import React, { useState, useEffect, useRef } from 'react';
import { useT, resolveAction } from '../useTranslation';
import { bindingId } from '../useBindings';
import { MOD_COLORS, MOD_FAMILY, buildModDefs } from '../modifierConstants';
import { MOUSE_BUTTONS } from '../useFormats';
import { resolveDisplayLabel } from '../keylabels';
import { ALL_KEY_MAP } from '../keyboardLayouts';

// When unified mode is active, collapse split-side variants (AltLeft/AltRight → Alt)
// so an existing binding never shows duplicate modifier buttons.
const SPLIT_TO_UNIFIED = {
  ShiftLeft: 'Shift', ShiftRight: 'Shift',
  CtrlLeft:  'Ctrl',  CtrlRight:  'Ctrl',
  AltLeft:   'Alt',   AltRight:   'Alt',
};

function normalizeModifiers(mods, splitModifiers) {
  if (splitModifiers) return mods;
  return [...new Set(mods.map(m => SPLIT_TO_UNIFIED[m] ?? m))];
}


export default function MouseBindModal({
  initialButton, initialModifiers, initialKeyboardKey, existingBindings = [],
  bindings = [],
  onSave, onCancel, settings, layoutKeys = [],
}) {
  const t       = useT();
  const modDefs = buildModDefs(settings);
  const language = settings.language ?? 'en-US';

  const [button, setButton]           = useState(initialButton ?? MOUSE_BUTTONS[0]);
  const [modifiers, setModifiers]     = useState(normalizeModifiers(initialModifiers ?? [], settings.splitModifiers));
  const [action, setAction]           = useState('');
  const [keyboardKey, setKeyboardKey] = useState(initialKeyboardKey ?? '');

  const inputRef        = useRef(null);
  const modalRef        = useRef(null);
  const isFirstRender   = useRef(true);

  const newId = bindingId(button, modifiers);

  useEffect(() => {
    if (inputRef.current && !('ontouchstart' in window)) inputRef.current.focus();
    const existing = existingBindings.find(b => bindingId(b.button, b.modifiers) === newId);
    if (existing) {
      setAction(resolveAction(existing.action, t));
      setKeyboardKey(existing.keyboardKey ?? '');
    }
  }, []);

  useEffect(() => {
    const existing = existingBindings.find(b => bindingId(b.button, b.modifiers) === newId);
    if (existing && action === '') {
      setAction(resolveAction(existing.action, t));
      setKeyboardKey(existing.keyboardKey ?? '');
    }
  }, [button, modifiers.join(',')]);

  // When the user picks a different remapped key, auto-fill action from the
  // matching keyboard binding (bare key, no modifiers).  Skip the initial
  // render so the existing mouse-binding action wins on open.
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    if (!keyboardKey) return;
    const kb = bindings.find(b => b.key === keyboardKey && b.modifiers.length === 0);
    if (kb) setAction(resolveAction(kb.action, t));
  }, [keyboardKey]);

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
    onSave(button, modifiers, action.trim(), keyboardKey);
  }

  const modLabels  = modifiers.map(m => modDefs.find(d => d.value === m)?.label ?? m);
  const titleCombo = [...modLabels, button].join('+');

  // In unified mode, collapse L/R modifier pairs: keep only the Left variant, label it plainly.
  const UNIFIED_MOD_LABEL = {
    ShiftLeft: 'Shift', ControlLeft: 'Ctrl', AltLeft: 'Alt', MetaLeft: 'Meta',
  };
  const SKIP_IN_UNIFIED = new Set(['ShiftRight', 'ControlRight', 'AltRight', 'MetaRight']);

  // Preferred display order for the remapped key dropdown
  const KEY_ORDER = [
    'Digit0','Digit1','Digit2','Digit3','Digit4','Digit5','Digit6','Digit7','Digit8','Digit9',
    'KeyA','KeyB','KeyC','KeyD','KeyE','KeyF','KeyG','KeyH','KeyI','KeyJ',
    'KeyK','KeyL','KeyM','KeyN','KeyO','KeyP','KeyQ','KeyR','KeyS','KeyT',
    'KeyU','KeyV','KeyW','KeyX','KeyY','KeyZ',
    'Space','Enter','MetaLeft','ContextMenu',
    'Escape','AltLeft','Backspace','CapsLock','ControlLeft','ShiftLeft','Tab',
    'Quote','Comma','Minus','Period','Slash','Semicolon','Equal',
    'BracketLeft','Backslash','BracketRight','Backquote',
    'ArrowDown','ArrowLeft','ArrowRight','ArrowUp',
    'IntlBackslash','IntlHash',
    'F1','F2','F3','F4','F5','F6','F7','F8','F9','F10','F11','F12',
    'PrintScreen','ScrollLock','Pause',
    'Insert','Home','PageUp','PageDown','Delete','End',
    'NumLock',
    'NumpadMultiply','NumpadAdd','NumpadSubtract','NumpadDecimal','NumpadDivide',
    'Numpad0','Numpad1','Numpad2','Numpad3','Numpad4',
    'Numpad5','Numpad6','Numpad7','Numpad8','Numpad9','NumpadEnter',
    // Split-mode L/R variants follow their unified counterparts
    'AltRight','ControlRight','ShiftRight','MetaRight',
  ];
  const KEY_RANK = Object.fromEntries(KEY_ORDER.map((id, i) => [id, i]));

  const keyOptions = layoutKeys
    .filter(k => settings.splitModifiers ? true : !SKIP_IN_UNIFIED.has(k.id))
    .map(k => {
      const label = (!settings.splitModifiers && UNIFIED_MOD_LABEL[k.id])
        ? UNIFIED_MOD_LABEL[k.id]
        : resolveDisplayLabel(k.id, ALL_KEY_MAP[k.id], language);
      return { id: k.id, label };
    })
    .filter(k => k.label)
    .sort((a, b) => {
      const ra = KEY_RANK[a.id] ?? Infinity;
      const rb = KEY_RANK[b.id] ?? Infinity;
      if (ra !== rb) return ra - rb;
      return a.label.localeCompare(b.label); // fallback for unlisted keys
    });

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal" ref={modalRef} onClick={e => e.stopPropagation()}>
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

          {layoutKeys.length > 0 && (
            <div className="modal-row">
              <label>{t('remappedKey')}</label>
              <select
                className="settings-select"
                value={keyboardKey}
                onChange={e => setKeyboardKey(e.target.value)}
              >
                <option value="">{t('none')}</option>
                {keyOptions.map(k => (
                  <option key={k.id} value={k.id}>{k.label}</option>
                ))}
              </select>
            </div>
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
