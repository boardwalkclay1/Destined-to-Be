// js/engine/index.js

// ---------- CORE HELPERS ----------

function onlyLetters(str = "") {
  return (str || "").toUpperCase().replace(/[^A-Z]/g, "");
}

function pythagoreanValue(ch) {
  const map = {
    A:1,B:2,C:3,D:4,E:5,F:6,G:7,
    H:8,I:9,J:1,K:2,L:3,M:4,N:5,
    O:6,P:7,Q:8,R:9,S:1,T:2,U:3,
    V:4,W:5,X:6,Y:7,Z:8
  };
  return map[ch] || 0;
}

function reduceNum(n) {
  while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
    n = n.toString().split("").reduce((a, b) => a + Number(b), 0);
  }
  return n;
}

function sumDigits(n) {
  return n.toString().split("").reduce((a, b) => a + Number(b), 0);
}

// ---------- DATE-BASED NUMBERS ----------

function calcLifePath(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return null;
  const total = sumDigits(d.getDate()) + sumDigits(d.getMonth() + 1) + sumDigits(d.getFullYear());
  return reduceNum(total);
}

function calcBirthdayNumber(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return null;
  return reduceNum(d.getDate());
}

function calcAttitudeNumber(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return null;
  const total = sumDigits(d.getDate()) + sumDigits(d.getMonth() + 1);
  return reduceNum(total);
}

function calcPersonalYear(dateStr, year) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  const total = sumDigits(d.getDate()) + sumDigits(d.getMonth() + 1) + sumDigits(year);
  return reduceNum(total);
}

function calcPersonalMonth(dateStr, year, month) {
  const py = calcPersonalYear(dateStr, year);
  if (!py) return null;
  return reduceNum(py + sumDigits(month));
}

function calcPersonalDay(dateStr, dateObj) {
  const pm = calcPersonalMonth(dateStr, dateObj.getFullYear(), dateObj.getMonth() + 1);
  if (!pm) return null;
  return reduceNum(pm + sumDigits(dateObj.getDate()));
}

// ---------- NAME-BASED NUMBERS ----------

function calcExpression(fullName) {
  const letters = onlyLetters(fullName);
  const total = letters.split("").reduce((sum, ch) => sum + pythagoreanValue(ch), 0);
  return reduceNum(total);
}

function isVowel(ch) {
  return ["A","E","I","O","U"].includes(ch);
}

function calcSoulUrge(fullName) {
  const letters = onlyLetters(fullName);
  const total = letters
    .split("")
    .filter(isVowel)
    .reduce((sum, ch) => sum + pythagoreanValue(ch), 0);
  if (!total) return null;
  return reduceNum(total);
}

function calcPersonality(fullName) {
  const letters = onlyLetters(fullName);
  const total = letters
    .split("")
    .filter(ch => !isVowel(ch))
    .reduce((sum, ch) => sum + pythagoreanValue(ch), 0);
  if (!total) return null;
  return reduceNum(total);
}

function calcMaturity(lifePath, expression) {
  if (!lifePath || !expression) return null;
  return reduceNum(lifePath + expression);
}

// ---------- KARMIC LESSONS / HIDDEN PASSION / DEBT ----------

const karmicDebtNumbers = [13, 14, 16, 19];

function calcLetterFrequencies(fullName) {
  const letters = onlyLetters(fullName);
  const freq = {};
  letters.split("").forEach(ch => {
    freq[ch] = (freq[ch] || 0) + 1;
  });
  return freq;
}

function calcKarmicLessons(fullName) {
  const letters = onlyLetters(fullName);
  const present = new Set(letters.split(""));
  const allLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const missing = allLetters.filter(ch => !present.has(ch));
  const missingNums = new Set(missing.map(pythagoreanValue).filter(n => n > 0));
  return Array.from(missingNums).sort((a, b) => a - b);
}

function calcHiddenPassion(fullName) {
  const freq = calcLetterFrequencies(fullName);
  const entries = Object.entries(freq);
  if (!entries.length) return null;
  entries.sort((a, b) => b[1] - a[1]);
  const [topLetter, topCount] = entries[0];
  const num = pythagoreanValue(topLetter);
  return { letter: topLetter, count: topCount, number: num };
}

function calcKarmicDebtFlags(lifePath, expression, birthday) {
  const flags = [];
  [lifePath, expression, birthday].forEach(n => {
    if (karmicDebtNumbers.includes(n)) flags.push(n);
  });
  return Array.from(new Set(flags));
}

// ---------- PHASES / PINNACLES / CHALLENGES ----------

function calcPinnaclesAndChallenges(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return null;

  const day = reduceNum(d.getDate());
  const month = reduceNum(d.getMonth() + 1);
  const year = reduceNum(d.getFullYear());

  const firstPinnacle = reduceNum(month + day);
  const secondPinnacle = reduceNum(day + year);
  const thirdPinnacle = reduceNum(firstPinnacle + secondPinnacle);
  const fourthPinnacle = reduceNum(month + year);

  const firstChallenge = Math.abs(month - day);
  const secondChallenge = Math.abs(day - year);
  const thirdChallenge = Math.abs(firstChallenge - secondChallenge);
  const fourthChallenge = Math.abs(month - year);

  return {
    pinnacles: [firstPinnacle, secondPinnacle, thirdPinnacle, fourthPinnacle],
    challenges: [firstChallenge, secondChallenge, thirdChallenge, fourthChallenge]
  };
}

