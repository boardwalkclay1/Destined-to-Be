// js/profile/profile.js
import { getState, updateUser, setNumbers } from '../state.js';
import { computeAll } from '../engine/index.js';

// ===============================
// HELPERS
// ===============================

function normalizeName(name) {
  return name
    .toUpperCase()
    .replace(/[^A-Z\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function validateBirthdate(dateStr) {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  return d instanceof Date && !isNaN(d);
}

// ===============================
// HYDRATE UI
// ===============================

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

// ===============================
// AVATAR HANDLING
// ===============================

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

// ===============================
// CINEMATIC SAVE ANIMATION
// ===============================

function playProfileCinematic() {
  const overlay = document.getElementById("sgDiveOverlay");
  if (!overlay) return;

  overlay.classList.add("active", "dive-in");

  setTimeout(() => overlay.classList.remove("dive-in"), 1100);
  setTimeout(() => overlay.classList.remove("active"), 1500);
}

// ===============================
// SAVE PROFILE
// ===============================

function wireSave() {
  const btn = document.getElementById('save-profile');
  const errorEl = document.getElementById('profile-error');

  if (!btn) return;

  btn.addEventListener('click', () => {
    const fullNameRaw = document.getElementById('full-name').value.trim();
    const preferredNameRaw = document.getElementById('preferred-name').value.trim();
    const birthdate = document.getElementById('birthdate').value;
    const challenge = document.getElementById('challenge').value.trim();
    const goal = document.getElementById('goal').value.trim();

    const fullName = normalizeName(fullNameRaw);
    const preferredName = normalizeName(preferredNameRaw);

    if (!validateBirthdate(birthdate)) {
      errorEl.textContent = "Enter a valid birthdate.";
      errorEl.classList.add("shake");
      setTimeout(() => errorEl.classList.remove("shake"), 400);
      return;
    }

    // Save user profile
    updateUser({ fullName, preferredName, birthdate, challenge, goal });

    // Run full numerology engine
    const numbers = computeAll(fullName, birthdate);

    // Save numerology map
    setNumbers(numbers);

    // Cinematic effect
    playProfileCinematic();

    // UI feedback
    btn.textContent = 'Saved ✓';
    setTimeout(() => (btn.textContent = 'Save & Recalculate'), 1200);
  });
}

// ===============================
// INIT
// ===============================

window.addEventListener('DOMContentLoaded', () => {
  const state = getState();
  hydrateForm(state.user);
  wireAvatar();
  wireSave();
});
