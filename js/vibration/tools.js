// js/vibration/tools.js

// ---------- CORE NUMEROLOGY HELPERS ----------

const LETTER_MAP = {
  A:1,B:2,C:3,D:4,E:5,F:6,G:7,
  H:8,I:9,J:1,K:2,L:3,M:4,N:5,
  O:6,P:7,Q:8,R:9,S:1,T:2,U:3,
  V:4,W:5,X:6,Y:7,Z:8
};

function onlyLetters(str = "") {
  return (str || "").toUpperCase().replace(/[^A-Z]/g, "");
}

function onlyDigits(str = "") {
  return (str || "").replace(/\D/g, "");
}

function pythagoreanValue(ch) {
  return LETTER_MAP[ch] || 0;
}

function reduceNum(n, keepMaster = true) {
  n = Number(n);
  if (!Number.isFinite(n)) return null;
  if (!keepMaster) {
    while (n > 9) {
      n = n.toString().split("").reduce((a, b) => a + Number(b), 0);
    }
    return n;
  }
  while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
    n = n.toString().split("").reduce((a, b) => a + Number(b), 0);
  }
  return n;
}

function sumDigits(n) {
  return n.toString().split("").reduce((a, b) => a + Number(b), 0);
}

// ---------- MEANING MAPS ----------

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

function meaningForNumber(n) {
  return baseMeanings[n] || "A unique blend of energies—feel into how this number lands in your body and life.";
}

// ---------- WORD / NAME VIBRATION ENGINE ----------

function analyzeWordVibration(raw, keepMaster = true) {
  const letters = onlyLetters(raw);
  if (!letters) {
    return {
      input: raw,
      total: null,
      reduced: null,
      breakdown: [],
      meaning: "Enter at least one letter to calculate vibration."
    };
  }

  const breakdown = letters.split("").map(ch => ({
    letter: ch,
    value: pythagoreanValue(ch)
  }));

  const total = breakdown.reduce((sum, item) => sum + item.value, 0);
  const reduced = reduceNum(total, keepMaster);

  return {
    input: raw,
    total,
    reduced,
    breakdown,
    meaning: meaningForNumber(reduced)
  };
}

// ---------- ADDRESS VIBRATION ENGINE ----------

function analyzeAddressVibration(raw, keepMaster = true) {
  if (!raw || !raw.trim()) {
    return {
      input: raw,
      total: null,
      reduced: null,
      numberPart: null,
      letterPart: null,
      meaning: "Enter an address to calculate its vibration."
    };
  }

  const digits = onlyDigits(raw);
  const letters = onlyLetters(raw);

  let numberPart = null;
  let letterPart = null;

  if (digits) {
    numberPart = {
      raw: digits,
      total: sumDigits(digits),
      reduced: reduceNum(digits, keepMaster)
    };
  }

  if (letters) {
    const letterValues = letters.split("").map(pythagoreanValue);
    const totalLetters = letterValues.reduce((a, b) => a + b, 0);
    letterPart = {
      raw: letters,
      total: totalLetters,
      reduced: reduceNum(totalLetters, keepMaster)
    };
  }

  const combinedTotal =
    (numberPart ? numberPart.total : 0) +
    (letterPart ? letterPart.total : 0);

  const combinedReduced = combinedTotal
    ? reduceNum(combinedTotal, keepMaster)
    : null;

  return {
    input: raw,
    total: combinedTotal || null,
    reduced: combinedReduced,
    numberPart,
    letterPart,
    meaning: combinedReduced
      ? meaningForNumber(combinedReduced)
      : "This address doesn’t resolve to a clear vibration yet—try including both numbers and street name."
  };
}

// ---------- STORAGE (RECENT HISTORY) ----------

const STORAGE_KEY = "destined_vibration_history_v1";

function loadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveHistory(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // ignore
  }
}

function addHistoryEntry(type, input, reduced, total) {
  const history = loadHistory();
  history.push({
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    type,
    input,
    reduced,
    total,
    timestamp: new Date().toISOString()
  });
  // keep last 20
  const trimmed = history.slice(-20);
  saveHistory(trimmed);
  return trimmed;
}

// ---------- RENDERING ----------

