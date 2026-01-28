// js/auth/login.js
import { updateState } from '../state.js';

const AUTH_KEY = 'destinedToBeUsers_v1';

function loadUsers() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_KEY)) || {};
  } catch {
    return {};
  }
}

function setCurrentUser(username) {
  localStorage.setItem('destinedToBeCurrentUser', username);
}

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
    const record = users[username];

    if (!record || record.password !== password) {
      errorEl.textContent = 'Invalid username or PIN.';
      return;
    }

    setCurrentUser(username);

    // Minimal: ensure state knows current username
    updateState({
      user: { username },
    });

    window.location.href = 'dashboard.html';
  });
});
