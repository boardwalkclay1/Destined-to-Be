export function computeIntensity(fullName) {
  if (!fullName) return null;

  const freq = {};
  fullName.toUpperCase().replace(/[^A-Z]/g, '').split('').forEach(l => {
    freq[l] = (freq[l] || 0) + 1;
  });

  return freq;
}
