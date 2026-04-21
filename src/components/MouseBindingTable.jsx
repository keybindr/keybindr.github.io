import React, { useState } from 'react';
import { bindingId } from '../useBindings';
import { useT, resolveAction } from '../useTranslation';
import { MOD_COLORS } from '../modifierConstants';
import { resolveDisplayLabel } from '../keylabels';
import { ALL_KEY_MAP } from '../keyboardLayouts';

// Compact label for the inline remap tag — numpad digits get "Num1" style, everything else full
function compactKeyLabel(keyId, keyDef, language) {
  if (/^Numpad\d$/.test(keyId)) return `Num${keyId.slice(-1)}`;
  return resolveDisplayLabel(keyId, keyDef, language);
}

export default function MouseBindingTable({ mouseBindings = [], onUpdateAction, onRemove, onOpenModal, settings = {}, locked = false, onToggleLocked }) {
  const t = useT();
  const language = settings.language ?? 'en-US';
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  function startEdit(b) {
    setEditingId(bindingId(b.button, b.modifiers));
    setEditValue(resolveAction(b.action, t));
  }

  function commitEdit(b) {
    if (editValue.trim()) onUpdateAction(b.button, b.modifiers, editValue.trim());
    setEditingId(null);
  }

  return (
    <div className="table-wrapper">
      <table className="binding-table">
        <colgroup>
          <col style={{ width: 20 }} />
          <col style={{ width: 110 }} />
          <col style={{ width: 95 }} />
          <col />
          <col style={{ width: 40 }} />
        </colgroup>
        <thead>
          <tr>
            <th className="cell-drag" />
            <th>{t('colModifier')}</th>
            <th>{t('colButton')}</th>
            <th>{t('colAction')}</th>
            <th className="cell-del-head">
              <button className="btn-lock" onClick={e => { e.stopPropagation(); onToggleLocked?.(v => !v); }} title={locked ? t('unlockDelete') : t('lockDelete')}>
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
          {mouseBindings.map(b => {
            const id = bindingId(b.button, b.modifiers);
            const isEditing = editingId === id;

            return (
              <tr key={id}>
                <td className="cell-drag" />
                <td className="cell-mod">
                  {b.modifiers.length > 0 ? (
                    <div className="mod-tags">
                      {b.modifiers.map(m => (
                        <span key={m} className="mod-tag" style={{ borderColor: MOD_COLORS[m] ?? '#888', color: MOD_COLORS[m] ?? '#888' }}>
                          {m}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="mod-none">—</span>
                  )}
                </td>
                <td
                  className="cell-key"
                  style={{ cursor: 'pointer' }}
                  onClick={() => onOpenModal?.(b.button, b.modifiers)}
                >
                  {b.button}
                  {b.keyboardKey && (
                    <span className="mouse-remap-tag" title={b.keyboardKey}>
                      🖱→{compactKeyLabel(b.keyboardKey, ALL_KEY_MAP[b.keyboardKey], language)}
                    </span>
                  )}
                </td>
                <td className="cell-action" onClick={() => startEdit(b)}>
                  {isEditing ? (
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
                    onClick={e => { e.stopPropagation(); if (!locked) onRemove(b.button, b.modifiers); }}
                  >✕</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="mouse-add-row">
        <button className="btn-secondary" onClick={() => onOpenModal?.()}>
          + {t('addMouseBinding')}
        </button>
      </div>
    </div>
  );
}
