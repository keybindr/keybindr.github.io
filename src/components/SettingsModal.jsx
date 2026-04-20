import React from 'react';

export default function SettingsModal({ settings, onToggleSplit, onClearKeys, onClose }) {
  const { splitModifiers } = settings;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal modal-settings" onClick={e => e.stopPropagation()}>
        <div className="settings-header">
          <h3 className="modal-title" style={{ marginBottom: 0 }}>Settings</h3>
          <button className="btn-icon" onClick={onClose} title="Close">✕</button>
        </div>

        <div className="settings-section">
          <div className="settings-section-title">Modifier key display</div>
          <div className="settings-row">
            <div className="toggle-group">
              <button
                className={`toggle-btn${!splitModifiers ? ' active' : ''}`}
                onClick={() => onToggleSplit(false)}
              >
                Unified
              </button>
              <button
                className={`toggle-btn${splitModifiers ? ' active' : ''}`}
                onClick={() => onToggleSplit(true)}
              >
                Left / Right
              </button>
            </div>
          </div>
        </div>

        <div className="settings-danger-section">
          <div className="dropdown-sep" style={{ marginBottom: 14 }} />
          <p className="settings-danger-label">This will clear all your work</p>
          <button className="btn-secondary" onClick={onClearKeys} style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}>
            Return to Defaults
          </button>
        </div>
      </div>
    </div>
  );
}
