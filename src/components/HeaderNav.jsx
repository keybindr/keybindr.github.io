import { useState, useRef } from 'react';
import { useClickOutside } from '../hooks/useClickOutside';
import { exportJSON, exportPNG } from '../export';
import { GAME_PRESETS } from '../gamePresets';

/**
 * Header navigation: desktop dropdown menus (game presets, import/export)
 * plus the equivalent mobile hamburger menu. Owns its own open/closed state
 * and click-outside handling — nothing outside this component reads it.
 */
export default function HeaderNav({
  t, formats, layoutName, settings, activePreset,
  onImportFile, onGameImportFile, onSelectPreset,
  onShare, onOpenHelp, onOpenSettings, onShowError,
}) {
  const [showPresets, setShowPresets]     = useState(false);
  const [showMenu, setShowMenu]           = useState(false);
  const [showHamburger, setShowHamburger] = useState(false);
  const [isExporting, setIsExporting]     = useState(false);

  const fileInputRef  = useRef(null);
  const gameImportRef = useRef(null);
  const presetsRef    = useRef(null);
  const menuRef       = useRef(null);
  const hamburgerRef  = useRef(null);

  useClickOutside(presetsRef, showPresets, () => setShowPresets(false));
  useClickOutside(menuRef, showMenu, () => setShowMenu(false));
  useClickOutside(hamburgerRef, showHamburger, () => setShowHamburger(false));

  function menuAction(fn) {
    setShowMenu(false);
    fn();
  }

  function hamburgerAction(fn) {
    setShowHamburger(false);
    fn();
  }

  function handleExportPng() {
    setIsExporting(true);
    exportPNG(formats, layoutName, settings)
      .catch(err => onShowError(err.message))
      .finally(() => setIsExporting(false));
  }

  const activePresetDef = GAME_PRESETS.find(p => p.id === activePreset);
  const gamePresetActions = activePresetDef?.importFn || activePresetDef?.exportFn ? activePresetDef : null;

  return (
    <>
      {/* Desktop navigation */}
      <div className="header-actions desktop-nav">
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          style={{ display: 'none' }}
          onChange={onImportFile}
        />
        <input
          ref={gameImportRef}
          type="file"
          accept={activePresetDef?.importAccept ?? ''}
          style={{ display: 'none' }}
          onChange={onGameImportFile}
        />
        <div className="dropdown" ref={presetsRef}>
          <button className="btn-export btn-presets" onClick={() => setShowPresets(v => !v)}>
            {activePresetDef ? activePresetDef.label : t('gameDefaults')}
          </button>
          {showPresets && (
            <div className="dropdown-menu">
              {GAME_PRESETS.map(p => (
                <button
                  key={p.id}
                  className={`dropdown-item${activePreset === p.id ? ' dropdown-item-active' : ''}`}
                  onClick={() => { setShowPresets(false); onSelectPreset(p); }}
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
              <button className="dropdown-item" disabled={isExporting} onClick={() => menuAction(handleExportPng)}>
                {t('exportPng')}{isExporting ? ' …' : ''}
              </button>
              {gamePresetActions && (
                <>
                  <div className="dropdown-sep" />
                  {gamePresetActions.importFn && (
                    <button className="dropdown-item" onClick={() => menuAction(() => gameImportRef.current?.click())}>
                      {t(gamePresetActions.importLabel)}
                    </button>
                  )}
                  {gamePresetActions.exportFn && (
                    <button className="dropdown-item" onClick={() => menuAction(() => gamePresetActions.exportFn(formats))}>
                      {t(gamePresetActions.exportLabel)}
                    </button>
                  )}
                </>
              )}
            </div>
          )}
        </div>
        <button className="btn-icon" title={t('shareLayout')} aria-label={t('shareLayout')} onClick={onShare}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="13" cy="3" r="1.5"/>
            <circle cx="3" cy="8" r="1.5"/>
            <circle cx="13" cy="13" r="1.5"/>
            <line x1="4.5" y1="7" x2="11.5" y2="4"/>
            <line x1="4.5" y1="9" x2="11.5" y2="12"/>
          </svg>
        </button>
        <button className="btn-icon" title={t('help')} aria-label={t('help')} onClick={onOpenHelp}>?</button>
        <button className="btn-icon" title={t('settings')} aria-label={t('settings')} onClick={onOpenSettings}>⚙</button>
      </div>

      {/* Mobile hamburger */}
      <div className="header-mobile" ref={hamburgerRef}>
        <button className="btn-hamburger" onClick={() => setShowHamburger(v => !v)} title={t('menu')} aria-label={t('menu')}>
          ☰
        </button>
        {showHamburger && (
          <div className="hamburger-menu">
            {gamePresetActions && (
              <>
                {gamePresetActions.importFn && (
                  <button className="hamburger-item" onClick={() => hamburgerAction(() => gameImportRef.current?.click())}>
                    {gamePresetActions.importLabel}
                  </button>
                )}
                {gamePresetActions.exportFn && (
                  <button className="hamburger-item" onClick={() => hamburgerAction(() => gamePresetActions.exportFn(formats))}>
                    {gamePresetActions.exportLabel}
                  </button>
                )}
                <div className="hamburger-sep" />
              </>
            )}
            <button className="hamburger-item" onClick={() => hamburgerAction(onShare)}>
              {t('shareLayout')}
            </button>
            <button className="hamburger-item" onClick={() => hamburgerAction(onOpenHelp)}>
              {t('help')}
            </button>
            <button className="hamburger-item" onClick={() => hamburgerAction(onOpenSettings)}>
              {t('settings')}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
