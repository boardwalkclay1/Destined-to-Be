// js/dashboard/dashboard.js
import { getState } from '../state.js';
import { applyTierToDom, isPro } from '../tier.js';

window.addEventListener('DOMContentLoaded', () => {
  applyTierToDom();
  renderDashboard();
});

function renderDashboard() {
  const state = getState();

  renderProfileCard(state);
  renderLifePathCard(state);
  renderDailyTip(state);
  renderCompletionStatus(state);
  renderProHints(state);
  renderAvatar(state);

  wireNavigation();
}

/* -------------------------------------------------------
   PROFILE CARD
------------------------------------------------------- */
function renderProfileCard(state) {
  const el = document.getElementById('profile-card');
  if (!el) return;

  const name = state.user.preferredName || state.user.fullName || 'Your Profile';

  const birth = state.user.birthdate
    ? `Born ${state.user.birthdate}`
    : `<span class="tip">Add your birthdate to unlock your map.</span>`;

  el.innerHTML = `
    <div class="dash-card-header">
      <h3>${name}</h3>
      <div id="dash-avatar" class="dash-avatar"></div>
    </div>

    <p>${birth}</p>

    <button class="secondary-btn" data-nav="profile.html">Edit Profile</button>
  `;
}

/* -------------------------------------------------------
   AVATAR PREVIEW
------------------------------------------------------- */
function renderAvatar(state) {
  const avatarEl = document.getElementById('dash-avatar');
  if (!avatarEl) return;

  if (state.user.avatarDataUrl) {
    avatarEl.style.backgroundImage = `url(${state.user.avatarDataUrl})`;
    avatarEl.classList.add('has-avatar');
  } else {
    avatarEl.textContent = '⟳';
  }
}

/* -------------------------------------------------------
   LIFE PATH CARD
------------------------------------------------------- */
function renderLifePathCard(state) {
  const el = document.getElementById('life-path-card');
  if (!el) return;

  const lp = state.numbers.lifePath;

  if (!lp) {
    el.innerHTML = `
      <h3>Life Path</h3>
      <p>Your Life Path will appear once your profile is complete.</p>
      <button class="primary-btn" data-nav="profile.html">Complete Profile</button>
    `;
    return;
  }

  el.innerHTML = `
    <h3>Life Path ${lp.value}</h3>
    <p>${lp.summary || 'Your core path number.'}</p>
    <button class="secondary-btn" data-nav="numbers.html">See All Numbers</button>
  `;
}

/* -------------------------------------------------------
   DAILY TIP
------------------------------------------------------- */
function renderDailyTip(state) {
  const el = document.getElementById('daily-tip-card');
  if (!el) return;

  const tip =
    state.numbers.dailyTip ||
    'Today is a good day to move one small step closer to what you’re building.';

  el.innerHTML = `
    <h3>Daily Tip</h3>
    <p>${tip}</p>
  `;
}

/* -------------------------------------------------------
   PROFILE COMPLETION STATUS
------------------------------------------------------- */
function renderCompletionStatus(state) {
  const el = document.getElementById('profile-card');
  if (!el) return;

  const missing = [];

  if (!state.user.fullName) missing.push('Full Name');
  if (!state.user.birthdate) missing.push('Birthdate');

  if (missing.length === 0) return;

  const msg = `
    <div class="completion-warning">
      <strong>Profile Incomplete</strong><br>
      Missing: ${missing.join(', ')}
    </div>
  `;

  el.insertAdjacentHTML('beforeend', msg);
}

/* -------------------------------------------------------
   PRO HINTS
------------------------------------------------------- */
function renderProHints(state) {
  if (isPro()) return;

  const lpCard = document.getElementById('life-path-card');
  if (!lpCard) return;

  lpCard.insertAdjacentHTML(
    'beforeend',
    `
      <div class="pro-hint">
        Unlock Pro to see your full destiny map, personal cycles, and applied numerology.
        <br>
        <button class="primary-btn" data-nav="upgrade.html">Upgrade – $6</button>
      </div>
    `
  );
}

/* -------------------------------------------------------
   NAVIGATION HANDLER
------------------------------------------------------- */
function wireNavigation() {
  document.querySelectorAll('[data-nav]').forEach(el => {
    el.addEventListener('click', () => {
      const target = el.getAttribute('data-nav');
      if (target) window.location.href = target;
    });
  });
}