function renderWordResult(result) {
  const out = document.getElementById("vibration-output");
  if (!out) return;

  if (!result || result.total == null) {
    out.innerHTML = `<p class="small-text">${result ? result.meaning : "Enter a word or name to calculate."}</p>`;
    return;
  }

  const breakdownHtml = result.breakdown
    .map(item => `<span class="pill">${item.letter} = ${item.value}</span>`)
    .join(" ");

  out.innerHTML = `
    <p><strong>Input:</strong> ${result.input}</p>
    <p><strong>Total:</strong> ${result.total}</p>
    <p><strong>Reduced:</strong> ${result.reduced}</p>
    <p class="small-text"><strong>Meaning:</strong> ${result.meaning}</p>
    <div class="pill-row">${breakdownHtml}</div>
  `;
}

function renderAddressResult(result) {
  const out = document.getElementById("address-output");
  if (!out) return;

  if (!result || result.total == null) {
    out.innerHTML = `<p class="small-text">${result ? result.meaning : "Enter an address to calculate."}</p>`;
    return;
  }

  const numberBlock = result.numberPart
    ? `<p><strong>Number part:</strong> ${result.numberPart.raw} → total ${result.numberPart.total}, reduced ${result.numberPart.reduced}</p>`
    : `<p><strong>Number part:</strong> none</p>`;

  const letterBlock = result.letterPart
    ? `<p><strong>Letter part:</strong> ${result.letterPart.raw} → total ${result.letterPart.total}, reduced ${result.letterPart.reduced}</p>`
    : `<p><strong>Letter part:</strong> none</p>`;

  out.innerHTML = `
    <p><strong>Input:</strong> ${result.input}</p>
    ${numberBlock}
    ${letterBlock}
    <p><strong>Combined total:</strong> ${result.total}</p>
    <p><strong>Combined reduced:</strong> ${result.reduced}</p>
    <p class="small-text"><strong>Meaning:</strong> ${result.meaning}</p>
  `;
}

function renderHistory(list) {
  const el = document.getElementById("vibration-history");
  if (!el) return;

  if (!list.length) {
    el.innerHTML = `<li class="small-text">No vibrations calculated yet. Your last 20 results will appear here.</li>`;
    return;
  }

  el.innerHTML = list
    .slice()
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .map(item => {
      const date = new Date(item.timestamp);
      const ts = Number.isNaN(date.getTime())
        ? ""
        : `${date.toLocaleDateString()} • ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
      return `
        <li class="pattern-item">
          <div class="pattern-main">
            <span class="pattern-number">${item.input}</span>
            <span class="pattern-reduced">${item.type} → ${item.reduced ?? "–"}</span>
          </div>
          <div class="pattern-meta">
            <span class="pattern-time">${ts}</span>
          </div>
        </li>
      `;
    })
    .join("");
}

// ---------- EVENT HANDLERS ----------

function handleWordCalc() {
  const inputEl = document.getElementById("vibration-word");
  const keepMasterEl = document.getElementById("vibration-keep-master");
  if (!inputEl) return;

  const raw = inputEl.value.trim();
  const keepMaster = keepMasterEl ? keepMasterEl.checked : true;

  const result = analyzeWordVibration(raw, keepMaster);
  renderWordResult(result);

  if (result.reduced != null) {
    const history = addHistoryEntry("word", raw, result.reduced, result.total);
    renderHistory(history);
  }
}

function handleAddressCalc() {
  const inputEl = document.getElementById("vibration-address");
  const keepMasterEl = document.getElementById("vibration-keep-master");
  if (!inputEl) return;

  const raw = inputEl.value.trim();
  const keepMaster = keepMasterEl ? keepMasterEl.checked : true;

  const result = analyzeAddressVibration(raw, keepMaster);
  renderAddressResult(result);

  if (result.reduced != null) {
    const history = addHistoryEntry("address", raw, result.reduced, result.total);
    renderHistory(history);
  }
}

// ---------- INIT ----------

document.addEventListener("DOMContentLoaded", () => {
  const history = loadHistory();
  renderHistory(history);

  const wordBtn = document.getElementById("calc-vibration");
  const addrBtn = document.getElementById("calc-address");

  if (wordBtn) wordBtn.addEventListener("click", handleWordCalc);
  if (addrBtn) addrBtn.addEventListener("click", handleAddressCalc);
});
