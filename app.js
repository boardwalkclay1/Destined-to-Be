// ===== SOCKET CONFIG =====
const SOCKET_URL = "https://boardwalkclay1.github.io/Destined-to-Be/"; // <-- SET THIS TO YOUR SERVER URL

let socket = null;
let socketConnected = false;

// ===== STATE =====
let state = {
  user: null,
  profile: null,
  tiers: { proUnlocked: false },
  settings: { theme: "midnight" },
  currentRoute: "dashboard",
};

const STORAGE_KEYS = {
  user: "dtb_user",
  profile: "dtb_profile",
  tiers: "dtb_tiers",
  settings: "dtb_settings",
};

// ===== BOOTSTRAP =====
document.addEventListener("DOMContentLoaded", () => {
  wireAuth();
  wireNav();
  wireSettings();
  wireProfile();
  wireNumbers();
  wireReadings();
  wireSpirit();
  loadState();
  applyTheme();
  decideInitialScreen();
});

// ===== UTILITIES =====
function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function load(key, fallback = null) {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.remove("hidden");
  setTimeout(() => toast.classList.add("hidden"), 2200);
}

function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return String(hash);
}

function initialsForName(name) {
  const parts = (name || "").trim().split(/\s+/);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0][0]?.toUpperCase() || "?";
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// ===== STATE INIT =====
function loadState() {
  state.user = load(STORAGE_KEYS.user);
  state.profile = load(STORAGE_KEYS.profile) || {
    fullName: "",
    preferredName: "",
    birthdate: "",
    challenge: "",
    goal: "",
    avatarBase64: null,
    numbers: {},
  };
  state.tiers =
    load(STORAGE_KEYS.tiers, { proUnlocked: false }) || { proUnlocked: false };
  state.settings = load(STORAGE_KEYS.settings, { theme: "midnight" }) || {
    theme: "midnight",
  };
}

function persistAll() {
  if (state.user) save(STORAGE_KEYS.user, state.user);
  if (state.profile) save(STORAGE_KEYS.profile, state.profile);
  save(STORAGE_KEYS.tiers, state.tiers);
  save(STORAGE_KEYS.settings, state.settings);
}

function decideInitialScreen() {
  const screenAuth = document.getElementById("screen-auth");
  const screenMain = document.getElementById("screen-main");
  if (state.user) {
    screenAuth.classList.add("hidden");
    screenMain.classList.remove("hidden");
    recalcNumbers();
    renderAll();
    initSocket();
  } else {
    screenAuth.classList.remove("hidden");
    screenMain.classList.add("hidden");
  }
}

// ===== THEME =====
function applyTheme() {
  if (state.settings.theme === "light") {
    document.body.classList.add("light");
  } else {
    document.body.classList.remove("light");
  }
}

// ===== SOCKET.IO =====
function initSocket() {
  if (socket || !state.user) return;

  socket = io(SOCKET_URL, {
    transports: ["websocket"],
  });

  socket.on("connect", () => {
    socketConnected = true;
    socket.emit("auth:hello", {
      userId: state.user.id,
      username: state.user.username,
      profile: state.profile,
      numbers: state.profile.numbers,
    });
  });

  socket.on("disconnect", () => {
    socketConnected = false;
  });

  socket.on("profile:update", (payload) => {
    if (!payload || payload.userId !== state.user.id) return;
    state.profile = payload.profile || state.profile;
    save(STORAGE_KEYS.profile, state.profile);
    recalcNumbers();
    renderAll();
    showToast("Profile updated from live server.");
  });

  socket.on("spirit:message", (msg) => {
    const out = document.getElementById("spirit-output");
    if (!out) return;
    const text = typeof msg === "string" ? msg : msg.text || "";
    if (!text) return;
    out.innerHTML += `<p><strong>Live Spirit:</strong> ${text}</p>`;
  });
}

function emitSafe(event, payload) {
  if (!socket || !socketConnected) return;
  socket.emit(event, payload);
}

