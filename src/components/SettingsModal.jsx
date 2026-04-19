import React, { useState } from 'react';
import ColorPicker from './ColorPicker';

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

function ModColorRow({ label, colorKey, color, expanded, onToggle, onChange }) {
  return (
    <div className="mod-color-block">
      <div className="settings-row">
        <span className="settings-label">{label}</span>
        <button
          type="button"
          className="mod-color-swatch"
          style={{ background: color }}
          onClick={onToggle}
          title={expanded ? 'Close picker' : 'Pick color'}
        />
      </div>
      {expanded && (
        <div className="mod-color-picker">
          <ColorPicker color={color} onChange={onChange} />
        </div>
      )}
    </div>
  );
}

export default function SettingsModal({ settings, onModColor, onSplitModColor, onToggleSplit, onClearKeys, onClose }) {
  const { splitModifiers, modColors, splitModColors } = settings;
  const [expanded, setExpanded] = useState(null);

  function toggle(key) {
    setExpanded(prev => prev === key ? null : key);
  }

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

        <div className="settings-section">
          <div className="settings-section-title">Modifier colors</div>

          {!splitModifiers ? (
            UNIFIED_MODS.map(({ key, label }) => (
              <ModColorRow
                key={key}
                label={label}
                colorKey={key}
                color={modColors[key]}
                expanded={expanded === key}
                onToggle={() => toggle(key)}
                onChange={color => onModColor(key, color)}
              />
            ))
          ) : (
            SPLIT_MOD_GROUPS.map(({ leftKey, rightKey, leftLabel, rightLabel }) => (
              <React.Fragment key={leftKey}>
                <ModColorRow
                  label={leftLabel}
                  colorKey={leftKey}
                  color={splitModColors[leftKey]}
                  expanded={expanded === leftKey}
                  onToggle={() => toggle(leftKey)}
                  onChange={color => onSplitModColor(leftKey, color)}
                />
                <ModColorRow
                  label={rightLabel}
                  colorKey={rightKey}
                  color={splitModColors[rightKey]}
                  expanded={expanded === rightKey}
                  onToggle={() => toggle(rightKey)}
                  onChange={color => onSplitModColor(rightKey, color)}
                />
              </React.Fragment>
            ))
          )}
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
