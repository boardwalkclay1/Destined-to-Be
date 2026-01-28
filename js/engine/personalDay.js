import { reduce } from './utils.js';

export function computePersonalDay(personalMonth) {
  if (!personalMonth) return null;
  const day = new Date().getDate();
  return { value: reduce(personalMonth.value + day) };
}
