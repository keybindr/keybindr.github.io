import React, { useState, useEffect, useRef } from 'react';
import { useT, resolveAction } from '../useTranslation';
import { MAX_FORMATS } from '../useFormats';

export default function FormatTabs({ formats, activeIndex, onSwitch, onAdd, onRename, onRemove }) {
  const t = useT();
  const [editingIdx, setEditingIdx] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (editingIdx !== null) inputRef.current?.select();
  }, [editingIdx]);

  function handleTabClick(i) {
    if (i === activeIndex) setEditingIdx(i);
    else onSwitch(i);
  }

  function commit(val) {
    onRename(editingIdx, val.trim());
    setEditingIdx(null);
  }

  return (
    <div className="format-tabs">
      {formats.map((f, i) => {
        const label    = resolveAction(f.name, t) || t('formatFallback', { n: String(i + 1) });
        const isActive = i === activeIndex;
        const removable = i > 0;

        return (
          <div
            key={i}
            className={`format-tab${isActive ? ' active' : ''}`}
            onClick={() => handleTabClick(i)}
            title={isActive ? t('tabClickRename') : label}
          >
            {editingIdx === i ? (
              <input
                ref={inputRef}
                className="format-tab-input"
                defaultValue={resolveAction(f.name, t)}
                maxLength={20}
                onClick={e => e.stopPropagation()}
                onBlur={e => commit(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') e.target.blur();
                  if (e.key === 'Escape') setEditingIdx(null);
                }}
              />
            ) : (
              <span>{label}</span>
            )}
            {removable && (
              <>
                <span className="format-tab-sep">|</span>
                <span
                  className="format-tab-remove"
                  onClick={e => { e.stopPropagation(); onRemove(i); }}
                  title={t('tabRemove')}
                >✕</span>
              </>
            )}
          </div>
        );
      })}
      {formats.length < MAX_FORMATS && (
        <button className="format-add-btn" onClick={onAdd} title={t('tabAdd')}>+</button>
      )}
    </div>
  );
}
