import React from 'react';

const MOBILE_NOTICE = 'This is a desktop focused application and, given the nature of it, will likely never be totally optimized for mobile. - Management';

export default function HelpModal({ onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal modal-help" onClick={e => e.stopPropagation()}>
        <h3 className="modal-title help-modal-title">How to use Keybindr</h3>
        <div className="help-body">
          <p className="mobile-only mobile-notice">{MOBILE_NOTICE}</p>

          <p>
            <strong>Keybindr</strong> is a visual keyboard binding planner. </p>
			
			<p> Map actions to key combinations, customize colors, name your layout, and export it for reference. All data is stored on your computer and there is no user tracking.</p>

          <h4>Binding a key</h4>
          <p>
            Click any key on the keyboard to open the bind dialog. Choose an optional modifier (Ctrl, Shift, Alt, or left/right variants), type an action label, pick an optional highlight color, then click Save.
          </p>

          <h4>Editing &amp; removing</h4>
          <p>
            Bound keys appear in the Bindings table below the keyboard. Click a row to highlight the key on the keyboard. Edit action labels inline by clicking the action text, or click × to remove. Drag the handle on the left of any row to reorder.
          </p>

          <h4>Key colors</h4>
          <p>
            Each key can have a custom highlight color set in the bind dialog. The color picker lets you set hue, saturation, brightness, and opacity — use the opacity slider and input to control transparency. Choose from recently used colors shown below the picker, or click Clear to remove the custom color from a key.
          </p>

          <h4>Layout name</h4>
          <p>
            Click the large name below the header to rename your layout. Press Enter or click away to save. The name persists between sessions and is included in exports.
          </p>

          <h4>Multiple formats</h4>
          <p>
            Use the format tabs above the keyboard to manage multiple binding sets — e.g. On Foot, In Vehicle. Click the active tab to rename it. Up to 5 formats can be open at once.
          </p>

          <h4>Corner indicators</h4>
          <p>
            Small colored triangles on bound keys show which modifier is used — Shift at the upper-right, Alt at the lower-right, Ctrl at the lower-left. Colors follow any custom color set on the corresponding modifier key.
          </p>

          <h4>Import / Export</h4>
          <p>
            Use the Import / Export menu to load or save your layout as JSON. Exporting JSON saves all formats, the layout name, and key colors — importing a JSON file fully restores the layout. Export PNG produces an image for each format; a single format downloads as a PNG, multiple formats download as a ZIP.
          </p>

          <h4>Settings</h4>
          <p>
            Toggle between unified modifier keys (Shift) or separate left/right keys (LShift / RShift). Reset All clears all bindings, colors, and the layout name.
          </p>
        </div>
        <div className="modal-actions">
          <button className="btn-primary" onClick={onClose}>Got it</button>
        </div>
      </div>
    </div>
  );
}
