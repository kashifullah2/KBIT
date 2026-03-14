import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  build: {
    // ✅ Optimize build for production
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // ✅ Code splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'markdown': ['react-markdown', 'remark-gfm'],
          'animations': ['framer-motion'],
          'pdf': ['jspdf', 'html2canvas', 'pdf-lib'],
        },
      },
    },
    // ✅ Chunk size warning threshold
    chunkSizeWarningLimit: 500,
    sourcemap: false,
  },
  // ✅ Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'axios', 'zustand'],
  },
})
