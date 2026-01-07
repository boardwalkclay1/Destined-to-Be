// ===== CONFIG =====
const SOCKET_URL = "https://your-socket-server.example.com"; // <-- change to your Socket.IO backend

// ===== STATE =====
let socket = null;
let state = {
  user: null,
  profile: null,
  tiers: { proUnlocked: false, socialUnlocked: false },
  settings: { theme: "dark", notificationsEnabled: false },
  currentRoute: "dashboard",
  friends: [],           // from server
  onlineUsers: [],       // from server for map
  activeChatFriendId: null,
};

const STORAGE_KEYS = {
  user: "numerology_user",
  profile: "numerology_profile",
  tiers: "numerology_tiers",
  settings: "numerology_settings",
};

// ===== BOOTSTRAP =====
document.addEventListener("DOMContentLoaded", () => {
  wireAuthUI();
  wireNav();
  wireSettings();
  wireDaily();
  wireNumbers();
  wireConnectionsUI();
  wireReadingsUI();
  wireSpiritGuide();
  loadStateFromStorage();
  initTheme();
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

// ===== STATE INIT =====
function loadStateFromStorage() {
  state.user = load(STORAGE_KEYS.user);
  state.profile = load(STORAGE_KEYS.profile) || null;
  state.tiers =
    load(STORAGE_KEYS.tiers, { proUnlocked: false, socialUnlocked: false }) || {
      proUnlocked: false,
      socialUnlocked: false,
    };
  state.settings =
    load(STORAGE_KEYS.settings, { theme: "dark", notificationsEnabled: false }) || {
      theme: "dark",
      notificationsEnabled: false,
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
    initSocket();
    renderAllViews();
  } else {
    screenAuth.classList.remove("hidden");
    screenMain.classList.add("hidden");
  }
}

// ===== THEME =====
function initTheme() {
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
    socket.emit("auth:hello", {
      userId: state.user.id,
      username: state.user.username,
      profile: state.profile,
    });
  });

  socket.on("friends:update", (friends) => {
    state.friends = friends || [];
    renderConnections();
  });

  socket.on("chat:message", (msg) => {
    handleIncomingChat(msg);
  });

  socket.on("presence:update", (onlineUsers) => {
    state.onlineUsers = onlineUsers || [];
    renderConnectionsMap();
  });

  socket.on("friend:request:result", (payload) => {
    const resDiv = document.getElementById("connections-search-result");
    if (payload.ok) {
      resDiv.textContent = "Request sent.";
    } else {
      resDiv.textContent = payload.error || "Could not send request.";
    }
  });
}

function emitSafe(event, payload) {
  if (!socket || !socket.connected) return;
  socket.emit(event, payload);
}

