/*
 * E² Teaching Framework — License Gate
 *
 * Purpose: lightweight client-side license activation for selling via
 *   Gumroad, Lemon Squeezy, or a simple self-hosted license endpoint.
 *
 * Features:
 *   - Free trial window (default 7 days) — customers can try before paying
 *   - Activation modal for entering a license key
 *   - Pluggable validator (Gumroad by default)
 *   - Offline-friendly: once activated, re-checks only every REVALIDATE_DAYS
 *   - Persists activation in localStorage
 *
 * ⚠ Client-side license gates deter casual piracy; they are NOT crack-proof.
 *    For higher assurance, host a small server that signs tokens.
 *
 * Quick start:
 *   1. Sell your app on Gumroad as a "License key enabled" product.
 *   2. Set PROVIDER.GUMROAD_PRODUCT_ID below to your product's permalink
 *      (the short permalink shown in Gumroad — NOT the product URL).
 *   3. Include on every page: <script src="./license.js" defer></script>
 *   4. Optionally replace "free trial" wording, links, and pricing in the modal.
 *
 * To disable the gate entirely (e.g. during store-app review), set
 *   window.E2_LICENSE_DISABLED = true  BEFORE this script runs.
 */
(function () {
  'use strict';

  // Easy off-switch for native store builds where the store handles payment
  if (window.E2_LICENSE_DISABLED === true) return;

  // ─── Configuration ────────────────────────────────────────────────────
  const CONFIG = {
    APP_NAME: 'E² Teaching Framework',
    TRIAL_DAYS: 7,
    REVALIDATE_DAYS: 14,
    PURCHASE_URL: 'https://gumroad.com/l/REPLACE_ME',
    SUPPORT_EMAIL: 'support@example.com',
    // Toggle between 'gumroad', 'lemonsqueezy', 'custom', or 'offline-key'
    PROVIDER_KIND: 'gumroad',
    PROVIDER: {
      // Gumroad: your product's short permalink, e.g. 'abcde'
      GUMROAD_PRODUCT_ID: 'REPLACE_ME',
      // Lemon Squeezy: your store slug + product id
      LEMON_STORE: 'REPLACE_ME',
      LEMON_PRODUCT_ID: 'REPLACE_ME',
      // Custom endpoint: POST {key} → { valid: true|false, customer?: '...' }
      CUSTOM_ENDPOINT: 'https://your-license-server.example.com/verify',
      // Offline keys: array of valid keys, hashed. Generate via scripts/hash-key.js
      OFFLINE_HASHED_KEYS: [],
    },
  };

  const STORAGE_KEY = 'e2_license_v1';
  const TERRA = '#C1694F';
  const CLAY = '#B7553B';
  const CREAM = '#FFF8F0';
  const BROWN = '#3D2B1F';

  // ─── State helpers ────────────────────────────────────────────────────
  function loadState() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch {
      return {};
    }
  }
  function saveState(patch) {
    const next = { ...loadState(), ...patch };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return next;
  }
  function daysSince(iso) {
    if (!iso) return Infinity;
    return (Date.now() - new Date(iso).getTime()) / 86400000;
  }
  function fmtDate(d) {
    return new Date(d).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  // ─── Validators ───────────────────────────────────────────────────────
  async function validateGumroad(key) {
    const url = 'https://api.gumroad.com/v2/licenses/verify';
    const body = new FormData();
    body.append('product_id', CONFIG.PROVIDER.GUMROAD_PRODUCT_ID);
    body.append('license_key', key);
    body.append('increment_uses_count', 'false');
    const res = await fetch(url, { method: 'POST', body });
    const data = await res.json().catch(() => ({}));
    return {
      valid: !!data.success,
      customer: data.purchase && data.purchase.email,
      raw: data,
    };
  }

  async function validateLemonSqueezy(key) {
    const res = await fetch(
      'https://api.lemonsqueezy.com/v1/licenses/validate',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ license_key: key }),
      }
    );
    const data = await res.json().catch(() => ({}));
    const valid =
      data.valid === true &&
      data.meta &&
      String(data.meta.product_id) === String(CONFIG.PROVIDER.LEMON_PRODUCT_ID);
    return { valid, customer: data.meta && data.meta.customer_email, raw: data };
  }

  async function validateCustom(key) {
    const res = await fetch(CONFIG.PROVIDER.CUSTOM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key }),
    });
    const data = await res.json().catch(() => ({}));
    return { valid: !!data.valid, customer: data.customer, raw: data };
  }

  async function validateOfflineKey(key) {
    // Hashes the key with SHA-256 and checks the list of approved hashes.
    const enc = new TextEncoder().encode(key.trim().toUpperCase());
    const digest = await crypto.subtle.digest('SHA-256', enc);
    const hex = [...new Uint8Array(digest)]
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    return {
      valid: CONFIG.PROVIDER.OFFLINE_HASHED_KEYS.includes(hex),
      raw: { hex },
    };
  }

  async function validate(key) {
    switch (CONFIG.PROVIDER_KIND) {
      case 'gumroad':
        return validateGumroad(key);
      case 'lemonsqueezy':
        return validateLemonSqueezy(key);
      case 'custom':
        return validateCustom(key);
      case 'offline-key':
        return validateOfflineKey(key);
      default:
        return { valid: false, raw: { error: 'unknown provider' } };
    }
  }

  // ─── Decide: gate, trial, or go ───────────────────────────────────────
  async function gateStartup() {
    const s = loadState();
    if (!s.firstSeen) saveState({ firstSeen: new Date().toISOString() });

    if (s.activated && s.key) {
      // Revalidate occasionally when online
      if (
        navigator.onLine &&
        daysSince(s.lastVerifiedAt) > CONFIG.REVALIDATE_DAYS
      ) {
        try {
          const r = await validate(s.key);
          if (r.valid) {
            saveState({ lastVerifiedAt: new Date().toISOString() });
          } else {
            saveState({ activated: false });
            return openModal({ reason: 'revalidation-failed' });
          }
        } catch {
          // Network error — let the user continue offline
        }
      }
      return; // ✅ fully activated
    }

    const inTrial = daysSince(s.firstSeen) < CONFIG.TRIAL_DAYS;
    if (inTrial) {
      showTrialBanner(
        CONFIG.TRIAL_DAYS - Math.floor(daysSince(s.firstSeen))
      );
      return;
    }

    // Trial expired → force activation
    openModal({ reason: 'trial-expired' });
  }

  // ─── UI ───────────────────────────────────────────────────────────────
  function showTrialBanner(daysLeft) {
    if (document.getElementById('e2-trial-banner')) return;
    const bar = document.createElement('div');
    bar.id = 'e2-trial-banner';
    bar.innerHTML = `
      <span>Free trial — <strong>${daysLeft} day${daysLeft === 1 ? '' : 's'} left</strong></span>
      <button type="button" id="e2-activate-link">Enter license key</button>
      <button type="button" id="e2-buy-link">Buy</button>
    `;
    Object.assign(bar.style, {
      position: 'sticky',
      top: '0',
      zIndex: '9998',
      background: BROWN,
      color: CREAM,
      padding: '8px 12px',
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: '0.82rem',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      justifyContent: 'center',
      flexWrap: 'wrap',
    });
    Array.from(bar.querySelectorAll('button')).forEach((b) => {
      Object.assign(b.style, {
        background: TERRA,
        border: 'none',
        color: CREAM,
        padding: '4px 10px',
        borderRadius: '999px',
        cursor: 'pointer',
        fontSize: '0.78rem',
        fontWeight: '600',
      });
    });
    document.body.prepend(bar);
    bar.querySelector('#e2-activate-link').onclick = () => openModal({});
    bar.querySelector('#e2-buy-link').onclick = () =>
      window.open(CONFIG.PURCHASE_URL, '_blank', 'noopener');
  }

  function openModal({ reason }) {
    if (document.getElementById('e2-license-modal')) return;

    const overlay = document.createElement('div');
    overlay.id = 'e2-license-modal';
    Object.assign(overlay.style, {
      position: 'fixed',
      inset: '0',
      background: 'rgba(61,43,31,0.82)',
      zIndex: '10000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'Inter, system-ui, sans-serif',
      backdropFilter: 'blur(4px)',
    });

    const mustActivate = reason === 'trial-expired' || reason === 'revalidation-failed';

    const headline = {
      'trial-expired': 'Your free trial has ended',
      'revalidation-failed': 'We couldn’t verify your license',
    }[reason] || 'Activate ' + CONFIG.APP_NAME;

    const card = document.createElement('div');
    Object.assign(card.style, {
      background: CREAM,
      borderRadius: '16px',
      maxWidth: '440px',
      width: '100%',
      padding: '28px 24px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
      color: BROWN,
    });
    card.innerHTML = `
      <div style="text-align:center;margin-bottom:16px">
        <div style="width:64px;height:64px;margin:0 auto 12px;background:linear-gradient(135deg,${TERRA},${CLAY});border-radius:16px;display:flex;align-items:center;justify-content:center;color:${CREAM};font-family:'Playfair Display',Georgia,serif;font-size:2rem;font-weight:700">E²</div>
        <h2 style="font-family:'Playfair Display',Georgia,serif;font-size:1.3rem;color:${CLAY};margin:0 0 6px">${headline}</h2>
        <p style="font-size:0.85rem;color:#7a5f52;margin:0">Enter the license key we emailed you after purchase, or get one now.</p>
      </div>
      <label style="display:block;font-size:0.8rem;margin-bottom:6px;font-weight:600">License key</label>
      <input type="text" id="e2-license-input" placeholder="XXXXXXXX-XXXXXXXX-XXXXXXXX-XXXXXXXX"
        autocapitalize="characters" autocomplete="off" spellcheck="false"
        style="width:100%;padding:12px 14px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:0.88rem;border:2px solid ${TERRA};border-radius:10px;background:white;color:${BROWN};box-sizing:border-box">
      <div id="e2-license-err" style="color:#b7553b;font-size:0.78rem;margin-top:8px;display:none"></div>
      <button type="button" id="e2-license-activate" style="margin-top:16px;width:100%;background:${TERRA};color:${CREAM};border:none;padding:13px;border-radius:10px;font-size:0.95rem;font-weight:600;cursor:pointer">Activate</button>
      <div style="display:flex;gap:10px;margin-top:10px">
        <a href="${CONFIG.PURCHASE_URL}" target="_blank" rel="noopener" style="flex:1;text-align:center;background:white;color:${TERRA};border:2px solid ${TERRA};padding:11px;border-radius:10px;font-size:0.85rem;font-weight:600;text-decoration:none">Buy a license →</a>
        ${mustActivate ? '' : `<button type="button" id="e2-license-later" style="flex:1;background:transparent;color:#7a5f52;border:2px solid #E9D9C9;padding:11px;border-radius:10px;font-size:0.85rem;cursor:pointer">Maybe later</button>`}
      </div>
      <p style="text-align:center;font-size:0.72rem;color:#9c8278;margin:14px 0 0">Need help? <a href="mailto:${CONFIG.SUPPORT_EMAIL}" style="color:${TERRA}">${CONFIG.SUPPORT_EMAIL}</a></p>
    `;
    overlay.appendChild(card);
    document.body.appendChild(overlay);

    const input = card.querySelector('#e2-license-input');
    const err = card.querySelector('#e2-license-err');
    const activate = card.querySelector('#e2-license-activate');
    const later = card.querySelector('#e2-license-later');

    async function doActivate() {
      const key = input.value.trim();
      if (key.length < 6) {
        err.textContent = 'Please enter a valid license key.';
        err.style.display = 'block';
        return;
      }
      activate.disabled = true;
      activate.textContent = 'Verifying…';
      err.style.display = 'none';
      try {
        const r = await validate(key);
        if (r.valid) {
          saveState({
            activated: true,
            key,
            customer: r.customer || null,
            activatedAt: new Date().toISOString(),
            lastVerifiedAt: new Date().toISOString(),
          });
          overlay.remove();
          const banner = document.getElementById('e2-trial-banner');
          if (banner) banner.remove();
        } else {
          err.textContent =
            'That key didn’t validate. Double-check it or contact support.';
          err.style.display = 'block';
          activate.disabled = false;
          activate.textContent = 'Activate';
        }
      } catch (e) {
        err.textContent =
          'Couldn’t reach the license server. Connect to the internet and try again.';
        err.style.display = 'block';
        activate.disabled = false;
        activate.textContent = 'Activate';
      }
    }

    activate.onclick = doActivate;
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') doActivate();
    });
    if (later) later.onclick = () => overlay.remove();
    setTimeout(() => input.focus(), 50);
  }

  // Expose a tiny API for your own "Account" UI
  window.E2License = {
    state: loadState,
    openModal: () => openModal({}),
    deactivate: () => {
      saveState({ activated: false, key: null });
    },
  };

  // Run after DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', gateStartup);
  } else {
    gateStartup();
  }
})();
