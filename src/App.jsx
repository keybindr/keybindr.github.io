import React, { useState, useRef, useEffect } from 'react';
import Keyboard from './components/Keyboard';
import BindModal from './components/BindModal';
import BindingTable from './components/BindingTable';
import HelpModal from './components/HelpModal';
import SettingsModal from './components/SettingsModal';
import { bindingId } from './useBindings';
import { useFormats, MAX_FORMATS } from './useFormats';
import { useSettings } from './useSettings';
import { exportXML, exportJSON, exportPNG, importFile } from './export';

const LAYOUT_NAME_KEY    = 'keybindr_layout_name';
const MOBILE_WARNED_KEY  = 'keybindr_mobile_warned';
const DEFAULT_LAYOUT_NAME = 'Custom Keybind Layout Name';

// ── Format tabs ───────────────────────────────────────────────────────────────
function FormatTabs({ formats, activeIndex, onSwitch, onAdd, onRename, onRemove }) {
  const [editingIdx, setEditingIdx] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (editingIdx !== null) inputRef.current?.select();
  }, [editingIdx]);

  function handleTabClick(i) {
    if (i === activeIndex) setEditingIdx(i);
    else onSwitch(i);
  }

  function commit(val) {
    onRename(editingIdx, val.trim());
    setEditingIdx(null);
  }

  return (
    <div className="format-tabs">
      {formats.map((f, i) => {
        const label    = f.name || `Format ${i + 1}`;
        const isActive = i === activeIndex;
        const removable = i > 0;

        return (
          <div
            key={i}
            className={`format-tab${isActive ? ' active' : ''}`}
            onClick={() => handleTabClick(i)}
            title={isActive ? 'Click to rename' : label}
          >
            {editingIdx === i ? (
              <input
                ref={inputRef}
                className="format-tab-input"
                defaultValue={f.name}
                maxLength={20}
                onClick={e => e.stopPropagation()}
                onBlur={e => commit(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') e.target.blur();
                  if (e.key === 'Escape') setEditingIdx(null);
                }}
              />
            ) : (
              <span>{label}</span>
            )}
            {removable && (
              <>
                <span className="format-tab-sep">|</span>
                <span
                  className="format-tab-remove"
                  onClick={e => { e.stopPropagation(); onRemove(i); }}
                  title="Remove format"
                >✕</span>
              </>
            )}
          </div>
        );
      })}
      {formats.length < MAX_FORMATS && (
        <button className="format-add-btn" onClick={onAdd} title="Add format">+</button>
      )}
    </div>
  );
}

// ── Layout name ───────────────────────────────────────────────────────────────
function LayoutName({ name, onChange }) {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (editing) inputRef.current?.select();
  }, [editing]);

  function commit(val) {
    onChange(val.trim());
    setEditing(false);
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        className="layout-name-input"
        defaultValue={name}
        maxLength={60}
        onBlur={e => commit(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter') commit(e.target.value);
          if (e.key === 'Escape') setEditing(false);
        }}
      />
    );
  }

  return (
    <div className="layout-name" onClick={() => setEditing(true)} title="Click to rename">
      {name || DEFAULT_LAYOUT_NAME}
    </div>
  );
}

// ── Legend triangle SVG ───────────────────────────────────────────────────────
function LegendTri({ color, dir }) {
  const s = 10;
  const pts = dir === 'shift' ? `${s},0 ${s},${s} 0,0`
            : dir === 'alt'   ? `${s},${s} ${s},0 0,${s}`
            :                   `0,${s} 0,0 ${s},${s}`;
  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} style={{ display: 'inline-block', flexShrink: 0 }}>
      <polygon points={pts} fill={color} />
    </svg>
  );
}

