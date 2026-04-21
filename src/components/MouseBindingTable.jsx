import React, { useState } from 'react';
import { bindingId } from '../useBindings';
import { useT, resolveAction } from '../useTranslation';
import { MOD_COLORS } from '../modifierConstants';

export default function MouseBindingTable({ mouseBindings = [], onUpdateAction, onRemove, onOpenModal }) {
  const t = useT();
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
        <thead>
          <tr>
            <th>{t('colModifier')}</th>
            <th>{t('colButton')}</th>
            <th>{t('colAction')}</th>
            <th className="cell-del-head" />
          </tr>
        </thead>
        <tbody>
          {mouseBindings.map(b => {
            const id = bindingId(b.button, b.modifiers);
            const isEditing = editingId === id;

            return (
              <tr key={id}>
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
                    title={t('removeBinding')}
                    onClick={e => { e.stopPropagation(); onRemove(b.button, b.modifiers); }}
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
