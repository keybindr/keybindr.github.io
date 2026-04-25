import React, { useState, useRef } from 'react';
import { useT } from '../useTranslation';
import { useFocusTrap } from '../hooks/useFocusTrap';

export default function ShareModal({ url, onClose }) {
  const t = useT();
  const [copied, setCopied] = useState(false);
  const modalRef = useRef(null);
  useFocusTrap(modalRef, { onEscape: onClose });

  function handleCopy() {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal modal-share" ref={modalRef} onClick={e => e.stopPropagation()}>
        <h3 className="modal-title">{t('shareTitle')}</h3>
        <div className="share-body">
          <p>{t('shareBody')}</p>
          <div className="share-url-row">
            <input
              className="share-url-input"
              type="text"
              readOnly
              value={url}
              onClick={e => e.target.select()}
            />
          </div>
        </div>
        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>{t('close')}</button>
          <button className="btn-primary" onClick={handleCopy}>
            {copied ? t('copied') : t('copyLink')}
          </button>
        </div>
      </div>
    </div>
  );
}
