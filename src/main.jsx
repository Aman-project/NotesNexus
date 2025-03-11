import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import App from './App.jsx'
import './index.css'

// Unregister any existing service workers
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    for (const registration of registrations) {
      registration.unregister().then(success => {
        if (success) {
          console.log('Service worker unregistered successfully');
          // Clear caches
          if ('caches' in window) {
            caches.keys().then(cacheNames => {
              cacheNames.forEach(cacheName => {
                caches.delete(cacheName).then(() => {
                  console.log(`Cache ${cacheName} deleted`);
                });
              });
            });
          }
          // Reload the page after unregistering
          window.location.reload();
        }
      });
    }
  });
}

// Mount React App
createRoot(document.getElementById("root") || document.createElement('div')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
