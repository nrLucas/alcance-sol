// Alcance Sol - Service Worker
// Offline-first PWA strategy

const CACHE_VERSION = "v1";
const CACHE_NAME = `alcance-sol-${CACHE_VERSION}`;

// Assets to cache immediately on install
const STATIC_ASSETS = ["/", "/login", "/home", "/report", "/history", "/contact", "/manifest.json", "/icons/icon-192x192.png", "/icons/icon-512x512.png"];

// Install event - cache static assets
self.addEventListener("install", (event) => {
    console.log("[SW] Installing...");

    event.waitUntil(
        caches
            .open(CACHE_NAME)
            .then((cache) => {
                console.log("[SW] Caching static assets");
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log("[SW] Install complete");
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error("[SW] Install failed:", error);
            }),
    );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
    console.log("[SW] Activating...");

    event.waitUntil(
        caches
            .keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter((name) => name.startsWith("alcance-sol-") && name !== CACHE_NAME)
                        .map((name) => {
                            console.log("[SW] Deleting old cache:", name);
                            return caches.delete(name);
                        }),
                );
            })
            .then(() => {
                console.log("[SW] Activate complete");
                return self.clients.claim();
            }),
    );
});

// Fetch event - network first with cache fallback for pages
// Stale-while-revalidate for assets
self.addEventListener("fetch", (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip cross-origin requests
    if (url.origin !== location.origin) {
        return;
    }

    // Skip API requests
    if (url.pathname.startsWith("/api/")) {
        return;
    }

    // Handle navigation requests (pages)
    if (request.mode === "navigate") {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    // Clone and cache the response
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, responseClone);
                    });
                    return response;
                })
                .catch(() => {
                    // Return cached version if network fails
                    return caches.match(request).then((cachedResponse) => {
                        if (cachedResponse) {
                            return cachedResponse;
                        }
                        // Fallback to home page
                        return caches.match("/");
                    });
                }),
        );
        return;
    }

    // Handle static assets - stale-while-revalidate
    if (request.destination === "script" || request.destination === "style" || request.destination === "image" || request.destination === "font") {
        event.respondWith(
            caches.open(CACHE_NAME).then((cache) => {
                return cache.match(request).then((cachedResponse) => {
                    const fetchPromise = fetch(request)
                        .then((networkResponse) => {
                            cache.put(request, networkResponse.clone());
                            return networkResponse;
                        })
                        .catch(() => cachedResponse);

                    return cachedResponse || fetchPromise;
                });
            }),
        );
        return;
    }

    // Default: network first with cache fallback
    event.respondWith(
        fetch(request)
            .then((response) => {
                const responseClone = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(request, responseClone);
                });
                return response;
            })
            .catch(() => {
                return caches.match(request);
            }),
    );
});

// Listen for messages from the app
self.addEventListener("message", (event) => {
    if (event.data && event.data.type === "SKIP_WAITING") {
        self.skipWaiting();
    }
});
