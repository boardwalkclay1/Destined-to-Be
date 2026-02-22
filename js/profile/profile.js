// js/profile/profile.js
import { getState, updateUser, setNumbers } from '../state.js';
import { computeAll } from '../engine/index.js';

window.addEventListener('DOMContentLoaded', () => {
  const state = getState();
  hydrateForm(state.user);
  wireAvatar();
  wireSave();
  renderNumbersSummary(state);
});

function hydrateForm(user) {
  document.getElementById('full-name').value = user.fullName || '';
  document.getElementById('preferred-name').value = user.preferredName || '';
  document.getElementById('birthdate').value = user.birthdate || '';
  document.getElementById('challenge').value = user.challenge || '';
  document.getElementById('goal').value = user.goal || '';
  if (document.getElementById('bio')) document.getElementById('bio').value = user.bio || '';
  if (document.getElementById('location')) document.getElementById('location').value = user.location || '';
  if (document.getElementById('social-link')) document.getElementById('social-link').value = user.socialLink || '';

  const avatarPreview = document.getElementById('avatar-preview');
  if (user.avatarDataUrl && avatarPreview) {
    avatarPreview.style.backgroundImage = `url(${user.avatarDataUrl})`;
    avatarPreview.textContent = '';
  }
}

function wireAvatar() {
  const fileInput = document.getElementById('avatar-file');
  const preview = document.getElementById('avatar-preview');
  if (!fileInput || !preview) return;

  fileInput.addEventListener('change', () => {
    const file = fileInput.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      preview.style.backgroundImage = `url(${dataUrl})`;
      preview.textContent = '';
      updateUser({ avatarDataUrl: dataUrl });
    };
    reader.readAsDataURL(file);
  });
}

function wireSave() {
  const btn = document.getElementById('save-profile');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const fullName = document.getElementById('full-name').value.trim();
    const preferredName = document.getElementById('preferred-name').value.trim();
    const birthdate = document.getElementById('birthdate').value;
    const challenge = document.getElementById('challenge').value.trim();
    const goal = document.getElementById('goal').value.trim();
    const bio = document.getElementById('bio')?.value.trim() || '';
    const location = document.getElementById('location')?.value.trim() || '';
    const socialLink = document.getElementById('social-link')?.value.trim() || '';

    // Save user profile
    updateUser({ fullName, preferredName, birthdate, challenge, goal, bio, location, socialLink });

    // Run full hybrid numerology engine
    const numbers = computeAll(fullName, birthdate);

    // Save numerology map
    setNumbers(numbers);

    // Re-render summary
    renderNumbersSummary({ user: { fullName, preferredName, birthdate }, numbers });

    // UI feedback
    btn.textContent = 'Saved ✓';
    setTimeout(() => (btn.textContent = 'Save & Recalculate'), 1200);
  });
}

function renderNumbersSummary(state) {
  const card = document.getElementById('numbers-summary-card');
  const grid = document.getElementById('numbers-summary');
  if (!card || !grid) return;

  const user = state.user || {};
  const numbers = state.numbers || {};

  if (!user.fullName && !user.birthdate) {
    card.style.display = 'none';
    return;
  }

  card.style.display = 'block';

  // If numbers not yet computed, compute them
  let nums = numbers;
  if (!nums || Object.keys(nums).length === 0) {
    try { nums = computeAll(user.fullName || '', user.birthdate || ''); } catch { nums = {}; }
  }

  const entries = [
    { label: 'Life Path', value: nums?.lifePath?.value ?? nums?.core?.lifePath ?? '—', icon: '☽' },
    { label: 'Expression', value: nums?.expression?.value ?? nums?.core?.expression ?? '—', icon: '✦' },
    { label: 'Soul Urge', value: nums?.soulUrge?.value ?? nums?.core?.soulUrge ?? '—', icon: '♡' },
    { label: 'Personality', value: nums?.personality?.value ?? nums?.core?.personality ?? '—', icon: '⬡' },
    { label: 'Birthday', value: nums?.birthday?.value ?? nums?.core?.birthday ?? '—', icon: '✧' },
    { label: 'Maturity', value: nums?.maturity?.value ?? nums?.core?.maturity ?? '—', icon: '◇' },
    { label: 'Personal Year', value: nums?.personalYear?.value ?? nums?.cycles?.personalYear ?? '—', icon: '↺' },
    { label: 'Personal Month', value: nums?.personalMonth?.value ?? nums?.cycles?.personalMonth ?? '—', icon: '◎' }
  ];

  grid.innerHTML = entries.map(e => `
    <div class="num-summary-chip">
      <span class="num-icon">${e.icon}</span>
      <span class="num-label">${e.label}</span>
      <span class="num-value">${e.value}</span>
    </div>
  `).join('');

  // Wire share button
  const shareBtn = document.getElementById('share-profile-btn');
  if (shareBtn) {
    shareBtn.onclick = () => shareProfileToFeed(state, entries);
  }
}

function shareProfileToFeed(state, entries) {
  const user = state.user || {};
  const name = user.preferredName || user.fullName || 'Anonymous';
  const lines = entries
    .filter(e => e.value !== '—')
    .map(e => `${e.icon} ${e.label}: ${e.value}`)
    .join('\n');
  const bio = user.bio ? `\n\n"${user.bio}"` : '';
  const text = `✦ ${name}'s Numerology Blueprint ✦\n\n${lines}${bio}\n\n✦ Destined to Be`;

  try {
    const posts = JSON.parse(localStorage.getItem('dtb_community_posts') || '[]');
    posts.unshift({
      id: Date.now(),
      author: name,
      content: text,
      category: 'numerology',
      likes: 0,
      likedBy: [],
      ts: new Date().toISOString()
    });
    localStorage.setItem('dtb_community_posts', JSON.stringify(posts.slice(0, 200)));
    alert('Profile shared to Community! ✦');
  } catch {
    navigator.clipboard?.writeText(text).then(() => alert('Copied to clipboard!'));
  }
}
