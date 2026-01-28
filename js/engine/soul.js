import { CH_MAP, onlyVowels, sumLetters, reduce } from './utils.js';

export function computeSoul(fullName) {
  if (!fullName) return null;
  const v = onlyVowels(fullName);
  const total = sumLetters(v, CH_MAP);
  return { value: reduce(total) };
}
