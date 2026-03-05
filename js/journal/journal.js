// ===============================
// JOURNAL STORAGE ENGINE
// ===============================

// Load entries from localStorage
function loadEntries() {
  const raw = localStorage.getItem("spiritualJournal");
  return raw ? JSON.parse(raw) : [];
}

// Save entries to localStorage
function saveEntries(entries) {
  localStorage.setItem("spiritualJournal", JSON.stringify(entries));
}

// Create a unique ID for each entry
function createId() {
  return "j_" + Math.random().toString(36).slice(2, 10);
}

// ===============================
// RENDERING ENGINE
// ===============================

function renderEntries() {
  const list = document.getElementById("journal-list");
  const entries = loadEntries();

  list.innerHTML = "";

  entries.forEach((entry) => {
    const li = document.createElement("li");
    li.className = "journal-item cinematic-entry";

    li.innerHTML = `
      <div class="journal-header">
        <div class="journal-date">${entry.date}</div>
        <div class="journal-time">${entry.time}</div>
      </div>

      <p class="journal-main">${entry.text}</p>

      ${entry.spiritual ? `<p class="journal-spiritual"><strong>Spiritual Notes:</strong> ${entry.spiritual}</p>` : ""}
      ${entry.why ? `<p class="journal-why"><strong>Why This Matters:</strong> ${entry.why}</p>` : ""}
      ${entry.context ? `<p class="journal-context"><strong>Life Context:</strong> ${entry.context}</p>` : ""}
    `;

    list.appendChild(li);

    // Cinematic fade-in animation
    requestAnimationFrame(() => {
      li.classList.add("visible");
    });
  });
}

// ===============================
// SAVE NEW ENTRY
// ===============================

function saveEntry() {
  const text = document.getElementById("journal-entry").value.trim();
  const spiritual = document.getElementById("journal-spiritual").value.trim();
  const why = document.getElementById("journal-why").value.trim();
  const context = document.getElementById("journal-context").value.trim();

  if (!text) return;

  const now = new Date();
  const date = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const entries = loadEntries();

  entries.unshift({
    id: createId(),
    date,
    time,
    text,
    spiritual,
    why,
    context
  });

  saveEntries(entries);
  renderEntries();

  // Clear fields
  document.getElementById("journal-entry").value = "";
  document.getElementById("journal-spiritual").value = "";
  document.getElementById("journal-why").value = "";
  document.getElementById("journal-context").value = "";
}

// ===============================
// INIT
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  renderEntries();
  document.getElementById("save-entry").addEventListener("click", saveEntry);
});
