const cacheName = 'quotative-v1';
const staticAssets = [
    './',
    './assets/Bubble.js',
    './assets/validation.js',
    './assets/pic/logo512.png',
    './assets/pic/logo192.png',
    './first-login.js',
    './login.js',
    './main.js',
    './manifest.webmanifest',
    './myprofile.js',
    './myprofile.css',
    './quotes.js',
    './register.js',
    './register_sw.js',
    './cards.js',
    './style.css',
    './sw.js',
    './user.css',
    './welcome.css',
    './welcome.js'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(staticAssets);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    fetch(event.request).catch(function() {
      return caches.match(event.request);
    })
  );
});