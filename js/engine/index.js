// js/engine/index.js
// NEW CINEMATIC NUMEROLOGY ENGINE

import { normalizeName, reduce, sumDigits, dateParts } from './utils.js';
import { computeSoul } from './soul.js';
import { computeExpression } from './expression.js';
import { computePersonality } from './personality.js';
import { computeMaturity } from './maturity.js';
import { computeCycles } from './cycles.js';
import { computePinnacles } from './pinnacles.js';
import { computePlanes } from './planes.js';
import { computeIntensity } from './intensity.js';
import { computeKarmicLessons } from './karmicLessons.js';
import { computeHiddenPassion } from './hiddenPassion.js';
import { computeKarmicDebt } from './karmicDebt.js';
import { appliedThemes } from './applied.js';

export function computeAll(fullName, birthdate) {
  const cleanName = normalizeName(fullName || "");
  const cleanDate = birthdate || "";

  // -----------------------------
  // CORE NUMBERS
  // -----------------------------
  const lifePath = computeLifePath(cleanDate);
  const birthday = computeBirthday(cleanDate);
  const attitude = computeAttitude(cleanDate);
  const expression = computeExpression(cleanName);
  const soulUrge = computeSoul(cleanName);
  const personality = computePersonality(cleanName);
  const maturity = computeMaturity(lifePath?.value, expression?.value);

  // -----------------------------
  // CYCLES
  // -----------------------------
  const cycles = computeCycles(cleanDate);

  // -----------------------------
  // PINNACLES
  // -----------------------------
  const pinnacles = computePinnacles(cleanDate);

  // -----------------------------
  // PLANES + INTENSITY
  // -----------------------------
  const planes = computePlanes(cleanName);
  const intensity = computeIntensity(cleanName);

  // -----------------------------
  // KARMIC SYSTEM
  // -----------------------------
  const karmicLessons = computeKarmicLessons(cleanName);
  const hiddenPassion = computeHiddenPassion(cleanName);
  const karmicDebt = computeKarmicDebt(lifePath?.value, expression?.value, birthday?.value);

  // -----------------------------
  // APPLIED THEMES
  // -----------------------------
  const applied = appliedThemes(
    lifePath?.value,
    cycles?.personalYear?.value,
    karmicLessons,
    karmicDebt
  );

  // -----------------------------
  // FINAL STRUCTURED MAP
  // -----------------------------
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
    cycles,
    pinnacles,
    planes,
    intensity,
    karmicLessons,
    hiddenPassion,
    karmicDebt,
    applied
  };
}

// -----------------------------
// DATE-BASED CORE FUNCTIONS
// -----------------------------

function computeLifePath(dateStr) {
  if (!dateStr) return null;
  const { day, month, year } = dateParts(dateStr);

  const raw = sumDigits(day) + sumDigits(month) + sumDigits(year);
  const value = reduce(raw);

  return {
    value,
    raw,
    label: "Life Path",
    breakdown: `${day} + ${month} + ${year} → ${raw} → ${value}`
  };
}

function computeBirthday(dateStr) {
  if (!dateStr) return null;
  const { day } = dateParts(dateStr);

  const raw = day;
  const value = reduce(raw);

  return {
    value,
    raw,
    label: "Birthday Number",
    breakdown: `${day} → ${value}`
  };
}

function computeAttitude(dateStr) {
  if (!dateStr) return null;
  const { day, month } = dateParts(dateStr);

  const raw = sumDigits(day) + sumDigits(month);
  const value = reduce(raw);

  return {
    value,
    raw,
    label: "Attitude Number",
    breakdown: `${day} + ${month} → ${raw} → ${value}`
  };
}
