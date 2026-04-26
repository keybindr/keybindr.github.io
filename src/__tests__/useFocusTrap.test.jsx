import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRef } from 'react';
import { useFocusTrap } from '../hooks/useFocusTrap';

// Minimal test component: renders a container with N focusable buttons.
function Trap({ onEscape, initialFocusIndex = null }) {
  const containerRef = useRef(null);
  const btnRefs = [useRef(null), useRef(null), useRef(null)];
  useFocusTrap(containerRef, {
    onEscape,
    initialFocusRef: initialFocusIndex !== null ? btnRefs[initialFocusIndex] : undefined,
  });
  return (
    <div ref={containerRef}>
      <button ref={btnRefs[0]}>First</button>
      <button ref={btnRefs[1]}>Middle</button>
      <button ref={btnRefs[2]}>Last</button>
    </div>
  );
}

describe('useFocusTrap', () => {
  it('focuses the first focusable element on mount by default', () => {
    render(<Trap />);
    expect(document.activeElement).toHaveTextContent('First');
  });

  it('focuses the initialFocusRef element when provided', () => {
    render(<Trap initialFocusIndex={1} />);
    expect(document.activeElement).toHaveTextContent('Middle');
  });

  it('Tab from the last element wraps back to the first', async () => {
    const user = userEvent.setup();
    render(<Trap />);
    screen.getByText('Last').focus();
    await user.tab();
    expect(document.activeElement).toHaveTextContent('First');
  });

  it('Shift+Tab from the first element wraps to the last', async () => {
    const user = userEvent.setup();
    render(<Trap />);
    screen.getByText('First').focus();
    await user.tab({ shift: true });
    expect(document.activeElement).toHaveTextContent('Last');
  });

  it('Escape calls the onEscape handler', async () => {
    const user = userEvent.setup();
    const onEscape = vi.fn();
    render(<Trap onEscape={onEscape} />);
    await user.keyboard('{Escape}');
    expect(onEscape).toHaveBeenCalledOnce();
  });

  it('does not call onEscape when no handler is provided', async () => {
    // Should not throw when Escape is pressed without an onEscape prop.
    const user = userEvent.setup();
    render(<Trap />);
    await expect(user.keyboard('{Escape}')).resolves.not.toThrow();
  });

  it('restores focus to the previously focused element on unmount', () => {
    const trigger = document.createElement('button');
    trigger.textContent = 'Trigger';
    document.body.appendChild(trigger);
    trigger.focus();

    const { unmount } = render(<Trap />);
    expect(document.activeElement).not.toBe(trigger); // trap took focus

    unmount();
    expect(document.activeElement).toBe(trigger);

    document.body.removeChild(trigger);
  });

  it('Tab inside the trap does not leave the container', async () => {
    const user = userEvent.setup();
    render(<Trap />);
    // Tab through all three buttons and verify focus stays inside
    await user.tab(); // First → Middle
    await user.tab(); // Middle → Last
    await user.tab(); // Last → First (wrapped)
    expect(document.activeElement).toHaveTextContent('First');
  });
});
