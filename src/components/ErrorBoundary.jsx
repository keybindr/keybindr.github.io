import React from 'react';

/**
 * React error boundary — catches render-time errors in its subtree so a crash
 * in one section of the UI doesn't blank the whole page.
 *
 * Props:
 *   fallback — What to render when an error is caught. Two forms are accepted:
 *     • A React node (static fallback UI).
 *     • A function `(error: Error, reset: () => void) => ReactNode` — useful
 *       when you want to show the error message or offer a dismiss/retry button.
 *
 * Example:
 *   <ErrorBoundary fallback={(err, reset) => (
 *     <div className="error-toast" onClick={reset}>{err.message}</div>
 *   )}>
 *     <ThingThatMightCrash />
 *   </ErrorBoundary>
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
    this.reset = this.reset.bind(this);
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('[keybindr] Uncaught render error:', error, info.componentStack);
  }

  reset() {
    this.setState({ error: null });
  }

  render() {
    if (this.state.error) {
      const { fallback } = this.props;
      if (typeof fallback === 'function') {
        return fallback(this.state.error, this.reset);
      }
      return fallback ?? null;
    }
    return this.props.children;
  }
}
