import React, { useState, useRef } from 'react';
import ColorPicker from './ColorPicker';

const PICKER_WIDTH = 252;
const PICKER_GAP   = 12;

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

export default function SettingsModal({ settings, onModColor, onSplitModColor, onToggleSplit, onClearKeys, onClose }) {
  const { splitModifiers, modColors, splitModColors } = settings;
  const [activeKey, setActiveKey] = useState(null);
  const [pickerPos, setPickerPos] = useState(null);
  const modalRef = useRef(null);

  function handleSwatchClick(key) {
    if (activeKey === key) {
      setActiveKey(null);
      setPickerPos(null);
      return;
    }
    setActiveKey(key);
    if (modalRef.current) {
      const rect = modalRef.current.getBoundingClientRect();
      setPickerPos({
        top:  rect.top,
        left: Math.max(8, rect.left - PICKER_WIDTH - PICKER_GAP),
      });
    }
  }

  // Always derive live color + handler from current settings so picker stays fresh
  const liveColor    = activeKey ? (splitModifiers ? splitModColors[activeKey] : modColors[activeKey]) : null;
  const liveOnChange = activeKey
    ? (splitModifiers ? c => onSplitModColor(activeKey, c) : c => onModColor(activeKey, c))
    : null;

  function SwatchRow({ label, colorKey, color }) {
    const isActive = activeKey === colorKey;
    return (
      <div className="settings-row">
        <span className="settings-label">{label}</span>
        <button
          type="button"
          className={`mod-color-swatch${isActive ? ' active' : ''}`}
          style={{ background: color }}
          onClick={() => handleSwatchClick(colorKey)}
          title={isActive ? 'Close picker' : 'Pick color'}
        />
      </div>
    );
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>

      {/* Color picker — fixed left of modal, natural height, dismissible */}
      {activeKey && pickerPos && (
        <div
          className="cpk-panel"
          style={{
            position: 'fixed',
            top:    pickerPos.top,
            left:   pickerPos.left,
            zIndex: 101,
          }}
          onClick={e => e.stopPropagation()}
        >
          <div className="cpk-panel-header">
            <span className="cpk-panel-title">Color Picker</span>
            <button className="cpk-panel-close" onClick={() => { setActiveKey(null); setPickerPos(null); }}>✕</button>
          </div>
          <div className="cpk-panel-body">
            <ColorPicker color={liveColor} onChange={liveOnChange} />
          </div>
        </div>
      )}

      {/* Settings modal */}
      <div className="modal modal-settings" ref={modalRef} onClick={e => e.stopPropagation()}>
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
                onClick={() => { onToggleSplit(false); setActiveKey(null); }}
              >
                Unified
              </button>
              <button
                className={`toggle-btn${splitModifiers ? ' active' : ''}`}
                onClick={() => { onToggleSplit(true); setActiveKey(null); }}
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
              <SwatchRow key={key} label={label} colorKey={key} color={modColors[key]} />
            ))
          ) : (
            SPLIT_MOD_GROUPS.map(({ leftKey, rightKey, leftLabel, rightLabel }) => (
              <React.Fragment key={leftKey}>
                <SwatchRow label={leftLabel} colorKey={leftKey} color={splitModColors[leftKey]} />
                <SwatchRow label={rightLabel} colorKey={rightKey} color={splitModColors[rightKey]} />
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
