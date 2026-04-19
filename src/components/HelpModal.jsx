import React from 'react';

export default function HelpModal({ onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal modal-help" onClick={e => e.stopPropagation()}>
        <h3 className="modal-title">How to use Keybindr</h3>
        <div className="help-body">
          <p>
            <strong>Keybindr</strong> is a visual keyboard binding planner. Map actions to
            key combinations, customize the layout, and export it for reference.
          </p>

          <h4>Binding a key</h4>
          <p>
            Click any key on the keyboard to open the bind dialog. Choose an optional
            modifier (Ctrl, Shift, or Alt), type an action label, pick an optional
            highlight color for that key, then click Save.
          </p>

          <h4>Editing &amp; removing</h4>
          <p>
            Bound keys appear in the table below the keyboard. Click a row to
            highlight it on the keyboard. Edit action labels inline, or click × to remove.
          </p>

          <h4>Corner indicators</h4>
          <p>
            Small colored triangles on bound keys show which modifier is used —
            Shift at the upper-right corner, Alt at the lower-right, Ctrl at the lower-left.
          </p>

          <h4>Import / Export</h4>
          <p>
            Use the Import / Export menu to load or save bindings as XML or JSON.
            Export PNG produces an image of the keyboard with the full binding list appended.
          </p>

          <h4>Settings</h4>
          <p>
            The ⚙ menu lets you customize modifier key colors and toggle between unified
            modifier keys (Shift) or separate left/right keys (LShift / RShift).
          </p>
        </div>
        <div className="modal-actions">
          <button className="btn-primary" onClick={onClose}>Got it</button>
        </div>
      </div>
    </div>
  );
}
