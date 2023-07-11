
const cacheName = 'cache-v1';

const precacheResources = [
            '/',
            'index.html',
            'manifest.json',
            'sw.js',
            'BluetoothTerminal.js',
            'main.js',
            'normalize.css',
            'styles.css',
            'favicon.ico',
            'favicon-16x16.png',
            'favicon-32x32.png',
            ];

self.addEventListener('install', (event) => {
  console.log('sw.js: install event');
  event.waitUntil(caches.open(cacheName).then((cache) => cache.addAll(precacheResources)));
});

self.addEventListener('activate', (event) => {
  console.log('sw.js: activate event');
});

self.addEventListener('fetch', (event) => {
  console.log('sw.js: fetch:', event.request.url);
  event.respondWith(caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;
      else return fetch(event.request);
    }),
  );
});
