// ========================================
// PREMIUM TIER LOGIC
// Feature gating and access control for E² Tools
// ========================================

const TIER_FEATURES = {
  free: {
    exportFormats: ['text'],
    maxSavedLessons: 3,
    maxSavedBlueprints: 1,
    maxSavedRubrics: 2,
    cloudSync: false,
    customTemplates: false,
    analyticsAccess: false,
    collaborationEnabled: false,
    aiSuggestions: false,
    subjectSuggestions: true,
    standardsAlignment: false,
    lmsIntegration: false,
    prioritySupport: false,
    customBranding: false
  },
  premium: {
    exportFormats: ['text', 'pdf', 'docx', 'html'],
    maxSavedLessons: -1,
    maxSavedBlueprints: -1,
    maxSavedRubrics: -1,
    cloudSync: true,
    customTemplates: true,
    analyticsAccess: false,
    collaborationEnabled: false,
    aiSuggestions: true,
    subjectSuggestions: true,
    standardsAlignment: true,
    lmsIntegration: false,
    prioritySupport: true,
    customBranding: false
  },
  school: {
    exportFormats: ['text', 'pdf', 'docx', 'html', 'xlsx', 'csv', 'json'],
    maxSavedLessons: -1,
    maxSavedBlueprints: -1,
    maxSavedRubrics: -1,
    cloudSync: true,
    customTemplates: true,
    analyticsAccess: true,
    collaborationEnabled: true,
    aiSuggestions: true,
    subjectSuggestions: true,
    standardsAlignment: true,
    lmsIntegration: true,
    prioritySupport: true,
    customBranding: true
  }
};

// ========================================
// TIER DETECTION & VALIDATION
// ========================================

function getCurrentTier() {
  // Check URL parameter first (from Pathways integration)
  const params = new URLSearchParams(window.location.search);
  const urlTier = params.get('tier');
  if (urlTier && TIER_FEATURES[urlTier]) {
    localStorage.setItem('e2_user_tier', urlTier);
    return urlTier;
  }
  
  // Check localStorage
  const stored = localStorage.getItem('e2_user_tier');
  if (stored && TIER_FEATURES[stored]) {
    return stored;
  }
  
  // Default to free
  return 'free';
}

function getTierFeatures(tier) {
  tier = tier || getCurrentTier();
  return TIER_FEATURES[tier] || TIER_FEATURES.free;
}

function hasFeature(featureName, tier) {
  const features = getTierFeatures(tier);
  return features[featureName] === true || features[featureName] === -1;
}

function canUseFeature(featureName, tier) {
  return hasFeature(featureName, tier);
}

// ========================================
// FEATURE GATING
// ========================================

function gateFeature(featureName, callback, options) {
  options = options || {};
  const tier = getCurrentTier();
  if (hasFeature(featureName, tier)) {
    callback();
  } else {
    showUpgradePrompt(featureName, options);
  }
}

function showUpgradePrompt(featureName, options) {
  options = options || {};
  const modal = document.createElement('div');
  modal.className = 'e2-upgrade-modal';
  modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;z-index:10000';
  
  const box = document.createElement('div');
  box.style.cssText = 'background:#fff;padding:2rem;border-radius:12px;max-width:500px;width:90%;text-align:center;box-shadow:0 10px 40px rgba(0,0,0,0.3)';
  
  const featureLabel = getFeatureLabel(featureName);
  box.innerHTML = `
    <h2 style="color:#C1694F;font-family:'Playfair Display',Georgia,serif;margin-bottom:1rem">Unlock Premium Feature</h2>
    <p style="margin-bottom:1rem;opacity:0.8">${featureLabel} is available in Premium and School plans.</p>
    <div style="background:#FAF0E6;padding:1rem;border-radius:8px;margin:1rem 0;text-align:left">
      <strong>Premium (Individual) includes:</strong>
      <ul style="margin-top:0.5rem;padding-left:1.5rem;font-size:0.9rem">
        <li>Unlimited saved lessons & rubrics</li>
        <li>PDF, Word & HTML export</li>
        <li>Cloud sync across devices</li>
        <li>Standards alignment tools</li>
        <li>AI-powered suggestions</li>
      </ul>
    </div>
    <div style="display:flex;gap:0.5rem;margin-top:1.5rem;justify-content:center;flex-wrap:wrap">
      <button onclick="this.closest('.e2-upgrade-modal').remove()" style="padding:0.75rem 1.5rem;background:#eee;border:none;border-radius:8px;cursor:pointer;font-family:inherit">Maybe Later</button>
      <a href="https://pathways-edu.netlify.app/" style="padding:0.75rem 1.5rem;background:#C1694F;color:#fff;border:none;border-radius:8px;cursor:pointer;text-decoration:none;font-family:inherit">Upgrade Now</a>
    </div>
  `;
  
  modal.appendChild(box);
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
  document.body.appendChild(modal);
}

function getFeatureLabel(featureName) {
  const labels = {
    exportFormats: 'Advanced Export Formats (PDF, Word, HTML)',
    cloudSync: 'Cloud Sync Across Devices',
    customTemplates: 'Custom Templates',
    analyticsAccess: 'Analytics Dashboard',
    collaborationEnabled: 'Team Collaboration',
    aiSuggestions: 'AI-Powered Suggestions',
    standardsAlignment: 'Standards Alignment',
    lmsIntegration: 'LMS Integration',
    prioritySupport: 'Priority Support',
    customBranding: 'Custom School Branding'
  };
  return labels[featureName] || 'This feature';
}

// ========================================
// LIMIT CHECKING (e.g., max saved items)
// ========================================

function checkLimit(limitName, currentCount, tier) {
  const features = getTierFeatures(tier);
  const limit = features[limitName];
  if (limit === -1) return { allowed: true, remaining: -1 };
  const allowed = currentCount < limit;
  const remaining = Math.max(0, limit - currentCount);
  return { allowed, remaining, limit };
}

// ========================================
// TIER BADGE UI
// ========================================

function renderTierBadge(tier, container) {
  tier = tier || getCurrentTier();
  const badges = {
    free: { label: 'Free', color: '#9E9E9E', bg: '#F5F5F5' },
    premium: { label: 'Premium', color: '#C1694F', bg: '#FAF0E6' },
    school: { label: 'School License', color: '#D4A843', bg: '#FFF8F0' }
  };
  const badge = badges[tier];
  if (!badge || !container) return;
  
  const el = document.createElement('span');
  el.style.cssText = `display:inline-block;padding:0.25rem 0.75rem;background:${badge.bg};color:${badge.color};border:1px solid ${badge.color};border-radius:100px;font-size:0.75rem;font-weight:600;letter-spacing:0.5px;text-transform:uppercase`;
  el.textContent = badge.label;
  container.appendChild(el);
}

// ========================================
// EXPORT FOR USE
// ========================================

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    TIER_FEATURES,
    getCurrentTier,
    getTierFeatures,
    hasFeature,
    canUseFeature,
    gateFeature,
    showUpgradePrompt,
    checkLimit,
    renderTierBadge
  };
}
