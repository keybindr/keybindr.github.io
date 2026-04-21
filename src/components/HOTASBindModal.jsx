import React, { useState, useEffect, useRef } from 'react';
import { useT, resolveAction } from '../useTranslation';
import { buildHotasGroups, getHotasLabel, hotasBindingId, getHotasModInfo, DEFAULT_JOYSTICK_BUTTONS, DEFAULT_THROTTLE_BUTTONS, DEFAULT_PEDALS_BUTTONS } from '../hotasConstants';
import { resolveDisplayLabel } from '../keylabels';
import { ALL_KEY_MAP } from '../keyboardLayouts';
import { MOD_COLORS, MOD_FAMILY, buildModDefs } from '../modifierConstants';

const SPLIT_TO_UNIFIED = {
  ShiftLeft: 'Shift', ShiftRight: 'Shift',
  CtrlLeft:  'Ctrl',  CtrlRight:  'Ctrl',
  AltLeft:   'Alt',   AltRight:   'Alt',
};

function normalizeModifiers(mods, splitModifiers) {
  if (splitModifiers) return mods;
  return [...new Set(mods.map(m => SPLIT_TO_UNIFIED[m] ?? m))];
}

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
  'AltRight','ControlRight','ShiftRight','MetaRight',
];
const KEY_RANK = Object.fromEntries(KEY_ORDER.map((id, i) => [id, i]));

const UNIFIED_MOD_LABEL = {
  ShiftLeft: 'Shift', ControlLeft: 'Ctrl', AltLeft: 'Alt', MetaLeft: 'Meta',
};
const SKIP_IN_UNIFIED = new Set(['ShiftRight', 'ControlRight', 'AltRight', 'MetaRight']);

