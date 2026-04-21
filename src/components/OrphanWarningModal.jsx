import React from 'react';
import { ALL_KEY_MAP } from '../keyboardLayouts';
import { useT } from '../useTranslation';

export default function OrphanWarningModal({ orphans, newLayoutName, onConfirm, onCancel, renderItem, bodyKeyOverride }) {
  const t = useT();
  const defaultBodyKey = orphans.length === 1 ? 'orphanBodySingular' : 'orphanBodyPlural';
  const bodyKey = bodyKeyOverride ?? defaultBodyKey;

  function defaultRenderItem(b, i) {
    const keyLabel = ALL_KEY_MAP[b.key]?.label ?? b.key;
    const combo = b.modifiers.length > 0
      ? `${b.modifiers.join('+')}+${keyLabel}`
      : keyLabel;
    return (
      <div key={i} className="orphan-item">
        <span className="orphan-combo">{combo}</span>
        <span className="orphan-arrow">→</span>
        <span className="orphan-action">{b.action}</span>
        {b._format && <span className="orphan-format">{b._format}</span>}
      </div>
    );
  }

  const doRenderItem = renderItem ?? defaultRenderItem;

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal modal-orphan" onClick={e => e.stopPropagation()}>
        <h3 className="modal-title">{t('orphanTitle', { layout: newLayoutName })}</h3>
        <div className="orphan-body">
          <p>{t(bodyKey, { count: orphans.length })}</p>
          <div className="orphan-list">
            {orphans.map((b, i) => doRenderItem(b, i))}
          </div>
        </div>
        <div className="modal-actions">
          <button className="btn-secondary" onClick={onCancel}>{t('cancel')}</button>
          <button className="btn-primary btn-danger" onClick={onConfirm}>{t('switchDelete')}</button>
        </div>
      </div>
    </div>
  );
}
