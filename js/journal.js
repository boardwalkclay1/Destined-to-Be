// js/journal/journal.js

// Load existing entries
function loadEntries() {
  const raw = localStorage.getItem("spiritualJournal");
  return raw ? JSON.parse(raw) : [];
}

// Save entries
function saveEntries(entries) {
  localStorage.setItem("spiritualJournal", JSON.stringify(entries));
}

// Render entries
function renderEntries() {
  const list = document.getElementById("journal-list");
  const entries = loadEntries();

  list.innerHTML = "";

  entries.forEach((entry, index) => {
    const li = document.createElement("li");
    li.className = "journal-item";

    li.innerHTML = `
      <div class="journal-header">
        <strong>${entry.date}</strong>
        <span>${entry.time}</span>
      </div>

      <p class="journal-main">${entry.text}</p>

      ${entry.spiritual ? `<p class="journal-spiritual"><strong>Spiritual Notes:</strong> ${entry.spiritual}</p>` : ""}
      ${entry.why ? `<p class="journal-why"><strong>Why This Matters:</strong> ${entry.why}</p>` : ""}
      ${entry.context ? `<p class="journal-context"><strong>Life Context:</strong> ${entry.context}</p>` : ""}
    `;

    list.appendChild(li);
  });
}

// Save new entry
function saveEntry() {
  const text = document.getElementById("journal-entry").value.trim();
  const spiritual = document.getElementById("journal-spiritual").value.trim();
  const why = document.getElementById("journal-why").value.trim();
  const context = document.getElementById("journal-context").value.trim();

  if (!text) return;

  const now = new Date();
  const date = now.toLocaleDateString();
  const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const entries = loadEntries();

  entries.unshift({
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

// Init
document.addEventListener("DOMContentLoaded", () => {
  renderEntries();

  document.getElementById("save-entry").addEventListener("click", saveEntry);
});
