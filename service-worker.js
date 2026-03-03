// service-worker.js
const CACHE_NAME = "destined-cache-v1";

const FILES_TO_CACHE = [
  "/", 
  "/index.html",
  "/styles.css",
  "/app.js",

  // Icons
  "/icons/icon-192.png",
  "/icons/numbers.jpg",
  "/icons/daily-energy.jpg",
  "/icons/vibration.jpg",
  "/icons/journal.jpg",
  "/icons/readinngs.jpg",
  "/icons/Compatibility.jpg",
  "/icons/spirit-guide.jpg",
  "/icons/sacred-geometry.jpg",
  "/icons/meanings.jpg",

  // Core JS modules
  "/js/state.js",
  "/js/tier.js",

  // Pages
  "/login.html",
  "/signup.html",
  "/dashboard.html",
  "/number.html",
  "/spirit.html",
  "/daily_energy.html",
  "/compatibility.html",
  "/meanings.html",
  "/journal.html",
  "/reading.html",
  "/sacred-geometry.html"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
