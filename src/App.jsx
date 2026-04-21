import React, { useState, useRef, useEffect } from 'react';
import Keyboard from './components/Keyboard';
import BindModal from './components/BindModal';
import BindingTable from './components/BindingTable';
import MouseBindingTable from './components/MouseBindingTable';
import MouseBindModal from './components/MouseBindModal';
import HelpModal from './components/HelpModal';
import SettingsModal from './components/SettingsModal';
import ShareModal from './components/ShareModal';
import ShareImportModal from './components/ShareImportModal';
import { bindingId } from './useBindings';
import { useFormats, MAX_FORMATS } from './useFormats';
import { useSettings } from './useSettings';
import { exportJSON, exportPNG, importFile } from './export';
import { GAME_PRESETS } from './gamePresets';
import OrphanWarningModal from './components/OrphanWarningModal';
import { encodeShareUrl, decodeShareHash } from './share';
import { DEFAULT_BINDINGS } from './defaultBindings';
import { getKeys, getLayout as getKbLayout } from './keyboardLayouts';
import { localeUsesISO } from './keylabels';
import { TranslationContext, makeT, resolveAction } from './useTranslation';


const DEFAULT_FORMAT_NAMES   = ['__t:formatOnFoot'];
const LEGACY_FORMAT_NAMES    = ['On Foot', 'In Vehicle'];
const DEFAULT_BINDING_COUNTS = [DEFAULT_BINDINGS.length];

function hasCustomSession(formats, layoutName) {
  if (layoutName) return true;
  if (formats.length !== 1) return true;
  if (formats.some((f, i) => f.name !== DEFAULT_FORMAT_NAMES[i] && !LEGACY_FORMAT_NAMES.includes(f.name))) return true;
  if (formats.some(f => Object.keys(f.keyColors).length > 0)) return true;
  if (formats.some((f, i) => f.bindings.length !== DEFAULT_BINDING_COUNTS[i])) return true;
  return false;
}

const LAYOUT_NAME_KEY    = 'keybindr_layout_name';
const MOBILE_WARNED_KEY  = 'keybindr_mobile_warned';
const DEFAULT_LAYOUT_NAME = null; // displayed via translation key 'layoutNameDefault'

// ── Format tabs ───────────────────────────────────────────────────────────────
function FormatTabs({ formats, activeIndex, onSwitch, onAdd, onRename, onRemove, t }) {
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
        const label    = resolveAction(f.name, t) || (t ? t('formatFallback', { n: String(i + 1) }) : `Format ${i + 1}`);
        const isActive = i === activeIndex;
        const removable = i > 0;

        return (
          <div
            key={i}
            className={`format-tab${isActive ? ' active' : ''}`}
            onClick={() => handleTabClick(i)}
            title={isActive ? (t ? t('tabClickRename') : 'Click to rename') : label}
          >
            {editingIdx === i ? (
              <input
                ref={inputRef}
                className="format-tab-input"
                defaultValue={resolveAction(f.name, t)}
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
                  title={t ? t('tabRemove') : 'Remove format'}
                >✕</span>
              </>
            )}
          </div>
        );
      })}
      {formats.length < MAX_FORMATS && (
        <button className="format-add-btn" onClick={onAdd} title={t ? t('tabAdd') : 'Add format'}>+</button>
      )}
    </div>
  );
}

