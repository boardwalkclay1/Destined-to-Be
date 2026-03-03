export function computeIntensity(fullName) {
  if (!fullName) return null;

  // Normalize: uppercase, letters only
  const clean = fullName
    .toUpperCase()
    .replace(/[^A-Z]/g, "");

  if (!clean) {
    return {
      rawInput: fullName,
      lettersUsed: [],
      frequencyMap: {},
      sorted: [],
      totalLetters: 0
    };
  }

  // Frequency map
  const freq = {};
  clean.split("").forEach(l => {
    freq[l] = (freq[l] || 0) + 1;
  });

  // Sorted list for UI (most intense → least)
  const sorted = Object.entries(freq)
    .map(([letter, count]) => ({ letter, count }))
    .sort((a, b) => b.count - a.count);

  return {
    rawInput: fullName,
    lettersUsed: clean.split(""),
    frequencyMap: freq,
    sorted,
    totalLetters: clean.length
  };
}
