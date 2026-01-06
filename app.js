// Basic in-memory state
let state = {
  user: null,
  profile: null,
  tiers: { proUnlocked: false, socialUnlocked: false },
  settings: { theme: "dark", notificationsEnabled: false },
  currentRoute: "dashboard",
  connections: [],
  messages: {},
};

const STORAGE_KEYS = {
  user: "numerology_user",
  profile: "numerology_profile",
  tiers: "numerology_tiers",
  settings: "numerology_settings",
  connections: "numerology_connections",
  messages: "numerology_messages",
};

document.addEventListener("DOMContentLoaded", () => {
  wireAuthUI();
  wireNav();
  wireSettings();
  wireDaily();
  wireNumbers();
  wireConnections();
  wireReadings();
  loadStateFromStorage();
  initTheme();
  decideInitialScreen();
});

/* Utilities */

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

/* State / initialization */

function loadStateFromStorage() {
  state.user = load(STORAGE_KEYS.user);
  state.profile = load(STORAGE_KEYS.profile) || null;
  state.tiers = load(STORAGE_KEYS.tiers, { proUnlocked: false, socialUnlocked: false }) || {
    proUnlocked: false,
    socialUnlocked: false,
  };
  state.settings = load(STORAGE_KEYS.settings, { theme: "dark", notificationsEnabled: false }) || {
    theme: "dark",
    notificationsEnabled: false,
  };
  state.connections = load(STORAGE_KEYS.connections, []);
  state.messages = load(STORAGE_KEYS.messages, {});
}

function persistAll() {
  if (state.user) save(STORAGE_KEYS.user, state.user);
  if (state.profile) save(STORAGE_KEYS.profile, state.profile);
  save(STORAGE_KEYS.tiers, state.tiers);
  save(STORAGE_KEYS.settings, state.settings);
  save(STORAGE_KEYS.connections, state.connections);
  save(STORAGE_KEYS.messages, state.messages);
}

function decideInitialScreen() {
  const screenAuth = document.getElementById("screen-auth");
  const screenMain = document.getElementById("screen-main");
  if (state.user) {
    screenAuth.classList.add("hidden");
    screenMain.classList.remove("hidden");
    renderAllViews();
  } else {
    screenAuth.classList.remove("hidden");
    screenMain.classList.add("hidden");
  }
}

/* Theme */

function initTheme() {
  if (state.settings.theme === "light") {
    document.body.classList.add("light");
  } else {
    document.body.classList.remove("light");
  }
}

/* Auth */

function wireAuthUI() {
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
    const passwordHash = simpleHash(password + salt);

    state.user = {
      id: "user-1",
      username,
      passwordHash,
      salt,
      createdAt: new Date().toISOString(),
    };
    state.profile = {
      name: username,
      bio: "",
      birthdate: "",
      avatarBase64: null,
      lifePath: null,
      destiny: null,
      soulUrge: null,
      personality: null,
      themeAccent: "default",
    };

    persistAll();
    error.textContent = "";
    decideInitialScreen();
    showToast("Account created on this device.");
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
    state.profile = load(STORAGE_KEYS.profile);
    loadStateFromStorage();
    error.textContent = "";
    decideInitialScreen();
    showToast("Welcome back.");
  });
}

function simpleHash(str) {
  let hash = 0,
    i,
    chr;
  if (str.length === 0) return "0";
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return String(hash);
}

/* Navigation */

function wireNav() {
  const navButtons = document.querySelectorAll(".nav-btn");
  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const route = btn.dataset.route;
      setRoute(route);
    });
  });

  document.getElementById("btn-go-enter-number").addEventListener("click", () => {
    setRoute("numbers");
  });
  document.getElementById("btn-go-upgrade").addEventListener("click", () => {
    openSettings();
  });
}

