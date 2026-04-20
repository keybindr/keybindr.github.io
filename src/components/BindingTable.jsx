import React, { useState, useRef } from 'react';
import { KEY_MAP } from '../keyboardLayout';
import { bindingId } from '../useBindings';

const KEY_BOUND_COLOR = '#3d3420';

const MOD_COLORS = {
  Ctrl:  '#e07b39', CtrlLeft:  '#e07b39', CtrlRight:  '#e07b39',
  Shift: '#7b9ee0', ShiftLeft: '#7b9ee0', ShiftRight: '#7b9ee0',
  Alt:   '#7be09a', AltLeft:   '#7be09a', AltRight:   '#7be09a',
};

function buildSegments(bindings) {
  const segments = [];
  const groupMap = {};
  for (let i = 0; i < bindings.length; i++) {
    const b = bindings[i];
    if (b.group) {
      if (groupMap[b.group] === undefined) {
        groupMap[b.group] = segments.length;
        segments.push({ type: 'group', name: b.group, items: [] });
      }
      segments[groupMap[b.group]].items.push({ b, flatIndex: i });
    } else {
      const last = segments[segments.length - 1];
      if (last?.type === 'ungrouped') {
        last.items.push({ b, flatIndex: i });
      } else {
        segments.push({ type: 'ungrouped', items: [{ b, flatIndex: i }] });
      }
    }
  }
  return segments;
}