// ── Mobile warning modal ──────────────────────────────────────────────────────
function MobileWarningModal({ onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal mobile-warning-modal" onClick={e => e.stopPropagation()}>
        <button className="mobile-warning-close" onClick={onClose} title="Close">✕</button>
        <p className="mobile-warning-text">
          This is a desktop focused application and, given the nature of it, will likely never be totally optimized for mobile. - Mangement
        </p>
      </div>
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const {
    formats, activeIndex, switchTo, addFormat, setFormatName, removeFormat,
    bindings, keyColors, recentColors,
    addOrUpdate, remove, updateAction,
    replaceActiveBindings, replaceFormats,
    setKeyColor, clearKeyColor, restoreKeyColor, clearAllKeyColors,
    resetFormats,
  } = useFormats();

  const { settings, setModColor, setSplitModColor, setSplitModifiers, resetSettings } = useSettings();

  const [layoutName, setLayoutNameState] = useState(() => localStorage.getItem(LAYOUT_NAME_KEY) || '');
  const [selectedId, setSelectedId]     = useState(null);
  const [modalKey, setModalKey]         = useState(null);
  const [showHelp, setShowHelp]         = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const modalOriginalColor = useRef(undefined);

  const fileInputRef    = useRef(null);
  const menuRef         = useRef(null);
  const hamburgerRef    = useRef(null);
  const [showMenu, setShowMenu]           = useState(false);
  const [showHamburger, setShowHamburger] = useState(false);

  const [showMobileWarning, setShowMobileWarning] = useState(() => {
    if (window.innerWidth > 768) return false;
    return !localStorage.getItem(MOBILE_WARNED_KEY);
  });

  useEffect(() => {
    if (!showMenu) return;
    function onMouseDown(e) {
      if (!menuRef.current?.contains(e.target)) setShowMenu(false);
    }
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [showMenu]);

  useEffect(() => {
    if (!showHamburger) return;
    function onMouseDown(e) {
      if (!hamburgerRef.current?.contains(e.target)) setShowHamburger(false);
    }
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [showHamburger]);

  function handleLayoutNameChange(name) {
    setLayoutNameState(name);
    if (name) localStorage.setItem(LAYOUT_NAME_KEY, name);
    else localStorage.removeItem(LAYOUT_NAME_KEY);
  }

  function resetAll() {
    resetSettings();
    resetFormats();
    setSelectedId(null);
    localStorage.removeItem(LAYOUT_NAME_KEY);
    setLayoutNameState('');
  }

  function handleImport(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    importFile(file)
      .then(result => {
        if (result.type === 'formats') replaceFormats(result.data);
        else replaceActiveBindings(result.data);
        setSelectedId(null);
      })
      .catch(err => alert(err.message));
    e.target.value = '';
  }

  function menuAction(fn) {
    setShowMenu(false);
    fn();
  }

  function hamburgerAction(fn) {
    setShowHamburger(false);
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

  function handleSwitchFormat(i) {
    switchTo(i);
    setSelectedId(null);
  }

  function closeMobileWarning() {
    localStorage.setItem(MOBILE_WARNED_KEY, '1');
    setShowMobileWarning(false);
  }

  const { splitModifiers, modColors, splitModColors } = settings;

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Keybindr</h1>

        {/* Desktop navigation */}
        <div className="header-actions desktop-nav">
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
                <button className="dropdown-item" onClick={() => menuAction(() => exportJSON(formats))}>
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

        {/* Mobile hamburger */}
        <div className="header-mobile" ref={hamburgerRef}>
          <button className="btn-hamburger" onClick={() => setShowHamburger(v => !v)} title="Menu">
            ☰
          </button>
          {showHamburger && (
            <div className="hamburger-menu">
              <button className="hamburger-item" onClick={() => hamburgerAction(() => fileInputRef.current?.click())}>
                Import XML/JSON
              </button>
              <div className="hamburger-sep" />
              <button className="hamburger-item" onClick={() => hamburgerAction(() => exportXML(bindings))}>
                Export XML
              </button>
              <button className="hamburger-item" onClick={() => hamburgerAction(() => exportJSON(formats))}>
                Export JSON
              </button>
              <button className="hamburger-item" onClick={() => hamburgerAction(() => exportPNG('keyboard-svg', bindings))}>
                Export PNG
              </button>
              <div className="hamburger-sep" />
              <button className="hamburger-item" onClick={() => hamburgerAction(() => setShowHelp(true))}>
                Help
              </button>
              <button className="hamburger-item" onClick={() => hamburgerAction(() => setShowSettings(true))}>
                Settings
              </button>
            </div>
          )}
        </div>
      </header>

      <LayoutName name={layoutName} onChange={handleLayoutNameChange} />

      <div className="legend-row">
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
        <FormatTabs
          formats={formats}
          activeIndex={activeIndex}
          onSwitch={handleSwitchFormat}
          onAdd={addFormat}
          onRename={setFormatName}
          onRemove={i => { removeFormat(i); setSelectedId(null); }}
        />
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
          onOpenModal={handleKeyClick}
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
          onClearKeys={resetAll}
          onClose={() => setShowSettings(false)}
        />
      )}

      {showMobileWarning && <MobileWarningModal onClose={closeMobileWarning} />}

      <footer className="app-footer">
        <div className="footer-content">
          <span>Vibed by <a href="https://andrewsimone.com/" className="footer-link" target="_blank" rel="noreferrer">Andrew Simone</a></span>
          <span className="footer-sep">|</span>
          <a href="https://github.com/keybindr/keybindr.github.io" className="footer-link" target="_blank" rel="noreferrer">Source Code</a>
          <span className="footer-sep">|</span>
          <a href="https://github.com/keybindr/keybindr.github.io/blob/main/LICENSE" className="footer-link" target="_blank" rel="noreferrer">MIT License</a>
        </div>
      </footer>
    </div>
  );
}
