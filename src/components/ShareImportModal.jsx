import React from 'react';
import { useT } from '../useTranslation';

export default function ShareImportModal({ formats, layoutName, onConfirm, onCancel, onDownload }) {
  const t = useT();
  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal modal-share-import" onClick={e => e.stopPropagation()}>
        <h3 className="modal-title">{t('importTitle')}</h3>
        <div className="share-import-body">
          <p>{t('importBody1')}</p>
          <p>{t('importBody2')}</p>
          <button className="btn-download-current" onClick={onDownload}>
            {t('downloadCurrent')}
          </button>
        </div>
        <div className="modal-actions">
          <button className="btn-secondary" onClick={onCancel}>{t('cancel')}</button>
          <button className="btn-primary" onClick={onConfirm}>{t('replaceLayout')}</button>
        </div>
      </div>
    </div>
  );
}