export default function BindingTable({
  bindings, keyColors = {}, selectedId,
  onSelect, onUpdateAction, onRemove, onReorder, onOpenModal,
  onUpdateGroup, onRenameGroup, onReorderGroup,
}) {
  const [editingId,        setEditingId]        = useState(null);
  const [editValue,        setEditValue]        = useState('');
  const [editingGroupId,   setEditingGroupId]   = useState(null);
  const [editGroupValue,   setEditGroupValue]   = useState('');
  const [editingGroupName, setEditingGroupName] = useState(null);
  const [editGroupNameVal, setEditGroupNameVal] = useState('');
  const [dragOverIndex,    setDragOverIndex]    = useState(null);
  const [dragOverGroup,    setDragOverGroup]    = useState(null);
  const dragIndex    = useRef(null);
  const dragGroupRef = useRef(null);

  const segments = buildSegments(bindings);

  // ── Action edit ────────────────────────────────────────────────────────────
  function startEdit(b) {
    setEditingId(bindingId(b.key, b.modifiers));
    setEditValue(b.action);
  }
  function commitEdit(b) {
    if (editValue.trim()) onUpdateAction(b.key, b.modifiers, editValue.trim());
    setEditingId(null);
  }

  // ── Group cell edit ────────────────────────────────────────────────────────
  function startGroupEdit(b) {
    setEditingGroupId(bindingId(b.key, b.modifiers));
    setEditGroupValue(b.group || '');
  }
  function commitGroupEdit(b) {
    onUpdateGroup?.(b.key, b.modifiers, editGroupValue.trim());
    setEditingGroupId(null);
  }

  // ── Group header name edit ─────────────────────────────────────────────────
  function startGroupNameEdit(name) {
    setEditingGroupName(name);
    setEditGroupNameVal(name);
  }
  function commitGroupNameEdit(oldName) {
    const newName = editGroupNameVal.trim();
    if (newName && newName !== oldName) onRenameGroup?.(oldName, newName);
    setEditingGroupName(null);
  }

  // ── Binding drag (ungrouped only) ──────────────────────────────────────────
  function handleBindingDragStart(e, flatIndex) {
    dragIndex.current = flatIndex;
    e.dataTransfer.effectAllowed = 'move';
    e.currentTarget.closest('tr').classList.add('row-dragging');
  }
  function handleBindingDragEnd(e) {
    e.currentTarget.closest('tr')?.classList.remove('row-dragging');
    dragIndex.current = null;
    setDragOverIndex(null);
  }
  function handleBindingDragOver(e, flatIndex) {
    if (dragIndex.current === null) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(flatIndex);
  }
  function handleBindingDrop(e, flatIndex) {
    e.preventDefault();
    if (dragIndex.current !== null && dragIndex.current !== flatIndex) {
      onReorder(dragIndex.current, flatIndex);
    }
    dragIndex.current = null;
    setDragOverIndex(null);
  }

  // ── Group drag ─────────────────────────────────────────────────────────────
  function handleGroupDragStart(e, groupName) {
    dragGroupRef.current = groupName;
    e.dataTransfer.effectAllowed = 'move';
    e.currentTarget.closest('tr').classList.add('row-dragging');
  }
  function handleGroupDragEnd(e) {
    e.currentTarget.closest('tr')?.classList.remove('row-dragging');
    dragGroupRef.current = null;
    setDragOverGroup(null);
  }
  function handleGroupDragOver(e, groupName) {
    if (!dragGroupRef.current || dragGroupRef.current === groupName) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverGroup(groupName);
  }
  function handleGroupDrop(e, groupName) {
    e.preventDefault();
    if (dragGroupRef.current && dragGroupRef.current !== groupName) {
      onReorderGroup?.(dragGroupRef.current, groupName);
    }
    dragGroupRef.current = null;
    setDragOverGroup(null);
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  function renderBindingRow({ b, flatIndex }, inGroup = false) {
    const id             = bindingId(b.key, b.modifiers);
    const isSelected     = id === selectedId;
    const keyLabel       = KEY_MAP[b.key]?.label ?? b.key;
    const isEditing      = editingId === id;
    const isEditingGroup = editingGroupId === id;
    const isDragOver     = !inGroup && dragOverIndex === flatIndex;
    const keyColor       = keyColors[b.key];

    return (
      <tr
        key={id}
        className={[
          isSelected ? 'row-selected'  : '',
          isDragOver ? 'row-drag-over' : '',
          inGroup    ? 'row-in-group'  : '',
        ].filter(Boolean).join(' ')}
        onClick={() => onSelect(id)}
        onDragOver={!inGroup ? e => handleBindingDragOver(e, flatIndex) : undefined}
        onDrop={!inGroup ? e => handleBindingDrop(e, flatIndex) : undefined}
        onDragLeave={!inGroup ? () => setDragOverIndex(null) : undefined}
      >
        <td className="cell-drag">
          {!inGroup && (
            <span
              className="drag-handle"
              draggable
              onDragStart={e => handleBindingDragStart(e, flatIndex)}
              onDragEnd={handleBindingDragEnd}
              onClick={e => e.stopPropagation()}
              title="Drag to reorder"
            >⠿</span>
          )}
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
            title="Edit key color"
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
            <span className="action-text" title="Click to edit">{b.action}</span>
          )}
        </td>
        <td className="cell-group" onClick={e => { e.stopPropagation(); startGroupEdit(b); }}>
          {isEditingGroup ? (
            <input
              autoFocus
              value={editGroupValue}
              onChange={e => setEditGroupValue(e.target.value)}
              onBlur={() => commitGroupEdit(b)}
              onKeyDown={e => {
                if (e.key === 'Enter') commitGroupEdit(b);
                if (e.key === 'Escape') setEditingGroupId(null);
              }}
              className="action-edit-input"
              placeholder="Group name…"
              onClick={e => e.stopPropagation()}
            />
          ) : (
            <span className={b.group ? 'group-tag' : 'mod-none'} title="Click to set group">
              {b.group || '—'}
            </span>
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
  }

  function renderGroupHeader({ name, items }) {
    const isDragOver    = dragOverGroup === name;
    const isEditingName = editingGroupName === name;
    return (
      <tr
        key={`group-hdr-${name}`}
        className={`group-header-row${isDragOver ? ' group-drag-over' : ''}`}
        onDragOver={e => handleGroupDragOver(e, name)}
        onDrop={e => handleGroupDrop(e, name)}
        onDragLeave={() => setDragOverGroup(null)}
      >
        <td className="cell-drag">
          <span
            className="drag-handle"
            draggable
            onDragStart={e => handleGroupDragStart(e, name)}
            onDragEnd={handleGroupDragEnd}
            onClick={e => e.stopPropagation()}
            title="Drag to reorder group"
          >⠿</span>
        </td>
        <td colSpan={5} className="group-header-cell">
          {isEditingName ? (
            <input
              autoFocus
              value={editGroupNameVal}
              onChange={e => setEditGroupNameVal(e.target.value)}
              onBlur={() => commitGroupNameEdit(name)}
              onKeyDown={e => {
                if (e.key === 'Enter') commitGroupNameEdit(name);
                if (e.key === 'Escape') setEditingGroupName(null);
              }}
              className="action-edit-input group-name-input"
              onClick={e => e.stopPropagation()}
            />
          ) : (
            <span
              className="group-name"
              onClick={e => { e.stopPropagation(); startGroupNameEdit(name); }}
              title="Click to rename group"
            >{name}</span>
          )}
          <span className="count-badge" style={{ marginLeft: 8 }}>{items.length}</span>
        </td>
        <td className="cell-del" />
      </tr>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="binding-table">
        <thead>
          <tr>
            <th className="cell-drag" />
            <th>Modifier</th>
            <th>Key</th>
            <th className="cell-color-head">Color</th>
            <th>Action</th>
            <th className="cell-group-head">Group</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {segments.flatMap(segment =>
            segment.type === 'group'
              ? [renderGroupHeader(segment), ...segment.items.map(item => renderBindingRow(item, true))]
              : segment.items.map(item => renderBindingRow(item, false))
          )}
        </tbody>
      </table>
      {bindings.length === 0 && (
        <p className="table-empty">No bindings yet. Click a key to add one.</p>
      )}
    </div>
  );
}
