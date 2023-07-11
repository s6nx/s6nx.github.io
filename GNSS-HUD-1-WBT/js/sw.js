
const cacheName = 'cache-v1';

const precacheResources = [
            '/',
            'index.html',
            'manifest.json',
            'js/sw.js',
            'js/BluetoothTerminal.js',
            'js/main.js',
            'css/normalize.css',
            'css/styles.css',
            'img/favicon.ico',
            'img/favicon-16x16.png',
            'img/favicon-32x32.png',
            'img/android-chrome-144x144.png',
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
