// js/tier.js
import { getState, setTier } from './state.js';

export function getTier() {
  return getState().tier;
}

export function isPro() {
  return getTier() === 'pro';
}

export function applyTierToDom() {
  const tier = getTier();

  // Pills / labels
  const pill = document.querySelector('#tier-pill, #topbar-tier-pill, #settings-tier-label');
  if (pill) pill.textContent = tier === 'pro' ? 'Pro' : 'Free';

  // Lock / unlock pro-only sections
  document.querySelectorAll('.pro-only').forEach(el => {
    if (tier === 'pro') {
      el.classList.remove('locked');
      el.classList.remove('hidden');
    } else {
      el.classList.add('locked');
    }
  });
}

export function unlockPro() {
  setTier('pro');
  applyTierToDom();
}
