import { dateParts, reduce } from './utils.js';

export function computeCycles(birthdate) {
  if (!birthdate) return null;
  const { month, day, year } = dateParts(birthdate);

  return {
    first: reduce(month),
    second: reduce(day),
    third: reduce(year)
  };
}
