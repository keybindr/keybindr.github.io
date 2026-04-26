import React, { useState, useEffect, useRef } from 'react';
import { useT } from '../useTranslation';

export default function LayoutName({ name, onChange }) {
  const t = useT();
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (editing) inputRef.current?.select();
  }, [editing]);

  function commit(val) {
    onChange(val.trim());
    setEditing(false);
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        className="layout-name-input"
        defaultValue={name}
        maxLength={60}
        onBlur={e => commit(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter') commit(e.target.value);
          if (e.key === 'Escape') setEditing(false);
        }}
      />
    );
  }

  return (
    <div className="layout-name" onClick={() => setEditing(true)} title={t('tabClickRename')}>
      {name || t('layoutNameDefault')}
    </div>
  );
}
