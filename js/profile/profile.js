// js/profile/profile.js
import { getState, updateUser, setNumbers } from '../state.js';

window.addEventListener('DOMContentLoaded', () => {
  const state = getState();
  hydrateForm(state.user);
  wireAvatar();
  wireSave();
});

function hydrateForm(user) {
  document.getElementById('full-name').value = user.fullName || '';
  document.getElementById('preferred-name').value = user.preferredName || '';
  document.getElementById('birthdate').value = user.birthdate || '';
  document.getElementById('challenge').value = user.challenge || '';
  document.getElementById('goal').value = user.goal || '';

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

    updateUser({ fullName, preferredName, birthdate, challenge, goal });

    // Placeholder: here you’d call your numerology engine
    const numbers = fakeRecalc(fullName, birthdate);
    setNumbers(numbers);

    btn.textContent = 'Saved ✓';
    setTimeout(() => (btn.textContent = 'Save & Recalculate'), 1200);
  });
}

function fakeRecalc(fullName, birthdate) {
  // This is a stub. Replace with real engine.
  return {
    lifePath: { value: '7', summary: 'Seeker, analyst, depth.' },
    birthday: { value: '3' },
    expression: { value: '1' },
    soul: { value: '9' },
    personality: { value: '5' },
    dailyTip: fullName && birthdate
      ? 'You updated your map. Pay attention to what feels lighter today.'
      : 'Complete your profile to unlock deeper guidance.',
  };
}