// ===== AUTH =====
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

    // Local ID; backend should also map this username to its own ID if needed
    state.user = {
      id: "user-" + username,
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
      sun: null,
      moon: null,
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
    state.profile = load(STORAGE_KEYS.profile) || state.profile;
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

// ===== NAV =====
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
  views.forEach((view) => view.classList.remove("active"));

  const targetView = document.getElementById(`view-${route}`);
  if (targetView) targetView.classList.add("active");

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
  const btnSaveProfile = document.getElementById("btn-save-profile");
  const btnLogout = document.getElementById("btn-logout");
  const btnReset = document.getElementById("btn-reset-all");
  const btnExport = document.getElementById("btn-export-data");
  const avatarInput = document.getElementById("settings-avatar");

  btnOpen.addEventListener("click", openSettings);
  btnClose.addEventListener("click", () => modal.classList.add("hidden"));

  themeSelect.addEventListener("change", () => {
    state.settings.theme = themeSelect.value;
    save(STORAGE_KEYS.settings, state.settings);
    initTheme();
  });

  avatarInput.addEventListener("change", handleAvatarUpload);

  btnSaveProfile.addEventListener("click", () => {
    const name = document.getElementById("settings-name").value.trim();
    const bio = document.getElementById("settings-bio").value.trim();
    const birthdate = document.getElementById("settings-birthdate").value;

    state.profile = state.profile || {};
    state.profile.name = name || state.user?.username || "Seeker";
    state.profile.bio = bio;
    state.profile.birthdate = birthdate;

    if (birthdate) {
      state.profile.lifePath = computeLifePath(birthdate);
    }

    if (state.profile.name) {
      const nameNums = computeNameNumbers(state.profile.name);
      state.profile.destiny = nameNums.destiny;
      state.profile.soulUrge = nameNums.soulUrge;
      state.profile.personality = nameNums.personality;
    }

    save(STORAGE_KEYS.profile, state.profile);
    persistAll();
    renderAllViews();
    emitSafe("profile:update", { userId: state.user.id, profile: state.profile });
    showToast("Profile updated.");
  });

  btnLogout.addEventListener("click", () => {
    state.user = null;
    persistAll();
    localStorage.removeItem(STORAGE_KEYS.user);
    if (socket) {
      socket.disconnect();
      socket = null;
    }
    decideInitialScreen();
  });

  btnReset.addEventListener("click", () => {
    if (!confirm("This will erase all numerology data on this device. Continue?")) return;
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
    if (socket) {
      socket.disconnect();
      socket = null;
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
    a.download = "numerology-data.json";
    a.click();
    URL.revokeObjectURL(url);
  });

  document
    .getElementById("btn-open-paypal-pro")
    .addEventListener("click", () => showToast("PayPal Pro checkout (to be wired)."));

  document
    .getElementById("btn-open-paypal-social")
    .addEventListener("click", () =>
      showToast("PayPal Cosmic Connect checkout (to be wired).")
    );

  // Dev toggles
  const tierStatus = document.getElementById("tier-status");
  if (!document.getElementById("dev-unlock-pro")) {
    tierStatus.insertAdjacentHTML(
      "afterend",
      `
      <button id="dev-unlock-pro" class="secondary small-btn" style="margin-top:6px;">Dev: Toggle Pro</button>
      <button id="dev-unlock-social" class="secondary small-btn" style="margin-top:6px;">Dev: Toggle Cosmic Connect</button>
    `
    );

    document.getElementById("dev-unlock-pro").addEventListener("click", () => {
      state.tiers.proUnlocked = !state.tiers.proUnlocked;
      save(STORAGE_KEYS.tiers, state.tiers);
      renderAllViews();
      openSettings();
      showToast(state.tiers.proUnlocked ? "Pro unlocked (dev)." : "Pro locked (dev).");
    });

    document.getElementById("dev-unlock-social").addEventListener("click", () => {
      state.tiers.socialUnlocked = !state.tiers.socialUnlocked;
      save(STORAGE_KEYS.tiers, state.tiers);
      renderAllViews();
      openSettings();
      showToast(
        state.tiers.socialUnlocked
          ? "Cosmic Connect unlocked (dev)."
          : "Cosmic Connect locked (dev)."
      );
    });
  }
}

function openSettings() {
  const modal = document.getElementById("modal-settings");
  modal.classList.remove("hidden");

  const name = document.getElementById("settings-name");
  const bio = document.getElementById("settings-bio");
  const birthdate = document.getElementById("settings-birthdate");
  const theme = document.getElementById("settings-theme");
  const tierStatus = document.getElementById("tier-status");
  const avatarPreview = document.getElementById("settings-avatar-preview");

  name.value = state.profile?.name || "";
  bio.value = state.profile?.bio || "";
  birthdate.value = state.profile?.birthdate || "";
  theme.value = state.settings.theme;

  if (state.profile?.avatarBase64) {
    avatarPreview.innerHTML = `<img src="${state.profile.avatarBase64}" alt="avatar" />`;
  } else {
    avatarPreview.textContent = initialsForName(
      state.profile?.name || state.user?.username || "?"
    );
  }

  let msg = "Free tier active.";
  if (state.tiers.proUnlocked) msg += " Pro Numerology unlocked.";
  if (state.tiers.socialUnlocked) msg += " Cosmic Connect unlocked.";
  tierStatus.textContent = msg;

  updateTierPill();
}

function handleAvatarUpload(e) {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const base64 = reader.result;
    state.profile = state.profile || {};
    state.profile.avatarBase64 = base64;
    save(STORAGE_KEYS.profile, state.profile);
    const avatarPreview = document.getElementById("settings-avatar-preview");
    avatarPreview.innerHTML = `<img src="${base64}" alt="avatar" />`;
    renderDashboard();
    emitSafe("profile:update", { userId: state.user.id, profile: state.profile });
  };
  reader.readAsDataURL(file);
}

