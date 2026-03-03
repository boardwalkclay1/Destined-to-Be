// js/auth/signup.js
import { updateState } from '../state.js';

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

function saveUsers(users) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(users));
}

function setCurrentUser(username) {
  localStorage.setItem(CURRENT_KEY, username);
}

// ===============================
// USER CREATION
// ===============================

function createUser(username, password) {
  return {
    id: "u_" + Math.random().toString(36).slice(2, 10),
    username,
    password,
    createdAt: Date.now()
  };
}

// ===============================
// CINEMATIC HOOK
// ===============================

function playSignupCinematic() {
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
  const form = document.getElementById('signup-form');
  const usernameEl = document.getElementById('signup-username');
  const passwordEl = document.getElementById('signup-password');
  const errorEl = document.getElementById('signup-error');

  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const username = usernameEl.value.trim();
    const password = passwordEl.value.trim();

    if (!username || !password) {
      errorEl.textContent = 'Enter a username and PIN.';
      errorEl.classList.add("shake");
      setTimeout(() => errorEl.classList.remove("shake"), 400);
      return;
    }

    const users = loadUsers();

    if (users[username]) {
      errorEl.textContent = 'That username is already taken.';
      errorEl.classList.add("shake");
      setTimeout(() => errorEl.classList.remove("shake"), 400);
      return;
    }

    // Create and save user
    users[username] = createUser(username, password);
    saveUsers(users);

    // Set current user
    setCurrentUser(username);

    // Initialize global state
    updateState({
      user: { username },
      tier: 'free',
      numbers: {}
    });

    // Sacred geometry dive
    playSignupCinematic();

    // Delay redirect for cinematic effect
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 900);
  });
});
