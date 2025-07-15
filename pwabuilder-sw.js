importScripts('cache-list.js');

const CACHE_STORAGE_NAME = 'enchant_moriy_v8';//カウントアップする

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_STORAGE_NAME)
    .then(function(cache) {
      return cache.addAll(files_to_cache);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
    .then(function(response) {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName !== CACHE_STORAGE_NAME;
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});