export default function HOTASBindModal({
  initialInput,
  initialModifiers,
  initialKeyboardKey,
  initialHotasMod,
  initialIsHotasMod,
  existingBindings = [],
  bindings = [],
  settings = {},
  layoutKeys = [],
  onSave,
  onRemove,
  onCancel,
}) {
  const t = useT();
  const language = settings.language ?? 'en-US';

  const joystickButtonCount = settings.joystickButtonCount ?? DEFAULT_JOYSTICK_BUTTONS;
  const throttleButtonCount = settings.throttleButtonCount ?? DEFAULT_THROTTLE_BUTTONS;
  const pedalsButtonCount   = settings.pedalsButtonCount   ?? DEFAULT_PEDALS_BUTTONS;

  const groups     = buildHotasGroups(joystickButtonCount, throttleButtonCount, pedalsButtonCount);
  const firstInput = groups[0]?.inputs[0] ?? '';
  const modDefs    = buildModDefs(settings);

  const [input,      setInput]      = useState(initialInput      ?? firstInput);
  const [modifiers,  setModifiers]  = useState(normalizeModifiers(initialModifiers ?? [], settings.splitModifiers));
  const [action,     setAction]     = useState('');
  const [keyboardKey, setKeyboardKey] = useState(initialKeyboardKey ?? '');
  const [hotasMod,   setHotasMod]   = useState(initialHotasMod   ?? '');
  const [isHotasMod, setIsHotasMod] = useState(initialIsHotasMod ?? false);

  const inputRef      = useRef(null);
  const modalRef      = useRef(null);
  const isFirstRender = useRef(true);

  // Pre-fill when opening for an existing binding
  useEffect(() => {
    const id       = hotasBindingId(input, modifiers, hotasMod);
    const existing = existingBindings.find(b => hotasBindingId(b.input, b.modifiers ?? [], b.hotasMod ?? '') === id);
    if (existing) {
      setAction(resolveAction(existing.action, t));
      setKeyboardKey(existing.keyboardKey ?? '');
      setIsHotasMod(existing.isHotasMod ?? false);
    }
    if (inputRef.current && !('ontouchstart' in window)) inputRef.current.focus();
  }, []);

  // When user switches input/modifiers/hotasMod, reload any existing action
  useEffect(() => {
    const id       = hotasBindingId(input, modifiers, hotasMod);
    const existing = existingBindings.find(b => hotasBindingId(b.input, b.modifiers ?? [], b.hotasMod ?? '') === id);
    if (existing && action === '') {
      setAction(resolveAction(existing.action, t));
      setKeyboardKey(existing.keyboardKey ?? '');
      setIsHotasMod(existing.isHotasMod ?? false);
    }
  }, [input, modifiers.join(','), hotasMod]);

  // Auto-fill action from keyboard binding when remapped key is picked
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    if (!keyboardKey) return;
    const kb = bindings.find(b => b.key === keyboardKey && b.modifiers.length === 0);
    if (kb) setAction(resolveAction(kb.action, t));
  }, [keyboardKey]);

  function toggleModifier(value) {
    setModifiers(prev => {
      if (prev.includes(value)) return prev.filter(m => m !== value);
      const family   = MOD_FAMILY[value];
      const filtered = family ? prev.filter(m => MOD_FAMILY[m] !== family) : prev;
      return [...filtered, value].sort();
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    // Was a modifier, user unchecked it — remove the modifier binding (and its dependents)
    if (!isHotasMod && initialIsHotasMod) {
      if (action.trim()) {
        // Convert to a regular binding with the provided action
        onSave(input, modifiers, action.trim(), keyboardKey, hotasMod, false);
      } else {
        // No action given — just remove the modifier entirely
        onRemove?.(input);
      }
      return;
    }
    if (!isHotasMod && !action.trim()) return;
    onSave(input, modifiers, isHotasMod ? '' : action.trim(), isHotasMod ? '' : keyboardKey, hotasMod, isHotasMod);
  }

  // HOTAS modifier buttons available in the dropdown
  const hotasModButtons = existingBindings.filter(b => b.isHotasMod);

  // Remapped key options for keyboard binding
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
      return a.label.localeCompare(b.label);
    });

  const hotasModInfo = hotasMod ? getHotasModInfo(hotasMod, existingBindings) : null;
  const comboLabel = [
    hotasMod ? `[${hotasModInfo?.label ?? getHotasLabel(hotasMod)}]+` : '',
    ...modifiers.map(m => modDefs.find(d => d.value === m)?.label ?? m).map(l => `${l}+`),
    getHotasLabel(input),
  ].join('');

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal" ref={modalRef} onClick={e => e.stopPropagation()}>
        <h3 className="modal-title">
          {t('bindVerb')} <span className="modal-key">{comboLabel}</span>
        </h3>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* ── Input ──────────────────────────────────────────────── */}
          <div className="modal-row">
            <label>{t('hotasColInput')}</label>
            <select
              className="settings-select"
              value={input}
              onChange={e => { setInput(e.target.value); setAction(''); }}
            >
              {groups.map(group => (
                <optgroup key={group.label} label={group.label}>
                  {group.inputs.map(id => (
                    <option key={id} value={id}>{getHotasLabel(id)}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {/* ── Mark as HOTAS modifier ─────────────────────────────── */}
          <div className="modal-row">
            <label style={{ cursor: 'pointer', userSelect: 'none' }}>
              <input
                type="checkbox"
                checked={isHotasMod}
                onChange={e => {
                  setIsHotasMod(e.target.checked);
                  if (e.target.checked) { setModifiers([]); setHotasMod(''); setAction(''); setKeyboardKey(''); }
                }}
                style={{ marginRight: 6 }}
              />
              {t('hotasMarkAsModifier')}
            </label>
          </div>

          {!isHotasMod && (
            <>
              {/* ── Modifiers (keyboard + HOTAS mod buttons) ─────────── */}
              <div className="modal-row">
                <label>{t('modifier')}</label>
                <div className="mod-buttons">
                  <button
                    type="button"
                    className={`mod-btn${modifiers.length === 0 && !hotasMod ? ' active' : ''}`}
                    onClick={() => { setModifiers([]); setHotasMod(''); }}
                  >{t('none')}</button>
                  {modDefs.map(m => (
                    <button
                      key={m.value}
                      type="button"
                      className={`mod-btn${modifiers.includes(m.value) ? ' active' : ''}`}
                      style={modifiers.includes(m.value) ? {
                        borderColor: m.color, color: m.color, background: m.color + '22',
                      } : {}}
                      onClick={() => toggleModifier(m.value)}
                    >{m.label}</button>
                  ))}
                  {hotasModButtons.map(b => {
                    const info    = getHotasModInfo(b.input, existingBindings);
                    const color   = info?.color ?? '#888';
                    const label   = info?.label ?? 'MOD';
                    const active  = hotasMod === b.input;
                    return (
                      <button
                        key={b.input}
                        type="button"
                        className={`mod-btn${active ? ' active' : ''}`}
                        style={active ? { borderColor: color, color, background: color + '22' } : {}}
                        title={getHotasLabel(b.input)}
                        onClick={() => { setHotasMod(active ? '' : b.input); setAction(''); }}
                      >{label}</button>
                    );
                  })}
                </div>
              </div>

              {/* ── Action ────────────────────────────────────────────── */}
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

              {/* ── Remapped keyboard key ─────────────────────────────── */}
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
            </>
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
