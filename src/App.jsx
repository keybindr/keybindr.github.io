import React, { useState } from 'react';
import Keyboard from './components/Keyboard';
import BindModal from './components/BindModal';
import BindingTable from './components/BindingTable';
import { useBindings, bindingId } from './useBindings';
import { exportXML, exportPNG } from './export';

export default function App() {
  const { bindings, addOrUpdate, remove, updateAction } = useBindings();
  const [selectedId, setSelectedId] = useState(null);
  const [modalKey, setModalKey] = useState(null);

  function handleKeyClick(keyId) {
    setModalKey(keyId);
  }

  function handleSave(key, mods, action) {
    addOrUpdate(key, mods, action);
    setSelectedId(bindingId(key, mods));
  }

  function handleSelect(id) {
    setSelectedId(prev => prev === id ? null : id);
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Keybindr</h1>
        <div className="header-actions">
          <button className="btn-export" onClick={() => exportXML(bindings)}>
            Export XML
          </button>
          <button className="btn-export" onClick={() => exportPNG('keyboard-svg')}>
            Export PNG
          </button>
        </div>
      </header>

      <div className="legend">
        <span className="legend-item"><span className="legend-dot bound" />Bound key</span>
        <span className="legend-item"><span className="legend-tri ctrl" />Ctrl</span>
        <span className="legend-item"><span className="legend-tri shift" />Shift</span>
        <span className="legend-item"><span className="legend-tri alt" />Alt</span>
      </div>

      <div className="keyboard-container">
        <Keyboard
          bindings={bindings}
          selectedId={selectedId}
          onKeyClick={handleKeyClick}
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
          onSave={handleSave}
          onClose={() => setModalKey(null)}
        />
      )}
    </div>
  );
}