// ===== NUMEROLOGY CORE =====
function computeLifePath(dateStr) {
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
  const masterNumbers = [11, 22, 33];
  while (n > 9 && !masterNumbers.includes(n)) {
    n = String(n)
      .split("")
      .map(Number)
      .reduce((a, b) => a + b, 0);
  }
  return n;
}

function computeNameNumbers(name) {
  const clean = name.toUpperCase().replace(/[^A-Z]/g, "");
  if (!clean) return { destiny: null, soulUrge: null, personality: null };

  let total = 0;
  let vowelTotal = 0;
  let consonantTotal = 0;

  for (const ch of clean) {
    const val = LETTER_MAP[ch] || 0;
    total += val;
    if (VOWELS.has(ch)) {
      vowelTotal += val;
    } else {
      consonantTotal += val;
    }
  }

  const destiny = reduceNumber(total);
  const soulUrge = reduceNumber(vowelTotal);
  const personality = reduceNumber(consonantTotal);

  return { destiny, soulUrge, personality };
}

function interpretSeenNumber(numStr) {
  const cleaned = numStr.replace(/\s+/g, "");
  if (!cleaned) return "Enter a number to interpret.";

  if (/^(111|222|333|444|555|666|777|888|999)$/.test(cleaned)) {
    return `Repeating ${cleaned[0]}s: intensified energy of ${cleaned[0]} asking for your attention right now.`;
  }

  if (/^[0-9]+$/.test(cleaned)) {
    const digits = cleaned.split("").map(Number);
    const sum = reduceNumber(digits.reduce((a, b) => a + b, 0));
    return `This number compresses to ${sum}. ${lifePathSummary(
      sum
    )} Ask where this theme is trying to get your attention.`;
  }

  return "Use only digits. Once entered, the app will map it to a core vibration.";
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

function destinySummary(n) {
  if (!n) return "Destiny number not computed yet.";
  const map = {
    1: "You are meant to stand out, initiate, and lead — not follow the script.",
    2: "You are meant to bring people together, soothe conflict, and build bridges.",
    3: "You are meant to inspire through words, art, and authentic expression.",
    4: "You are meant to build structures that last — systems, businesses, foundations.",
    5: "You are meant to experience variety, change, and freedom — and model how to ride it.",
    6: "You are meant to create safe, beautiful spaces and care for people or communities.",
    7: "You are meant to seek deeper truths and share distilled wisdom.",
    8: "You are meant to steward power, resources, and impact in the material world.",
    9: "You are meant to serve something bigger than yourself and help close old cycles.",
    11: "Destiny 11: illuminate paths for others through intuition and insight.",
    22: "Destiny 22: manifest large-scale visions with real, practical structures.",
    33: "Destiny 33: teach and heal at a heart level, often through service.",
  };
  return map[n] || "Your destiny number adds a unique flavor to your path.";
}

function soulUrgeSummary(n) {
  if (!n) return "Soul urge not computed yet.";
  const map = {
    1: "Deep down, you crave independence and the freedom to choose your own way.",
    2: "Deep down, you crave harmony, closeness, and emotional safety.",
    3: "Deep down, you crave expression, play, and being seen in your uniqueness.",
    4: "Deep down, you crave stability and a sense of solid ground beneath you.",
    5: "Deep down, you crave variety, adventure, and fresh experiences.",
    6: "Deep down, you crave being needed and creating a warm, supportive environment.",
    7: "Deep down, you crave solitude, depth, and honest inner exploration.",
    8: "Deep down, you crave influence, results, and tangible progress.",
    9: "Deep down, you crave meaning, compassion, and emotional closure.",
  };
  return map[n] || "Your soul urge shows what your heart really wants.";
}

function personalitySummary(n) {
  if (!n) return "Personality not computed yet.";
  const map = {
    1: "You come across as strong-willed, direct, and self-driven.",
    2: "You come across as gentle, receptive, and diplomatic.",
    3: "You come across as lively, expressive, and creative.",
    4: "You come across as grounded, practical, and reliable.",
    5: "You come across as restless, curious, and adaptable.",
    6: "You come across as caring, responsible, and protective.",
    7: "You come across as thoughtful, reserved, and observant.",
    8: "You come across as confident, ambitious, and authoritative.",
    9: "You come across as compassionate, reflective, and mature.",
  };
  return map[n] || "Your personality number shows how the world first reads your energy.";
}

function dailyTipForLifePath(lp) {
  const generic =
    "Take one conscious action aligned with what you already know matters.";
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

function initialsForName(name) {
  const parts = name.trim().split(/\s+/);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0][0]?.toUpperCase() || "?";
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// ===== SPIRIT GUIDE =====
function wireSpiritGuide() {
  const btn = document.getElementById("btn-spirit-generate");
  const focusSelect = document.getElementById("spirit-focus");
  const questionInput = document.getElementById("spirit-question");
  const outputDiv = document.getElementById("spirit-output");

  btn.addEventListener("click", () => {
    const focus = focusSelect.value;
    const question = questionInput.value.trim();
    const html = generateSpiritInsight(focus, question);
    outputDiv.innerHTML = html + `
      <button id="spirit-speak" class="secondary small-btn" style="margin-top:8px;">Let Spirit speak</button>
    `;
    document.getElementById("spirit-speak").addEventListener("click", () => {
      const plain = outputDiv.innerText;
      speakText(plain);
    });
  });
}

function speakText(text) {
  if (!("speechSynthesis" in window)) {
    showToast("Speech not supported in this browser.");
    return;
  }
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = 0.95;
  utter.pitch = 1.1;
  utter.lang = "en-US";
  speechSynthesis.speak(utter);
}

function generateSpiritInsight(focus, question) {
  const profile = state.profile || {};
  const lp = profile.lifePath;
  const destiny = profile.destiny;
  const soul = profile.soulUrge;
  const personality = profile.personality;
  const sun = profile.sun;
  const moon = profile.moon;

  if (!lp && !destiny && !soul && !personality && !sun && !moon) {
    return "<p>Set your name, birthdate, and (optionally) sun/moon in Settings to unlock a full Spirit reading.</p>";
  }

  const segments = [];

  segments.push(
    `<p><strong>Core current:</strong> Life path ${
      lp ?? "?"
    } flows as ${lifePathSummary(lp)}</p>`
  );

  if (destiny) {
    segments.push(`<p><strong>Destiny ${destiny}:</strong> ${destinySummary(destiny)}</p>`);
  }

  if (soul) {
    segments.push(`<p><strong>Soul urge ${soul}:</strong> ${soulUrgeSummary(soul)}</p>`);
  }

  if (personality) {
    segments.push(
      `<p><strong>Personality ${personality}:</strong> ${personalitySummary(personality)}</p>`
    );
  }

  if (sun || moon) {
    segments.push(
      `<p><strong>Sun in ${sun || "?"}</strong> shapes how your light shows in the world, while <strong>Moon in ${
        moon || "?"
      }</strong> shapes how you hold and process feelings.</p>`
    );
  }

  segments.push(`<p>${buildSpiritFocusLayer(focus, lp, destiny, soul, sun, moon)}</p>`);

  if (question) {
    segments.push(
      `<p><strong>Spirit hears your question:</strong> “${question}”<br>${spiritQuestionLayer(
        question,
        lp,
        destiny,
        soul,
        sun,
        moon
      )}</p>`
    );
  }

  segments.push(
    `<p class="tip">This reading is woven locally from your numbers and signs. Refine your profile to sharpen the voice.</p>`
  );

  return segments.join("");
}

function buildSpiritFocusLayer(focus, lp, destiny, soul, sun, moon) {
  const lpText = lp ? lifePathSummary(lp) : "your unique way of moving through life";
  const dText = destiny ? destinySummary(destiny) : "";
  const sText = soul ? soulUrgeSummary(soul) : "";

  if (focus === "overview") {
    return `Right now, the most important move is to live closer to the center of ${lpText.toLowerCase()}. Your outer path ${
      dText ? "and destiny pattern" : ""
    } and your inner craving ${
      sText ? "of the soul urge" : ""
    } need to be treated as one rhythm, not separate lives.`;
  }

  if (focus === "career") {
    return `In work and money, Spirit is pointing you toward environments that actually respect ${lpText.toLowerCase()}. ${
      destiny
        ? "When your career honors " +
          dText.toLowerCase() +
          ", your effort multiplies."
        : ""
    } ${
      soul
        ? "If your job ignores what your heart craves (" +
          sText.toLowerCase() +
          "), exhaustion is not a glitch — it is a message."
        : ""
    }`;
  }

  if (focus === "relationships") {
    return `In love and connection, your life path shows how you naturally move toward and away from people. ${
      sun
        ? "Your sun sign colors how boldly you shine in connection, while your moon shows how you retreat to process."
        : "Notice how different your public self is from the self that appears when you feel safe."
    } ${
      soul
        ? "Your soul urge is the part of you that cannot pretend to be satisfied when it is not."
        : ""
    }`;
  }

  if (focus === "growth") {
    return `For healing and growth, your numbers suggest that the next level is not about becoming someone else — it is about letting the truest version of you take up more space. Start with one daily habit that honors your natural rhythm instead of fighting it.`;
  }

  return "Bring your daily decisions into alignment with your actual energetic pattern instead of your fear.";
}

function spiritQuestionLayer(question, lp, destiny, soul, sun, moon) {
  const qLow = question.toLowerCase();
  let layer = "";

  if (qLow.includes("job") || qLow.includes("career") || qLow.includes("money")) {
    layer += "Spirit is reading your question through the lens of your path and destiny. ";
    if (lp === 8 || destiny === 8) {
      layer +=
        "Strong 8 current means power, resources, and leadership are part of your contract — playing small feels safe but suffocating.";
    } else if (lp === 4 || destiny === 4) {
      layer +=
        "Your 4 energy wants solid structures; quick wins that do not build anything real tend to leave you empty.";
    } else {
      layer +=
        "Instead of chasing generic success, ask: ‘What does success look like for my exact pattern?’";
    }
  } else if (qLow.includes("love") || qLow.includes("relationship")) {
    layer +=
      "For love, Spirit points to your moon and your soul urge. They show what kind of emotional climate you can actually thrive in. ";
    if (soul === 2 || lp === 2) {
      layer +=
        "You are built for closeness and emotional reciprocity — half-hearted connection drains you more than solitude.";
    } else if (soul === 5 || lp === 5) {
      layer +=
        "You need both freedom and intimacy; agreements that treat change as betrayal are not your home.";
    } else {
      layer +=
        "Define the feeling of ‘home’ in connection before you define the form of the relationship.";
    }
  } else {
    layer +=
      "Your question is a doorway. Spirit is less interested in the surface detail and more focused on whether your next step is aligned with your deeper pattern rather than your fear of disappointing others.";
  }

  return layer;
}

// ===== RENDER PIPELINE =====
function renderAllViews() {
  renderDashboard();
  renderNumbers();
  renderDaily();
  renderConnections();
  renderReadings();
  updateTierPill();
}

function renderRoute(route) {
  if (route === "dashboard") renderDashboard();
  if (route === "numbers") renderNumbers();
  if (route === "guidance") renderDaily();
  if (route === "connections") renderConnections();
  if (route === "readings") renderReadings();
  if (route === "spirit") updateTierPill();
}

function updateTierPill() {
  const pill = document.getElementById("topbar-tier-pill");
  if (!pill) return;
  const tiers = [];
  if (state.tiers.proUnlocked) tiers.push("Pro");
  if (state.tiers.socialUnlocked) tiers.push("Cosmic");
  pill.textContent = tiers.length ? tiers.join(" + ") : "Free";
}

// ===== DASHBOARD =====
function renderDashboard() {
  const profileDiv = document.getElementById("dashboard-profile");
  const lp = state.profile?.lifePath || null;
  const lifePathDiv = document.getElementById("dashboard-life-path");
  const dailyDiv = document.getElementById("dashboard-daily-tip");

  const name = state.profile?.name || state.user?.username || "Seeker";
  const bio = state.profile?.bio || "";
  const birthdate = state.profile?.birthdate || "";
  const avatarBase64 = state.profile?.avatarBase64 || null;

  const initials = initialsForName(name);
  const avatarHTML = avatarBase64
    ? `<div class="profile-avatar"><img src="${avatarBase64}" alt="avatar" /></div>`
    : `<div class="profile-avatar">${initials}</div>`;

  profileDiv.innerHTML = `
    ${avatarHTML}
    <div class="profile-main">
      <h4>${name}</h4>
      <p>${bio || "Write a short bio in Settings to anchor your story."}</p>
      <p><strong>Birthdate:</strong> ${birthdate || "Add in Settings"}</p>
    </div>
  `;

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

function renderNumbers() {
  const coreDiv = document.getElementById("numbers-core");
  const advDiv = document.getElementById("numbers-advanced");
  const profile = state.profile;

  if (!profile?.birthdate) {
    coreDiv.innerHTML =
      "<p>Set your birthdate in Settings to unlock your core numbers.</p>";
  } else {
    const lp = profile.lifePath;
    coreDiv.innerHTML = `
      <h4>Core numbers</h4>
      <p><strong>Life path:</strong> ${lp}</p>
      <p>${lifePathSummary(lp)}</p>
    `;
  }

  const destiny = profile?.destiny || null;
  const soulUrge = profile?.soulUrge || null;
  const personality = profile?.personality || null;

  if (!profile?.name) {
    advDiv.innerHTML =
      "<p>Add your name in Settings so we can decode your destiny, soul urge, and personality numbers.</p>";
    return;
  }

  advDiv.innerHTML = `
    <h4>Name-based numbers</h4>
    <p><strong>Destiny:</strong> ${destiny ?? "—"}</p>
    <p>${destinySummary(destiny)}</p>
    <p><strong>Soul urge:</strong> ${soulUrge ?? "—"}</p>
    <p>${soulUrgeSummary(soulUrge)}</p>
    <p><strong>Personality:</strong> ${personality ?? "—"}</p>
    <p>${personalitySummary(personality)}</p>
  `;
}

// ===== DAILY VIEW =====
function wireDaily() {
  document
    .getElementById("btn-upgrade-from-daily")
    .addEventListener("click", () => openSettings());
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

// ===== CONNECTIONS (FRIENDS + CHAT + MAP) =====
let mapInstance = null;
let mapMarkersLayer = null;

function wireConnectionsUI() {
  document
    .getElementById("btn-upgrade-connections")
    .addEventListener("click", () => openSettings());

  document.getElementById("btn-add-connection").addEventListener("click", () => {
    openFriendSearch();
  });

  document.getElementById("btn-connections-search").addEventListener("click", () => {
    const value = document.getElementById("connections-search").value.trim();
    if (!value) return;
    emitSafe("friend:request", {
      fromUserId: state.user.id,
      targetUsername: value,
    });
    document.getElementById("connections-search-result").textContent = "Sending request...";
  });

  document
    .getElementById("connections-chat-send")
    .addEventListener("click", sendChatFromInput);

  document
    .getElementById("connections-share-location")
    .addEventListener("change", handleLocationToggle);
}

function openFriendSearch() {
  document.getElementById("connections-search").focus();
}

function handleLocationToggle(e) {
  const enabled = e.target.checked;
  if (enabled) {
    if (!navigator.geolocation) {
      showToast("Geolocation not supported.");
      e.target.checked = false;
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        emitSafe("presence:location", {
          userId: state.user.id,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        showToast("Location shared.");
      },
      () => {
        showToast("Could not get location.");
        e.target.checked = false;
      }
    );
  } else {
    emitSafe("presence:location", {
      userId: state.user.id,
      lat: null,
      lng: null,
    });
  }
}

function renderConnections() {
  const friendsDiv = document.getElementById("connections-friends");
  const locked = !state.tiers.socialUnlocked;

  if (locked) {
    friendsDiv.innerHTML = "<p>Unlock Cosmic Connect to use full friends features.</p>";
    return;
  }

  if (!state.friends || !state.friends.length) {
    friendsDiv.innerHTML =
      "<p>You have no friends yet. Send a request using the username above.</p>";
    return;
  }

  let html = "";
  state.friends.forEach((f) => {
    html += `
      <div>
        <button class="secondary small-btn" data-friend-id="${f.id}">
          ${f.name || f.username} ${f.online ? "●" : "○"}
        </button>
        <button class="secondary small-btn" data-friend-remove="${f.id}" style="margin-top:4px;">Remove</button>
      </div>
    `;
  });
  friendsDiv.innerHTML = html;

  friendsDiv.querySelectorAll("[data-friend-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.friendId;
      setActiveChatFriend(id);
    });
  });

  friendsDiv.querySelectorAll("[data-friend-remove]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.friendRemove;
      emitSafe("friend:remove", { userId: state.user.id, friendId: id });
    });
  });

  if (!state.activeChatFriendId && state.friends.length) {
    setActiveChatFriend(state.friends[0].id);
  } else {
    renderChatThread();
  }

  renderConnectionsMap();
}

