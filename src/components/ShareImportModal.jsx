import React from 'react';

export default function ShareImportModal({ formats, layoutName, onConfirm, onCancel, onDownload }) {
  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal modal-share-import" onClick={e => e.stopPropagation()}>
        <h3 className="modal-title">Replace current layout?</h3>
        <div className="share-import-body">
          <p>You have an existing layout. Opening this shared link will overwrite all your current bindings, colors, and formats.</p>
          <p>Download your current layout first if you want to keep it.</p>
          <button className="btn-download-current" onClick={onDownload}>
            ↓ Download current layout
          </button>
        </div>
        <div className="modal-actions">
          <button className="btn-secondary" onClick={onCancel}>Cancel</button>
          <button className="btn-primary" onClick={onConfirm}>Replace layout</button>
        </div>
      </div>
    </div>
  );
}
