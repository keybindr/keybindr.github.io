import React, { useState, useRef } from 'react';
import { KEY_MAP } from '../keyboardLayout';
import { bindingId } from '../useBindings';

const MOD_COLORS = {
  Ctrl:  '#e07b39',
  Shift: '#7b9ee0',
  Alt:   '#7be09a',
};

export default function BindingTable({ bindings, selectedId, onSelect, onUpdateAction, onRemove, onReorder, onOpenModal }) {
  const [editingId, setEditingId]     = useState(null);
  const [editValue, setEditValue]     = useState('');
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const dragIndex = useRef(null);

  function startEdit(b) {
    setEditingId(bindingId(b.key, b.modifiers));
    setEditValue(b.action);
  }

  function commitEdit(b) {
    if (editValue.trim()) onUpdateAction(b.key, b.modifiers, editValue.trim());
    setEditingId(null);
  }

  function handleDragStart(e, index) {
    dragIndex.current = index;
    e.dataTransfer.effectAllowed = 'move';
    // minimal ghost image — let browser default but mark the row
    e.currentTarget.closest('tr').classList.add('row-dragging');
  }

  function handleDragEnd(e) {
    e.currentTarget.closest('tr')?.classList.remove('row-dragging');
    dragIndex.current = null;
    setDragOverIndex(null);
  }

  function handleDragOver(e, index) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  }

  function handleDrop(e, index) {
    e.preventDefault();
    if (dragIndex.current !== null && dragIndex.current !== index) {
      onReorder(dragIndex.current, index);
    }
    dragIndex.current = null;
    setDragOverIndex(null);
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
            <th className="cell-drag" />
          </tr>
        </thead>
        <tbody>
          {bindings.map((b, index) => {
            const id         = bindingId(b.key, b.modifiers);
            const isSelected = id === selectedId;
            const keyLabel   = KEY_MAP[b.key]?.label ?? b.key;
            const isEditing  = editingId === id;
            const isDragOver = dragOverIndex === index;

            return (
              <tr
                key={id}
                className={[
                  isSelected  ? 'row-selected'  : '',
                  isDragOver  ? 'row-drag-over' : '',
                ].filter(Boolean).join(' ')}
                onClick={() => onSelect(id)}
                onDoubleClick={() => onOpenModal?.(b.key)}
                onDragOver={e => handleDragOver(e, index)}
                onDrop={e => handleDrop(e, index)}
                onDragLeave={() => setDragOverIndex(null)}
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
                <td className="cell-drag">
                  <span
                    className="drag-handle"
                    draggable
                    onDragStart={e => handleDragStart(e, index)}
                    onDragEnd={handleDragEnd}
                    onClick={e => e.stopPropagation()}
                    title="Drag to reorder"
                  >⠿</span>
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
