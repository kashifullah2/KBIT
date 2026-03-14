/**
 * Service Worker for offline support and caching
 * Place this file in /frontend/public/sw.js
 */

const CACHE_NAME = 'brain-half-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
      .catch((err) => console.log('Cache open failed:', err))
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - network first, fallback to cache
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // ✅ Skip all API calls - they should never be cached
  if (event.request.url.includes('/api/') ||
      event.request.url.includes('/chat') ||
      event.request.url.includes('/upload') ||
      event.request.url.includes('/token')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Don't cache error responses
        if (!response || response.status !== 200) {
          return response;
        }
        
        // Clone the response
        const clonedResponse = response.clone();

        // Cache the response for future use
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, clonedResponse);
        });

        return response;
      })
      .catch(() => {
        // Fall back to cache if network fails
        return caches.match(event.request)
          .then((response) => {
            return response || new Response('Offline - Resource not available', {
              status: 503,
              statusText: 'Service Unavailable',
            });
          });
      })
  );
});
