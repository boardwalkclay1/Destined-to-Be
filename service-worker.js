const CACHE_NAME = "destined-cache-v4";

const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/styles/styles.css",
  "/app.js",

  // Icons (safe mode: load individually)
  "/icons/icon-192.png",
  "/icons/numbers.jpg",
  "/icons/daily-energy.jpg",
  "/icons/vibration.jpg",
  "/icons/journal.jpg",
  "/icons/readinngs.jpg",
  "/icons/Compatibility.jpg",
  "/icons/spirit-guide.jpg",
  "/icons/sacred-geometry.jpg",
  "/icons/meanings.jpg"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      for (const file of FILES_TO_CACHE) {
        try {
          await cache.add(file);
        } catch (err) {
          console.warn("Skipping missing file:", file);
        }
      }
    })
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => key !== CACHE_NAME && caches.delete(key)))
    )
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(res => res || fetch(event.request))
  );
});
