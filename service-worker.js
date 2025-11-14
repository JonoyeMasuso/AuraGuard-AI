// A basic service worker for PWA functionality (caching and notifications)

const CACHE_NAME = 'patient-navigator-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  // Add other assets like icons, css, etc. that you want to cache
  '/logo192.png',
  '/logo512.png'
];

// Install the service worker and cache the static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Serve cached content when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Listener for push notifications (for future implementation)
self.addEventListener('push', event => {
  const data = event.data.json();
  const title = data.title || 'AuraGuard AI';
  const options = {
    body: data.body,
    icon: '/logo192.png',
    badge: '/logo192.png'
  };
  event.waitUntil(self.registration.showNotification(title, options));
});