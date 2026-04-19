import React from 'react';

const UNIFIED_MODS = [
  { key: 'Shift', label: 'Shift' },
  { key: 'Alt',   label: 'Alt'   },
  { key: 'Ctrl',  label: 'Ctrl'  },
];

const SPLIT_MOD_GROUPS = [
  { leftKey: 'ShiftLeft',  rightKey: 'ShiftRight', leftLabel: 'LShift', rightLabel: 'RShift' },
  { leftKey: 'AltLeft',    rightKey: 'AltRight',   leftLabel: 'LAlt',   rightLabel: 'RAlt'   },
  { leftKey: 'CtrlLeft',   rightKey: 'CtrlRight',  leftLabel: 'LCtrl',  rightLabel: 'RCtrl'  },
];

export default function SettingsModal({ settings, onModColor, onSplitModColor, onToggleSplit, onReset, onClose }) {
  const { splitModifiers, modColors, splitModColors } = settings;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal modal-settings" onClick={e => e.stopPropagation()}>
        <h3 className="modal-title">Settings</h3>

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

        <div className="settings-section">
          <div className="settings-section-title">Modifier colors</div>

          {!splitModifiers ? (
            UNIFIED_MODS.map(({ key, label }) => (
              <div key={key} className="settings-row">
                <span className="settings-label">{label}</span>
                <input
                  type="color"
                  className="color-picker"
                  value={modColors[key]}
                  onChange={e => onModColor(key, e.target.value)}
                />
              </div>
            ))
          ) : (
            SPLIT_MOD_GROUPS.map(({ leftKey, rightKey, leftLabel, rightLabel }) => (
              <div key={leftKey} className="settings-row settings-row-split">
                <span className="settings-label">{leftLabel}</span>
                <input
                  type="color"
                  className="color-picker"
                  value={splitModColors[leftKey]}
                  onChange={e => onSplitModColor(leftKey, e.target.value)}
                />
                <span className="settings-label settings-label-right">{rightLabel}</span>
                <input
                  type="color"
                  className="color-picker"
                  value={splitModColors[rightKey]}
                  onChange={e => onSplitModColor(rightKey, e.target.value)}
                />
              </div>
            ))
          )}
        </div>

        <div className="modal-actions" style={{ justifyContent: 'space-between' }}>
          <button className="btn-secondary" onClick={onReset} style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}>
            Reset to defaults
          </button>
          <button className="btn-primary" onClick={onClose}>Done</button>
        </div>
      </div>
    </div>
  );
}
