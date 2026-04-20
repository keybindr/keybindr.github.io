import React from 'react';
import { useT } from '../useTranslation';

export default function HelpModal({ onClose }) {
  const t = useT();
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal modal-help" onClick={e => e.stopPropagation()}>
        <h3 className="modal-title help-modal-title">{t('helpTitle')}</h3>
        <div className="help-body">
          <p className="mobile-only mobile-notice">{t('mobileWarning')}</p>

          <p><strong>Keybindr</strong> {t('helpIntro1')}</p>
          <p>{t('helpIntro2')}</p>
          <p>{t('helpIntro3')}</p>

          <h4>{t('settingsTitle')}</h4>
          <p>
            <strong>{t('helpSplitLabel')}</strong> {t('helpSplitBody')}
          </p>
          <p>
            <strong>{t('physicalLayout')}</strong> {t('helpPhysBody1')}
          </p>
          <p>{t('helpPhysBody2')}</p>
          <p>
            <strong>{t('languageRegion')}</strong> {t('helpLangBody')}
          </p>
          <p>
            <strong>{t('helpResetLabel')}</strong> {t('helpResetBody')}
          </p>
        </div>
        <div className="modal-actions">
          <button className="btn-primary" onClick={onClose}>{t('gotIt')}</button>
        </div>
      </div>
    </div>
  );
}