// ===== AUTH =====
function wireAuth() {
  const btnShowLogin = document.getElementById("btn-show-login");
  const btnShowSignup = document.getElementById("btn-show-signup");
  const formLogin = document.getElementById("form-login");
  const formSignup = document.getElementById("form-signup");

  btnShowLogin.addEventListener("click", () => {
    btnShowLogin.classList.add("active");
    btnShowSignup.classList.remove("active");
    formLogin.classList.remove("hidden");
    formSignup.classList.add("hidden");
  });

  btnShowSignup.addEventListener("click", () => {
    btnShowSignup.classList.add("active");
    btnShowLogin.classList.remove("active");
    formSignup.classList.remove("hidden");
    formLogin.classList.add("hidden");
  });

  formSignup.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("signup-username").value.trim();
    const password = document.getElementById("signup-password").value;
    const error = document.getElementById("signup-error");

    if (!username || !password) {
      error.textContent = "Enter a username and password.";
      return;
    }

    const salt = crypto.getRandomValues(new Uint32Array(1))[0].toString();
    const hash = simpleHash(password + salt);

    state.user = {
      id: "user-" + username,
      username,
      passwordHash: hash,
      salt,
      createdAt: new Date().toISOString(),
    };
    persistAll();
    error.textContent = "";
    decideInitialScreen();
    showToast("Account created.");
  });

  formLogin.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("login-username").value.trim();
    const password = document.getElementById("login-password").value;
    const error = document.getElementById("login-error");

    const storedUser = load(STORAGE_KEYS.user);
    if (!storedUser) {
      error.textContent = "No account found on this device. Sign up first.";
      return;
    }
    if (storedUser.username !== username) {
      error.textContent = "Username does not match the saved account.";
      return;
    }

    const candidateHash = simpleHash(password + storedUser.salt);
    if (candidateHash !== storedUser.passwordHash) {
      error.textContent = "Incorrect password.";
      return;
    }

    state.user = storedUser;
    error.textContent = "";
    decideInitialScreen();
    showToast("Welcome back.");
  });
}

// ===== NAV =====
function wireNav() {
  const navButtons = document.querySelectorAll(".nav-btn");
  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const route = btn.dataset.route;
      setRoute(route);
    });
  });

  document
    .getElementById("btn-dash-complete-profile")
    .addEventListener("click", () => setRoute("profile"));
  document
    .getElementById("btn-dash-see-numbers")
    .addEventListener("click", () => setRoute("numbers"));
  document
    .getElementById("btn-dash-open-spirit")
    .addEventListener("click", () => setRoute("spirit"));
}

function setRoute(route) {
  state.currentRoute = route;
  const navButtons = document.querySelectorAll(".nav-btn");
  navButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.route === route);
  });

  const views = document.querySelectorAll(".view");
  views.forEach((v) => v.classList.remove("active"));
  const target = document.getElementById(`view-${route}`);
  if (target) target.classList.add("active");

  const title = document.getElementById("topbar-title");
  title.textContent = route.charAt(0).toUpperCase() + route.slice(1);

  renderRoute(route);
}

