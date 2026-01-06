// ===== STATE =====
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
  wireAI();
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

// ===== THEME =====
function initTheme() {
  if (state.settings.theme === "light") {
    document.body.classList.add("light");
  } else {
    document.body.classList.remove("light");
  }
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

// ===== NAVIGATION =====
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

  // Dev toggles to unlock tiers locally for testing
  const tierStatus = document.getElementById("tier-status");
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
      state.tiers.socialUnlocked ? "Cosmic Connect unlocked (dev)." : "Cosmic Connect locked (dev)."
    );
  });
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
    avatarPreview.textContent = initialsForName(state.profile?.name || state.user?.username || "?");
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

// ===== AI GUIDE ENGINE =====
function wireAI() {
  const btn = document.getElementById("btn-ai-generate");
  const focusSelect = document.getElementById("ai-focus");
  const questionInput = document.getElementById("ai-question");
  const outputDiv = document.getElementById("ai-output");

  btn.addEventListener("click", () => {
    const focus = focusSelect.value;
    const question = questionInput.value.trim();
    const insight = generateAIInsight(focus, question);
    outputDiv.innerHTML = insight;
  });
}

function generateAIInsight(focus, question) {
  const profile = state.profile || {};
  const lp = profile.lifePath;
  const destiny = profile.destiny;
  const soul = profile.soulUrge;
  const personality = profile.personality;

  if (!lp && !destiny && !soul && !personality) {
    return "<p>Set your name and birthdate in Settings to unlock a full AI-style reading.</p>";
  }

  const name = profile.name || "you";
  const base = [];

  base.push(
    `<p><strong>Core pattern:</strong> Your life path ${
      lp ?? "?"
    } points to ${lifePathSummary(lp)}`
  );

  if (destiny) {
    base.push(
      `<p><strong>Destiny ${destiny}:</strong> ${destinySummary(destiny)}</p>`
    );
  }

  if (soul) {
    base.push(
      `<p><strong>Soul urge ${soul}:</strong> ${soulUrgeSummary(soul)}</p>`
    );
  }

  if (personality) {
    base.push(
      `<p><strong>Personality ${personality}:</strong> ${personalitySummary(
        personality
      )}</p>`
    );
  }

  const focusText = buildFocusLayer(focus, lp, destiny, soul);
  base.push(`<p>${focusText}</p>`);

  if (question) {
    base.push(
      `<p><strong>Reading your question:</strong> "${question}"<br/>` +
        personalizedQuestionLayer(question, lp, destiny, soul) +
        `</p>`
    );
  }

  base.push(
    `<p class="tip">All of this is being generated locally in your browser from your numbers. Update your profile to tune the signal.</p>`
  );

  return base.join("");
}

function buildFocusLayer(focus, lp, destiny, soul) {
  const lpText = lp ? lifePathSummary(lp) : "your unique way of moving through life";
  const dText = destiny ? destinySummary(destiny) : "";
  const sText = soul ? soulUrgeSummary(soul) : "";

  if (focus === "overview") {
    return `Right now, the most important thing is to live closer to the center of ${lpText.toLowerCase()}. Your days flow better when your actions respect both ${
      dText ? "your destiny pattern" : "your long-term direction"
    } and ${
      sText ? "what your heart quietly craves" : "what actually energizes you"
    }.`;
  }

  if (focus === "career") {
    return `Career-wise, lean into situations that let you express ${lpText.toLowerCase()}. ${
      destiny
        ? "Your destiny number hints that the more you align work with " +
          dText.toLowerCase() +
          ", the easier money and opportunity move."
        : ""
    } ${
      soul
        ? "Your soul urge adds that if your work ignores " +
          sText.toLowerCase() +
          ", burnout shows up fast."
        : ""
    }`;
  }

  if (focus === "relationships") {
    return `In relationships, your life path shows how you naturally show up. Notice where you either over-play or under-play ${lpText.toLowerCase()}. ${
      soul
        ? "Your soul urge tells you what you secretly need from connection, even when you do not say it out loud."
        : "Pay attention to what you actually long for, not just what looks good on paper."
    }`;
  }

  if (focus === "growth") {
    return `For growth and healing, your numbers suggest that the next level is not about becoming someone else, but refining the way you already operate. Start with one small shift that honors your core pattern instead of fighting it.`;
  }

  return "Bring your daily decisions into alignment with your actual energetic pattern instead of your fear.";
}