// ── Layout name ───────────────────────────────────────────────────────────────
function LayoutName({ name, onChange, t }) {
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
    <div className="layout-name" onClick={() => setEditing(true)} title={t ? t('tabClickRename') : 'Click to rename'}>
      {name || (t ? t('layoutNameDefault') : 'Custom Keybind Layout Name')}
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
  const t = React.useContext(TranslationContext);
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal mobile-warning-modal" onClick={e => e.stopPropagation()}>
        <button className="mobile-warning-close" onClick={onClose} title={t('close')}>✕</button>
        <p className="mobile-warning-text">{t('mobileWarning')}</p>
      </div>
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const {
    formats, activeIndex, switchTo, addFormat, setFormatName, removeFormat,
    bindings, keyColors, mouseBindings, recentColors,
    addOrUpdate, remove, reorderBindings, updateAction,
    replaceActiveBindings, replaceFormats, removeOrphanBindings,
    setKeyColor, clearKeyColor, restoreKeyColor, clearAllKeyColors, addRecentColor,
    addOrUpdateMouseBinding, removeMouseBinding, updateMouseAction,
    resetFormats,
    undo, redo,
  } = useFormats();

  const { settings, setSplitModifiers, setPhysicalLayout, setLanguage, setUiLanguage, setWarnCrossFormatConflicts, setShowMouseBindings, resetSettings } = useSettings();
  const [mouseModal, setMouseModal] = useState(null);

  const [layoutName, setLayoutNameState] = useState(() => localStorage.getItem(LAYOUT_NAME_KEY) || '');
  const [selectedId, setSelectedId]     = useState(null);
  const [modalKey, setModalKey]         = useState(null);
  const [showHelp, setShowHelp]         = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showShare, setShowShare]             = useState(false);
  const [shareUrl, setShareUrl]               = useState('');
  const [pendingImport, setPendingImport]     = useState(null);
  const [pendingLayout, setPendingLayout]     = useState(null); // { id, name, orphans }
  const modalOriginalColor = useRef(undefined);

  const fileInputRef        = useRef(null);
  const gameImportRef       = useRef(null);
  const menuRef         = useRef(null);
  const presetsRef      = useRef(null);
  const hamburgerRef    = useRef(null);
  const [showMenu, setShowMenu]           = useState(false);
  const [showPresets, setShowPresets]     = useState(false);
  const [showHamburger, setShowHamburger] = useState(false);
  const [activePreset, setActivePreset]   = useState(null);
  const [deleteLocked, setDeleteLocked]   = useState(false);

  const [showMobileWarning, setShowMobileWarning] = useState(() => {
    return window.innerWidth <= 768 && !localStorage.getItem(MOBILE_WARNED_KEY);
  });

  useEffect(() => {
    function onKeyDown(e) {
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key === 'z') {
        e.preventDefault();
        undo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        redo();
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [undo, redo]);

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

  useEffect(() => {
    if (!showPresets) return;
    function onMouseDown(e) {
      if (!presetsRef.current?.contains(e.target)) setShowPresets(false);
    }
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [showPresets]);

  function handleLayoutNameChange(name) {
    setLayoutNameState(name);
    if (name) localStorage.setItem(LAYOUT_NAME_KEY, name);
    else localStorage.removeItem(LAYOUT_NAME_KEY);
  }

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash || !hash.includes('layout=')) return;
    decodeShareHash(hash).then(result => {
      if (!result) return;
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
      if (hasCustomSession(formats, layoutName)) {
        setPendingImport(result);
      } else {
        applySharedImport(result);
      }
    });
  }, []);

  function applySharedImport(result) {
    if (result.formats) replaceFormats(result.formats);
    if (result.layoutName !== undefined) handleLayoutNameChange(result.layoutName);
    if (result.physicalLayout) setPhysicalLayout(result.physicalLayout);
    if (result.language)       setLanguage(result.language);
    setSelectedId(null);
    setPendingImport(null);
  }

  function resetAll() {
    const keepMouseBindings = settings.showMouseBindings;
    resetSettings();
    if (keepMouseBindings) setShowMouseBindings(true);
    resetFormats();
    setSelectedId(null);
    setActivePreset(null);
    setDeleteLocked(false);
    localStorage.removeItem(LAYOUT_NAME_KEY);
    setLayoutNameState('');
  }

  function handleImport(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    importFile(file, settings.uiLanguage || settings.language)
      .then(result => {
        if (result.type === 'full') {
          replaceFormats(result.data.formats);
          handleLayoutNameChange(result.data.layoutName || '');
          if (result.data.physicalLayout) setPhysicalLayout(result.data.physicalLayout);
          if (result.data.language)       setLanguage(result.data.language);
        } else if (result.type === 'formats') {
          replaceFormats(result.data);
        } else {
          replaceActiveBindings(result.data);
        }
        setSelectedId(null);
        setActivePreset(null);
      })
      .catch(err => alert(err.message));
    e.target.value = '';
  }

  function handleGameImport(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const preset = GAME_PRESETS.find(p => p.id === activePreset);
    if (!preset?.importFn) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const bindings = preset.importFn(ev.target.result);
      replaceActiveBindings(bindings);
      setSelectedId(null);
    };
    reader.readAsText(file);
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

  // In unified mode, modifier key colors are mirrored to both sides of the pair
  const UNIFIED_MOD_PAIRS = {
    ShiftLeft:    'ShiftRight',   ShiftRight:   'ShiftLeft',
    ControlLeft:  'ControlRight', ControlRight: 'ControlLeft',
    AltLeft:      'AltRight',     AltRight:     'AltLeft',
    MetaLeft:     'MetaRight',    MetaRight:    'MetaLeft',
  };

  function getModPair(keyId) {
    return !settings.splitModifiers ? (UNIFIED_MOD_PAIRS[keyId] ?? null) : null;
  }

  function handleKeyClick(keyId) {
    modalOriginalColor.current = keyColors[keyId];
    setModalKey(keyId);
  }

  function handleSave(key, mods, action) {
    if (action) {
      addOrUpdate(key, mods, action);
      setSelectedId(bindingId(key, mods));
    }
    const newColor = keyColors[key];
    if (newColor && newColor !== modalOriginalColor.current) {
      addRecentColor(newColor);
    }
    setModalKey(null);
  }

  function handleModalCancel() {
    restoreKeyColor(modalKey, modalOriginalColor.current);
    const pair = getModPair(modalKey);
    if (pair) restoreKeyColor(pair, modalOriginalColor.current);
    setModalKey(null);
  }

  function handleColorChange(keyId, color) {
    if (color) setKeyColor(keyId, color);
    else clearKeyColor(keyId);
    // Mirror to the paired modifier key in unified mode
    const pair = getModPair(keyId);
    if (pair) {
      if (color) setKeyColor(pair, color);
      else clearKeyColor(pair);
    }
  }

  function handleLoadPreset(preset) {
    replaceFormats(preset.formats.map(f => ({ name: f.name, bindings: f.bindings, keyColors: f.keyColors ?? {} })));
    if (preset.layoutName) handleLayoutNameChange(preset.layoutName);
    setActivePreset(preset.id);
    setDeleteLocked(true);
    setSelectedId(null);
    setShowMouseBindings(true);
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

  function handleShare() {
    encodeShareUrl(formats, layoutName, settings).then(url => {
      setShareUrl(url);
      setShowShare(true);
    });
  }

  function handleLayoutChange(newId) {
    const newKeySet = new Set(getKeys(newId).map(k => k.id));
    const orphans = formats.flatMap(f =>
      f.bindings
        .filter(b => !newKeySet.has(b.key))
        .map(b => ({ ...b, _format: f.name }))
    );
    if (orphans.length > 0) {
      setPendingLayout({ id: newId, name: getKbLayout(newId).name, orphans });
    } else {
      setPhysicalLayout(newId);
    }
  }

  const ANSI_ISO_PAIRS = {
    'ansi-104': 'iso-105',
    'iso-105':  'ansi-104',
    'tkl-ansi': 'tkl-iso',
    'tkl-iso':  'tkl-ansi',
  };

  function handleLocaleChange(newLocaleId) {
    setLanguage(newLocaleId);
    const current = settings.physicalLayout;
    const newNeedsISO = localeUsesISO(newLocaleId);
    const currentIsISO = current === 'iso-105' || current === 'tkl-iso';
    if (newNeedsISO !== currentIsISO && ANSI_ISO_PAIRS[current]) {
      handleLayoutChange(ANSI_ISO_PAIRS[current]);
    }
  }

  function handleUiLocaleChange(newLocaleId) {
    setUiLanguage(newLocaleId);
  }

  function confirmLayoutChange() {
    if (!pendingLayout) return;
    const newKeySet = new Set(getKeys(pendingLayout.id).map(k => k.id));
    removeOrphanBindings(newKeySet);
    setPhysicalLayout(pendingLayout.id);
    setSelectedId(null);
    setPendingLayout(null);
  }

  const { splitModifiers } = settings;
  const t = makeT(settings.uiLanguage || settings.language);

  // Legend colors follow modifier key custom colors, falling back to defaults
  const legShift  = keyColors['ShiftLeft']   || keyColors['ShiftRight']   || '#7b9ee0';
  const legAlt    = keyColors['AltLeft']     || keyColors['AltRight']     || '#7be09a';
  const legCtrl   = keyColors['ControlLeft'] || keyColors['ControlRight'] || '#e07b39';
  const legShiftL = keyColors['ShiftLeft']   || '#7b9ee0';
  const legShiftR = keyColors['ShiftRight']  || '#7b9ee0';
  const legAltL   = keyColors['AltLeft']     || '#7be09a';
  const legAltR   = keyColors['AltRight']    || '#7be09a';
  const legCtrlL  = keyColors['ControlLeft'] || '#e07b39';
  const legCtrlR  = keyColors['ControlRight']|| '#e07b39';

  return (
    <TranslationContext.Provider value={t}>
    <div className="app">
      <header className="app-header">
        <div className="app-title-group">
          <h1 className="app-title">Keybindr</h1>
          <div className="app-tagline">{t('tagline')}</div>
        </div>

        {/* Desktop navigation */}
        <div className="header-actions desktop-nav">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            style={{ display: 'none' }}
            onChange={handleImport}
          />
          <input
            ref={gameImportRef}
            type="file"
            accept={GAME_PRESETS.find(p => p.id === activePreset)?.importAccept ?? ''}
            style={{ display: 'none' }}
            onChange={handleGameImport}
          />
          <div className="dropdown" ref={presetsRef}>
            <button className="btn-export btn-presets" onClick={() => setShowPresets(v => !v)}>
              {activePreset ? GAME_PRESETS.find(p => p.id === activePreset)?.label : t('gameDefaults')}
            </button>
            {showPresets && (
              <div className="dropdown-menu">
                {GAME_PRESETS.map(p => (
                  <button
                    key={p.id}
                    className={`dropdown-item${activePreset === p.id ? ' dropdown-item-active' : ''}`}
                    onClick={() => { setShowPresets(false); handleLoadPreset(p); }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="dropdown" ref={menuRef}>
            <button className="btn-export" onClick={() => setShowMenu(v => !v)}>
              {t('importExport')}
            </button>
            {showMenu && (
              <div className="dropdown-menu">
                <button className="dropdown-item" onClick={() => menuAction(() => fileInputRef.current?.click())}>
                  {t('importJson')}
                </button>
                <div className="dropdown-sep" />
                <button className="dropdown-item" onClick={() => menuAction(() => exportJSON(formats, layoutName, settings))}>
                  {t('exportJson')}
                </button>
                <button className="dropdown-item" onClick={() => menuAction(() => exportPNG(formats, layoutName, settings).catch(err => alert(err.message)))}>
                  {t('exportPng')}
                </button>
                {(() => {
                  const ap = GAME_PRESETS.find(p => p.id === activePreset);
                  if (!ap?.importFn && !ap?.exportFn) return null;
                  return (
                    <>
                      <div className="dropdown-sep" />
                      {ap.importFn && (
                        <button className="dropdown-item" onClick={() => menuAction(() => gameImportRef.current?.click())}>
                          {t(ap.importLabel)}
                        </button>
                      )}
                      {ap.exportFn && (
                        <button className="dropdown-item" onClick={() => menuAction(() => ap.exportFn(formats))}>
                          {t(ap.exportLabel)}
                        </button>
                      )}
                    </>
                  );
                })()}
              </div>
            )}
          </div>
          <button className="btn-icon" title={t('shareLayout')} onClick={handleShare}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="13" cy="3" r="1.5"/>
              <circle cx="3" cy="8" r="1.5"/>
              <circle cx="13" cy="13" r="1.5"/>
              <line x1="4.5" y1="7" x2="11.5" y2="4"/>
              <line x1="4.5" y1="9" x2="11.5" y2="12"/>
            </svg>
          </button>
          <button className="btn-icon" title={t('help')} onClick={() => setShowHelp(true)}>?</button>
          <button className="btn-icon" title={t('settings')} onClick={() => setShowSettings(true)}>⚙</button>
        </div>

        {/* Mobile hamburger */}
        <div className="header-mobile" ref={hamburgerRef}>
          <button className="btn-hamburger" onClick={() => setShowHamburger(v => !v)} title={t('menu')}>
            ☰
          </button>
          {showHamburger && (
            <div className="hamburger-menu">
              <button className="hamburger-item" onClick={() => hamburgerAction(() => fileInputRef.current?.click())}>
                {t('importJson')}
              </button>
              <div className="hamburger-sep" />
              <button className="hamburger-item" onClick={() => hamburgerAction(() => exportJSON(formats, layoutName, settings))}>
                {t('exportJson')}
              </button>
              <button className="hamburger-item" onClick={() => hamburgerAction(() => exportPNG(formats, layoutName, settings).catch(err => alert(err.message)))}>
                {t('exportPng')}
              </button>
              {(() => {
                const ap = GAME_PRESETS.find(p => p.id === activePreset);
                if (!ap?.importFn && !ap?.exportFn) return null;
                return (
                  <>
                    {ap.importFn && (
                      <button className="hamburger-item" onClick={() => hamburgerAction(() => gameImportRef.current?.click())}>
                        {ap.importLabel}
                      </button>
                    )}
                    {ap.exportFn && (
                      <button className="hamburger-item" onClick={() => hamburgerAction(() => ap.exportFn(formats))}>
                        {ap.exportLabel}
                      </button>
                    )}
                  </>
                );
              })()}
              <div className="hamburger-sep" />
              <button className="hamburger-item" onClick={() => hamburgerAction(handleShare)}>
                {t('shareLayout')}
              </button>
              <button className="hamburger-item" onClick={() => hamburgerAction(() => setShowHelp(true))}>
                {t('help')}
              </button>
              <button className="hamburger-item" onClick={() => hamburgerAction(() => setShowSettings(true))}>
                {t('settings')}
              </button>
            </div>
          )}
        </div>
      </header>

      <LayoutName name={layoutName} onChange={handleLayoutNameChange} t={t} />

      <div className="legend-row">
        <div className="legend">
          {splitModifiers ? (
            <>
              <span className="legend-item"><LegendTri color={legShiftL} dir="shift" /> LShift</span>
              <span className="legend-item"><LegendTri color={legShiftR} dir="shift" /> RShift</span>
              <span className="legend-item"><LegendTri color={legAltL}   dir="alt"   /> LAlt</span>
              <span className="legend-item"><LegendTri color={legAltR}   dir="alt"   /> RAlt</span>
              <span className="legend-item"><LegendTri color={legCtrlL}  dir="ctrl"  /> LCtrl</span>
              <span className="legend-item"><LegendTri color={legCtrlR}  dir="ctrl"  /> RCtrl</span>
            </>
          ) : (
            <>
              <span className="legend-item"><LegendTri color={legShift} dir="shift" /> Shift</span>
              <span className="legend-item"><LegendTri color={legAlt}   dir="alt"   /> Alt</span>
              <span className="legend-item"><LegendTri color={legCtrl}  dir="ctrl"  /> Ctrl</span>
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
          t={t}
        />
      </div>

      <div className="keyboard-container">
        <Keyboard
          bindings={bindings}
          selectedId={selectedId}
          onKeyClick={handleKeyClick}
          keyColors={keyColors}
          settings={settings}
          mouseBindings={mouseBindings}
        />
      </div>

      <div className="panel">
        <h2 className="panel-title">{t('bindingsTitle')} <span className="count-badge">{bindings.length}</span></h2>
        <BindingTable
          bindings={bindings}
          keyColors={keyColors}
          selectedId={selectedId}
          onSelect={handleSelect}
          onUpdateAction={updateAction}
          onRemove={remove}
          onReorder={reorderBindings}
          onOpenModal={handleKeyClick}
          settings={settings}
          locked={deleteLocked}
          onToggleLocked={setDeleteLocked}
          formats={formats}
          activeIndex={activeIndex}
        />
      </div>

      {settings.showMouseBindings && (
        <div className="panel" style={{ marginTop: 10 }}>
          <h2 className="panel-title">{t('mouseBindingsTitle')} <span className="count-badge">{mouseBindings.length}</span></h2>
          <MouseBindingTable
            mouseBindings={mouseBindings}
            settings={settings}
            locked={deleteLocked}
            onToggleLocked={setDeleteLocked}
            onUpdateAction={updateMouseAction}
            onRemove={removeMouseBinding}
            onOpenModal={(button, modifiers) => {
              const existing = mouseBindings.find(b => b.button === button && JSON.stringify(b.modifiers) === JSON.stringify(modifiers ?? []));
              setMouseModal({ button: button ?? null, modifiers: modifiers ?? [], keyboardKey: existing?.keyboardKey ?? '' });
            }}
          />
        </div>
      )}

      {mouseModal && (
        <MouseBindModal
          initialButton={mouseModal.button}
          initialModifiers={mouseModal.modifiers}
          initialKeyboardKey={mouseModal.keyboardKey ?? ''}
          existingBindings={mouseBindings}
          bindings={bindings}
          settings={settings}
          layoutKeys={getKeys(settings.physicalLayout)}
          onSave={(button, modifiers, action, keyboardKey) => {
            addOrUpdateMouseBinding(button, modifiers, action, keyboardKey);
            if (keyboardKey) addOrUpdate(keyboardKey, [], action);
            setMouseModal(null);
          }}
          onCancel={() => setMouseModal(null)}
        />
      )}

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
          formats={formats}
          activeIndex={activeIndex}
        />
      )}

      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}

      {showShare && <ShareModal url={shareUrl} onClose={() => setShowShare(false)} />}

      {pendingImport && (
        <ShareImportModal
          onDownload={() => exportJSON(formats, layoutName, settings)}
          onConfirm={() => applySharedImport(pendingImport)}
          onCancel={() => setPendingImport(null)}
        />
      )}

      {showSettings && (
        <SettingsModal
          settings={settings}
          onToggleSplit={setSplitModifiers}
          onChangeLayout={handleLayoutChange}
          onChangeLocale={handleLocaleChange}
          onChangeUiLocale={handleUiLocaleChange}
          onToggleCrossFormatWarnings={setWarnCrossFormatConflicts}
          onToggleMouseBindings={setShowMouseBindings}
          onClearKeys={resetAll}
          onClose={() => setShowSettings(false)}
        />
      )}

      {pendingLayout && (
        <OrphanWarningModal
          orphans={pendingLayout.orphans}
          newLayoutName={pendingLayout.name}
          onConfirm={confirmLayoutChange}
          onCancel={() => setPendingLayout(null)}
        />
      )}

      {showMobileWarning && <MobileWarningModal onClose={closeMobileWarning} />}

      <footer className="app-footer">
        <div className="footer-content">
          <a href="https://ko-fi.com/B0B717I6U" className="kofi-btn" target="_blank" rel="noreferrer">☕ Support on Ko-fi</a>
          <span className="footer-sep">|</span>
          <a href="https://github.com/keybindr/keybindr.github.io" className="footer-link" target="_blank" rel="noreferrer">{t('sourceCode')}</a>
          <span className="footer-sep">|</span>
          <a href="https://github.com/keybindr/keybindr.github.io/issues" className="footer-link" target="_blank" rel="noreferrer">{t('fileABug')}</a>
        </div>
      </footer>
    </div>
    </TranslationContext.Provider>
  );
}