// ===== SETTINGS =====
function wireSettings() {
  const btnOpen = document.getElementById("btn-open-settings");
  const btnClose = document.getElementById("btn-close-settings");
  const modal = document.getElementById("modal-settings");
  const themeSelect = document.getElementById("settings-theme");
  const btnLogout = document.getElementById("btn-logout");
  const btnReset = document.getElementById("btn-reset-all");
  const btnExport = document.getElementById("btn-export-data");

  btnOpen.addEventListener("click", openSettings);
  btnClose.addEventListener("click", () => modal.classList.add("hidden"));

  themeSelect.addEventListener("change", () => {
    state.settings.theme = themeSelect.value;
    save(STORAGE_KEYS.settings, state.settings);
    applyTheme();
  });

  btnLogout.addEventListener("click", () => {
    state.user = null;
    persistAll();
    localStorage.removeItem(STORAGE_KEYS.user);
    if (socket) {
      socket.disconnect();
      socket = null;
      socketConnected = false;
    }
    decideInitialScreen();
  });

  btnReset.addEventListener("click", () => {
    if (!confirm("This will erase all numerology data on this device. Continue?")) return;
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
    if (socket) {
      socket.disconnect();
      socket = null;
      socketConnected = false;
    }
    location.reload();
  });

  btnExport.addEventListener("click", () => {
    const payload = {
      user: state.user,
      profile: state.profile,
      tiers: state.tiers,
      settings: state.settings,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "destined-to-be-data.json";
    a.click();
    URL.revokeObjectURL(url);
  });

  document
    .getElementById("btn-open-paypal-pro")
    .addEventListener("click", () => showToast("PayPal Pro checkout (to be wired)."));

  const tierStatus = document.getElementById("tier-status");
  if (!document.getElementById("dev-unlock-pro")) {
    tierStatus.insertAdjacentHTML(
      "afterend",
      `<button id="dev-unlock-pro" class="secondary small-btn" style="margin-top:6px;">Dev: Toggle Pro</button>`
    );
    document.getElementById("dev-unlock-pro").addEventListener("click", () => {
      state.tiers.proUnlocked = !state.tiers.proUnlocked;
      save(STORAGE_KEYS.tiers, state.tiers);
      renderAll();
      openSettings();
      showToast(state.tiers.proUnlocked ? "Pro unlocked (dev)." : "Pro locked (dev).");
    });
  }
}

function openSettings() {
  const modal = document.getElementById("modal-settings");
  modal.classList.remove("hidden");
  const themeSelect = document.getElementById("settings-theme");
  themeSelect.value = state.settings.theme;

  const tierStatus = document.getElementById("tier-status");
  tierStatus.textContent = state.tiers.proUnlocked
    ? "Pro numerology unlocked."
    : "Free tier active. Pro adds advanced readings.";
  updateTierPill();
}

function updateTierPill() {
  const pill = document.getElementById("topbar-tier-pill");
  pill.textContent = state.tiers.proUnlocked ? "Pro" : "Free";
}

// ===== PROFILE =====
function wireProfile() {
  const avatarInput = document.getElementById("profile-avatar");
  avatarInput.addEventListener("change", handleAvatarUpload);

  document
    .getElementById("btn-save-profile-view")
    .addEventListener("click", saveProfileFromView);
}

function saveProfileFromView() {
  state.profile.fullName =
    document.getElementById("profile-full-name").value.trim();
  state.profile.preferredName =
    document.getElementById("profile-preferred-name").value.trim();
  state.profile.birthdate =
    document.getElementById("profile-birthdate").value;
  state.profile.challenge =
    document.getElementById("profile-challenge").value.trim();
  state.profile.goal =
    document.getElementById("profile-goal").value.trim();

  recalcNumbers();
  save(STORAGE_KEYS.profile, state.profile);
  persistAll();

  emitSafe("profile:update", {
    userId: state.user.id,
    profile: state.profile,
    numbers: state.profile.numbers,
  });

  renderAll();
  showToast("Profile saved and numbers recalculated.");
}

function handleAvatarUpload(e) {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    state.profile.avatarBase64 = reader.result;
    save(STORAGE_KEYS.profile, state.profile);
    persistAll();
    renderDashboard();
    emitSafe("profile:update", {
      userId: state.user.id,
      profile: state.profile,
      numbers: state.profile.numbers,
    });
  };
  reader.readAsDataURL(file);
}

// ===== NUMEROLOGY CORE =====
function computeLifePath(dateStr) {
  const digits = dateStr.replace(/[^0-9]/g, "").split("").map(Number);
  if (!digits.length) return null;
  let sum = digits.reduce((a, b) => a + b, 0);
  const master = [11, 22, 33];
  while (sum > 9 && !master.includes(sum)) {
    sum = String(sum)
      .split("")
      .map(Number)
      .reduce((a, b) => a + b, 0);
  }
  return sum;
}

function computeBirthdayNumber(dateStr) {
  if (!dateStr) return null;
  const day = parseInt(dateStr.split("-")[2], 10);
  if (!day) return null;
  const master = [11, 22];
  let n = day;
  while (n > 9 && !master.includes(n)) {
    n = String(n)
      .split("")
      .map(Number)
      .reduce((a, b) => a + b, 0);
  }
  return n;
}

const LETTER_MAP = {
  A: 1,
  B: 2,
  C: 3,
  D: 4,
  E: 5,
  F: 6,
  G: 7,
  H: 8,
  I: 9,
  J: 1,
  K: 2,
  L: 3,
  M: 4,
  N: 5,
  O: 6,
  P: 7,
  Q: 8,
  R: 9,
  S: 1,
  T: 2,
  U: 3,
  V: 4,
  W: 5,
  X: 6,
  Y: 7,
  Z: 8,
};

const VOWELS = new Set(["A", "E", "I", "O", "U", "Y"]);

function reduceNumber(n) {
  const master = [11, 22, 33];
  while (n > 9 && !master.includes(n)) {
    n = String(n)
      .split("")
      .map(Number)
      .reduce((a, b) => a + b, 0);
  }
  return n;
}

