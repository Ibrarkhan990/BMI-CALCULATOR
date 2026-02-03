const CACHE_NAME = 'bmi-app-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/StyleSheet.css',
  '/Script.js',
  '/manifest.json',
  '/icon1.png',
  '/icon2.png'
];

// Install Event - Cache Files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
});

// Fetch Event - Serve from Cache if offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});