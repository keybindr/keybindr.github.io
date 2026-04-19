import React, { useState, useRef, useEffect } from 'react';
import Keyboard from './components/Keyboard';
import BindModal from './components/BindModal';
import BindingTable from './components/BindingTable';
import HelpModal from './components/HelpModal';
import SettingsModal from './components/SettingsModal';
import { useBindings, bindingId } from './useBindings';
import { useKeyColors } from './useKeyColors';
import { useSettings } from './useSettings';
import { exportXML, exportJSON, exportPNG, importFile } from './export';

// Small SVG triangle matching the corner used on keys
function LegendTri({ color, dir }) {
  const s = 10;
  const pts = dir === 'shift' ? `${s},0 ${s},${s} 0,0`
            : dir === 'alt'   ? `${s},${s} ${s},0 0,${s}`
            :                   `0,${s} 0,0 ${s},${s}`; // ctrl
  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} style={{ display: 'inline-block', flexShrink: 0 }}>
      <polygon points={pts} fill={color} />
    </svg>
  );
}

export default function App() {
  const { bindings, addOrUpdate, remove, updateAction, replaceBindings } = useBindings();
  const { keyColors, recentColors, setKeyColor, clearKeyColor, restoreKeyColor } = useKeyColors();
  const { settings, setModColor, setSplitModColor, setSplitModifiers } = useSettings();

  const [selectedId, setSelectedId] = useState(null);
  const [modalKey, setModalKey] = useState(null);
  const [showHelp, setShowHelp] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const modalOriginalColor = useRef(undefined);

  const fileInputRef = useRef(null);
  const menuRef = useRef(null);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    if (!showMenu) return;
    function onMouseDown(e) {
      if (!menuRef.current?.contains(e.target)) setShowMenu(false);
    }
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [showMenu]);

  function handleImport(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    importFile(file).then(replaceBindings).catch(err => alert(err.message));
    e.target.value = '';
  }

  function menuAction(fn) {
    setShowMenu(false);
    fn();
  }

  function handleKeyClick(keyId) {
    modalOriginalColor.current = keyColors[keyId];
    setModalKey(keyId);
  }

  function handleSave(key, mods, action) {
    addOrUpdate(key, mods, action);
    setSelectedId(bindingId(key, mods));
    setModalKey(null);
  }

  function handleModalCancel() {
    restoreKeyColor(modalKey, modalOriginalColor.current);
    setModalKey(null);
  }

  function handleColorChange(keyId, color) {
    if (color) setKeyColor(keyId, color);
    else clearKeyColor(keyId);
  }

  function handleSelect(id) {
    setSelectedId(prev => prev === id ? null : id);
  }

  const { splitModifiers, modColors, splitModColors } = settings;

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Keybindr</h1>
        <div className="header-actions">
          <input
            ref={fileInputRef}
            type="file"
            accept=".xml,.json"
            style={{ display: 'none' }}
            onChange={handleImport}
          />
          <div className="dropdown" ref={menuRef}>
            <button className="btn-export" onClick={() => setShowMenu(v => !v)}>
              Import / Export ▾
            </button>
            {showMenu && (
              <div className="dropdown-menu">
                <button className="dropdown-item" onClick={() => menuAction(() => fileInputRef.current?.click())}>
                  Import XML/JSON
                </button>
                <div className="dropdown-sep" />
                <button className="dropdown-item" onClick={() => menuAction(() => exportXML(bindings))}>
                  Export XML
                </button>
                <button className="dropdown-item" onClick={() => menuAction(() => exportJSON(bindings))}>
                  Export JSON
                </button>
                <button className="dropdown-item" onClick={() => menuAction(() => exportPNG('keyboard-svg', bindings))}>
                  Export PNG
                </button>
              </div>
            )}
          </div>
          <button className="btn-icon" title="Help" onClick={() => setShowHelp(true)}>?</button>
          <button className="btn-icon" title="Settings" onClick={() => setShowSettings(true)}>⚙</button>
        </div>
      </header>

      <div className="legend">
        {splitModifiers ? (
          <>
            <span className="legend-item"><LegendTri color={splitModColors.ShiftLeft}  dir="shift" /> LShift</span>
            <span className="legend-item"><LegendTri color={splitModColors.ShiftRight} dir="shift" /> RShift</span>
            <span className="legend-item"><LegendTri color={splitModColors.AltLeft}    dir="alt"   /> LAlt</span>
            <span className="legend-item"><LegendTri color={splitModColors.AltRight}   dir="alt"   /> RAlt</span>
            <span className="legend-item"><LegendTri color={splitModColors.CtrlLeft}   dir="ctrl"  /> LCtrl</span>
            <span className="legend-item"><LegendTri color={splitModColors.CtrlRight}  dir="ctrl"  /> RCtrl</span>
          </>
        ) : (
          <>
            <span className="legend-item"><LegendTri color={modColors.Shift} dir="shift" /> Shift</span>
            <span className="legend-item"><LegendTri color={modColors.Alt}   dir="alt"   /> Alt</span>
            <span className="legend-item"><LegendTri color={modColors.Ctrl}  dir="ctrl"  /> Ctrl</span>
          </>
        )}
      </div>

      <div className="keyboard-container">
        <Keyboard
          bindings={bindings}
          selectedId={selectedId}
          onKeyClick={handleKeyClick}
          keyColors={keyColors}
          settings={settings}
        />
      </div>

      <div className="panel">
        <h2 className="panel-title">Bindings <span className="count-badge">{bindings.length}</span></h2>
        <BindingTable
          bindings={bindings}
          selectedId={selectedId}
          onSelect={handleSelect}
          onUpdateAction={updateAction}
          onRemove={remove}
        />
      </div>

      {modalKey && (
        <BindModal
          keyId={modalKey}
          existingBindings={bindings}
          keyColor={keyColors[modalKey]}
          recentColors={recentColors}
          onColorChange={color => handleColorChange(modalKey, color)}
          onSave={handleSave}
          onCancel={handleModalCancel}
          settings={settings}
        />
      )}

      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}

      {showSettings && (
        <SettingsModal
          settings={settings}
          onModColor={setModColor}
          onSplitModColor={setSplitModColor}
          onToggleSplit={setSplitModifiers}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
