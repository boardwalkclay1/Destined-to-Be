import { dateParts, reduce } from './utils.js';

export function computePinnacles(birthdate) {
  if (!birthdate) return null;
  const { month, day, year } = dateParts(birthdate);

  const p1 = reduce(month + day);
  const p2 = reduce(day + year);
  const p3 = reduce(p1 + p2);
  const p4 = reduce(month + year);

  return { p1, p2, p3, p4 };
}
