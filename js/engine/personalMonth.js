import { reduce } from './utils.js';

export function computePersonalMonth(personalYear) {
  if (!personalYear) return null;
  const month = new Date().getMonth() + 1;
  return { value: reduce(personalYear.value + month) };
}
