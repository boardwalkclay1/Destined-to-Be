import { PY_MAP, sumLetters, reduce } from '../utils.js';

export function computeAddress(address) {
  if (!address) return null;
  const total = sumLetters(address, PY_MAP);
  return { value: reduce(total) };
}
