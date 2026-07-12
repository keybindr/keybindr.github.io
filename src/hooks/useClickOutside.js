import { useEffect, useRef } from 'react';

/**
 * Calls `onOutside` on the next mousedown outside `containerRef.current`.
 * Only listens while `active` is true (e.g. while a dropdown is open).
 * @param {React.RefObject} containerRef
 * @param {boolean} active
 * @param {() => void} onOutside
 */
export function useClickOutside(containerRef, active, onOutside) {
  // Keep onOutside current without re-registering the listener on every render.
  const onOutsideRef = useRef(onOutside);
  onOutsideRef.current = onOutside;

  useEffect(() => {
    if (!active) return;
    function onMouseDown(e) {
      if (!containerRef.current?.contains(e.target)) onOutsideRef.current();
    }
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [containerRef, active]);
}
