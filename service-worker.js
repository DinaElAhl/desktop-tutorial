/*
 * E² Teaching Framework — Service Worker v1.1.0
 * Provides offline support and fast repeat loads.
 *
 * Strategy:
 *   — Pre-cache the app shell on install
 *   — Network-first for navigations (so users get updates when online)
 *   — Cache-first for static assets (icons, fonts, manifest)
 *   — Fall back to cached shell when offline
 *
 * Bump CACHE_VERSION whenever you ship a breaking change
 * to invalidate stale caches on user devices.
 */

const CACHE_VERSION = 'e2-v1.1.0';
const SHELL_CACHE   = `e2-shell-${CACHE_VERSION}`;
const RUNTIME_CACHE = `e2-runtime-${CACHE_VERSION}`;

const APP_SHELL = [
  './',
  './index.html',
  './e2-complete-app.html',
  './e2-teaching-framework.html',
  './e2-lesson-planner.html',
  './e2-blueprint-planner.html',
  './e2-rubrics-assessment.html',
  './e2-app-standalone.html',
  './manifest.webmanifest',
  './license.js',
  './pwa.js',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/maskable-512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon.ico',
];

// ── Install: pre-cache the app shell ─────────────────────────────
self.addEventListener('install', (event) => {
  self.skipWaiting(); // activate new SW immediately
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => {
      // addAll is atomic — if any fail, nothing is cached.
      // Use individual adds with catch so a single missing asset
      // doesn't break install.
      return Promise.all(
        APP_SHELL.map((url) =>
          cache.add(url).catch((err) => {
            console.warn('[SW] Failed to pre-cache:', url, err);
          })
        )
      );
    })
  );
});

// ── Activate: clean up old caches ────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k !== SHELL_CACHE && k !== RUNTIME_CACHE)
            .map((k) => {
              console.log('[SW] Deleting old cache:', k);
              return caches.delete(k);
            })
        )
      )
      .then(() => self.clients.claim())
  );
});

// ── Fetch: serve from cache, fall back to network ────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin requests
  if (url.origin !== location.origin) return;

  // Navigation requests: network-first, fall back to cached shell
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(SHELL_CACHE).then((c) => c.put(request, clone));
          }
          return response;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Static assets: cache-first
  if (
    url.pathname.startsWith('/icons/') ||
    url.pathname.startsWith('/fonts/') ||
    url.pathname.endsWith('.webmanifest') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.js')
  ) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            if (response.ok) {
              const clone = response.clone();
              caches.open(RUNTIME_CACHE).then((c) => c.put(request, clone));
            }
            return response;
          })
      )
    );
    return;
  }

  // Everything else: network-first with runtime cache fallback
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(RUNTIME_CACHE).then((c) => c.put(request, clone));
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});
