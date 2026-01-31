// js/account/overview.js
import { getState, clearState } from "../state.js";

document.addEventListener("DOMContentLoaded", () => {
  const state = getState() || {};

  renderProfile(state.profile);
  renderNumbers(state.numbers);
  renderCycles(state.numbers);
  renderPatterns(state.patterns);
  renderVibrations(state.vibrations);
  renderJournal(state.journal);

  wireDelete();
});

// ---------------- PROFILE ----------------

function renderProfile(profile = {}) {
  const el = document.getElementById("profile-block");
  if (!el) return;

  el.innerHTML = `
    <p><strong>Full Name:</strong> ${profile.fullName || "—"}</p>
    <p><strong>Preferred Name:</strong> ${profile.preferredName || "—"}</p>
    <p><strong>Birthdate:</strong> ${profile.birthdate || "—"}</p>
    <p><strong>Challenge:</strong> ${profile.challenge || "—"}</p>
    <p><strong>Goal:</strong> ${profile.goal || "—"}</p>
  `;
}

// ---------------- NUMBERS ----------------

function renderNumbers(numbers = {}) {
  const el = document.getElementById("numbers-block");
  if (!el) return;

  if (!numbers.core) {
    el.innerHTML = `<p class="small-text">No numerology calculated yet.</p>`;
    return;
  }

  const c = numbers.core;

  el.innerHTML = `
    <p><strong>Life Path:</strong> ${c.lifePath ?? "—"}</p>
    <p><strong>Expression:</strong> ${c.expression ?? "—"}</p>
    <p><strong>Soul Urge:</strong> ${c.soulUrge ?? "—"}</p>
    <p><strong>Personality:</strong> ${c.personality ?? "—"}</p>
    <p><strong>Maturity:</strong> ${c.maturity ?? "—"}</p>
  `;
}

// ---------------- CYCLES ----------------

function renderCycles(numbers = {}) {
  const el = document.getElementById("cycles-block");
  if (!el) return;

  if (!numbers.cycles) {
    el.innerHTML = `<p class="small-text">No cycle data available.</p>`;
    return;
  }

  const cy = numbers.cycles;

  el.innerHTML = `
    <p><strong>Personal Year:</strong> ${cy.personalYear ?? "—"}</p>
    <p><strong>Personal Month:</strong> ${cy.personalMonth ?? "—"}</p>
    <p><strong>Personal Day:</strong> ${cy.personalDay ?? "—"}</p>
  `;
}

// ---------------- PATTERNS ----------------

function renderPatterns(patterns = []) {
  const el = document.getElementById("patterns-block");
  if (!el) return;

  if (!patterns.length) {
    el.innerHTML = `<li class="small-text">No patterns logged yet.</li>`;
    return;
  }

  el.innerHTML = patterns
    .slice(-5)
    .reverse()
    .map(p => {
      const date = new Date(p.timestamp);
      return `
        <li>
          <strong>${p.number}</strong> — ${date.toLocaleDateString()} ${date.toLocaleTimeString([], {hour:"2-digit", minute:"2-digit"})}
        </li>
      `;
    })
    .join("");
}

// ---------------- VIBRATIONS ----------------

function renderVibrations(vibs = []) {
  const el = document.getElementById("vibration-block");
  if (!el) return;

  if (!vibs.length) {
    el.innerHTML = `<li class="small-text">No vibrations calculated yet.</li>`;
    return;
  }

  el.innerHTML = vibs
    .slice(-5)
    .reverse()
    .map(v => {
      const date = new Date(v.timestamp);
      return `
        <li>
          <strong>${v.input}</strong> → ${v.reduced ?? "—"}
          <span class="small-text">${date.toLocaleDateString()}</span>
        </li>
      `;
    })
    .join("");
}

// ---------------- JOURNAL ----------------

function renderJournal(entries = []) {
  const el = document.getElementById("journal-block");
  if (!el) return;

  if (!entries.length) {
    el.innerHTML = `<li class="small-text">No journal entries yet.</li>`;
    return;
  }

  el.innerHTML = entries
    .slice(-5)
    .reverse()
    .map(e => {
      const date = new Date(e.timestamp);
      return `
        <li>
          <strong>${date.toLocaleDateString()}</strong>
          <p class="small-text">${e.text.slice(0, 80)}...</p>
        </li>
      `;
    })
    .join("");
}

// ---------------- DELETE ACCOUNT ----------------

function wireDelete() {
  const btn = document.getElementById("delete-account");
  if (!btn) return;

  btn.addEventListener("click", () => {
    if (confirm("Are you sure you want to delete ALL data? This cannot be undone.")) {
      clearState();
      location.reload();
    }
  });
}
