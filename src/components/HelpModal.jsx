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

          <p>{t('helpIntro2')}</p>
          <p>{t('helpIntro3')}</p>
          <p>{t('helpIntro4')}</p>

          <h4>{t('helpSettingsTitle')}</h4>
          <p>
            <strong>{t('helpSplitLabel')}</strong> {t('helpSplitBody')}
          </p>
          <p>
            <strong>{t('physicalLayout')}</strong> {t('helpPhysBody1')}
          </p>
          <p>
            <strong>{t('languageRegion')}</strong> {t('helpLangBody')}
          </p>
          <p>
            <strong>{t('helpMouseHotasLabel')}</strong> {t('helpMouseHotasBody')}
          </p>
          <p>
            <strong>{t('helpConflictsLabel')}</strong> {t('helpConflictsBody')}
          </p>
          <p>
            <strong>{t('helpResetLabel')}</strong> {t('helpResetBody')}
          </p>

          <p className="help-credit">
            {t('helpCreditBy')}{' — '}
            <a href="mailto:andrew@keybinds.help">andrew@keybinds.help</a>
          </p>
          <p className="help-credit-note">
            {t('helpCreditNote')}
          </p>
        </div>
        <div className="modal-actions">
          <button className="btn-primary" onClick={onClose}>{t('gotIt')}</button>
        </div>
      </div>
    </div>
  );
}
