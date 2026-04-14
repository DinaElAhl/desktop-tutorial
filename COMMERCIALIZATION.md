# Commercialization Guide — E² Teaching Framework

This guide walks you through every path to selling your app: as a PWA from
your own website, in the Apple App Store, Google Play Store, Microsoft Store,
and as desktop apps for Mac/Windows/Linux.

Pick the path that matches your ambition and budget. They are **additive** —
you can start with (1) and add the others later without rebuilding anything.

---

## What's already wired up

Your repo now has all of the scaffolding you need:

| Capability            | Files                                    | Status |
| --------------------- | ---------------------------------------- | ------ |
| PWA manifest + icons  | `manifest.webmanifest`, `icons/*`        | ✅     |
| Offline support       | `service-worker.js`, `pwa.js`            | ✅     |
| Install prompt (all OS)| `pwa.js`                                | ✅     |
| License-key gate      | `license.js`                             | ✅ (opt-in) |
| iOS + Android wrapper | `capacitor.config.json`, `package.json`  | ✅     |
| Desktop wrapper       | `src-tauri/*`                            | ✅     |
| Privacy policy draft  | `PRIVACY.md`                             | ✅     |
| EULA draft            | `EULA.md`                                | ✅     |

---

## Path 1 — Sell as a PWA from your own website 🟢

**Cost:** $0 platform fees. Only payment processor (~3% via Gumroad/Stripe).
**Time:** ~1 hour after this setup.
**Where it lives:** Any hosting that serves static files (GitHub Pages,
Netlify, Cloudflare Pages, Vercel — all free).

### Step 1 — Host it publicly

Choose one:
- **GitHub Pages** (free, you already have a repo):
  1. On github.com, go to `Settings → Pages`
  2. Source: `Deploy from a branch` → `main` → `/ (root)` → Save
  3. Wait 1 minute; your app will be at `https://dinaelahl.github.io/desktop-tutorial/`
- **Netlify Drop** (drag-and-drop, no git): https://app.netlify.com/drop
- **Cloudflare Pages**: connect the GitHub repo at https://dash.cloudflare.com/

### Step 2 — Set up Gumroad for license keys

1. Create an account at https://gumroad.com
2. New product → "Digital product" → "Software license key"
3. Enable **"Generate a unique license key for each sale"**
4. Price it (e.g. $9.99 one-time or $2.99/mo)
5. Copy the **product permalink** (the short code at end of URL, e.g. `abcde`)

### Step 3 — Turn on the license gate

Open `license.js` and edit the `CONFIG` block at the top:

```js
const CONFIG = {
  PURCHASE_URL: 'https://gumroad.com/l/abcde',      // ← your permalink
  SUPPORT_EMAIL: 'you@yourdomain.com',              // ← your email
  PROVIDER_KIND: 'gumroad',
  PROVIDER: {
    GUMROAD_PRODUCT_ID: 'abcde',                    // ← same permalink
    // ...
  },
};
```

Then add this line **just before `</body>`** in every HTML file (same spot where
`pwa.js` is included):

```html
<script src="license.js" defer></script>
```

That's it. Trial users get 7 days free, then are prompted to buy or enter a key.

### Step 4 — Sell it

- Share the hosted URL on your teaching Instagram / LinkedIn / teacher FB groups
- Customers buy through Gumroad → get email with key → enter in the app → unlocked forever
- Gumroad keeps ~10%, you get the rest directly to your bank

---

## Path 2 — Google Play Store + Microsoft Store (via PWA Builder) 🟡

**Cost:** $25 (Google) + $19 (Microsoft) one-time registration.
**Time:** One weekend.
**Apple note:** Apple rejects PWA-only submissions. For iOS, use Path 3.

### Step 1 — Publish to Google Play
1. Register at https://play.google.com/console ($25)
2. Go to https://www.pwabuilder.com — paste your hosted URL (from Path 1)
3. Click **"Store Package" → "Android"** → download the `.aab` file
4. On Play Console: New app → Upload the `.aab` to internal testing
5. Complete the content rating form, target audience, data safety form
6. Upload 2 phone screenshots + feature graphic (1024×500) — use your own
7. Submit for review (1–3 days)

### Step 2 — Publish to Microsoft Store
1. Register at https://partner.microsoft.com/dashboard ($19 individual)
2. PWA Builder → **"Store Package" → "Windows"** → download `.msixbundle`
3. On Partner Center: New app → Upload the `.msixbundle`
4. Submit for review (24–72h)

---

## Path 3 — Apple App Store (iOS) + Google Play (via Capacitor) 🔴

**Cost:** $99/year (Apple) + $25 one-time (Google).
**Time:** Several weeks including review iterations.
**Critical:** Apple rejects apps that are "just a website". Your PWA wrapper
must feel like a real app. The steps below include the minimum changes
Apple requires.

### Prerequisites — install these on a **Mac** (required for iOS):
- Xcode (free, from App Store)
- Node.js 20+
- CocoaPods: `sudo gem install cocoapods`
- Apple Developer account: https://developer.apple.com/programs/ ($99/yr)

### Step 1 — Install Capacitor deps (in the project folder)
```bash
cd desktop-tutorial
npm install
```

### Step 2 — Add platforms
```bash
npx cap add ios
npx cap add android
npx cap sync
```

This creates `ios/` and `android/` directories with native projects.

### Step 3 — Disable the license gate (the stores collect payment instead)

In every HTML file, **before** the license.js script, add:
```html
<script>window.E2_LICENSE_DISABLED = true;</script>
```

Or don't include `license.js` at all in the store-build variant.

