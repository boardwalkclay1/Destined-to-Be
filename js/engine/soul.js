import { CH_MAP, onlyVowels, sumLetters, reduce, normalizeName } from './utils.js';

export function computeSoul(fullName) {
  if (!fullName) return null;

  // Normalize input (remove punctuation, collapse spaces, uppercase)
  const clean = normalizeName(fullName);

  // Extract vowels only
  const vowels = onlyVowels(clean);

  // Sum using the chosen mapping system
  const rawTotal = sumLetters(vowels, CH_MAP);

  // Reduce to core numerology number
  const value = reduce(rawTotal);

  return {
    value,
    rawTotal,
    lettersUsed: vowels.split(""),
    breakdown: vowels.split("").map(ch => ({
      letter: ch,
      number: CH_MAP[ch] || 0
    }))
  };
}
