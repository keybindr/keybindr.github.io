import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';

// Outer last-resort boundary: catches anything that escapes App's own boundary.
const crashFallback = (
  <div style={{ color: '#ffb3b3', padding: '40px', textAlign: 'center', fontFamily: 'system-ui' }}>
    <h2 style={{ marginBottom: '12px' }}>Something went wrong</h2>
    <p>Please refresh the page to recover your session.</p>
  </div>
);

createRoot(document.getElementById('root')).render(
  <ErrorBoundary fallback={crashFallback}>
    <App />
  </ErrorBoundary>
);
