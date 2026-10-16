// Bump this string any time index.html (or any cached file) changes and gets
// redeployed — it's the only thing that makes the service worker fetch the
// new version instead of serving the old one forever from cache.
var CACHE_VERSION = "v1";
var CACHE_NAME = "edna-tracker-" + CACHE_VERSION;

var PRECACHE_URLS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png"
];

// On install: download and cache every file the app needs to run with zero
// network signal, then activate immediately instead of waiting for all tabs
// to close.
self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(PRECACHE_URLS);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

// On activate: delete any cache left over from a previous version, then take
// control of open pages right away.
self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (names) {
      return Promise.all(
        names
          .filter(function (name) { return name !== CACHE_NAME; })
          .map(function (name) { return caches.delete(name); })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

// Cache-first: serve from cache instantly (works offline), and only reach
// the network for anything not already cached. A successful network
// response is stored for next time.
self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then(function (cached) {
      if (cached) return cached;

      return fetch(event.request).then(function (response) {
        if (response && response.status === 200) {
          var copy = response.clone();
          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(event.request, copy);
          });
        }
        return response;
      }).catch(function () {
        // Offline and not cached (e.g. first-ever load of a page we don't
        // precache) — nothing sensible to return, let the fetch fail.
        return new Response("Offline and not cached yet.", {
          status: 503,
          statusText: "Offline"
        });
      });
    })
  );
});
