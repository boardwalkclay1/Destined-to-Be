import { dateParts, reduce } from './utils.js';

export function computeAttitude(birthdate) {
  if (!birthdate) return null;
  const { day, month } = dateParts(birthdate);
  return { value: reduce(day + month) };
}
