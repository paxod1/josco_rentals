import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Mark bundle as loaded for recovery script
window.__MAIN_BUNDLE_LOADED__ = true;

import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { store } from './store/store.js'
import GlobalErrorBoundary from './components/global/GlobalErrorBoundary.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GlobalErrorBoundary>
      <Provider store={store}>
        <App />
      </Provider>
    </GlobalErrorBoundary>
  </StrictMode>,
)
// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
      })
      .catch(registrationError => {
      });
  });
}
