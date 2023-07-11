
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
            'android-chrome-144x144.png',
            'browserconfig.xml',
            ];

self.addEventListener('install', (event) => {
  console.log('sw.js: install event');
  event.waitUntil(caches.open(cacheName).then((cache) => cache.addAll(precacheResources)));
});

self.addEventListener('activate', (event) => {
  console.log('sw.js: activate event');
});

self.addEventListener('fetch', (event) => {
  event.respondWith(caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        console.log('sw.js: cache:', event.request.url);
        return cachedResponse;
      }
      else {
        console.log('sw.js: fetch:', event.request.url);
        event.waitUntil(caches.open(cacheName).then((cache) => cache.add(event.request.url)));
        return fetch(event.request);
      }
    }),
  );
});
