import React, { useRef } from 'react';
import { useT } from '../useTranslation';
import { useFocusTrap } from '../hooks/useFocusTrap';

export default function MobileWarningModal({ onClose }) {
  const t = useT();
  const modalRef = useRef(null);
  useFocusTrap(modalRef, { onEscape: onClose });
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal mobile-warning-modal" ref={modalRef} onClick={e => e.stopPropagation()}>
        <button className="mobile-warning-close" onClick={onClose} title={t('close')}>✕</button>
        <p className="mobile-warning-text">{t('mobileWarning')}</p>
      </div>
    </div>
  );
}
