/*
 * E² Teaching Framework — PWA bootstrap
 * - Registers the service worker
 * - Captures the 'beforeinstallprompt' event and exposes an install button
 * - Shows a friendly iOS "Add to Home Screen" hint (Safari doesn't fire beforeinstallprompt)
 * - Emits a small toast when a new version has been installed
 *
 * Drop into any page with: <script src="./pwa.js" defer></script>
 */
(function () {
  'use strict';

  const TERRA = '#C1694F';
  const CREAM = '#FFF8F0';

  // ─── Register the service worker ─────────────────────────────────────
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('./service-worker.js', { scope: './' })
        .then((registration) => {
          registration.addEventListener('updatefound', () => {
            const newSW = registration.installing;
            if (!newSW) return;
            newSW.addEventListener('statechange', () => {
              if (
                newSW.state === 'installed' &&
                navigator.serviceWorker.controller
              ) {
                showToast('New version ready — reload to update.', () => {
                  newSW.postMessage('SKIP_WAITING');
                  window.location.reload();
                });
              }
            });
          });
        })
        .catch((err) => console.warn('[PWA] SW registration failed:', err));
    });
  }

  // ─── Installability ──────────────────────────────────────────────────
  let deferredPrompt = null;

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event;
    mountInstallButton();
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    hideInstallButton();
    showToast('Installed. Open from your home screen anytime.');
  });

  // iOS Safari doesn't fire beforeinstallprompt — detect and show a hint
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const isInStandalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;
  if (isIOS && !isInStandalone) {
    // Show an install hint once per session
    if (!sessionStorage.getItem('e2_ios_hint_shown')) {
      setTimeout(() => {
        showIOSInstallHint();
        sessionStorage.setItem('e2_ios_hint_shown', '1');
      }, 3000);
    }
  }

  // ─── UI helpers ──────────────────────────────────────────────────────
  function mountInstallButton() {
    if (document.getElementById('pwa-install-btn')) return;
    const btn = document.createElement('button');
    btn.id = 'pwa-install-btn';
    btn.type = 'button';
    btn.innerHTML = '⬇ Install App';
    Object.assign(btn.style, {
      position: 'fixed',
      right: '16px',
      bottom: 'calc(16px + env(safe-area-inset-bottom, 0px))',
      zIndex: '9999',
      background: TERRA,
      color: CREAM,
      border: 'none',
      borderRadius: '999px',
      padding: '12px 20px',
      fontSize: '0.9rem',
      fontWeight: '600',
      fontFamily: 'Inter, system-ui, sans-serif',
      boxShadow: '0 6px 20px rgba(193,105,79,0.4)',
      cursor: 'pointer',
      letterSpacing: '0.2px',
    });
    btn.addEventListener('click', async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') hideInstallButton();
      deferredPrompt = null;
    });
    document.body.appendChild(btn);
  }

  function hideInstallButton() {
    const el = document.getElementById('pwa-install-btn');
    if (el) el.remove();
  }

  function showIOSInstallHint() {
    if (document.getElementById('ios-install-hint')) return;
    const hint = document.createElement('div');
    hint.id = 'ios-install-hint';
    hint.innerHTML =
      '<div style="flex:1">📱 Add to Home Screen: tap <strong>Share</strong> → <strong>Add to Home Screen</strong></div>' +
      '<button style="background:transparent;border:none;color:#FFF8F0;font-size:1.4rem;cursor:pointer;padding:0 4px;line-height:1" aria-label="Dismiss">×</button>';
    Object.assign(hint.style, {
      position: 'fixed',
      left: '12px',
      right: '12px',
      bottom: 'calc(12px + env(safe-area-inset-bottom, 0px))',
      zIndex: '9999',
      background: TERRA,
      color: CREAM,
      borderRadius: '12px',
      padding: '14px 16px',
      fontSize: '0.85rem',
      fontFamily: 'Inter, system-ui, sans-serif',
      boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      lineHeight: '1.4',
    });
    hint.querySelector('button').addEventListener('click', () => hint.remove());
    document.body.appendChild(hint);
    setTimeout(() => hint.remove(), 10000);
  }

  function showToast(message, onClick) {
    const toast = document.createElement('div');
    toast.textContent = message;
    Object.assign(toast.style, {
      position: 'fixed',
      left: '50%',
      transform: 'translateX(-50%)',
      bottom: 'calc(80px + env(safe-area-inset-bottom, 0px))',
      zIndex: '10000',
      background: '#3D2B1F',
      color: CREAM,
      padding: '12px 18px',
      borderRadius: '999px',
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: '0.85rem',
      boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
      cursor: onClick ? 'pointer' : 'default',
      maxWidth: 'calc(100vw - 32px)',
      textAlign: 'center',
    });
    if (onClick) toast.addEventListener('click', onClick);
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 6000);
  }
})();
