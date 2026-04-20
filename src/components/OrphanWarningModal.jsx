import React from 'react';
import { ALL_KEY_MAP } from '../keyboardLayouts';

export default function OrphanWarningModal({ orphans, newLayoutName, onConfirm, onCancel }) {
  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal modal-orphan" onClick={e => e.stopPropagation()}>
        <h3 className="modal-title">Switch to {newLayoutName}?</h3>
        <div className="orphan-body">
          <p>
            The following {orphans.length === 1 ? 'binding' : 'bindings'} use{orphans.length === 1 ? 's' : ''} keys
            that don't exist in this layout and will be deleted:
          </p>
          <div className="orphan-list">
            {orphans.map((b, i) => {
              const keyLabel = ALL_KEY_MAP[b.key]?.label ?? b.key;
              const combo = b.modifiers.length > 0
                ? `${b.modifiers.join('+')}+${keyLabel}`
                : keyLabel;
              return (
                <div key={i} className="orphan-item">
                  <span className="orphan-combo">{combo}</span>
                  <span className="orphan-arrow">→</span>
                  <span className="orphan-action">{b.action}</span>
                  {b._format && <span className="orphan-format">{b._format}</span>}
                </div>
              );
            })}
          </div>
        </div>
        <div className="modal-actions">
          <button className="btn-secondary" onClick={onCancel}>Cancel</button>
          <button className="btn-primary btn-danger" onClick={onConfirm}>Switch &amp; Delete</button>
        </div>
      </div>
    </div>
  );
}