function setActiveChatFriend(friendId) {
  state.activeChatFriendId = friendId;
  renderChatThread();
}

function handleIncomingChat(msg) {
  // msg: { from, to, text, timestamp }
  const chatDiv = document.getElementById("connections-chat-thread");
  if (!chatDiv) return;
  // Append if it belongs to us
  if (msg.to === state.user.id || msg.from === state.user.id) {
    const mine = msg.from === state.user.id;
    const div = document.createElement("div");
    div.className = "message" + (mine ? " mine" : "");
    const friend = state.friends.find((f) => f.id === msg.from || f.id === msg.to);
    const name = mine ? "You" : friend?.name || friend?.username || "Friend";
    div.innerHTML = `<p>${msg.text}</p><span>${name} • ${new Date(
      msg.timestamp
    ).toLocaleTimeString()}</span>`;
    chatDiv.appendChild(div);
    chatDiv.scrollTop = chatDiv.scrollHeight;
  }
}

function sendChatFromInput() {
  const textarea = document.getElementById("connections-chat-input");
  const text = textarea.value.trim();
  if (!text || !state.activeChatFriendId) return;
  const payload = {
    from: state.user.id,
    to: state.activeChatFriendId,
    text,
    timestamp: new Date().toISOString(),
  };
  emitSafe("chat:message", payload);
  handleIncomingChat(payload); // optimistic render
  textarea.value = "";
}

