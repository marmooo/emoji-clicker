const CACHE_NAME = "2023-12-27 00:50";
const urlsToCache = [
  "/emoji-clicker/",
  "/emoji-clicker/index.js",
  "/emoji-clicker/ja/",
  "/emoji-clicker/ja/index.yomi",
  "/emoji-clicker/data/ja.csv",
  "/emoji-clicker/mp3/end.mp3",
  "/emoji-clicker/mp3/correct3.mp3",
  "/emoji-clicker/favicon/favicon.svg",
  "https://marmooo.github.io/yomico/yomico.min.js",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    }),
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    }),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName)),
      );
    }),
  );
});
