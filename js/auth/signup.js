// js/auth/signup.js
import { updateState } from '../state.js';

const AUTH_KEY = 'destinedToBeUsers_v1';

function loadUsers() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_KEY)) || {};
  } catch {
    return {};
  }
}

function saveUsers(users) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(users));
}

function setCurrentUser(username) {
  localStorage.setItem('destinedToBeCurrentUser', username);
}

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
      return;
    }

    const users = loadUsers();
    if (users[username]) {
      errorEl.textContent = 'That username is already taken.';
      return;
    }

    users[username] = { password };
    saveUsers(users);
    setCurrentUser(username);

    // Initialize state for this user
    updateState({
      user: { username },
      tier: 'free',
      numbers: {},
    });

    window.location.href = 'dashboard.html';
  });
});
