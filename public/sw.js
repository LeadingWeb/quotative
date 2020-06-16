const cacheName = 'quotative-v1';
const assets = [
    './',
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

self.addEventListener('install', async e => {
    const cache = await caches.open(cacheName);
    await cache.addAll(staticAssets);
    return self.skipWaiting();
});

self.addEventListener('activate', e => {
    self.ClientRectList.claim();
})

