// js/dashboard/dashboard.js
import { getState } from '../state.js';
import { applyTierToDom } from '../tier.js';

window.addEventListener('DOMContentLoaded', () => {
  applyTierToDom();
  renderDashboard();
});

function renderDashboard() {
  const state = getState();

  renderProfileCard(state);
  renderLifePathCard(state);
  renderDailyTip(state);

  document.getElementById('profile-card')?.addEventListener('click', () => {
    window.location.href = 'profile.html';
  });
}

function renderProfileCard(state) {
  const el = document.getElementById('profile-card');
  if (!el) return;

  const name = state.user.preferredName || state.user.fullName || 'Your profile';
  el.innerHTML = `
    <h3>${name}</h3>
    <p>${state.user.birthdate ? `Born ${state.user.birthdate}` : 'Add your birthdate to unlock your map.'}</p>
    <button class="secondary-btn" onclick="location.href='profile.html'">Edit profile</button>
  `;
}

function renderLifePathCard(state) {
  const el = document.getElementById('life-path-card');
  if (!el) return;

  const lp = state.numbers.lifePath;
  if (!lp) {
    el.innerHTML = `
      <h3>Life Path</h3>
      <p>We’ll calculate this once your profile is complete.</p>
      <button class="primary-btn" onclick="location.href='profile.html'">Complete profile</button>
    `;
    return;
  }

  el.innerHTML = `
    <h3>Life Path ${lp.value}</h3>
    <p>${lp.summary || 'Your core path number.'}</p>
    <button class="secondary-btn" onclick="location.href='numbers.html'">See all numbers</button>
  `;
}

function renderDailyTip(state) {
  const el = document.getElementById('daily-tip-card');
  if (!el) return;

  const tip = state.numbers.dailyTip || 'Today is a good day to move one small step closer to what you’re building.';
  el.innerHTML = `
    <h3>Daily Tip</h3>
    <p>${tip}</p>
  `;
}
