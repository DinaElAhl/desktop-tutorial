/*
 * E² Teaching Framework — Service Worker
 * Provides offline support and fast repeat loads.
 *
 * Strategy:
 *   - Pre-cache the app shell on install
 *   - Network-first for navigations (so users get updates when online)
 *   - Cache-first for static assets (icons, fonts, manifest)
 *   - Fall back to cached shell when offline
 *
 * Bump CACHE_VERSION whenever you ship a breaking change and you want
 * to invalidate stale caches on user devices.
 */

const CACHE_VERSION = 'e2-v1.0.0';
const APP_SHELL_CACHE = `e2-shell-${CACHE_VERSION}`;
const RUNTIME_CACHE   = `e2-runtime-${CACHE_VERSION}`;

const APP_SHELL = [
  './',
  './index.html',
  './e2-complete-app.html',
  './e2-teaching-framework.html',
  './e2-lesson-planner.html',
  './e2-blueprint-planner.html',
  './e2-rubrics-assessment.html',
  './manifest.webmanifest',
  './license.js',
  './pwa.js',
  './icons/icon-48.png',
  './icons/icon-72.png',
  './icons/icon-96.png',
  './icons/icon-128.png',
  './icons/icon-144.png',
  './icons/icon-152.png',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/maskable-512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon.ico',
];

// ─── Install: pre-cache the app shell ─────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(APP_SHELL_CACHE).then((cache) => {
      // addAll is atomic — if any fail, nothing is cached.
      // Use individual adds with catch so a single missing asset doesn't break install.
      return Promise.all(
        APP_SHELL.map((url) =>
          cache.add(url).catch((err) => {
            console.warn('[SW] Skipping pre-cache for', url, err.message);
          })
        )
      );
    })
  );
  self.skipWaiting();
});

// ─── Activate: purge old caches ───────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== APP_SHELL_CACHE && k !== RUNTIME_CACHE)
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// ─── Fetch: strategy per request type ─────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle GET
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Skip cross-origin requests we don't control (fonts.googleapis etc. handled below)
  const isSameOrigin = url.origin === self.location.origin;
  const isGoogleFonts =
    url.hostname === 'fonts.googleapis.com' ||
    url.hostname === 'fonts.gstatic.com';

  // Navigations → network-first, fall back to cached shell
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() =>
          caches.match(request).then(
            (cached) => cached || caches.match('./index.html')
          )
        )
    );
    return;
  }

  // Same-origin static assets → cache-first
  if (isSameOrigin) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request)
          .then((response) => {
            if (!response || response.status !== 200 || response.type === 'opaque') {
              return response;
            }
            const copy = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
            return response;
          })
          .catch(() => cached);
      })
    );
    return;
  }

  // Google Fonts → stale-while-revalidate
  if (isGoogleFonts) {
    event.respondWith(
      caches.open(RUNTIME_CACHE).then((cache) =>
        cache.match(request).then((cached) => {
          const network = fetch(request)
            .then((response) => {
              cache.put(request, response.clone());
              return response;
            })
            .catch(() => cached);
          return cached || network;
        })
      )
    );
    return;
  }

  // Everything else: try network, fall back to cache
  event.respondWith(fetch(request).catch(() => caches.match(request)));
});

// Allow the page to trigger immediate activation after update.
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
