// js/auth/login.js
import { updateState } from '../state.js';

// Storage key
const AUTH_KEY = 'destinedToBeUsers_v1';
const CURRENT_KEY = 'destinedToBeCurrentUser';

// ===============================
// LOAD + SAVE
// ===============================

function loadUsers() {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function setCurrentUser(username) {
  localStorage.setItem(CURRENT_KEY, username);
}

// ===============================
// AUTH VALIDATION
// ===============================

function validateCredentials(users, username, password) {
  const record = users[username];
  if (!record) return false;
  if (record.password !== password) return false;
  return true;
}

// ===============================
// CINEMATIC HOOK
// ===============================

function playLoginCinematic() {
  const overlay = document.getElementById("sgDiveOverlay");
  if (!overlay) return;

  overlay.classList.add("active", "dive-in");

  setTimeout(() => {
    overlay.classList.remove("dive-in");
  }, 1100);

  setTimeout(() => {
    overlay.classList.remove("active");
  }, 1500);
}

// ===============================
// INIT
// ===============================

window.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('login-form');
  const usernameEl = document.getElementById('login-username');
  const passwordEl = document.getElementById('login-password');
  const errorEl = document.getElementById('login-error');

  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const username = usernameEl.value.trim();
    const password = passwordEl.value.trim();
    const users = loadUsers();

    const valid = validateCredentials(users, username, password);

    if (!valid) {
      errorEl.textContent = 'Invalid username or PIN.';
      errorEl.classList.add("shake");
      setTimeout(() => errorEl.classList.remove("shake"), 400);
      return;
    }

    // Save current user
    setCurrentUser(username);

    // Update global state
    updateState({
      user: { username }
    });

    // Play sacred geometry dive
    playLoginCinematic();

    // Delay navigation for cinematic effect
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 900);
  });
});