function personalizedQuestionLayer(question, lp, destiny, soul) {
  let layer = "";
  const qLow = question.toLowerCase();
  if (qLow.includes("job") || qLow.includes("career") || qLow.includes("money")) {
    layer +=
      "Notice how your question about work or money interacts with your core numbers. ";
    if (lp === 8 || destiny === 8) {
      layer +=
        "You have strong 8 energy, which amplifies themes of power, resources, and responsibility — avoid selling yourself short.";
    } else if (lp === 4 || destiny === 4) {
      layer +=
        "Your 4 energy thrives when you build something step by step; quick fixes usually do not satisfy you for long.";
    } else {
      layer +=
        "Your path may not be about a traditional ladder; look for roles where your natural pattern has space to breathe.";
    }
  } else if (qLow.includes("love") || qLow.includes("relationship")) {
    layer +=
      "Your question about love is best answered by listening to your soul urge. ";
    if (soul === 2 || lp === 2) {
      layer +=
        "You are wired for partnership and emotional attunement — do not pretend you are fine with half-connection.";
    } else if (soul === 5 || lp === 5) {
      layer +=
        "You need both connection and freedom; design relationships where change is not treated as a threat.";
    } else {
      layer +=
        "Define what safety and aliveness mean for you, and let that standard filter your connections.";
    }
  } else {
    layer +=
      "Even if your question is not explicitly about career or love, your numbers suggest that your next move should feel like a deeper alignment, not a performance for others.";
  }
  return layer;
}

function initialsForName(name) {
  const parts = name.trim().split(/\s+/);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0][0]?.toUpperCase() || "?";
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
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
  if (route === "ai") updateTierPill();
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

// ===== CONNECTIONS (COSMIC CONNECT) =====
function wireConnections() {
  const btnAdd = document.getElementById("btn-add-connection");
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
}

function computeCompatibility(lpA, lpB) {
  if (!lpA || !lpB) return null;
  const diff = Math.abs(lpA - lpB);
  if (diff === 0) return 90;
  if (diff === 1) return 82;
  if (diff === 2) return 74;
  if (diff >= 7) return 55;
  return 68;
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
      <button class="secondary small-btn" data-conn-id="${conn.id}">
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

  renderConnectionDetail(state.connections[0]);
  renderConnectionMessages(state.connections[0]);

  function renderConnectionDetail(conn) {
    const score = conn.compatibilityScore;
    detailDiv.innerHTML = `
      <h4>${conn.name}</h4>
      <p><strong>Birthdate:</strong> ${conn.birthdate}</p>
      <p><strong>Life path:</strong> ${conn.lifePath}</p>
      <p><strong>Compatibility score:</strong> ${score ?? "N/A"}</p>
      <p>This is a local-only connection. When a backend is added, this can become real matching and messaging between devices.</p>
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
        <button class="primary small-btn" data-send-id="${conn.id}">Send</button>
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

// ===== READINGS =====
function wireReadings() {
  document
    .getElementById("btn-upgrade-readings")
    .addEventListener("click", () => openSettings());
}

function renderReadings() {
  const lp = state.profile?.lifePath || null;
  const destiny = state.profile?.destiny || null;
  const soulUrge = state.profile?.soulUrge || null;
  const personality = state.profile?.personality || null;

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
      <h4>Advanced reading</h4>
      <p><strong>Destiny:</strong> ${destiny ?? "—"}</p>
      <p>${destinySummary(destiny)}</p>
      <p><strong>Soul urge:</strong> ${soulUrge ?? "—"}</p>
      <p>${soulUrgeSummary(soulUrge)}</p>
      <p><strong>Personality:</strong> ${personality ?? "—"}</p>
      <p>${personalitySummary(personality)}</p>
      <p>This reading is generated fully on your device. No cloud, no account on any server.</p>
    `;
  } else {
    advancedCard.classList.add("locked");
    overlay.classList.remove("hidden");
    advancedContent.classList.add("hidden");
  }
}
