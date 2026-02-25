/* Simple service worker: cache-first for static assets and main routes. */
const CACHE_NAME = "ai-quest-v1";
const URLS_TO_CACHE = [
  "/",
  "/learn",
  "/profile",
  "/settings",
  "/daily",
  "/manifest.json",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(URLS_TO_CACHE).catch(() => {
        /* Some URLs may fail in dev; ignore. */
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) => {
      return Promise.all(
        names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        const clone = response.clone();
        if (response.status === 200 && request.method === "GET") {
          if (url.pathname.startsWith("/_next/") || url.pathname.startsWith("/sfx/") || url.pathname === "/manifest.json") {
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
        }
        return response;
      }).catch(() => {
        if (request.mode === "navigate") {
          return caches.match("/") || caches.match("/learn") || new Response("Offline", { status: 503, statusText: "Offline" });
        }
        return new Response("", { status: 503 });
      });
    })
  );
});
