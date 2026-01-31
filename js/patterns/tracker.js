// js/patterns/tracker.js

// ---------- NUMEROLOGY CORE ----------

function reduceNum(n) {
  n = Number(n);
  if (!Number.isFinite(n)) return null;
  while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
    n = n.toString().split("").reduce((a, b) => a + Number(b), 0);
  }
  return n;
}

const baseMeanings = {
  1: "Initiation, independence, and self-leadership.",
  2: "Harmony, partnership, and sensitivity.",
  3: "Expression, creativity, and communication.",
  4: "Structure, work, and foundations.",
  5: "Change, freedom, and movement.",
  6: "Care, responsibility, and relationships.",
  7: "Intuition, analysis, and spiritual inquiry.",
  8: "Power, results, and material mastery.",
  9: "Compassion, endings, and integration.",
  11: "Heightened intuition, spiritual insight, and inspiration.",
  22: "Master builder energy, large-scale impact, and grounded vision.",
  33: "Master teacher energy, healing, and compassionate service."
};

const repeatingMap = {
  "111": "Fresh starts, alignment, and a nudge to act on your ideas.",
  "222": "Balance, partnership, and trusting the timing of what’s unfolding.",
  "333": "Creative expansion, self-expression, and support from your guides.",
  "444": "Stability, protection, and building something that lasts.",
  "555": "Change, disruption, and an invitation to pivot.",
  "666": "Responsibility, care, and rebalancing your priorities.",
  "777": "Spiritual insight, study, and inner alignment.",
  "888": "Power, manifestation, and material flow.",
  "999": "Completion, closure, and preparing for a new chapter.",
  "000": "Void, reset, and pure potential."
};

function interpretPatternNumber(raw) {
  if (!raw) return { label: "No number", text: "Enter a pattern to interpret." };

  const cleaned = raw.replace(/\D/g, "");
  if (!cleaned) {
    return { label: "Invalid", text: "Use digits only for the pattern (e.g., 111, 222, 1234)." };
  }

  // Exact repeating pattern
  if (repeatingMap[cleaned]) {
    return { label: cleaned, text: repeatingMap[cleaned] };
  }

  const reduced = reduceNum(cleaned);
  const base = baseMeanings[reduced];

  if (!base) {
    return {
      label: cleaned,
      text: "This pattern points to a unique mix of energies—notice what it means to you in context."
    };
  }

  return {
    label: `${cleaned} → ${reduced}`,
    text: base
  };
}

// ---------- STORAGE LAYER ----------

const STORAGE_KEY = "destined_pattern_tracker_v1";

function loadPatterns() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function savePatterns(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // ignore
  }
}

// ---------- ANALYTICS ENGINE ----------

function computeAnalytics(patterns) {
  if (!patterns.length) {
    return {
      total: 0,
      byReduced: {},
      mostFrequent: null,
      byHour: {},
      byWeekday: {},
      moodCounts: {}
    };
  }

  const byReduced = {};
  const byHour = {};
  const byWeekday = {};
  const moodCounts = {};

  for (const p of patterns) {
    const cleaned = (p.number || "").replace(/\D/g, "");
    const reduced = reduceNum(cleaned);
    if (reduced != null) {
      byReduced[reduced] = (byReduced[reduced] || 0) + 1;
    }

    const date = new Date(p.timestamp);
    if (!Number.isNaN(date.getTime())) {
      const hour = date.getHours();
      const weekday = date.getDay(); // 0-6
      byHour[hour] = (byHour[hour] || 0) + 1;
      byWeekday[weekday] = (byWeekday[weekday] || 0) + 1;
    }

    if (p.mood) {
      moodCounts[p.mood] = (moodCounts[p.mood] || 0) + 1;
    }
  }

  // Most frequent reduced number
  let mostFrequent = null;
  Object.entries(byReduced).forEach(([num, count]) => {
    if (!mostFrequent || count > mostFrequent.count) {
      mostFrequent = { num: Number(num), count };
    }
  });

  return {
    total: patterns.length,
    byReduced,
    mostFrequent,
    byHour,
    byWeekday,
    moodCounts
  };
}

function weekdayLabel(idx) {
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][idx] || "?";
}

// ---------- RENDERING ----------

