import React, { useState } from 'react';
import { useT, resolveAction } from '../useTranslation';
import { getHotasLabel, hotasBindingId, getHotasModInfo } from '../hotasConstants';
import { resolveDisplayLabel } from '../keylabels';
import { ALL_KEY_MAP } from '../keyboardLayouts';
import { MOD_COLORS } from '../modifierConstants';

function compactKeyLabel(keyId, keyDef, language) {
  if (/^Numpad\d$/.test(keyId)) return `Num${keyId.slice(-1)}`;
  return resolveDisplayLabel(keyId, keyDef, language);
}

export default function HOTASBindingTable({
  hotasBindings = [],
  onUpdateAction,
  onRemove,
  onOpenModal,
  settings = {},
  locked = false,
  onToggleLocked,
}) {
  const t = useT();
  const language = settings.language ?? 'en-US';
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  function getBid(b) {
    return hotasBindingId(b.input, b.modifiers ?? [], b.hotasMod ?? '');
  }

  function startEdit(b) {
    if (b.isHotasMod) return; // modifier-only buttons have no action to edit
    setEditingId(getBid(b));
    setEditValue(resolveAction(b.action, t));
  }

  function commitEdit(b) {
    if (editValue.trim()) onUpdateAction(b.input, b.modifiers ?? [], b.hotasMod ?? '', editValue.trim());
    setEditingId(null);
  }

  return (
    <div className="table-wrapper">
      <table className="binding-table">
        <colgroup>
          <col style={{ width: 20 }} />
          <col style={{ width: 110 }} />
          <col style={{ width: 170 }} />
          <col />
          <col style={{ width: 40 }} />
        </colgroup>
        <thead>
          <tr>
            <th className="cell-drag" />
            <th>{t('colModifier')}</th>
            <th>{t('hotasColInput')}</th>
            <th>{t('colAction')}</th>
            <th className="cell-del-head">
              <button
                className="btn-lock"
                onClick={e => { e.stopPropagation(); onToggleLocked?.(v => !v); }}
                title={locked ? t('unlockDelete') : t('lockDelete')}
              >
                <span style={{ position: 'relative', left: '6px', color: 'var(--accent)', lineHeight: 1 }}>
                  {locked ? (
                    <svg width="11" height="13" viewBox="0 0 11 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="0.5" y="5.5" width="10" height="7" rx="1.5" stroke="currentColor"/>
                      <path d="M2.5 5.5V3.5a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.4"/>
                    </svg>
                  ) : (
                    <svg width="11" height="13" viewBox="0 0 11 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="0.5" y="5.5" width="10" height="7" rx="1.5" stroke="currentColor"/>
                      <path d="M2.5 5.5V3.5a3 3 0 0 1 6 0" stroke="currentColor" strokeWidth="1.4"/>
                    </svg>
                  )}
                </span>
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {hotasBindings.map(b => {
            const bid       = getBid(b);
            const isEditing = editingId === bid;
            const mods      = b.modifiers ?? [];
            const hotasMod  = b.hotasMod  ?? '';

            // Resolve numbered modifier info for this row's hotasMod reference
            const hotasModInfo = hotasMod ? getHotasModInfo(hotasMod, hotasBindings) : null;
            // Resolve numbered modifier info if THIS row is a modifier button
            const selfModInfo  = b.isHotasMod ? getHotasModInfo(b.input, hotasBindings) : null;

            return (
              <tr key={bid}>
                <td className="cell-drag" />

                {/* Modifier column — HOTAS mod chip (numbered+colored) + keyboard mods */}
                <td className="cell-mod">
                  {(mods.length > 0 || hotasMod) ? (
                    <div className="mod-tags">
                      {hotasMod && (
                        <span
                          className="mod-tag"
                          style={{
                            borderColor: hotasModInfo?.color ?? '#888',
                            color:       hotasModInfo?.color ?? '#888',
                          }}
                          title={getHotasLabel(hotasMod)}
                        >
                          {hotasModInfo?.label ?? 'MOD'}
                        </span>
                      )}
                      {mods.map(m => (
                        <span key={m} className="mod-tag" style={{ borderColor: MOD_COLORS[m] ?? '#888', color: MOD_COLORS[m] ?? '#888' }}>
                          {m}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="mod-none">—</span>
                  )}
                </td>

                {/* Input column */}
                <td
                  className="cell-key"
                  style={{ cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 13 }}
                  onClick={() => onOpenModal?.(b.input, b.modifiers ?? [], b.hotasMod ?? '', b.isHotasMod ?? false)}
                  title={b.input}
                >
                  {getHotasLabel(b.input)}
                  {b.keyboardKey && (
                    <span className="mouse-remap-tag" title={b.keyboardKey}>
                      🕹→{compactKeyLabel(b.keyboardKey, ALL_KEY_MAP[b.keyboardKey], language)}
                    </span>
                  )}
                </td>

                {/* Action column */}
                <td className="cell-action" onClick={() => startEdit(b)}>
                  {b.isHotasMod ? (
                    <span
                      className="mod-tag"
                      style={{
                        borderColor: selfModInfo?.color ?? '#888',
                        color:       selfModInfo?.color ?? '#888',
                        cursor: 'pointer',
                      }}
                      onClick={() => onOpenModal?.(b.input, [], '', true)}
                      title={t('hotasModifierButton')}
                    >
                      {selfModInfo?.label ?? 'MOD'}
                    </span>
                  ) : isEditing ? (
                    <input
                      autoFocus
                      value={editValue}
                      onChange={e => setEditValue(e.target.value)}
                      maxLength={60}
                      onBlur={() => commitEdit(b)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') commitEdit(b);
                        if (e.key === 'Escape') setEditingId(null);
                      }}
                      className="action-edit-input"
                      onClick={e => e.stopPropagation()}
                    />
                  ) : (
                    <span className="action-text" title={t('clickToEdit')}>{resolveAction(b.action, t)}</span>
                  )}
                </td>

                <td className="cell-del">
                  <button
                    className="btn-del"
                    style={{ visibility: locked ? 'hidden' : 'visible' }}
                    title={t('removeBinding')}
                    onClick={e => { e.stopPropagation(); if (!locked) onRemove(b.input, b.modifiers ?? [], b.hotasMod ?? ''); }}
                  >✕</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="mouse-add-row">
        <button className="btn-secondary" onClick={() => onOpenModal?.()}>
          + {t('addHotasBinding')}
        </button>
      </div>
    </div>
  );
}