function computeNameNumbers(name) {
  const clean = (name || "").toUpperCase().replace(/[^A-Z]/g, "");
  if (!clean) return { destiny: null, soulUrge: null, personality: null, karmicLessons: [] };

  let total = 0;
  let vowelTotal = 0;
  let consonantTotal = 0;
  const counts = { 1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0 };

  for (const ch of clean) {
    const val = LETTER_MAP[ch] || 0;
    if (!val) continue;
    total += val;
    counts[val]++;
    if (VOWELS.has(ch)) vowelTotal += val;
    else consonantTotal += val;
  }

  const destiny = reduceNumber(total);
  const soulUrge = reduceNumber(vowelTotal);
  const personality = reduceNumber(consonantTotal);
  const karmicLessons = Object.entries(counts)
    .filter(([num, count]) => count === 0)
    .map(([num]) => parseInt(num, 10));

  return { destiny, soulUrge, personality, karmicLessons };
}

function computeMaturity(lifePath, destiny) {
  if (!lifePath || !destiny) return null;
  return reduceNumber(lifePath + destiny);
}

function computeBalance(fullName) {
  const parts = (fullName || "").trim().split(/\s+/);
  if (parts.length < 2) return null;
  const initials = parts.map((p) => p[0].toUpperCase()).filter(Boolean);
  let total = 0;
  initials.forEach((ch) => {
    const val = LETTER_MAP[ch] || 0;
    total += val;
  });
  return reduceNumber(total);
}

// ===== NUMEROLOGY INTERP =====
function lifePathSummary(lp) {
  const map = {
    1: "Leader energy: independence, initiative, carving your own path.",
    2: "Diplomat energy: harmony, partnership, sensitivity.",
    3: "Creator energy: expression, joy, communication.",
    4: "Builder energy: structure, discipline, foundations.",
    5: "Explorer energy: freedom, change, experience.",
    6: "Guardian energy: responsibility, care, home.",
    7: "Seeker energy: introspection, wisdom, mystery.",
    8: "Power energy: ambition, impact, material mastery.",
    9: "Sage energy: compassion, endings, universal service.",
    11: "Master 11: intuition, illumination, higher inspiration.",
    22: "Master 22: master builder, big structures, legacy.",
    33: "Master 33: master teacher, healing through service.",
  };
  return map[lp] || "Your life path has its own unique rhythm.";
}

function destinySummary(n) {
  if (!n) return "Destiny number not computed yet.";
  const map = {
    1: "You are meant to stand out, initiate, and bring new things into the world.",
    2: "You are meant to connect, harmonize, and mediate between people and energies.",
    3: "You are meant to inspire through words, art, and creative expression.",
    4: "You are meant to build solid, reliable structures that others can trust.",
    5: "You are meant to explore, adapt, and model healthy freedom.",
    6: "You are meant to nurture, protect, and beautify spaces and relationships.",
    7: "You are meant to seek truth and share distilled insight.",
    8: "You are meant to work with power, resources, and real-world impact.",
    9: "You are meant to bring compassion and closure to cycles.",
    11: "You are meant to illuminate paths for others as a guide or channel.",
    22: "You are meant to turn big visions into practical structures.",
    33: "You are meant to teach and heal at a deep emotional level.",
  };
  return map[n] || "Your destiny number colors what you are here to build.";
}

function soulUrgeSummary(n) {
  if (!n) return "Soul urge not computed yet.";
  const map = {
    1: "You quietly crave autonomy and the freedom to choose your path.",
    2: "You quietly crave connection, emotional safety, and resonance.",
    3: "You quietly crave expression, play, and creative flow.",
    4: "You quietly crave stability and clear, dependable ground.",
    5: "You quietly crave variety, movement, and new experiences.",
    6: "You quietly crave being needed, loving, and loved in return.",
    7: "You quietly crave depth, solitude, and honest reflection.",
    8: "You quietly crave influence, results, and measurable progress.",
    9: "You quietly crave meaning, closure, and emotional honesty.",
  };
  return map[n] || "Your soul urge reveals what actually nourishes you inside.";
}

function personalitySummary(n) {
  if (!n) return "Personality not computed yet.";
  const map = {
    1: "You come across as direct, determined, and self-directed.",
    2: "You come across as gentle, sensitive, and cooperative.",
    3: "You come across as expressive, social, and playful.",
    4: "You come across as structured, grounded, and reliable.",
    5: "You come across as dynamic, curious, and flexible.",
    6: "You come across as caring, responsible, and protective.",
    7: "You come across as thoughtful, private, and observant.",
    8: "You come across as confident, ambitious, and authoritative.",
    9: "You come across as caring, wise, and a bit mysterious.",
  };
  return map[n] || "Your personality number is the energy that walks into the room first.";
}

