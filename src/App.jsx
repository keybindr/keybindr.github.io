import React, { useState, useRef, useEffect } from 'react';
import Keyboard from './components/Keyboard';
import BindModal from './components/BindModal';
import BindingTable from './components/BindingTable';
import { useBindings, bindingId } from './useBindings';
import { useKeyColors } from './useKeyColors';
import { exportXML, exportJSON, exportPNG, importFile } from './export';

export default function App() {
  const { bindings, addOrUpdate, remove, updateAction, replaceBindings } = useBindings();
  const { keyColors, recentColors, setKeyColor, clearKeyColor, restoreKeyColor } = useKeyColors();
  const [selectedId, setSelectedId] = useState(null);
  const [modalKey, setModalKey] = useState(null);
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
    importFile(file)
      .then(replaceBindings)
      .catch(err => alert(err.message));
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
        </div>
      </header>

      <div className="legend">
        <span className="legend-item"><span className="legend-tri shift" />Shift</span>
        <span className="legend-item"><span className="legend-tri alt" />Alt</span>
        <span className="legend-item"><span className="legend-tri ctrl" />Ctrl</span>
      </div>

      <div className="keyboard-container">
        <Keyboard
          bindings={bindings}
          selectedId={selectedId}
          onKeyClick={handleKeyClick}
          keyColors={keyColors}
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
        />
      )}
    </div>
  );
}
