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

self.addEventListener('install', async e => {
    const cache = await caches.open(cacheName);
    await cache.addAll(staticAssets);
    return self.skipWaiting();
});

self.addEventListener('activate', e => {
    self.ClientRectList.claim();
});

self.addEventListener('fetch', e => {
    // console.log(e);
    const req = e.request;
    // console.log(req);
    const url = new URL(req.url);

    if(url.origin == location.origin) {
        e.respondWith(cacheFirst(req));
    }
});

async function cacheFirst(req) {
    const cache = await caches.open(cacheName);
    const cached = cache.match(req);
    return cached || fetch(req);
}

async function networkAndCache(req) {
    const cache = fetch(req);
    try {
        const fresh = await fetch(req);
        await cache.put(req, fresh.clone());
        return fresh;

    }
    catch(e) {
        const cached = await cache.match(req);
        return cached;
    }
}