// ---------- PLANES & INTENSITY (PRO) ----------

function calcPlanes(fullName) {
  const letters = onlyLetters(fullName);
  const vowels = letters.split("").filter(isVowel);
  const consonants = letters.split("").filter(ch => !isVowel(ch));

  const mentalLetters = ["A","J","S"];
  const emotionalLetters = ["B","K","T","C","L","U"];
  const physicalLetters = ["D","M","V","E","N","W"];
  const intuitiveLetters = ["F","O","X","G","P","Y","H","Q","Z","I","R"];

  const planeScore = { mental:0, emotional:0, physical:0, intuitive:0 };

  letters.split("").forEach(ch => {
    if (mentalLetters.includes(ch)) planeScore.mental++;
    if (emotionalLetters.includes(ch)) planeScore.emotional++;
    if (physicalLetters.includes(ch)) planeScore.physical++;
    if (intuitiveLetters.includes(ch)) planeScore.intuitive++;
  });

  return {
    vowels: vowels.length,
    consonants: consonants.length,
    planes: planeScore
  };
}

function calcIntensity(freq) {
  const entries = Object.entries(freq);
  if (!entries.length) return null;
  entries.sort((a, b) => b[1] - a[1]);
  const [topLetter, topCount] = entries[0];
  return { topLetter, topCount };
}

// ---------- APPLIED NUMEROLOGY (PRO) ----------

function appliedThemes(lifePath, personalYear, karmicLessons, karmicDebt) {
  const themes = [];

  const lpMap = {
    1: "Leadership, independence, and initiating new paths.",
    2: "Partnership, sensitivity, and diplomacy.",
    3: "Creativity, expression, and visibility.",
    4: "Structure, discipline, and long-term building.",
    5: "Change, freedom, and experimentation.",
    6: "Responsibility, care, and community.",
    7: "Introspection, study, and spiritual inquiry.",
    8: "Power, material mastery, and impact.",
    9: "Completion, compassion, and service."
  };

  const pyMap = {
    1: "Year of new beginnings and bold moves.",
    2: "Year of patience, collaboration, and subtle progress.",
    3: "Year of expression, creativity, and social energy.",
    4: "Year of work, foundations, and discipline.",
    5: "Year of change, risk, and flexibility.",
    6: "Year of responsibility, home, and relationships.",
    7: "Year of reflection, study, and inner work.",
    8: "Year of ambition, results, and recognition.",
    9: "Year of release, endings, and integration."
  };

  if (lpMap[lifePath]) themes.push(lpMap[lifePath]);
  if (pyMap[personalYear]) themes.push(pyMap[personalYear]);

  if (karmicLessons && karmicLessons.length) {
    themes.push(`Karmic lessons around numbers: ${karmicLessons.join(", ")} — repeated themes you’re here to integrate.`);
  }

  if (karmicDebt && karmicDebt.length) {
    themes.push(`Karmic debt numbers present: ${karmicDebt.join(", ")} — these can feel like intensified lessons in those areas.`);
  }

  return themes;
}

// ---------- REPEATING NUMBER INTERPRETER ----------

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

function interpretSeenNumber(raw) {
  if (!raw) return "Enter a number pattern to interpret.";
  const cleaned = raw.replace(/\D/g, "");
  if (!cleaned) return "Enter a number pattern to interpret.";

  if (repeatingMap[cleaned]) return repeatingMap[cleaned];

  const reduced = reduceNum(Number(cleaned));
  const base = {
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
  }[reduced];

  if (!base) return "This pattern points to a unique mix of energies—notice what it means to you in context.";

  return `This pattern reduces to ${reduced}. ${base}`;
}

// ---------- MAIN AGGREGATOR ----------

export function computeAllNumbers(state = {}) {
  const profile = state.profile || {};
  const fullName = profile.fullName || profile.name || "";
  const birthDate = profile.birthDate || profile.dob || "";

  const lifePath = calcLifePath(birthDate);
  const birthday = calcBirthdayNumber(birthDate);
  const attitude = calcAttitudeNumber(birthDate);
  const expression = calcExpression(fullName);
  const soulUrge = calcSoulUrge(fullName);
  const personality = calcPersonality(fullName);
  const maturity = calcMaturity(lifePath, expression);

  const now = new Date();
  const personalYear = calcPersonalYear(birthDate, now.getFullYear());
  const personalMonth = calcPersonalMonth(birthDate, now.getFullYear(), now.getMonth() + 1);
  const personalDay = calcPersonalDay(birthDate, now);

  const phases = calcPinnaclesAndChallenges(birthDate);

  const freq = calcLetterFrequencies(fullName);
  const planes = calcPlanes(fullName);
  const intensity = calcIntensity(freq);

  const karmicLessons = calcKarmicLessons(fullName);
  const hiddenPassion = calcHiddenPassion(fullName);
  const karmicDebt = calcKarmicDebtFlags(lifePath, expression, birthday);

  const applied = appliedThemes(lifePath, personalYear, karmicLessons, karmicDebt);

  return {
    core: {
      lifePath,
      birthday,
      attitude,
      expression,
      soulUrge,
      personality,
      maturity
    },
    cycles: {
      personalYear,
      personalMonth,
      personalDay
    },
    phases,
    planes,
    intensity,
    karmicLessons,
    hiddenPassion,
    karmicDebt,
    applied
  };
}

export { interpretSeenNumber };
