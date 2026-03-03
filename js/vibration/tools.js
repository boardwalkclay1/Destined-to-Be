// js/vibration/tools.js

// ===============================
// NORMALIZATION HELPERS
// ===============================

function normalizeLetters(str = "") {
  return (str || "")
    .toUpperCase()
    .replace(/[^A-Z]/g, "");
}

function normalizeDigits(str = "") {
  return (str || "").replace(/\D/g, "");
}

function normalizeInput(str = "") {
  return (str || "").trim();
}

// ===============================
// PYTHAGOREAN LETTER MAP
// ===============================

const LETTER_MAP = {
  A:1,B:2,C:3,D:4,E:5,F:6,G:7,
  H:8,I:9,J:1,K:2,L:3,M:4,N:5,
  O:6,P:7,Q:8,R:9,S:1,T:2,U:3,
  V:4,W:5,X:6,Y:7,Z:8
};

function letterValue(ch) {
  return LETTER_MAP[ch] || 0;
}

// ===============================
// NUMEROLOGY REDUCTION
// ===============================

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

// ===============================
// MEANINGS
// ===============================

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

// ===============================
// WORD / NAME VIBRATION
// ===============================

export function analyzeWordVibration(raw, keepMaster = true) {
  const input = normalizeInput(raw);
  const letters = normalizeLetters(input);

  if (!letters) {
    return {
      rawInput: raw,
      total: null,
      reduced: null,
      breakdown: [],
      meaning: "Enter at least one letter to calculate vibration."
    };
  }

  const breakdown = letters.split("").map(ch => ({
    letter: ch,
    value: letterValue(ch)
  }));

  const total = breakdown.reduce((sum, item) => sum + item.value, 0);
  const reduced = reduceNum(total, keepMaster);

  return {
    rawInput: raw,
    lettersUsed: letters.split(""),
    breakdown,
    total,
    reduced,
    meaning: meaningForNumber(reduced)
  };
}

// ===============================
// ADDRESS VIBRATION
// ===============================

export function analyzeAddressVibration(raw, keepMaster = true) {
  const input = normalizeInput(raw);
  if (!input) {
    return {
      rawInput: raw,
      total: null,
      reduced: null,
      numberPart: null,
      letterPart: null,
      meaning: "Enter an address to calculate its vibration."
    };
  }

  const digits = normalizeDigits(input);
  const letters = normalizeLetters(input);

  let numberPart = null;
  let letterPart = null;

  if (digits) {
    const totalDigits = sumDigits(digits);
    numberPart = {
      raw: digits,
      digitsUsed: digits.split(""),
      total: totalDigits,
      reduced: reduceNum(totalDigits, keepMaster)
    };
  }

  if (letters) {
    const letterValues = letters.split("").map(letterValue);
    const totalLetters = letterValues.reduce((a, b) => a + b, 0);
    letterPart = {
      raw: letters,
      lettersUsed: letters.split(""),
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
    rawInput: raw,
    numberPart,
    letterPart,
    total: combinedTotal || null,
    reduced: combinedReduced,
    meaning: combinedReduced
      ? meaningForNumber(combinedReduced)
      : "This address doesn’t resolve to a clear vibration yet—try including both numbers and street name."
  };
}

// ===============================
// HISTORY
// ===============================

const HISTORY_KEY = "destined_vibration_history_v2";

export function loadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveHistory(list) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(list));
  } catch {}
}

export function addHistoryEntry(type, input, reduced, total) {
  const history = loadHistory();
  history.push({
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    type,
    input,
    reduced,
    total,
    timestamp: new Date().toISOString()
  });
  const trimmed = history.slice(-20);
  saveHistory(trimmed);
  return trimmed;
}
