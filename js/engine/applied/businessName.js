import { CH_MAP, sumLetters, reduce } from '../utils.js';

export function computeBusinessName(name) {
  if (!name) return null;
  const total = sumLetters(name, CH_MAP);
  return { value: reduce(total) };
}
