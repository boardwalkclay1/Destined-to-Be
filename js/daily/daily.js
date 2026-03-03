// js/daily/daily.js

// ===============================
// NUMEROLOGY HELPERS
// ===============================

function sumDigits(n) {
  return n.toString().split("").reduce((a, b) => a + Number(b), 0);
}

function reduceNum(n) {
  while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
    n = sumDigits(n);
  }
  return n;
}

// ===============================
// BIRTHDAY SOURCE (STATE-AWARE)
// ===============================

function getBirthdayFromState() {
  try {
    const raw = localStorage.getItem("destinedToBeState");
    if (!raw) return null;

    const state = JSON.parse(raw);
    if (!state.user || !state.user.birthdate) return null;

    // Expecting YYYY-MM-DD
    const [year, month, day] = state.user.birthdate.split("-").map(Number);
    return { month, day };
  } catch {
    return null;
  }
}

// Fallback birthday if none stored
function getBirthday() {
  const fromState = getBirthdayFromState();
  if (fromState) return fromState;

  const fallback = localStorage.getItem("birthday") || "01-01";
  const [month, day] = fallback.split("-").map(Number);
  return { month, day };
}

// ===============================
// UNIVERSAL + PERSONAL DAY
// ===============================

function getUniversalDay() {
  const now = new Date();
  const d = now.getDate();
  const m = now.getMonth() + 1;
  const y = now.getFullYear();
  return reduceNum(d + m + y);
}

function getPersonalDay() {
  const { month, day } = getBirthday();
  return reduceNum(month + day + getUniversalDay());
}

// ===============================
// INTERPRETATION ENGINE
// ===============================

function getDailyInterpretation() {
  const index = Math.floor(Math.random() * interpretations.length);
  return interpretations[index];
}

// ===============================
// RENDERING (CINEMATIC)
// ===============================

function renderDaily() {
  const personal = getPersonalDay();
  const universal = getUniversalDay();
  const interpretation = getDailyInterpretation();

  const personalEl = document.getElementById("daily-personal");
  const universalEl = document.getElementById("daily-universal");
  const interpEl = document.getElementById("daily-interpretation");

  // Cinematic fade-in
  personalEl.classList.remove("fade-in");
  universalEl.classList.remove("fade-in");
  interpEl.classList.remove("fade-in");

  void personalEl.offsetWidth; // force reflow

  personalEl.textContent = `Personal Day: ${personal}`;
  universalEl.textContent = `Universal Day: ${universal}`;
  interpEl.textContent = interpretation;

  personalEl.classList.add("fade-in");
  universalEl.classList.add("fade-in");
  interpEl.classList.add("fade-in");
}

// ===============================
// INIT
// ===============================

document.addEventListener("DOMContentLoaded", renderDaily);
