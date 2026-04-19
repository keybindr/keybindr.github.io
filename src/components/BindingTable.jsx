import React, { useState } from 'react';
import { KEY_MAP } from '../keyboardLayout';
import { bindingId } from '../useBindings';

const MOD_COLORS = {
  Ctrl:  '#e07b39',
  Shift: '#7b9ee0',
  Alt:   '#7be09a',
};

export default function BindingTable({ bindings, selectedId, onSelect, onUpdateAction, onRemove, onOpenModal }) {
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  const sorted = [...bindings].sort((a, b) => {
    const ak = a.key + a.modifiers.join('');
    const bk = b.key + b.modifiers.join('');
    return ak.localeCompare(bk);
  });

  function startEdit(b) {
    setEditingId(bindingId(b.key, b.modifiers));
    setEditValue(b.action);
  }

  function commitEdit(b) {
    if (editValue.trim()) {
      onUpdateAction(b.key, b.modifiers, editValue.trim());
    }
    setEditingId(null);
  }

  return (
    <div className="table-wrapper">
      <table className="binding-table">
        <thead>
          <tr>
            <th>Modifier</th>
            <th>Key</th>
            <th>Action</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {sorted.map(b => {
            const id = bindingId(b.key, b.modifiers);
            const isSelected = id === selectedId;
            const keyLabel = KEY_MAP[b.key]?.label ?? b.key;
            const isEditing = editingId === id;

            return (
              <tr
                key={id}
                className={isSelected ? 'row-selected' : ''}
                onClick={() => onSelect(id)}
                onDoubleClick={() => onOpenModal?.(b.key)}
              >
                <td className="cell-mod">
                  {b.modifiers.length > 0 ? (
                    b.modifiers.map(m => (
                      <span key={m} className="mod-tag" style={{ borderColor: MOD_COLORS[m] ?? '#888', color: MOD_COLORS[m] ?? '#888' }}>
                        {m}
                      </span>
                    ))
                  ) : (
                    <span className="mod-none">—</span>
                  )}
                </td>
                <td className="cell-key">{keyLabel}</td>
                <td className="cell-action" onClick={e => { e.stopPropagation(); startEdit(b); }}>
                  {isEditing ? (
                    <input
                      autoFocus
                      value={editValue}
                      onChange={e => setEditValue(e.target.value)}
                      onBlur={() => commitEdit(b)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') commitEdit(b);
                        if (e.key === 'Escape') setEditingId(null);
                      }}
                      className="action-edit-input"
                      onClick={e => e.stopPropagation()}
                    />
                  ) : (
                    <span className="action-text" title="Click to edit">{b.action}</span>
                  )}
                </td>
                <td className="cell-del">
                  <button
                    className="btn-del"
                    title="Remove binding"
                    onClick={e => { e.stopPropagation(); onRemove(b.key, b.modifiers); }}
                  >✕</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {bindings.length === 0 && (
        <p className="table-empty">No bindings yet. Click a key to add one.</p>
      )}
    </div>
  );
}
