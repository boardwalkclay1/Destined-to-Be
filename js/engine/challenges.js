import { dateParts, reduce } from './utils.js';

export function computeChallenges(birthdate) {
  if (!birthdate) return null;
  const { month, day, year } = dateParts(birthdate);

  const c1 = reduce(Math.abs(month - day));
  const c2 = reduce(Math.abs(day - year));
  const c3 = reduce(Math.abs(c1 - c2));
  const c4 = reduce(Math.abs(month - year));

  return { c1, c2, c3, c4 };
}
