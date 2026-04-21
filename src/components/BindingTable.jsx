import React, { useState, useRef } from 'react';
import { ALL_KEY_MAP } from '../keyboardLayouts';
import { resolveLabel } from '../keylabels';
import { bindingId } from '../useBindings';
import { useT, resolveAction } from '../useTranslation';
import { KEY_BOUND, MOD_COLORS, MOD_FAMILY } from '../modifierConstants';

const KEY_BOUND_COLOR = KEY_BOUND;

// Maps physical modifier key IDs to their logical family (unique to conflict detection)
const MOD_KEY_FAMILY = {
  ShiftLeft: 'Shift', ShiftRight: 'Shift',
  ControlLeft: 'Ctrl', ControlRight: 'Ctrl',
  AltLeft: 'Alt',   AltRight: 'Alt',
};

function detectModifierConflicts(bindings) {
  const standalone = new Map();
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
      const family = MOD_FAMILY[m];
      if (family && standalone.has(family)) {
        conflicts.add(standalone.get(family));
        conflicts.add(bindingId(b.key, b.modifiers));
      }
    }
  }
  return conflicts;
}

function findCrossFormatConflicts(activeBindings, formats, activeIndex) {
  const result = new Map();
  if (!formats || formats.length < 2) return result;
  for (const b of activeBindings) {
    const id = bindingId(b.key, b.modifiers);
    const others = [];
    formats.forEach((f, i) => {
      if (i === activeIndex) return;
      if (f.bindings.some(x => bindingId(x.key, x.modifiers) === id)) {
        others.push({ index: i, name: f.name });
      }
    });
    if (others.length > 0) result.set(id, others);
  }
  return result;
}

function formatTabName(f, i, t) {
  return resolveAction(f.name, t) || t('formatFallback', { n: String(i + 1) });
}

export default function BindingTable({ bindings, keyColors = {}, selectedId, onSelect, onUpdateAction, onRemove, onReorder, onOpenModal, settings = {}, locked = false, onToggleLocked, formats, activeIndex }) {
  const t = useT();
  const language = settings.language ?? 'en-US';
  const [editingId, setEditingId]         = useState(null);
  const [editValue, setEditValue]         = useState('');
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const dragIndex = useRef(null);
  const conflictIds = detectModifierConflicts(bindings);
  const crossConflicts = settings.warnCrossFormatConflicts
    ? findCrossFormatConflicts(bindings, formats, activeIndex)
    : new Map();

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
          {bindings.map((b, index) => {
            const id         = bindingId(b.key, b.modifiers);
            const isSelected = id === selectedId;
            const keyLabel   = resolveLabel(b.key, ALL_KEY_MAP[b.key], language);
            const isEditing  = editingId === id;
            const isDragOver = dragOverIndex === index;
            const keyColor   = keyColors[b.key];
            const isConflict = conflictIds.has(id);
            const crossEntries = crossConflicts.get(id);
            const crossTitle = crossEntries
              ? t('crossFormatConflict', { names: crossEntries.map(({ index, name }) => `"${formatTabName({ name }, index, t)}"`).join(', ') })
              : null;

            return (
              <tr
                key={id}
                className={[
                  isSelected  ? 'row-selected'  : '',
                  isDragOver  ? 'row-drag-over' : '',
                  (isConflict || crossTitle) ? 'row-conflict' : '',
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
                <td className="cell-key" style={{ cursor: 'pointer' }} onClick={e => { e.stopPropagation(); onOpenModal?.(b.key); }}>{keyLabel}</td>
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
                    <>
                      <span className="action-text" title={t('clickToEdit')}>{resolveAction(b.action, t)}</span>
                      {isConflict && <span className="conflict-icon" title={t('modifierConflict')}>⚠</span>}
                      {crossTitle && <span className="conflict-icon" title={crossTitle}>⚠</span>}
                    </>
                  )}
                </td>
                <td className="cell-del">
                  <button
                    className="btn-del"
                    style={{ visibility: locked ? 'hidden' : 'visible' }}
                    title={t('removeBinding')}
                    onClick={e => { e.stopPropagation(); if (!locked) onRemove(b.key, b.modifiers); }}
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
