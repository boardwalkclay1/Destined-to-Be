// js/dashboard/dashboard.js
import { getState } from '../state.js';
import { applyTierToDom } from '../tier.js';

window.addEventListener('DOMContentLoaded', () => {
  safeApplyTier();
  hydrateTierPill();
  hydrateSubhead();
  wireNav();
});

function safeApplyTier() {
  try {
    if (typeof applyTierToDom === 'function') {
      applyTierToDom();
    }
  } catch (e) {
    // fail silently so nav still works
    console.warn('Tier apply failed:', e);
  }
}

function hydrateTierPill() {
  let state;
  try {
    state = getState();
  } catch {
    return;
  }

  const pill = document.getElementById('tier-pill');
  if (!pill) return;
  pill.textContent = state.tier === 'pro' ? 'Pro' : 'Free';
}

function hydrateSubhead() {
  let state;
  try {
    state = getState();
  } catch {
    return;
  }

  const sub = document.querySelector('.topbar-left .subhead');
  if (!sub) return;

  const name = state.user?.preferredName || state.user?.fullName;
  const lp = state.numbers?.lifePath?.value;

  if (name && lp) {
    sub.textContent = `${name} • Life Path ${lp}`;
  } else if (name) {
    sub.textContent = `${name} • Dashboard`;
  } else {
    sub.textContent = 'Numerology OS Dashboard';
  }
}

function wireNav() {
  document.querySelectorAll('[data-nav]').forEach(el => {
    el.addEventListener('click', () => {
      const target = el.getAttribute('data-nav');
      if (!target) return;
      window.location.href = target;
    });
  });
}
