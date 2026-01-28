import { dateParts, reduce } from './utils.js';

export function computeLifePath(birthdate) {
  if (!birthdate) return null;
  const { day, month, year } = dateParts(birthdate);
  const sum = reduce(reduce(day) + reduce(month) + reduce(year));
  return { value: sum };
}