function renderChatThread() {
  const chatDiv = document.getElementById("connections-chat-thread");
  const title = document.getElementById("connections-chat-title");

  const friend = state.friends.find((f) => f.id === state.activeChatFriendId);
  if (!friend) {
    title.textContent = "Messages";
    chatDiv.innerHTML = "<p class='tip'>Select a friend to start chatting.</p>";
    return;
  }

  title.textContent = `Chat with ${friend.name || friend.username}`;
  // Real history should come from backend; here assume server may emit history separately if desired
  chatDiv.innerHTML = "<p class='tip'>Messages will appear here as you chat.</p>";
}

function renderConnectionsMap() {
  const mapDiv = document.getElementById("connections-map");
  if (!mapDiv) return;
  if (!state.tiers.socialUnlocked) {
    mapDiv.innerHTML = "";
    return;
  }

  if (!mapInstance) {
    mapInstance = L.map("connections-map").setView([0, 0], 2);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
    }).addTo(mapInstance);
    mapMarkersLayer = L.layerGroup().addTo(mapInstance);
  }

  mapMarkersLayer.clearLayers();
  const withLocation = state.onlineUsers.filter((u) => u.lat && u.lng);
  if (!withLocation.length) return;

  withLocation.forEach((u) => {
    const marker = L.marker([u.lat, u.lng]).addTo(mapMarkersLayer);
    marker.bindPopup(`${u.name || u.username}`);
  });

  // Center roughly on first user
  const first = withLocation[0];
  mapInstance.setView([first.lat, first.lng], 3);
}

