// js/account/overview.js
import { getState, resetState } from "../state.js";

document.addEventListener("DOMContentLoaded", () => {
  const state = getState();

  renderProfile(state.user);
  renderCoreNumbers(state.numbers?.core);
  renderCycles(state.numbers?.cycles);
  renderPinnacles(state.numbers?.pinnacles);
  renderIntensity(state.numbers?.intensity);
  renderPatterns(state.patterns);
  renderVibrations(state.vibrations);
  renderJournal(state.journal);

  wireDelete();
});

// ===============================
// PROFILE
// ===============================

function renderProfile(user = {}) {
  const el = document.getElementById("profile-block");
  if (!el) return;

  el.innerHTML = `
    <p><strong>Full Name:</strong> ${user.fullName || "—"}</p>
    <p><strong>Preferred Name:</strong> ${user.preferredName || "—"}</p>
    <p><strong>Birthdate:</strong> ${user.birthdate || "—"}</p>
    <p><strong>Challenge:</strong> ${user.challenge || "—"}</p>
    <p><strong>Goal:</strong> ${user.goal || "—"}</p>
  `;
}

// ===============================
// CORE NUMBERS
// ===============================

function renderCoreNumbers(core) {
  const el = document.getElementById("numbers-block");
  if (!el) return;

  if (!core) {
    el.innerHTML = `<p class="small-text">No numerology calculated yet.</p>`;
    return;
  }

  el.innerHTML = `
    <p><strong>Life Path:</strong> ${core.lifePath?.value ?? "—"}</p>
    <p><strong>Expression:</strong> ${core.expression?.value ?? "—"}</p>
    <p><strong>Soul Urge:</strong> ${core.soulUrge?.value ?? "—"}</p>
    <p><strong>Personality:</strong> ${core.personality?.value ?? "—"}</p>
    <p><strong>Maturity:</strong> ${core.maturity?.value ?? "—"}</p>
  `;
}

// ===============================
// CYCLES (Personal Year / Month / Day)
// ===============================

function renderCycles(cycles) {
  const el = document.getElementById("cycles-block");
  if (!el) return;

  if (!cycles) {
    el.innerHTML = `<p class="small-text">No cycle data available.</p>`;
    return;
  }

  el.innerHTML = `
    <p><strong>Personal Year:</strong> ${cycles.personalYear?.value ?? "—"}</p>
    <p><strong>Personal Month:</strong> ${cycles.personalMonth?.value ?? "—"}</p>
    <p><strong>Personal Day:</strong> ${cycles.personalDay?.value ?? "—"}</p>
  `;
}

// ===============================
// PINNACLES
// ===============================

function renderPinnacles(pinnacles) {
  const el = document.getElementById("pinnacles-block");
  if (!el) return;

  if (!pinnacles) {
    el.innerHTML = `<p class="small-text">No pinnacle data available.</p>`;
    return;
  }

  el.innerHTML = `
    <p><strong>Pinnacle 1:</strong> ${pinnacles.p1?.value ?? "—"}</p>
    <p><strong>Pinnacle 2:</strong> ${pinnacles.p2?.value ?? "—"}</p>
    <p><strong>Pinnacle 3:</strong> ${pinnacles.p3?.value ?? "—"}</p>
    <p><strong>Pinnacle 4:</strong> ${pinnacles.p4?.value ?? "—"}</p>
  `;
}

// ===============================
// INTENSITY (Letter Frequency)
// ===============================

function renderIntensity(intensity) {
  const el = document.getElementById("intensity-block");
  if (!el) return;

  if (!intensity || !intensity.sorted?.length) {
    el.innerHTML = `<p class="small-text">No intensity data available.</p>`;
    return;
  }

  const top = intensity.sorted.slice(0, 5);

  el.innerHTML = top
    .map(i => `<p><strong>${i.letter}</strong> → ${i.count}</p>`)
    .join("");
}

// ===============================
// PATTERNS (Repeating Numbers)
// ===============================

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

// ===============================
// VIBRATIONS (Word / Address)
// ===============================

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

// ===============================
// JOURNAL
// ===============================

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

// ===============================
// DELETE ACCOUNT
// ===============================

function wireDelete() {
  const btn = document.getElementById("delete-account");
  if (!btn) return;

  btn.addEventListener("click", () => {
    if (confirm("Delete ALL data? This cannot be undone.")) {
      resetState();
      location.reload();
    }
  });
}
