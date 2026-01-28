// js/engine/utils.js

// Pythagorean letter map
export const PY_MAP = {
  A:1, J:1, S:1,
  B:2, K:2, T:2,
  C:3, L:3, U:3,
  D:4, M:4, V:4,
  E:5, N:5, W:5,
  F:6, O:6, X:6,
  G:7, P:7, Y:7,
  H:8, Q:8, Z:8,
  I:9, R:9
};

// Chaldean letter map
export const CH_MAP = {
  A:1, I:1, J:1, Q:1, Y:1,
  B:2, K:2, R:2,
  C:3, G:3, L:3, S:3,
  D:4, M:4, T:4,
  E:5, H:5, N:5, X:5,
  U:6, V:6, W:6,
  O:7, Z:7,
  F:8, P:8
};

// Reduce number but keep master numbers
export function reduce(n) {
  if (n === 11 || n === 22 || n === 33) return n;
  while (n > 9) {
    n = n.toString().split('').reduce((a,b)=>a+Number(b),0);
    if (n === 11 || n === 22 || n === 33) return n;
  }
  return n;
}

// Sum letters using a map
export function sumLetters(str, map) {
  return str
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
    .split('')
    .map(ch => map[ch] || 0)
    .reduce((a,b)=>a+b, 0);
}

// Extract vowels / consonants
export const vowels = ['A','E','I','O','U'];
export function onlyVowels(str) {
  return str.toUpperCase().split('').filter(c => vowels.includes(c)).join('');
}
export function onlyConsonants(str) {
  return str.toUpperCase().split('').filter(c => !vowels.includes(c) && /[A-Z]/.test(c)).join('');
}

// Date helpers
export function dateParts(birthdate) {
  const d = new Date(birthdate);
  return {
    day: d.getUTCDate(),
    month: d.getUTCMonth() + 1,
    year: d.getUTCFullYear()
  };
}
