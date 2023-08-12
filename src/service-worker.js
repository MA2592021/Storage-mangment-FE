// service-worker.js

// Cache the offline page during installation
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("my-cache").then((cache) => {
      return cache.addAll(["/offline.html"]);
    })
  );
});

// Intercept network requests and respond with cached resources or the offline page
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      } else {
        return fetch(event.request).catch(() => {
          return caches.match("/offline.html");
        });
      }
    })
  );
});
