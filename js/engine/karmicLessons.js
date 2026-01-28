export function computeKarmicLessons(fullName) {
  if (!fullName) return null;

  const letters = fullName.toUpperCase().replace(/[^A-Z]/g, '').split('');
  const all = new Set(letters);
  const missing = [];

  for (let c of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ') {
    if (!all.has(c)) missing.push(c);
  }

  return { missing };
}