### Step 4 — Apple App Review essentials

Apple rejects PWAs that feel like websites. To pass review:
1. Add at least **one native-only feature** — e.g. a "Share my lesson plan"
   button that uses iOS's native share sheet via `@capacitor/share`
2. Remove the "Install App" button on iOS (it's redundant inside a native app)
3. Add a proper privacy policy URL (use your hosted `PRIVACY.md`)
4. Fill the **App Privacy** questionnaire honestly (you store data in local
   browser storage → select "Data not collected" if you don't have analytics)
5. Use the apple developer portal to generate certificates; `npx cap open ios`
   opens Xcode where you archive + upload to App Store Connect

### Step 5 — In-app purchase (if selling)

For subscription or one-time purchase, use `@capacitor/app` + a community
plugin like `cordova-plugin-purchase`. Apple requires you use their billing;
you **cannot** link to Gumroad from the iOS app.

### Step 6 — Submit

- **iOS:** Xcode → Product → Archive → Distribute → App Store Connect →
  fill listing → submit for review (typically 24–48h)
- **Android:** `npx cap open android` → Android Studio → Build → Generate
  Signed Bundle → upload to Play Console → submit

---

## Path 4 — Desktop apps (Mac/Windows/Linux via Tauri) 🔴

**Cost:** Free to build. Optional: $99/yr (Apple) for Mac App Store,
$19 (Microsoft) for Microsoft Store. Direct download = $0.
**Time:** A weekend.

### Prerequisites (any desktop OS):
- Rust: https://rustup.rs/
- Tauri CLI: `cargo install tauri-cli --version "^2"`
- Node 20+
- Platform tooling:
  - **Mac:** Xcode Command Line Tools
  - **Windows:** WebView2 Runtime + MSVC Build Tools
  - **Linux:** `libgtk-3-dev libwebkit2gtk-4.1-dev`

### Build
```bash
cd desktop-tutorial
npm install
cargo tauri dev     # live-preview the desktop app
cargo tauri build   # produces installers in src-tauri/target/release/bundle/
```

You'll get:
- **Mac:** `.dmg` and `.app` bundle
- **Windows:** `.msi` and `.exe` installer
- **Linux:** `.deb` and `.AppImage`

### Distribution options
1. **Direct download** from your website → cheapest; you link to the installer
2. **Mac App Store** → sign with Apple Developer ID, notarize, submit
3. **Microsoft Store** → package as MSIX, submit
4. **Homebrew / Chocolatey** → community package managers (free, optional)

### Code signing (strongly recommended)
Unsigned apps show scary security warnings. Get:
- **Mac:** Developer ID Application certificate (from Apple Developer Portal)
- **Windows:** Code Signing Certificate from DigiCert/Sectigo (~$100–300/yr)
  or use Azure Trusted Signing (pay-per-use)

---

## Legal + business essentials (required for ALL paths)

### Before your first paid sale
- [ ] **Business entity** — Sole proprietorship is fine to start; LLC
      protects personal assets. Check local rules.
- [ ] **Tax** — Gumroad/Stripe/Apple all require a W-9 (US) or W-8BEN
      (non-US). You'll owe income tax on profit.
- [ ] **Privacy policy** — `PRIVACY.md` in this repo. Host it at a public URL.
- [ ] **Terms of service / EULA** — `EULA.md` in this repo. Host publicly.
- [ ] **GDPR** — If any EU customer can buy, disclose data collection and
      offer deletion. The template in `PRIVACY.md` covers the basics.
- [ ] **Refund policy** — Apple/Google handle refunds for store sales. For
      Gumroad, set your own (e.g. 14-day no-questions refund).

### Pricing ideas (research comparable products)
- **One-time**: $4.99 / $9.99 / $14.99 / $19.99 — classic "paid app" feel
- **Subscription**: $2.99/mo or $19.99/yr — if you'll ship regular updates
- **Freemium**: free basic + $4.99 one-time to unlock Blueprint + Rubrics
- **Bundle**: $29 "Lifetime — all future updates" — teachers love this

### Marketing channels that work for teachers
- TeachersPayTeachers (if your audience is there)
- Teacher-focused subreddits: r/Teachers, r/Professors
- Education Twitter/X and LinkedIn
- Instagram: short demo videos
- Teacher Facebook groups (be genuine — don't just drop links)
- Product Hunt launch

---

## Development commands — quick reference

```bash
# Install deps
npm install

# Run the app locally (just static HTML)
npm run serve              # http://localhost:8080

# Regenerate icons after editing the generator script
npm run icons

# Capacitor (after iOS/Android platforms added)
npm run cap:add:ios
npm run cap:add:android
npm run cap:sync           # sync web changes to native projects
npm run cap:open:ios       # open Xcode
npm run cap:open:android   # open Android Studio

# Tauri desktop
npm run tauri:dev
npm run tauri:build
```

---

## Recommended rollout order (my honest take)

1. **This week:** Deploy Path 1 (PWA on GitHub Pages/Netlify). Share with 10
   teachers you know. See if anyone installs or buys.
2. **If 3+ people pay:** Add Path 2 (Google Play + Microsoft Store via PWA
   Builder). Low marginal cost, wider reach.
3. **If revenue ≥ $500:** Add Path 3 (Apple App Store via Capacitor). This
   is where Apple's 30% cut starts stinging, but iOS users prefer the App Store.
4. **If you want bundled school sales:** Add Path 4 (desktop apps). Schools
   often deploy desktop software fleet-wide.

**Don't skip step 1.** Validation before investment is everything.

---

*Last updated: April 2026 · For help, see the README or contact your own support email.*
