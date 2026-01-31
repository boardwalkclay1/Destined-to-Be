// js/spirit/spirit.js
import { getState } from '../state.js';
import { applyTierToDom } from '../tier.js';
import { generateGuideResponse } from './guide-engine.js';
import { setupGuideModes, collectExtraData } from './guide-modes.js';

document.addEventListener('DOMContentLoaded', () => {
  try {
    if (typeof applyTierToDom === 'function') applyTierToDom();
  } catch {}

  setupGuideModes();

  const askBtn = document.getElementById('ask-guide');
  const focusEl = document.getElementById('guide-focus');
  const outputEl = document.getElementById('guide-output');

  askBtn.addEventListener('click', () => {
    const focus = focusEl.value;
    let state = {};
    try {
      state = getState() || {};
    } catch {
      state = {};
    }

    const extra = collectExtraData();
    const text = generateGuideResponse(focus, { state, extra });

    outputEl.textContent = text;
  });
});