function dailyTipForLifePath(lp) {
  const generic =
    "Take one conscious action aligned with what you already know matters.";
  if (!lp) return generic;
  const tips = {
    1: "Choose one decision today where you lead instead of waiting.",
    2: "Soften one conversation today by truly listening first.",
    3: "Express something today that you usually keep inside.",
    4: "Strengthen one system or habit by 1%.",
    5: "Say yes to one new experience, even if small.",
    6: "Offer a practical act of care to someone close.",
    7: "Block out quiet time away from screens to think.",
    8: "Move one concrete step toward a long-term goal.",
    9: "Release one thing—an item, habit, or belief—you have outgrown.",
  };
  return tips[lp] || generic;
}

function interpretSeenNumber(numStr) {
  const cleaned = numStr.replace(/\s+/g, "");
  if (!cleaned) return "Enter a number to interpret.";
  if (!/^[0-9]+$/.test(cleaned)) {
    return "Use only digits. Spirit will compress the number into a core vibration.";
  }

  if (/^(111|222|333|444|555|666|777|888|999)$/.test(cleaned)) {
    return `Repeating ${cleaned[0]}s: amplified ${cleaned[0]} energy trying to get your attention. Notice where that theme shows up today.`;
  }

  const digits = cleaned.split("").map(Number);
  const sum = reduceNumber(digits.reduce((a, b) => a + b, 0));
  return `This number compresses to ${sum}. ${lifePathSummary(
    sum
  )} Ask where this theme is whispering in your current situation.`;
}

// ===== RE-CALC =====
function recalcNumbers() {
  const p = state.profile;
  const birthdate = p.birthdate;
  const fullName = p.fullName || p.preferredName;

  const lifePath = computeLifePath(birthdate);
  const birthday = computeBirthdayNumber(birthdate);
  const nameNums = computeNameNumbers(fullName);
  const maturity = computeMaturity(lifePath, nameNums.destiny);
  const balance = computeBalance(fullName);

  p.numbers = {
    lifePath,
    birthday,
    destiny: nameNums.destiny,
    soulUrge: nameNums.soulUrge,
    personality: nameNums.personality,
    karmicLessons: nameNums.karmicLessons,
    maturity,
    balance,
  };
}

// ===== RENDER PIPELINE =====
function renderAll() {
  renderDashboard();
  renderProfileView();
  renderNumbersView();
  renderReadingsView();
  renderSpiritView();
  updateTierPill();
}

function renderRoute(route) {
  if (route === "dashboard") renderDashboard();
  if (route === "profile") renderProfileView();
  if (route === "numbers") renderNumbersView();
  if (route === "readings") renderReadingsView();
  if (route === "spirit") renderSpiritView();
  if (route === "learn") updateTierPill();
}

// ===== DASHBOARD =====
function renderDashboard() {
  const profileDiv = document.getElementById("dashboard-profile");
  const lifePathDiv = document.getElementById("dashboard-life-path");
  const dailyDiv = document.getElementById("dashboard-daily-tip");

  const name = state.profile.preferredName || state.profile.fullName || state.user?.username || "Seeker";
  const avatar = state.profile.avatarBase64;
  const initials = initialsForName(name);

  const avatarHTML = avatar
    ? `<div class="profile-avatar"><img src="${avatar}" alt="avatar" /></div>`
    : `<div class="profile-avatar">${initials}</div>`;

  profileDiv.innerHTML = `
    ${avatarHTML}
    <div class="profile-main">
      <h4>${name}</h4>
      <p>${state.profile.goal || "Set your current goal so Spirit can speak more precisely."}</p>
      <p><strong>Birthdate:</strong> ${state.profile.birthdate || "Add in Profile"}</p>
    </div>
  `;

  const lp = state.profile.numbers.lifePath;
  if (!lp) {
    lifePathDiv.innerHTML =
      "<p>Set your birthdate in Profile to see your life path number.</p>";
  } else {
    lifePathDiv.innerHTML = `
      <h4>Life path ${lp}</h4>
      <p>${lifePathSummary(lp)}</p>
    `;
  }

  dailyDiv.innerHTML = `
    <h4>Today's tip</h4>
    <p>${dailyTipForLifePath(lp)}</p>
  `;
}

