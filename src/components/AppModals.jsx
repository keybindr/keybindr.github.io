import React, { Suspense } from 'react';
import { getKeys } from '../keyboardLayouts';
import { ErrorBoundary } from './ErrorBoundary';

// Modals are lazy-loaded — they're only shown on user action, never on initial render.
const BindModal          = React.lazy(() => import('./BindModal'));
const MouseBindModal     = React.lazy(() => import('./MouseBindModal'));
const HOTASBindModal     = React.lazy(() => import('./HOTASBindModal'));
const HelpModal          = React.lazy(() => import('./HelpModal'));
const SettingsModal      = React.lazy(() => import('./SettingsModal'));
const ShareModal         = React.lazy(() => import('./ShareModal'));
const ShareImportModal   = React.lazy(() => import('./ShareImportModal'));
const OrphanWarningModal = React.lazy(() => import('./OrphanWarningModal'));

/**
 * Every lazy-loaded modal/dialog in the app, gated behind its own piece of
 * App's state. Wrapped in one ErrorBoundary + Suspense so a modal crash
 * shows a dismissable toast instead of blanking the whole page.
 */
export default function AppModals({
  // HOTAS bind modal
  hotasModal, hotasBindings, bindings, effectiveHotasSettings,
  onSaveHotas, onRemoveHotasModifier, onCancelHotas,
  // Mouse bind modal
  mouseModal, mouseBindings, settings,
  onSaveMouse, onCancelMouse,
  // Keyboard bind modal
  modalKey, keyColors, recentColors, formats, activeIndex,
  onColorChange, onSaveKey, onCancelKey,
  // Help / share / settings-change orphan confirmation
  showHelp, onCloseHelp,
  showShare, shareUrl, onCloseShare,
  pendingImport, onDownloadShared, onConfirmSharedImport, onCancelSharedImport,
  showSettings, onCloseSettings,
  settingsModalProps,
  pendingLayout, onConfirmLayoutChange, onCancelLayoutChange,
  pendingMouseModel, onConfirmMouseModelChange, onCancelMouseModelChange,
  pendingHotasModel, onConfirmHotasModelChange, onCancelHotasModelChange,
}) {
  return (
    <ErrorBoundary fallback={(err, reset) => (
      <div className="error-toast" role="alert" onClick={reset}>
        {err.message || 'Something went wrong'}
      </div>
    )}>
    <Suspense fallback={null}>
    {hotasModal && (
      <HOTASBindModal
        initialInput={hotasModal.input}
        initialModifiers={hotasModal.modifiers ?? []}
        initialKeyboardKey={hotasModal.keyboardKey ?? ''}
        initialHotasMod={hotasModal.hotasMod ?? ''}
        initialIsHotasMod={hotasModal.isHotasMod ?? false}
        existingBindings={hotasBindings}
        bindings={bindings}
        settings={effectiveHotasSettings}
        layoutKeys={getKeys(settings.physicalLayout)}
        onSave={onSaveHotas}
        onRemove={onRemoveHotasModifier}
        onCancel={onCancelHotas}
      />
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
        onSave={onSaveMouse}
        onCancel={onCancelMouse}
      />
    )}

    {modalKey && (
      <BindModal
        keyId={modalKey}
        existingBindings={bindings}
        keyColor={keyColors[modalKey]}
        recentColors={recentColors}
        onColorChange={color => onColorChange(modalKey, color)}
        onSave={onSaveKey}
        onCancel={onCancelKey}
        settings={settings}
        formats={formats}
        activeIndex={activeIndex}
      />
    )}

    {showHelp && <HelpModal onClose={onCloseHelp} />}

    {showShare && <ShareModal url={shareUrl} onClose={onCloseShare} />}

    {pendingImport && (
      <ShareImportModal
        onDownload={onDownloadShared}
        onConfirm={onConfirmSharedImport}
        onCancel={onCancelSharedImport}
      />
    )}

    {showSettings && (
      <SettingsModal
        settings={settings}
        onClose={onCloseSettings}
        {...settingsModalProps}
      />
    )}

    {pendingLayout && (
      <OrphanWarningModal
        orphans={pendingLayout.orphans}
        newLayoutName={pendingLayout.name}
        language={settings.language}
        onConfirm={onConfirmLayoutChange}
        onCancel={onCancelLayoutChange}
      />
    )}

    {pendingMouseModel && (
      <OrphanWarningModal
        orphans={pendingMouseModel.orphans}
        newLayoutName={pendingMouseModel.name}
        bodyKeyOverride={pendingMouseModel.orphans.length === 1 ? 'mouseOrphanBodySingular' : 'mouseOrphanBodyPlural'}
        renderItem={(b, i) => (
          <div key={i} className="orphan-item">
            <span className="orphan-combo">{b.button}</span>
            <span className="orphan-arrow">→</span>
            <span className="orphan-action">{b.action}</span>
            {b._format && <span className="orphan-format">{b._format}</span>}
          </div>
        )}
        onConfirm={onConfirmMouseModelChange}
        onCancel={onCancelMouseModelChange}
      />
    )}

    {pendingHotasModel && (
      <OrphanWarningModal
        orphans={pendingHotasModel.orphans}
        newLayoutName={pendingHotasModel.name}
        bodyKeyOverride={pendingHotasModel.orphans.length === 1 ? 'hotasOrphanBodySingular' : 'hotasOrphanBodyPlural'}
        renderItem={(b, i) => (
          <div key={i} className="orphan-item">
            <span className="orphan-combo">{b.input}</span>
            <span className="orphan-arrow">→</span>
            <span className="orphan-action">{b.isHotasMod ? '[MODIFIER]' : b.action}</span>
            {b._format && <span className="orphan-format">{b._format}</span>}
          </div>
        )}
        onConfirm={onConfirmHotasModelChange}
        onCancel={onCancelHotasModelChange}
      />
    )}

    </Suspense>
    </ErrorBoundary>
  );
}
