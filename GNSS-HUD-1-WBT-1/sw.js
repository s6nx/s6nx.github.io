// Choose a cache name
const cacheName = 'cache-v1';

// List the files to precache
const precacheResources = [
            '/',
            '/browserconfig.xml',
            '/cli.js',
            '/css/normalize.css',
            '/css/styles.css',
            '/icons/android-chrome-144x144.png',
            '/icons/android-chrome-192x192.png',
            '/icons/android-chrome-256x256.png',
            '/icons/android-chrome-36x36.png',
            '/icons/android-chrome-384x384.png',
            '/icons/android-chrome-48x48.png',
            '/icons/android-chrome-512x512.png',
            '/icons/android-chrome-72x72.png',
            '/icons/android-chrome-96x96.png',
            '/icons/apple-touch-icon.png',
            '/icons/favicon.ico',
            '/icons/favicon-16x16.png',
            '/icons/favicon-32x32.png',
            '/icons/mstile-150x150.png',
            '/icons/mstile-310x150.png',
            '/icons/mstile-310x310.png',
            '/icons/mstile-70x70.png',
            '/icons/safari-pinned-tab.svg',
            '/index.html',
            '/js/BluetoothTerminal.js',
            '/js/companion.js',
            '/js/main.js',
            '/js/sw-toolbox.js',
            '/manifest.json',
            '/package.json',
            '/package-lock.json',
            '/scss/_buttons.scss',
            '/scss/_config.scss',
            '/scss/_general.scss',
            '/scss/_send-form.scss',
            '/scss/_terminal.scss',
            '/scss/_toolbar.scss',
            '/scss/styles.scss',
            '/sw.js'
];

// When the service worker is installing, open the cache and add the precache resources to it
self.addEventListener('install', (event) => {
  console.log('sw.js: install event');
  event.waitUntil(caches.open(cacheName).then((cache) => cache.addAll(precacheResources)));
});

self.addEventListener('activate', (event) => {
  console.log('sw.js: activate event');
});

// When there's an incoming fetch request, try and respond with a precached resource, otherwise fall back to the network
self.addEventListener('fetch', (event) => {
  console.log('sw.js: fetch:', event.request.url);
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request);
    }),
  );
});