function setRoute(route) {
  state.currentRoute = route;
  const navButtons = document.querySelectorAll(".nav-btn");
  navButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.route === route);
  });

  const views = document.querySelectorAll(".view");
  views.forEach((view) => {
    view.classList.remove("active");
  });

  const targetView = document.getElementById(`view-${route}`);
  if (targetView) {
    targetView.classList.add("active");
  }

  const title = document.getElementById("topbar-title");
  title.textContent = route.charAt(0).toUpperCase() + route.slice(1);

  renderRoute(route);
}

/* Settings */

function wireSettings() {
  const btnOpen = document.getElementById("btn-open-settings");
  const btnClose = document.getElementById("btn-close-settings");
  const modal = document.getElementById("modal-settings");
  const themeSelect = document.getElementById("settings-theme");
  const btnSaveProfile = document.getElementById("btn-save-profile");
  const btnLogout = document.getElementById("btn-logout");
  const btnReset = document.getElementById("btn-reset-all");
  const btnExport = document.getElementById("btn-export-data");

  btnOpen.addEventListener("click", openSettings);
  btnClose.addEventListener("click", () => modal.classList.add("hidden"));

  themeSelect.addEventListener("change", () => {
    state.settings.theme = themeSelect.value;
    save(STORAGE_KEYS.settings, state.settings);
    initTheme();
  });

  btnSaveProfile.addEventListener("click", () => {
    const name = document.getElementById("settings-name").value.trim();
    const bio = document.getElementById("settings-bio").value.trim();
    const birthdate = document.getElementById("settings-birthdate").value;

    state.profile = state.profile || {};
    state.profile.name = name || state.user?.username || "Seeker";
    state.profile.bio = bio;
    state.profile.birthdate = birthdate;

    // Derive numerology when birthdate is set
    if (birthdate) {
      state.profile.lifePath = computeLifePath(birthdate);
      // Other numbers can be derived similarly or via name
    }

    save(STORAGE_KEYS.profile, state.profile);
    renderAllViews();
    showToast("Profile updated.");
  });

  btnLogout.addEventListener("click", () => {
    state.user = null;
    persistAll();
    localStorage.removeItem(STORAGE_KEYS.user);
    decideInitialScreen();
  });

  btnReset.addEventListener("click", () => {
    if (!confirm("This will erase all numerology data on this device. Continue?")) return;
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
    location.reload();
  });

  btnExport.addEventListener("click", () => {
    const payload = {
      user: state.user,
      profile: state.profile,
      tiers: state.tiers,
      settings: state.settings,
      connections: state.connections,
      messages: state.messages,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "numerology-data.json";
    a.click();
    URL.revokeObjectURL(url);
  });

  document.getElementById("btn-open-paypal-pro").addEventListener("click", () => {
    // Placeholder: integrate with PayPal Enterprise payment link
    showToast("Redirecting to PayPal Pro checkout (to be wired).");
  });

  document.getElementById("btn-open-paypal-social").addEventListener("click", () => {
    // Placeholder: integrate with PayPal Enterprise payment link
    showToast("Redirecting to PayPal Cosmic Connect checkout (to be wired).");
  });
}

function openSettings() {
  const modal = document.getElementById("modal-settings");
  modal.classList.remove("hidden");

  // Populate fields
  const name = document.getElementById("settings-name");
  const bio = document.getElementById("settings-bio");
  const birthdate = document.getElementById("settings-birthdate");
  const theme = document.getElementById("settings-theme");
  const tierStatus = document.getElementById("tier-status");

  name.value = state.profile?.name || "";
  bio.value = state.profile?.bio || "";
  birthdate.value = state.profile?.birthdate || "";
  theme.value = state.settings.theme;

  let msg = "Free tier active.";
  if (state.tiers.proUnlocked) msg += " Pro Numerology unlocked.";
  if (state.tiers.socialUnlocked) msg += " Cosmic Connect unlocked.";
  tierStatus.textContent = msg;
}

/* Numerology computations (simplified) */

function computeLifePath(dateStr) {
  // dateStr: "YYYY-MM-DD"
  const digits = dateStr.replace(/[^0-9]/g, "").split("").map(Number);
  let sum = digits.reduce((a, b) => a + b, 0);

  const masterNumbers = [11, 22, 33];
  while (sum > 9 && !masterNumbers.includes(sum)) {
    sum = String(sum)
      .split("")
      .map(Number)
      .reduce((a, b) => a + b, 0);
  }
  return sum;
}

function interpretSeenNumber(numStr) {
  const cleaned = numStr.replace(/\s+/g, "");
  if (!cleaned) return "Enter a number to interpret.";

  if (/^(111|222|333|444|555|666|777|888|999)$/.test(cleaned)) {
    return `Repeating ${cleaned[0]}s: intensified energy of ${cleaned[0]} asking for your attention.`;
  }

  return "This number is nudging you to stay aware. In Pro, you can unlock a deeper breakdown.";
}

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

function dailyTipForLifePath(lp) {
  const generic = "Take one conscious action aligned with what you already know matters.";
  if (!lp) return generic;
  const tips = {
    1: "Lead one small decision today instead of waiting for permission.",
    2: "Offer someone a moment of genuine listening today.",
    3: "Express yourself in one unfiltered creative way before sleep.",
    4: "Choose one system or routine and tighten it by 1%.",
    5: "Say yes to one new experience, even if it is small.",
    6: "Bring beauty or comfort into one shared space today.",
    7: "Block out time for quiet reflection without your phone.",
    8: "Move one step toward a concrete goal, even if invisible to others.",
    9: "Release one thing you no longer need, physical or emotional.",
  };
  return tips[lp] || generic;
}

function careerTipForLifePath(lp) {
  const tips = {
    1: "Own your authority: pitch your ideas instead of waiting to be asked.",
    2: "Lean into roles that let you coordinate and harmonize teams.",
    3: "Seek work that rewards communication, storytelling, or performance.",
    4: "Choose environments where building systems is respected, not rushed.",
    5: "Opt into roles with variety and movement; avoid cages.",
    6: "Look for positions where you can support people or environments directly.",
    7: "Favor research, analysis, or spiritual-intellectual work over constant extroversion.",
    8: "Align with roles that allow real impact, leadership, or resource management.",
    9: "Choose work that feels meaningful and carries a sense of service.",
  };
  return tips[lp] || "Align your work with what feels meaningful, not just what feels safe.";
}

function familyTipForLifePath(lp) {
  const tips = {
    1: "Lead with example at home, not just instructions.",
    2: "Prioritize honest conversations; your peace often comes from clarity.",
    3: "Make room for play and humor in your relationships.",
    4: "Create simple, reliable rituals that give everyone stability.",
    5: "Stay present with loved ones; your restless energy needs anchoring.",
    6: "Remember to also receive care, not only give it.",
    7: "Share your inner world more often so people do not misread your silence.",
    8: "Notice when ambition pulls you away; consciously return to the people you love.",
    9: "Practice forgiving the past at home, including your own mistakes.",
  };
  return tips[lp] || "Bring more honesty and presence into your closest bonds today.";
}

/* Render functions */

function renderAllViews() {
  renderDashboard();
  renderNumbers();
  renderDaily();
  renderConnections();
  renderReadings();
}

function renderRoute(route) {
  if (route === "dashboard") renderDashboard();
  if (route === "numbers") renderNumbers();
  if (route === "guidance") renderDaily();
  if (route === "connections") renderConnections();
  if (route === "readings") renderReadings();
}

function renderDashboard() {
  const lp = state.profile?.lifePath || null;
  const lifePathDiv = document.getElementById("dashboard-life-path");
  const dailyDiv = document.getElementById("dashboard-daily-tip");

  if (!lp) {
    lifePathDiv.innerHTML =
      "<p>Set your birthdate in Settings to see your life path number.</p>";
  } else {
    lifePathDiv.innerHTML = `
      <h4>Life path ${lp}</h4>
      <p>${lifePathSummary(lp)}</p>
    `;
  }

  const tip = dailyTipForLifePath(lp);
  dailyDiv.innerHTML = `
    <h4>Today's tip</h4>
    <p>${tip}</p>
  `;
}

function renderNumbers() {
  const coreDiv = document.getElementById("numbers-core");
  const profile = state.profile;
  if (!profile?.birthdate) {
    coreDiv.innerHTML =
      "<p>Set your birthdate in Settings to unlock your core numbers.</p>";
    return;
  }

  const lp = profile.lifePath;
  coreDiv.innerHTML = `
    <p><strong>Life path:</strong> ${lp}</p>
    <p>${lifePathSummary(lp)}</p>
  `;
}

function renderDaily() {
  const lp = state.profile?.lifePath || null;
  const freeDiv = document.getElementById("daily-free");
  freeDiv.innerHTML = `
    <h4>Life path daily</h4>
    <p>${dailyTipForLifePath(lp)}</p>
  `;

  const proCard = document.getElementById("daily-pro");
  const proContent = document.getElementById("daily-pro-content");
  const overlay = proCard.querySelector(".lock-overlay");

  if (state.tiers.proUnlocked) {
    proCard.classList.remove("locked");
    overlay.classList.add("hidden");
    proContent.classList.remove("hidden");
    proContent.innerHTML = `
      <h4>Career and family lens</h4>
      <p><strong>Career:</strong> ${careerTipForLifePath(lp)}</p>
      <p><strong>Family:</strong> ${familyTipForLifePath(lp)}</p>
    `;
  } else {
    proCard.classList.add("locked");
    overlay.classList.remove("hidden");
    proContent.classList.add("hidden");
  }
}

function wireDaily() {
  document
    .getElementById("btn-upgrade-from-daily")
    .addEventListener("click", () => openSettings());
}

/* Numbers view */

function wireNumbers() {
  const btnInterpret = document.getElementById("btn-interpret-number");
  const input = document.getElementById("input-seen-number");
  const result = document.getElementById("seen-number-result");

  btnInterpret.addEventListener("click", () => {
    const text = input.value.trim();
    result.textContent = interpretSeenNumber(text);
  });
}

/* Connections */

function wireConnections() {
  const btnAdd = document.getElementById("btn-add-connection");
  const connectionsLockedCard = document.getElementById("connections-locked");
  const connectionsContent = document.getElementById("connections-content");
  const btnUpgradeConnections = document.getElementById("btn-upgrade-connections");

  btnUpgradeConnections.addEventListener("click", () => openSettings());

  btnAdd.addEventListener("click", () => {
    if (!state.tiers.socialUnlocked) {
      showToast("Unlock Cosmic Connect to add saved connections.");
      return;
    }
    const name = prompt("Connection name:");
    if (!name) return;
    const birthdate = prompt("Connection birthdate (YYYY-MM-DD):");
    if (!birthdate) return;

    const lp = computeLifePath(birthdate);
    const id = `conn-${Date.now()}`;
    const connection = {
      id,
      name,
      relation: "",
      birthdate,
      lifePath: lp,
      compatibilityScore: computeCompatibility(lp, state.profile?.lifePath || null),
    };
    state.connections.push(connection);
    save(STORAGE_KEYS.connections, state.connections);
    renderConnections();
  });

  function computeCompatibility(lpA, lpB) {
    if (!lpA || !lpB) return null;
    // Extremely simple placeholder compatibility metric
    const diff = Math.abs(lpA - lpB);
    if (diff === 0) return 90;
    if (diff === 1) return 82;
    if (diff === 2) return 74;
    if (diff >= 7) return 55;
    return 68;
  }

  // Expose to state for use in render
  window.computeCompatibility = computeCompatibility;
}

function renderConnections() {
  const lockedCard = document.getElementById("connections-locked");
  const content = document.getElementById("connections-content");
  const listDiv = document.getElementById("connection-list");
  const detailDiv = document.getElementById("connection-detail");
  const messagesDiv = document.getElementById("connection-messages");

  if (!state.tiers.socialUnlocked) {
    lockedCard.classList.remove("hidden");
    content.classList.add("hidden");
    return;
  }

  lockedCard.classList.add("hidden");
  content.classList.remove("hidden");

  if (!state.connections.length) {
    listDiv.innerHTML = "<p>No saved connections yet.</p>";
    detailDiv.innerHTML = "";
    messagesDiv.innerHTML = "";
    return;
  }

  let html = "<h4>Your connections</h4>";
  state.connections.forEach((conn) => {
    html += `
      <button class="secondary small" data-conn-id="${conn.id}">
        ${conn.name} (LP ${conn.lifePath})
      </button>
    `;
  });
  listDiv.innerHTML = html;

  const buttons = listDiv.querySelectorAll("[data-conn-id]");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.connId;
      const conn = state.connections.find((c) => c.id === id);
      if (!conn) return;
      renderConnectionDetail(conn);
      renderConnectionMessages(conn);
    });
  });

  // Show first by default
  renderConnectionDetail(state.connections[0]);
  renderConnectionMessages(state.connections[0]);

  function renderConnectionDetail(conn) {
    const score = conn.compatibilityScore;
    detailDiv.innerHTML = `
      <h4>${conn.name}</h4>
      <p><strong>Birthdate:</strong> ${conn.birthdate}</p>
      <p><strong>Life path:</strong> ${conn.lifePath}</p>
      <p><strong>Compatibility score:</strong> ${score ?? "N/A"}</p>
      <p>This is a local-only connection. When a backend is added, this can become real matching.</p>
    `;
  }

  function renderConnectionMessages(conn) {
    const thread = state.messages[conn.id] || [];
    let html = `<h4>Messages with ${conn.name}</h4><div class="messages-thread">`;
    if (!thread.length) {
      html += `<p class="tip">Start a local private thread with this connection. Stored on this device only.</p>`;
    } else {
      thread.forEach((msg) => {
        html += `<div class="message"><p>${msg.text}</p><span>${new Date(
          msg.timestamp
        ).toLocaleString()}</span></div>`;
      });
    }
    html += `</div>
      <div class="messages-input">
        <textarea id="msg-input-${conn.id}" rows="2" placeholder="Type a message..."></textarea>
        <button class="primary small" data-send-id="${conn.id}">Send</button>
      </div>`;
    messagesDiv.innerHTML = html;

    const btnSend = messagesDiv.querySelector("[data-send-id]");
    const textarea = messagesDiv.querySelector("textarea");

    btnSend.addEventListener("click", () => {
      const text = textarea.value.trim();
      if (!text) return;
      const msg = {
        id: `msg-${Date.now()}`,
        fromUser: true,
        text,
        timestamp: new Date().toISOString(),
      };
      if (!state.messages[conn.id]) state.messages[conn.id] = [];
      state.messages[conn.id].push(msg);
      save(STORAGE_KEYS.messages, state.messages);
      renderConnectionMessages(conn);
    });
  }
}

/* Readings */

function wireReadings() {
  document.getElementById("btn-upgrade-readings").addEventListener("click", () => openSettings());
}

function renderReadings() {
  const lp = state.profile?.lifePath || null;
  const freeDiv = document.getElementById("reading-life-path");
  const advancedCard = document.getElementById("card-advanced-readings");
  const advancedContent = document.getElementById("reading-advanced");
  const overlay = advancedCard.querySelector(".lock-overlay");

  freeDiv.innerHTML = lp
    ? `<p>Your life path is <strong>${lp}</strong>.</p><p>${lifePathSummary(lp)}</p>`
    : "<p>Set your birthdate in Settings to see your life path reading.</p>";

  if (state.tiers.proUnlocked) {
    advancedCard.classList.remove("locked");
    overlay.classList.add("hidden");
    advancedContent.classList.remove("hidden");
    advancedContent.innerHTML = `
      <h4>Advanced reading (stub)</h4>
      <p>Here you will see destiny, soul urge, personality, and your current cycle.</p>
    `;
  } else {
    advancedCard.classList.add("locked");
    overlay.classList.remove("hidden");
    advancedContent.classList.add("hidden");
  }
}
