import { CH_MAP, onlyConsonants, sumLetters, reduce } from './utils.js';

export function computePersonality(fullName) {
  if (!fullName) return null;
  const c = onlyConsonants(fullName);
  const total = sumLetters(c, CH_MAP);
  return { value: reduce(total) };
}
