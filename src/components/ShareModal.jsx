import React, { useState } from 'react';

export default function ShareModal({ url, onClose }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal modal-share" onClick={e => e.stopPropagation()}>
        <h3 className="modal-title">Share Layout</h3>
        <div className="share-body">
          <p>This link, which is going to look <em>bonkers</em>, encodes your entire layout — all formats, bindings, colors, and name — directly in the URL. Anyone with the link can open it and see your layout instantly. There's no user tracking data encoded.</p>
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
          <button className="btn-secondary" onClick={onClose}>Close</button>
          <button className="btn-primary" onClick={handleCopy}>
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
        </div>
      </div>
    </div>
  );
}
