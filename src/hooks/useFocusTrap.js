import { useEffect, useRef } from 'react';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

/**
 * Traps keyboard focus inside `containerRef.current` for the lifetime of the component.
 *
 * - Tab / Shift+Tab cycles through focusable descendants, wrapping at both ends.
 * - Escape calls `onEscape` if provided.
 * - On unmount, focus is restored to the element that had it when the trap mounted.
 *
 * Initial focus:
 * - If `initialFocusRef` is provided, that element is focused on mount.
 *   Skipped on touch devices to prevent the software keyboard from appearing
 *   when the target is a text input.
 * - Otherwise, the first focusable descendant is focused unconditionally.
 *
 * @param {React.RefObject} containerRef - The modal/dialog container element.
 * @param {{ onEscape?: () => void, initialFocusRef?: React.RefObject }} [options]
 */
export function useFocusTrap(containerRef, { onEscape, initialFocusRef } = {}) {
  // Keep onEscape current without re-registering the listener on every render.
  const onEscapeRef = useRef(onEscape);
  onEscapeRef.current = onEscape;

  useEffect(() => {
    const previouslyFocused = document.activeElement;

    // ── Initial focus ──────────────────────────────────────────────────────
    if (initialFocusRef?.current) {
      // Suppress auto-focus on touch devices to avoid popping up the software
      // keyboard when the target is a text input.
      if (!('ontouchstart' in window)) {
        initialFocusRef.current.focus();
      }
    } else {
      containerRef.current?.querySelector(FOCUSABLE_SELECTOR)?.focus();
    }

    // ── Keyboard handler ───────────────────────────────────────────────────
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        if (onEscapeRef.current) {
          e.preventDefault();
          onEscapeRef.current();
        }
        return;
      }

      if (e.key !== 'Tab') return;

      const container = containerRef.current;
      if (!container) return;

      const els   = Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR));
      if (els.length === 0) return;

      const first  = els[0];
      const last   = els[els.length - 1];
      const active = document.activeElement;

      // If focus escaped the trap (e.g. user clicked outside), pull it back.
      if (!container.contains(active)) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
        return;
      }

      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      // Restore focus to whatever held it before this modal opened.
      previouslyFocused?.focus?.();
    };
  // Empty deps: run once on mount. onEscape is kept current via ref above.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