function renderHistory(patterns) {
  const list = document.getElementById("pattern-history");
  if (!list) return;

  if (!patterns.length) {
    list.innerHTML = `<li class="small-text">No patterns logged yet. Start tracking what you keep seeing.</li>`;
    return;
  }

  list.innerHTML = patterns
    .slice()
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .map(p => {
      const date = new Date(p.timestamp);
      const ts = Number.isNaN(date.getTime())
        ? ""
        : `${date.toLocaleDateString()} • ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;

      const interp = interpretPatternNumber(p.number);

      return `
        <li class="pattern-item">
          <div class="pattern-main">
            <span class="pattern-number">${p.number}</span>
            <span class="pattern-reduced">${interp.label}</span>
          </div>
          <div class="pattern-meta">
            <span class="pattern-time">${ts}</span>
            ${p.mood ? `<span class="pattern-mood pill pill-${p.mood}">${p.mood}</span>` : ""}
          </div>
          ${p.notes ? `<div class="pattern-notes">${p.notes}</div>` : ""}
          <div class="pattern-meaning small-text">${interp.text}</div>
        </li>
      `;
    })
    .join("");
}

function renderAnalytics(patterns) {
  const container = document.getElementById("pattern-analytics");
  if (!container) return;

  const stats = computeAnalytics(patterns);

  if (!stats.total) {
    container.innerHTML = `<p class="small-text">Once you log a few patterns, you’ll see frequency and timing analytics here.</p>`;
    return;
  }

  const reducedRows = Object.entries(stats.byReduced)
    .sort((a, b) => b[1] - a[1])
    .map(([num, count]) => `<li>${num}: <strong>${count}</strong> times</li>`)
    .join("");

  const hourRows = Object.entries(stats.byHour)
    .sort((a, b) => Number(a[0]) - Number(b[0]))
    .map(([hour, count]) => `<li>${hour}:00 – <strong>${count}</strong> hits</li>`)
    .join("");

  const weekdayRows = Object.entries(stats.byWeekday)
    .sort((a, b) => Number(a[0]) - Number(b[0]))
    .map(([idx, count]) => `<li>${weekdayLabel(Number(idx))}: <strong>${count}</strong> hits</li>`)
    .join("");

  const moodRows = Object.entries(stats.moodCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([mood, count]) => `<li>${mood}: <strong>${count}</strong> logs</li>`)
    .join("");

  const mfBlock = stats.mostFrequent
    ? `<p><strong>Most frequent reduced number:</strong> ${stats.mostFrequent.num} (${stats.mostFrequent.count} times)</p>`
    : "";

  container.innerHTML = `
    <p><strong>Total logs:</strong> ${stats.total}</p>
    ${mfBlock}

    <h4>By Reduced Number</h4>
    <ul class="small-list">${reducedRows}</ul>

    <h4>By Time of Day</h4>
    <ul class="small-list">${hourRows}</ul>

    <h4>By Day of Week</h4>
    <ul class="small-list">${weekdayRows}</ul>

    <h4>By Mood / Charge</h4>
    <ul class="small-list">${moodRows || "<li>No moods logged yet.</li>"}</ul>
  `;
}

function renderInstantInterpretation(patterns) {
  const out = document.getElementById("instant-interpretation");
  if (!out) return;

  if (!patterns.length) {
    out.textContent = "Log a pattern to see an instant interpretation based on numerology and your history.";
    return;
  }

  const latest = patterns[patterns.length - 1];
  const interp = interpretPatternNumber(latest.number);

  const stats = computeAnalytics(patterns);
  let historyLine = "";

  if (stats.mostFrequent && stats.mostFrequent.num === reduceNum(latest.number.replace(/\D/g, ""))) {
    historyLine = "This reduced number is also your most frequent pattern so far—pay attention to its theme.";
  } else if (stats.mostFrequent) {
    historyLine = `Your most frequent reduced number so far is ${stats.mostFrequent.num}. Compare today’s pattern to that theme.`;
  }

  out.innerHTML = `
    <p><strong>${interp.label}</strong></p>
    <p>${interp.text}</p>
    ${historyLine ? `<p class="small-text">${historyLine}</p>` : ""}
  `;
}

// ---------- EVENT WIRING ----------

function handleSave() {
  const numberInput = document.getElementById("pattern-number");
  const notesInput = document.getElementById("pattern-notes");
  const moodSelect = document.getElementById("pattern-mood");

  if (!numberInput) return;

  const rawNumber = numberInput.value.trim();
  const notes = notesInput ? notesInput.value.trim() : "";
  const mood = moodSelect ? moodSelect.value : "";

  if (!rawNumber) {
    alert("Enter a number pattern before saving.");
    return;
  }

  const patterns = loadPatterns();

  patterns.push({
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    number: rawNumber,
    notes,
    mood,
    timestamp: new Date().toISOString()
  });

  savePatterns(patterns);

  numberInput.value = "";
  if (notesInput) notesInput.value = "";
  if (moodSelect) moodSelect.value = "";

  renderHistory(patterns);
  renderAnalytics(patterns);
  renderInstantInterpretation(patterns);
}

document.addEventListener("DOMContentLoaded", () => {
  const patterns = loadPatterns();

  renderHistory(patterns);
  renderAnalytics(patterns);
  renderInstantInterpretation(patterns);

  const saveBtn = document.getElementById("save-pattern");
  if (saveBtn) {
    saveBtn.addEventListener("click", handleSave);
  }
});
