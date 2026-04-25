import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 600,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_debugger: true,   // strip debugger statements
        passes: 2,             // two compression passes for better ratio
      },
      format: {
        comments: false,       // strip all comments from output
      },
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          // React + ReactDOM into a stable vendor chunk — browsers cache it
          // independently from app code, which changes more frequently.
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'react-vendor';
          }
        },
      },
    },
  },
});
