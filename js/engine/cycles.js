import { dateParts, reduce } from './utils.js';

export function computeCycles(birthdate) {
  if (!birthdate) return null;

  const { month, day, year } = dateParts(birthdate);

  const firstRaw = month;
  const secondRaw = day;
  const thirdRaw = year;

  const first = reduce(firstRaw);
  const second = reduce(secondRaw);
  const third = reduce(thirdRaw);

  return {
    first: {
      value: first,
      raw: firstRaw,
      label: "First Cycle (Formative)",
      breakdown: `${firstRaw} → ${first}`
    },
    second: {
      value: second,
      raw: secondRaw,
      label: "Second Cycle (Productive)",
      breakdown: `${secondRaw} → ${second}`
    },
    third: {
      value: third,
      raw: thirdRaw,
      label: "Third Cycle (Harvest)",
      breakdown: `${thirdRaw} → ${third}`
    }
  };
}
