// js/dashboard/dashboard.js

// Minimal dashboard script for a simple readings-focused app.
// No state, no user data, no life path, no personalization.

window.addEventListener('DOMContentLoaded', () => {
  wireNav();
  setTierPill(); // optional: keeps the UI consistent
});

// --- TIER PILL (STATIC OR LOCAL STORAGE) ---
function setTierPill() {
  const pill = document.getElementById('tier-pill');
  if (!pill) return;

  // If you want it fully static, replace this with: pill.textContent = 'Free';
  const tier = localStorage.getItem('tier') || 'free';
  pill.textContent = tier === 'pro' ? 'Pro' : 'Free';
}

// --- NAVIGATION ---
function wireNav() {
  document.querySelectorAll('[data-nav]').forEach(el => {
    el.addEventListener('click', () => {
      const target = el.getAttribute('data-nav');
      if (target) window.location.href = target;
    });
  });
}
