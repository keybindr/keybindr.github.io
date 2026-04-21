import React from 'react';
import { LAYOUTS } from '../keyboardLayouts';
import { LOCALES } from '../keylabels';
import { useT } from '../useTranslation';

function stripKeyboardHints(name) {
  return name
    .replace(/,?\s*(AZERTY|QWERTZ|QWERTY)/gi, '')
    .replace(/\(\s*\)/, '')
    .replace(/\s+\)/g, ')')
    .trim();
}

export default function SettingsModal({ settings, onToggleSplit, onChangeLayout, onChangeLocale, onChangeUiLocale, onToggleCrossFormatWarnings, onToggleMouseBindings, onToggleHotasBindings, onChangeJoystickButtonCount, onChangeThrottleButtonCount, onChangePedalsButtonCount, onClearKeys, onClose }) {
  const t = useT();
  const { splitModifiers, physicalLayout, language, uiLanguage, warnCrossFormatConflicts, showMouseBindings, showHotasBindings, joystickButtonCount, throttleButtonCount, pedalsButtonCount } = settings;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal modal-settings" onClick={e => e.stopPropagation()}>
        <div className="settings-header">
          <h3 className="modal-title" style={{ marginBottom: 0 }}>{t('settingsTitle')}</h3>
          <button className="btn-icon" onClick={onClose} title={t('close')}>✕</button>
        </div>

        <div className="settings-section">
          <div className="settings-section-title">{t('keyboardSection')}</div>
          <div className="settings-row settings-row-labeled">
            <label className="settings-label">{t('physicalLayout')}</label>
            <select
              className="settings-select"
              value={physicalLayout}
              onChange={e => onChangeLayout(e.target.value)}
            >
              {Object.entries(LAYOUTS).map(([id, layout]) => (
                <option key={id} value={id}>{layout.name}</option>
              ))}
            </select>
          </div>
          <div className="settings-row settings-row-labeled">
            <label className="settings-label">{t('languageRegion')}</label>
            <select
              className="settings-select"
              value={language}
              onChange={e => onChangeLocale(e.target.value)}
            >
              {Object.entries(LOCALES).map(([id, locale]) => (
                <option key={id} value={id}>{locale.name}</option>
              ))}
            </select>
          </div>
          <div className="settings-row settings-row-labeled">
            <label className="settings-label">{t('interfaceLanguage')}</label>
            <select
              className="settings-select"
              value={uiLanguage ?? ''}
              onChange={e => onChangeUiLocale(e.target.value || null)}
            >
              <option value="">{t('matchKeyboard')}</option>
              {Object.entries(LOCALES).map(([id, locale]) => (
                <option key={id} value={id}>{stripKeyboardHints(locale.name)}</option>
              ))}
            </select>
          </div>
          <div className="dropdown-sep" style={{ marginTop: 14 }} />
        </div>

        <div className="settings-section">
          <div className="settings-section-title">{t('modifierDisplay')}</div>
          <div className="settings-row">
            <div className="toggle-group">
              <button
                className={`toggle-btn${!splitModifiers ? ' active' : ''}`}
                onClick={() => onToggleSplit(false)}
              >
                {t('unified')}
              </button>
              <button
                className={`toggle-btn${splitModifiers ? ' active' : ''}`}
                onClick={() => onToggleSplit(true)}
              >
                {t('leftRight')}
              </button>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <div className="settings-section-title">{t('crossFormatWarnings')}</div>
          <div className="settings-row">
            <div className="toggle-group">
              <button
                className={`toggle-btn${!warnCrossFormatConflicts ? ' active' : ''}`}
                onClick={() => onToggleCrossFormatWarnings(false)}
              >
                {t('off')}
              </button>
              <button
                className={`toggle-btn${warnCrossFormatConflicts ? ' active' : ''}`}
                onClick={() => onToggleCrossFormatWarnings(true)}
              >
                {t('on')}
              </button>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <div className="settings-section-title">{t('showMouseBindings')}</div>
          <div className="settings-row">
            <div className="toggle-group">
              <button
                className={`toggle-btn${!showMouseBindings ? ' active' : ''}`}
                onClick={() => onToggleMouseBindings(false)}
              >
                {t('off')}
              </button>
              <button
                className={`toggle-btn${showMouseBindings ? ' active' : ''}`}
                onClick={() => onToggleMouseBindings(true)}
              >
                {t('on')}
              </button>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <div className="settings-section-title">{t('showHotasBindings')}</div>
          <div className="settings-row">
            <div className="toggle-group">
              <button
                className={`toggle-btn${!showHotasBindings ? ' active' : ''}`}
                onClick={() => onToggleHotasBindings(false)}
              >
                {t('off')}
              </button>
              <button
                className={`toggle-btn${showHotasBindings ? ' active' : ''}`}
                onClick={() => onToggleHotasBindings(true)}
              >
                {t('on')}
              </button>
            </div>
          </div>
          {showHotasBindings && (
            <div style={{ marginTop: 10 }}>
              <div className="settings-row settings-row-labeled" style={{ marginTop: 6 }}>
                <label className="settings-label">{t('joystickButtonCount')}</label>
                <select
                  className="settings-select"
                  value={joystickButtonCount}
                  onChange={e => onChangeJoystickButtonCount(Number(e.target.value))}
                >
                  {[8,16,24,32,48,64].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div className="settings-row settings-row-labeled" style={{ marginTop: 6 }}>
                <label className="settings-label">{t('throttleButtonCount')}</label>
                <select
                  className="settings-select"
                  value={throttleButtonCount}
                  onChange={e => onChangeThrottleButtonCount(Number(e.target.value))}
                >
                  {[8,16,24,32,48,64].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div className="settings-row settings-row-labeled" style={{ marginTop: 6 }}>
                <label className="settings-label">{t('pedalsButtonCount')}</label>
                <select
                  className="settings-select"
                  value={pedalsButtonCount}
                  onChange={e => onChangePedalsButtonCount(Number(e.target.value))}
                >
                  {[2,4,6,8].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>
          )}
        </div>

        <div className="settings-danger-section">
          <div className="dropdown-sep" style={{ marginBottom: 14 }} />
          <p className="settings-danger-label">{t('clearWarning')}</p>
          <button className="btn-secondary" onClick={onClearKeys} style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}>
            {t('returnToDefaults')}
          </button>
        </div>
      </div>
    </div>
  );
}
