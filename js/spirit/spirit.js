// js/spirit/spirit.js
import { getState } from '../state.js';
import { isPro } from '../tier.js';

window.addEventListener('DOMContentLoaded', () => {
  wireSpirit();
});

function wireSpirit() {
  const focusEl = document.getElementById('guide-focus') || document.getElementById('spirit-focus');
  const askBtn = document.getElementById('ask-guide') || document.getElementById('btn-spirit-ask');
  const output = document.getElementById('guide-output') || document.getElementById('spirit-response');

  if (!focusEl || !askBtn || !output) return;

  askBtn.addEventListener('click', () => {
    const mode = focusEl.value;
    const state = getState();
    const response = buildGuideResponse(mode, state);
    output.innerHTML = response;
  });
}

function buildGuideResponse(mode, state) {
  const { user, numbers } = state;

  switch (mode) {
    case 'tour':
      return `
        <p>Here’s your map:</p>
        <ul>
          <li><strong>Dashboard</strong> shows your highlights and daily tip.</li>
          <li><strong>Profile</strong> stores your name, birthdate, and context.</li>
          <li><strong>Numbers</strong> is your full numerology map.</li>
          <li><strong>Readings</strong> turns your numbers into stories.</li>
          <li><strong>Learn</strong> teaches you what each number means.</li>
        </ul>
      `;
    case 'numbers':
      return `
        <p>Your Life Path is ${numbers.lifePath?.value ?? '…'} — your core road.</p>
        <p>Your Expression is ${numbers.expression?.value ?? '…'} — how you build in the world.</p>
        <p>Your Soul Urge is ${numbers.soul?.value ?? '…'} — what you actually crave.</p>
        ${!isPro() ? '<p>Unlock Pro to see your full destiny map.</p>' : ''}
      `;
    case 'decision':
      return `
        <p>For decisions, look at your current Personal Year ${
          numbers.personalYear?.value ?? '…'
        } and ask:</p>
        <p>“Does this move match the theme of this year, or fight it?”</p>
        ${!isPro() ? '<p>Pro gives you a full year roadmap.</p>' : ''}
      `;
    case 'stuck':
      return `
        <p>When you feel stuck, your challenge often mirrors a karmic lesson or current cycle.</p>
        <p>Re-read your challenge and goal in your profile, then check your Life Path and Personal Year.</p>
      `;
    case 'path':
      return `
        <p>Your bigger path is a blend of your Life Path ${
          numbers.lifePath?.value ?? '…'
        } and Expression ${numbers.expression?.value ?? '…'}.</p>
        <p>Life Path is the road. Expression is the vehicle. Soul Urge is the fuel.</p>
      `;
    default:
      return '<p>The Guide is listening, but needs a focus.</p>';
  }
}
