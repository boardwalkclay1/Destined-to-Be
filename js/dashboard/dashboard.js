// js/dashboard/dashboard.js
import { getState } from '../state.js';
import { applyTierToDom } from '../tier.js';

window.addEventListener('DOMContentLoaded', () => {
  applyTierToDom();
  hydrateTierPill();
  wireNav();
  hydrateQuickContext();
});

function hydrateTierPill() {
  const state = getState();
  const pill = document.getElementById('tier-pill');
  if (!pill) return;
  pill.textContent = state.tier === 'pro' ? 'Pro' : 'Free';
}

function wireNav() {
  document.querySelectorAll('[data-nav]').forEach(el => {
    el.addEventListener('click', () => {
      const target = el.getAttribute('data-nav');
      if (target) window.location.href = target;
    });
  });
}

function hydrateQuickContext() {
  // Optional: you can surface a tiny bit of state here later
  // (e.g., show name or life path in the topbar subtitle)
  const state = getState();
  const sub = document.querySelector('.topbar-left .subhead');
  if (!sub) return;

  const name = state.user?.preferredName || state.user?.fullName;
  const lp = state.numbers?.lifePath?.value;

  if (name && lp) {
    sub.textContent = `${name} • Life Path ${lp}`;
  } else if (name) {
    sub.textContent = `${name} • Dashboard`;
  }
}
