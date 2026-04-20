import React, { useState, useRef } from 'react';
import { ALL_KEY_MAP } from '../keyboardLayouts';
import { resolveLabel } from '../keylabels';
import { bindingId } from '../useBindings';
import { useT, resolveAction } from '../useTranslation';

const KEY_BOUND_COLOR = '#3d3420';

// Maps physical modifier key IDs to their logical family
const MOD_KEY_FAMILY = {
  ShiftLeft: 'Shift', ShiftRight: 'Shift',
  ControlLeft: 'Ctrl', ControlRight: 'Ctrl',
  AltLeft: 'Alt',   AltRight: 'Alt',
};

// Maps modifier values (unified or split) to their logical family
const MOD_VALUE_FAMILY = {
  Shift: 'Shift', ShiftLeft: 'Shift', ShiftRight: 'Shift',
  Ctrl:  'Ctrl',  CtrlLeft:  'Ctrl',  CtrlRight:  'Ctrl',
  Alt:   'Alt',   AltLeft:   'Alt',   AltRight:   'Alt',
};

function detectModifierConflicts(bindings) {
  const standalone = new Map(); // family → bindingId
  for (const b of bindings) {
    const family = MOD_KEY_FAMILY[b.key];
    if (family && b.modifiers.length === 0) {
      standalone.set(family, bindingId(b.key, b.modifiers));
    }
  }
  if (standalone.size === 0) return new Set();

  const conflicts = new Set();
  for (const b of bindings) {
    for (const m of b.modifiers) {
      const family = MOD_VALUE_FAMILY[m];
      if (family && standalone.has(family)) {
        conflicts.add(standalone.get(family));
        conflicts.add(bindingId(b.key, b.modifiers));
      }
    }
  }
  return conflicts;
}

const MOD_COLORS = {
  Ctrl:  '#e07b39', CtrlLeft:  '#e07b39', CtrlRight:  '#e07b39',
  Shift: '#7b9ee0', ShiftLeft: '#7b9ee0', ShiftRight: '#7b9ee0',
  Alt:   '#7be09a', AltLeft:   '#7be09a', AltRight:   '#7be09a',
};

export default function BindingTable({ bindings, keyColors = {}, selectedId, onSelect, onUpdateAction, onRemove, onReorder, onOpenModal, settings = {} }) {
  const t = useT();
  const language = settings.language ?? 'en-US';
  const [editingId, setEditingId]         = useState(null);
  const [editValue, setEditValue]         = useState('');
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const dragIndex = useRef(null);
  const conflictIds = detectModifierConflicts(bindings);

  function startEdit(b) {
    setEditingId(bindingId(b.key, b.modifiers));
    setEditValue(resolveAction(b.action, t));
  }

  function commitEdit(b) {
    if (editValue.trim()) onUpdateAction(b.key, b.modifiers, editValue.trim());
    setEditingId(null);
  }

  function handleDragStart(e, index) {
    dragIndex.current = index;
    e.dataTransfer.effectAllowed = 'move';
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
            <th className="cell-drag" />
            <th>{t('colModifier')}</th>
            <th>{t('colKey')}</th>
            <th className="cell-color-head">{t('colColor')}</th>
            <th>{t('colAction')}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {bindings.map((b, index) => {
            const id         = bindingId(b.key, b.modifiers);
            const isSelected = id === selectedId;
            const keyLabel   = resolveLabel(b.key, ALL_KEY_MAP[b.key], language);
            const isEditing  = editingId === id;
            const isDragOver = dragOverIndex === index;
            const keyColor   = keyColors[b.key];
            const isConflict = conflictIds.has(id);

            return (
              <tr
                key={id}
                className={[
                  isSelected  ? 'row-selected'  : '',
                  isDragOver  ? 'row-drag-over' : '',
                  isConflict  ? 'row-conflict'  : '',
                ].filter(Boolean).join(' ')}
                onClick={() => onSelect(id)}
                onDragOver={e => handleDragOver(e, index)}
                onDrop={e => handleDrop(e, index)}
                onDragLeave={() => setDragOverIndex(null)}
              >
                <td className="cell-drag">
                  <span
                    className="drag-handle"
                    draggable
                    onDragStart={e => handleDragStart(e, index)}
                    onDragEnd={handleDragEnd}
                    onClick={e => e.stopPropagation()}
                    title={t('dragToReorder')}
                  >⠿</span>
                </td>
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
                <td className="cell-key">{keyLabel}</td>
                <td className="cell-color">
                  <button
                    type="button"
                    className="binding-color-swatch"
                    style={{ background: keyColor || KEY_BOUND_COLOR }}
                    title={t('editKeyColor')}
                    onClick={e => { e.stopPropagation(); onOpenModal?.(b.key); }}
                  />
                </td>
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
                    <>
                      <span className="action-text" title={t('clickToEdit')}>{resolveAction(b.action, t)}</span>
                      {isConflict && <span className="conflict-icon" title={t('modifierConflict')}>⚠</span>}
                    </>
                  )}
                </td>
                <td className="cell-del">
                  <button
                    className="btn-del"
                    title={t('removeBinding')}
                    onClick={e => { e.stopPropagation(); onRemove(b.key, b.modifiers); }}
                  >✕</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {bindings.length === 0 && (
        <p className="table-empty">{t('noBindings')}</p>
      )}
    </div>
  );
}
