// js/meanings/meanings.js

const STORAGE_KEY = "numerologyMeanings";

// ---------- STORAGE HELPERS ----------

function loadMeanings() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function saveMeanings(meanings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(meanings));
}

// ---------- RENDER KEYS LIST ----------

function renderKeysList(selectedKey = null) {
  const listEl = document.getElementById("meaning-keys");
  const meanings = loadMeanings();
  const keys = Object.keys(meanings).sort();

  listEl.innerHTML = "";

  if (keys.length === 0) {
    const li = document.createElement("li");
    li.textContent = "No meanings saved yet. Create one below.";
    listEl.appendChild(li);
    return;
  }

  keys.forEach(key => {
    const li = document.createElement("li");
    li.textContent = key;
    li.className = "meaning-key-item";
    if (key === selectedKey) li.classList.add("active");

    li.addEventListener("click", () => {
      loadMeaningIntoEditor(key);
    });

    listEl.appendChild(li);
  });
}

// ---------- EDITOR LOGIC ----------

function loadMeaningIntoEditor(key) {
  const meanings = loadMeanings();
  const editor = document.getElementById("meaning-editor");
  const keyInput = document.getElementById("meaning-key-input");

  keyInput.value = key;
  editor.value = meanings[key] || "";

  renderKeysList(key);
}

function saveCurrentMeaning() {
  const keyInput = document.getElementById("meaning-key-input");
  const editor = document.getElementById("meaning-editor");

  const key = keyInput.value.trim();
  const text = editor.value.trim();

  if (!key) return;

  const meanings = loadMeanings();
  meanings[key] = text;
  saveMeanings(meanings);

  renderKeysList(key);
}

// ---------- INIT ----------

document.addEventListener("DOMContentLoaded", () => {
  renderKeysList();

  document.getElementById("save-meaning")
    .addEventListener("click", saveCurrentMeaning);
});