// ===== READINGS (NUMEROLOGY + ASTRO) =====
function wireReadingsUI() {
  // Sun/Moon select options
  const signs = [
    "Aries",
    "Taurus",
    "Gemini",
    "Cancer",
    "Leo",
    "Virgo",
    "Libra",
    "Scorpio",
    "Sagittarius",
    "Capricorn",
    "Aquarius",
    "Pisces",
  ];
  const sunSelect = document.getElementById("reading-sun-sign");
  const moonSelect = document.getElementById("reading-moon-sign");

  signs.forEach((s) => {
    const opt1 = document.createElement("option");
    opt1.value = s;
    opt1.textContent = s;
    sunSelect.appendChild(opt1);

    const opt2 = document.createElement("option");
    opt2.value = s;
    opt2.textContent = s;
    moonSelect.appendChild(opt2);
  });

  document.getElementById("reading-save-astro").addEventListener("click", () => {
    const sunVal = sunSelect.value || null;
    const moonVal = moonSelect.value || null;
    state.profile = state.profile || {};
    state.profile.sun = sunVal;
    state.profile.moon = moonVal;
    save(STORAGE_KEYS.profile, state.profile);
    persistAll();
    renderReadings();
    showToast("Astro profile saved.");
  });

  document
    .getElementById("btn-upgrade-readings")
    .addEventListener("click", () => openSettings());
}