// ===== PROFILE VIEW =====
function renderProfileView() {
  document.getElementById("profile-full-name").value =
    state.profile.fullName || "";
  document.getElementById("profile-preferred-name").value =
    state.profile.preferredName || "";
  document.getElementById("profile-birthdate").value =
    state.profile.birthdate || "";
  document.getElementById("profile-challenge").value =
    state.profile.challenge || "";
  document.getElementById("profile-goal").value = state.profile.goal || "";

  const avatarPreview = document.getElementById("profile-avatar-preview");
  if (state.profile.avatarBase64) {
    avatarPreview.innerHTML = `<img src="${state.profile.avatarBase64}" alt="avatar" />`;
  } else {
    const name =
      state.profile.preferredName ||
      state.profile.fullName ||
      state.user?.username ||
      "?";
    avatarPreview.textContent = initialsForName(name);
  }
}

// ===== NUMBERS VIEW =====
function wireNumbers() {
  const btnInterpret = document.getElementById("btn-interpret-number");
  const input = document.getElementById("input-seen-number");
  const result = document.getElementById("seen-number-result");

  btnInterpret.addEventListener("click", () => {
    const text = input.value.trim();
    result.textContent = interpretSeenNumber(text);
  });
}

function renderNumbersView() {
  const coreDiv = document.getElementById("numbers-core-path");
  const nameDiv = document.getElementById("numbers-name-based");
  const phasesDiv = document.getElementById("numbers-phases");

  const nums = state.profile.numbers || {};

  if (!nums.lifePath) {
    coreDiv.innerHTML =
      "<p>Life path is missing. Set your birthdate in Profile and save.</p>";
  } else {
    coreDiv.innerHTML = `
      <p><strong>Life path:</strong> ${nums.lifePath}</p>
      <p>${lifePathSummary(nums.lifePath)}</p>
      <p><strong>Birthday number:</strong> ${nums.birthday ?? "—"}</p>
      <p>This adds a more specific flavor to your life path — how you approach your path day-to-day.</p>
    `;
  }

  if (!state.profile.fullName && !state.profile.preferredName) {
    nameDiv.innerHTML =
      "<p>Add your full name in Profile to unlock destiny, soul, personality, and karmic lessons.</p>";
  } else {
    nameDiv.innerHTML = `
      <p><strong>Destiny (Expression):</strong> ${nums.destiny ?? "—"}</p>
      <p>${destinySummary(nums.destiny)}</p>
      <p><strong>Soul urge:</strong> ${nums.soulUrge ?? "—"}</p>
      <p>${soulUrgeSummary(nums.soulUrge)}</p>
      <p><strong>Personality:</strong> ${nums.personality ?? "—"}</p>
      <p>${personalitySummary(nums.personality)}</p>
      <p><strong>Karmic lessons:</strong> ${
        nums.karmicLessons && nums.karmicLessons.length
          ? nums.karmicLessons.join(", ")
          : "None missing — you have some of every vibration in your name."
      }</p>
    `;
  }

  phasesDiv.innerHTML = `
    <p><strong>Maturity number:</strong> ${nums.maturity ?? "—"}</p>
    <p>${
      nums.maturity
        ? "This shows what you grow into over time — a blend of your life path and destiny."
        : "Set both birthdate and full name to compute your maturity number."
    }</p>
    <p><strong>Balance number:</strong> ${nums.balance ?? "—"}</p>
    <p>${
      nums.balance
        ? "This hints at how you naturally respond when emotions run high or conflict appears."
        : "Balance appears when you have at least a first and last name set."
    }</p>
  `;
}

// ===== READINGS VIEW =====
function wireReadings() {
  document
    .getElementById("btn-upgrade-readings")
    .addEventListener("click", () => openSettings());
}

