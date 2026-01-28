import { CH_MAP, sumLetters, reduce } from './utils.js';

export function computeExpression(fullName) {
  if (!fullName) return null;
  const total = sumLetters(fullName, CH_MAP);
  return { value: reduce(total) };
}
