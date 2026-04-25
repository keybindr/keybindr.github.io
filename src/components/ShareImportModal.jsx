import React, { useRef } from 'react';
import { useT } from '../useTranslation';
import { useFocusTrap } from '../hooks/useFocusTrap';

export default function ShareImportModal({ onConfirm, onCancel, onDownload }) {
  const t = useT();
  const modalRef = useRef(null);
  useFocusTrap(modalRef, { onEscape: onCancel });
  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal modal-share-import" ref={modalRef} onClick={e => e.stopPropagation()}>
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
