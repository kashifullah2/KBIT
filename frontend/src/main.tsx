import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { initializeDiagnostics } from './lib/diagnostics'

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

// ✅ Initialize diagnostics to identify connection issues early
initializeDiagnostics(false).catch(console.error);

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// ✅ Register service worker for offline support and caching
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.log('Service Worker registration failed:', err);
    });
  });
}