function renderReadings() {
  const lp = state.profile?.lifePath || null;
  const destiny = state.profile?.destiny || null;
  const soulUrge = state.profile?.soulUrge || null;
  const personality = state.profile?.personality || null;
  const sun = state.profile?.sun || null;
  const moon = state.profile?.moon || null;

  // set dropdown defaults
  if (sun) document.getElementById("reading-sun-sign").value = sun;
  if (moon) document.getElementById("reading-moon-sign").value = moon;

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

    let html = `
      <h4>Advanced numerology</h4>
      <p><strong>Destiny:</strong> ${destiny ?? "—"}</p>
      <p>${destinySummary(destiny)}</p>
      <p><strong>Soul urge:</strong> ${soulUrge ?? "—"}</p>
      <p>${soulUrgeSummary(soulUrge)}</p>
      <p><strong>Personality:</strong> ${personality ?? "—"}</p>
      <p>${personalitySummary(personality)}</p>
    `;

    html += `<h4>Astro blend</h4>`;
    if (sun || moon) {
      html += `
        <p><strong>Sun in ${sun || "?"}</strong> shows where you shine steadily.</p>
        <p><strong>Moon in ${moon || "?"}</strong> shows how you emotionally process and self-soothe.</p>
      `;
    } else {
      html += `<p>Add your sun and moon to unlock this layer.</p>`;
    }

    if (lp || sun || moon) {
      html += `<p><strong>Synthesis:</strong> Your life path ${lp || "?"} moves through the world in a ${
        sun || "?"
      } / ${moon || "?"} costume. When your daily actions match both your path and your emotional truth, you feel less split inside.</p>`;
    }

    advancedContent.innerHTML = html;
  } else {
    advancedCard.classList.add("locked");
    overlay.classList.remove("hidden");
    advancedContent.classList.add("hidden");
  }
}

// ===== RENDER DAILY, CONNECTIONS ENTRY =====
function renderConnections() {
  if (!document.getElementById("connections-friends")) return;
  if (!state.tiers.socialUnlocked) {
    document.getElementById("connections-friends").innerHTML =
      "<p>Unlock Cosmic Connect to use full friends features.</p>";
    return;
  }
  // friends are rendered earlier when socket event fires; just ensure map is drawn
  renderConnectionsMap();
}

// ===== END =====
