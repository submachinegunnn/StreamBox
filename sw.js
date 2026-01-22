const CACHE_NAME = "streambox-v1";

const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/search.html",
  "/episode.html",
  "/player.html",
  "/styles.css",
  "/app.js",
  "/search.js",
  "/episode.js",
  "/player.js",
  "/manifest.json"
];

/* Install */
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

/* Activate */
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_NAME)
          .map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

/* Fetch */
self.addEventListener("fetch", event => {
  const req = event.request;
  const url = new URL(req.url);

  // ❌ NEVER cache TMDB or Vidking
  if (
    url.hostname.includes("themoviedb.org") ||
    url.hostname.includes("vidking.net")
  ) {
    return;
  }

  // ✅ Cache-first for app shell
  event.respondWith(
    caches.match(req).then(cached => {
      return (
        cached ||
        fetch(req).then(res => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
          return res;
        })
      );
    })
  );
});