function renderReadingsView() {
  const lp = state.profile.numbers.lifePath;
  const freeDiv = document.getElementById("reading-life-path");
  const advancedCard = document.getElementById("card-advanced-readings");
  const advancedContent = document.getElementById("reading-advanced");
  const overlay = advancedCard.querySelector(".lock-overlay");

  freeDiv.innerHTML = lp
    ? `<p>Your life path is <strong>${lp}</strong>.</p><p>${lifePathSummary(lp)}</p><p>This is the backbone of your experience here. The rest of your numbers add color, but this road stays constant.</p>`
    : "<p>Set your birthdate in Profile to unlock your life path reading.</p>";

  if (state.tiers.proUnlocked) {
    advancedCard.classList.remove("locked");
    overlay.classList.add("hidden");
    advancedContent.classList.remove("hidden");

    const nums = state.profile.numbers || {};
    advancedContent.innerHTML = `
      <h4>Multi-layer reading</h4>
      <p><strong>Destiny:</strong> ${nums.destiny ?? "—"}</p>
      <p>${destinySummary(nums.destiny)}</p>
      <p><strong>Soul urge:</strong> ${nums.soulUrge ?? "—"}</p>
      <p>${soulUrgeSummary(nums.soulUrge)}</p>
      <p><strong>Personality:</strong> ${nums.personality ?? "—"}</p>
      <p>${personalitySummary(nums.personality)}</p>
      <p><strong>Maturity:</strong> ${nums.maturity ?? "—"}</p>
      <p>This is the energy you grow into as life unfolds. Often it becomes more obvious after midlife.</p>
      <p><strong>Karmic lessons:</strong> ${
        nums.karmicLessons && nums.karmicLessons.length
          ? nums.karmicLessons.join(", ")
          : "None missing — you carry all number vibrations in your signature."
      }</p>
      <p>Your karmic lessons show where life keeps giving you practice reps. The same themes repeat until you move with them consciously.</p>
      <p><strong>Balance:</strong> ${nums.balance ?? "—"}</p>
      <p>Balance hints at how you handle emotional disruption. Working with this consciously can change how conflicts feel from the inside.</p>
      <p class="tip">Use the Spirit Guide when you want this reading translated into language tuned to your current situation.</p>
    `;
  } else {
    advancedCard.classList.add("locked");
    overlay.classList.remove("hidden");
    advancedContent.classList.add("hidden");
  }
}

// ===== SPIRIT GUIDE =====
function wireSpirit() {
  const btn = document.getElementById("btn-spirit-generate");
  const speakBtn = document.getElementById("btn-spirit-speak");
  const focusSelect = document.getElementById("spirit-focus");
  const questionInput = document.getElementById("spirit-question");
  const outputDiv = document.getElementById("spirit-output");

  btn.addEventListener("click", () => {
    const focus = focusSelect.value;
    const question = questionInput.value.trim();
    const html = generateSpiritInsight(focus, question);
    outputDiv.innerHTML = html;

    emitSafe("spirit:question", {
      userId: state.user?.id,
      focus,
      question,
      numbers: state.profile.numbers,
      profile: {
        name:
          state.profile.preferredName ||
          state.profile.fullName ||
          state.user?.username,
        challenge: state.profile.challenge,
        goal: state.profile.goal,
      },
    });
  });

  speakBtn.addEventListener("click", () => {
    const text =
      outputDiv.innerText ||
      "There is nothing to read yet. Ask the Spirit Guide a question first.";
    speakText(text);
  });
}

function speakText(text) {
  if (!("speechSynthesis" in window)) {
    showToast("Speech not supported in this browser.");
    return;
  }
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = 0.95;
  utter.pitch = 1.05;
  utter.lang = "en-US";
  speechSynthesis.speak(utter);
}

function renderSpiritView() {
  updateTierPill();
}

function generateSpiritInsight(focus, question) {
  const p = state.profile;
  const n = p.numbers || {};
  const name = p.preferredName || p.fullName || state.user?.username || "you";

  const hasCore =
    n.lifePath || n.destiny || n.soulUrge || n.personality || n.maturity;

  if (!hasCore && focus !== "tour") {
    return `<p>You have not given me much to work with yet. Start by filling in your Profile with your full name and birthdate, then come back and ask again.</p>`;
  }

  if (focus === "tour") {
    return spiritTourText(name);
  }

  const segments = [];

  segments.push(
    `<p><strong>Spirit speaking to ${name}:</strong> I am reading your numbers as a pattern, not as fixed rules. The point is navigation, not judgment.</p>`
  );

  if (n.lifePath) {
    segments.push(
      `<p><strong>Life path ${n.lifePath}:</strong> ${lifePathSummary(
        n.lifePath
      )}</p>`
    );
  }
  if (n.destiny) {
    segments.push(
      `<p><strong>Destiny ${n.destiny}:</strong> ${destinySummary(n.destiny)}</p>`
    );
  }
  if (n.soulUrge) {
    segments.push(
      `<p><strong>Soul urge ${n.soulUrge}:</strong> ${soulUrgeSummary(
        n.soulUrge
      )}</p>`
    );
  }
  if (n.personality) {
    segments.push(
      `<p><strong>Personality ${n.personality}:</strong> ${personalitySummary(
        n.personality
      )}</p>`
    );
  }

  segments.push(`<p>${spiritFocusLayer(focus, p, n)}</p>`);

  if (question) {
    segments.push(
      `<p><strong>I heard your question:</strong> “${question}”<br>${spiritQuestionLayer(
        question,
        p,
        n
      )}</p>`
    );
  }

  segments.push(
    `<p class="tip">Nothing here replaces your own choice. Use this as a mirror, not a command. Check what resonates in your body, not just your mind.</p>`
  );

  return segments.join("");
}

