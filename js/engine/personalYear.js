import { reduce } from './utils.js';

export function computePersonalYear(birthdate) {
  if (!birthdate) return null;
  const year = new Date().getFullYear();
  const sum = reduce(
    reduce(new Date(birthdate).getUTCDate()) +
    reduce(new Date(birthdate).getUTCMonth() + 1) +
    reduce(year)
  );
  return { value: sum };
}
