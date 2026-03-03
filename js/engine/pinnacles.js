import { dateParts, reduce } from './utils.js';

export function computePinnacles(birthdate) {
  if (!birthdate) return null;

  const { month, day, year } = dateParts(birthdate);

  // Raw sums
  const rawP1 = month + day;
  const rawP2 = day + year;
  const rawP3 = rawP1 + rawP2;
  const rawP4 = month + year;

  // Reduced values
  const p1 = reduce(rawP1);
  const p2 = reduce(rawP2);
  const p3 = reduce(rawP3);
  const p4 = reduce(rawP4);

  return {
    p1: {
      value: p1,
      raw: rawP1,
      label: "First Pinnacle",
      breakdown: `${month} + ${day} = ${rawP1} → ${p1}`
    },
    p2: {
      value: p2,
      raw: rawP2,
      label: "Second Pinnacle",
      breakdown: `${day} + ${year} = ${rawP2} → ${p2}`
    },
    p3: {
      value: p3,
      raw: rawP3,
      label: "Third Pinnacle",
      breakdown: `${rawP1} + ${rawP2} = ${rawP3} → ${p3}`
    },
    p4: {
      value: p4,
      raw: rawP4,
      label: "Fourth Pinnacle",
      breakdown: `${month} + ${year} = ${rawP4} → ${p4}`
    }
  };
}