function spiritTourText(name) {
  return `
    <p><strong>Welcome, ${name}.</strong> Let me show you how this space works so you can move with confidence.</p>
    <p><strong>Step 1 – Profile:</strong> Go to the Profile tab and enter your full birth name, the name you go by now, and your birthdate. If you tell me what you’re struggling with and what you’re building, my guidance gets sharper.</p>
    <p><strong>Step 2 – Numbers:</strong> Once you save, the Numbers tab will light up with your life path, destiny, soul urge, personality, birthday, maturity, karmic lessons, and balance. Think of this as your numeric fingerprint.</p>
    <p><strong>Step 3 – Readings:</strong> The Readings tab gives you a focused interpretation. Free mode explains your life path. Pro opens a multi-layer reading that ties everything together.</p>
    <p><strong>Step 4 – Ask me:</strong> Come back here, choose what you want support with, and ask a question if you like. I will translate your numbers into next steps and perspective.</p>
    <p class="tip">You do not have to do everything at once. Start with one honest field in Profile, save, and we will build from there.</p>
  `;
}

function spiritFocusLayer(focus, profile, nums) {
  if (focus === "numbers") {
    return "You have given me a numeric map. My job is to help you feel it in your actual life. Start by reading your life path and destiny slowly, and notice which phrases make your body react. That is where we will work.";
  }
  if (focus === "decision") {
    return "When you face a decision, do not ask, “What will impress people?” Ask instead, “Which option respects my life path energy and my soul urge?” The right path may feel more vulnerable but less exhausting.";
  }
  if (focus === "stuck") {
    return "Feeling stuck usually means one of your numbers is underfed. Life path wants movement in its direction, soul urge wants nourishment, and destiny wants a long-term project. Feed all three gently and stuckness loosens.";
  }
  if (focus === "path") {
    return "Your path is not a single door you must find. It is a pattern you are already walking. By honoring your life path energy in small daily ways, bigger paths reveal themselves without forcing.";
  }
  return "Use each section of this app as a mirror, not a verdict. If something does not resonate, we adjust how we read it instead of forcing it to fit.";
}

function spiritQuestionLayer(question, profile, nums) {
  const q = question.toLowerCase();
  let text = "";

  if (q.includes("job") || q.includes("career") || q.includes("work") || q.includes("money")) {
    text +=
      "For work and money questions, look at your life path and destiny first. They show what kind of contribution actually fits you. ";
    if (nums.lifePath === 8 || nums.destiny === 8) {
      text +=
        "You carry 8 energy, which means power, resources, and leadership are not accidents in your story. Do not shrink from responsibility you are ready for.";
    } else if (nums.lifePath === 4 || nums.destiny === 4) {
      text +=
        "You carry 4 energy, so building something solid, even slowly, will satisfy you more than quick wins that evaporate.";
    } else {
      text +=
        "Find the intersection between what feels meaningful and what you can do consistently without burning out. That is usually where your numbers want you.";
    }
  } else if (q.includes("love") || q.includes("relationship") || q.includes("partner")) {
    text +=
      "For love and relationships, your soul urge and personality numbers matter most. They tell you what you need and how you tend to show up. ";
    if (nums.soulUrge === 2 || nums.lifePath === 2) {
      text +=
        "You are built for togetherness and emotional tuning. Do not pretend you are fine with half-connection; it will drain you.";
    } else if (nums.soulUrge === 5 || nums.lifePath === 5) {
      text +=
        "You need both connection and breathing room. Design relationships where change and growth are welcomed, not feared.";
    } else {
      text +=
        "Ask yourself what your nervous system actually experiences as safety and aliveness, and let that be your standard.";
    }
  } else if (q.includes("purpose") || q.includes("path") || q.includes("why")) {
    text +=
      "Purpose questions are really “alignment” questions. Your life path shows how you move, your destiny shows what you build, and your soul urge shows what keeps you emotionally alive. When all three agree, you feel on purpose.";
  } else {
    text +=
      "Even if your question sounds specific, the real work is noticing whether your current choices honor your core pattern or try to overwrite it. Move by small honest steps rather than dramatic swings.";
  }

  return text;
}
