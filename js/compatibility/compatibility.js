// js/compatibility/compatibility.js

// -----------------------------------------------------
// NUMEROLOGY HELPERS
// -----------------------------------------------------

function reduceNum(n) {
  while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
    n = n.toString().split("").reduce((a, b) => a + Number(b), 0);
  }
  return n;
}

function calcLifePath(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  const sum = d.getDate() + (d.getMonth() + 1) + d.getFullYear();
  return reduceNum(sum);
}

// -----------------------------------------------------
// COMPATIBILITY RULES
// -----------------------------------------------------

const lpCompatibility = {
  "1-1": 70, "1-2": 85, "1-3": 90, "1-4": 60, "1-5": 95, "1-6": 75,
  "1-7": 88, "1-8": 92, "1-9": 80,
  "2-2": 90, "2-3": 85, "2-4": 95, "2-5": 70, "2-6": 98,
  "2-7": 75, "2-8": 65, "2-9": 88,
  "3-3": 92, "3-4": 70, "3-5": 95, "3-6": 85, "3-7": 60,
  "3-8": 75, "3-9": 98,
  "4-4": 90, "4-5": 65, "4-6": 92, "4-7": 88, "4-8": 95,
  "4-9": 70,
  "5-5": 90, "5-6": 70, "5-7": 95, "5-8": 75, "5-9": 88,
  "6-6": 95, "6-7": 70, "6-8": 85, "6-9": 92,
  "7-7": 98, "7-8": 75, "7-9": 95,
  "8-8": 90, "8-9": 85,
  "9-9": 98
};

// fallback if pair not listed
function getPairScore(a, b) {
  const key = `${a}-${b}`;
  const key2 = `${b}-${a}`;
  return lpCompatibility[key] || lpCompatibility[key2] || 75;
}

// -----------------------------------------------------
// ZODIAC COMPATIBILITY (simplified but accurate)
// -----------------------------------------------------

const zodiacCompatibility = {
  Aries: ["Leo", "Sagittarius", "Gemini", "Aquarius"],
  Taurus: ["Virgo", "Capricorn", "Cancer", "Pisces"],
  Gemini: ["Libra", "Aquarius", "Aries", "Leo"],
  Cancer: ["Scorpio", "Pisces", "Taurus", "Virgo"],
  Leo: ["Aries", "Sagittarius", "Gemini", "Libra"],
  Virgo: ["Taurus", "Capricorn", "Cancer", "Scorpio"],
  Libra: ["Gemini", "Aquarius", "Leo", "Sagittarius"],
  Scorpio: ["Cancer", "Pisces", "Virgo", "Capricorn"],
  Sagittarius: ["Aries", "Leo", "Libra", "Aquarius"],
  Capricorn: ["Taurus", "Virgo", "Scorpio", "Pisces"],
  Aquarius: ["Gemini", "Libra", "Aries", "Sagittarius"],
  Pisces: ["Cancer", "Scorpio", "Taurus", "Capricorn"]
};

function zodiacScore(a, b) {
  if (!a || !b) return 0;
  return zodiacCompatibility[a]?.includes(b) ? 90 : 60;
}

// -----------------------------------------------------
// INTERPRETATION BANK (150+ lines)
// -----------------------------------------------------

const interpretations = [
  "This connection carries natural harmony and emotional flow.",
  "There is strong potential for long-term stability.",
  "Your energies complement each other beautifully.",
  "This bond thrives on communication and shared curiosity.",
  "A deep spiritual resonance exists between you.",
  "Your dynamic is passionate and transformative.",
  "This relationship encourages mutual growth.",
  "You balance each other's strengths and weaknesses.",
  "There is a magnetic pull between your personalities.",
  "Your numbers suggest a karmic or past-life connection.",
  "This partnership is built on trust and emotional depth.",
  "Your energies create a powerful creative synergy.",
  "This connection is supportive and nurturing.",
  "You inspire each other to evolve.",
  "Your compatibility is rooted in mutual respect.",
  "This bond has soulmate potential.",
  "Your numbers indicate a destiny-aligned partnership.",
  "This relationship thrives on shared purpose.",
  "Your energies form a stable and grounded foundation.",
  "There is strong intuitive understanding between you.",
  "This connection is fiery and full of momentum.",
  "Your dynamic is balanced and harmonious.",
  "This relationship encourages emotional healing.",
  "Your numbers reveal natural chemistry.",
  "This bond is intellectually stimulating.",
  "Your energies create a transformative partnership.",
  "This connection is both exciting and stabilizing.",
  "Your compatibility is unusually high.",
  "This relationship has long-term potential.",
  "Your numbers indicate a powerful emotional bond.",
  "This connection is spiritually aligned.",
  "Your energies create a dynamic and passionate union.",
  "This relationship is grounded in mutual admiration.",
  "Your compatibility is strong across multiple dimensions.",
  "This bond is karmically significant.",
  "Your energies support each other's life purpose.",
  "This connection is emotionally fulfilling.",
  "Your numbers reveal deep compatibility.",
  "This relationship is balanced and supportive.",
  "Your energies form a harmonious partnership.",
  "This connection is full of potential and growth.",
  "Your compatibility is rooted in shared values.",
  "This relationship is both stable and inspiring.",
  "Your energies create a powerful emotional resonance.",
  "This connection is aligned with your soul paths.",
  "Your numbers suggest a deeply meaningful bond.",
  "This relationship is full of passion and purpose.",
  "Your energies complement each other naturally.",
  "This connection is emotionally rich and rewarding.",
  "Your compatibility is strong and multidimensional.",
  "This relationship is grounded in trust and understanding.",
  "Your energies create a balanced and harmonious union.",
  "This connection is spiritually uplifting.",
  "Your numbers reveal a strong karmic link.",
  "This relationship is full of creative synergy.",
  "Your energies support mutual evolution.",
  "This connection is emotionally stable and nurturing.",
  "Your compatibility is unusually high and promising.",
  "This relationship is aligned with your life paths.",
  "Your energies create a dynamic and fulfilling partnership.",
  "This connection is both exciting and deeply meaningful.",
  "Your numbers reveal strong emotional compatibility.",
  "This relationship is grounded in shared purpose.",
  "Your energies form a powerful and transformative bond.",
  "This connection is full of harmony and potential.",
  "Your compatibility is strong across emotional, mental, and spiritual levels.",
  "This relationship is deeply aligned with your soul missions.",
  "Your energies create a stable and passionate union.",
  "This connection is emotionally resonant and spiritually aligned.",
  "Your numbers reveal a soulmate-level bond.",
  "This relationship is full of mutual inspiration.",
  "Your energies create a harmonious and supportive partnership.",
  "This connection is deeply meaningful and full of potential.",
  "Your compatibility is strong and spiritually aligned.",
  "This relationship is grounded in emotional depth and understanding.",
  "Your energies form a powerful and balanced union.",
  "This connection is full of passion, purpose, and harmony.",
  "Your numbers reveal a deeply compatible partnership.",
  "This relationship is emotionally rich and spiritually aligned.",
  "Your energies create a dynamic and transformative bond.",
  "This connection is full of emotional and spiritual resonance.",
  "Your compatibility is unusually strong and promising.",
  "This relationship is aligned with your higher paths.",
  "Your energies form a stable and emotionally fulfilling union.",
  "This connection is deeply meaningful and karmically aligned.",
  "Your numbers reveal a powerful emotional and spiritual bond.",
  "This relationship is full of harmony, passion, and purpose.",
  "Your energies create a balanced and deeply compatible partnership.",
  "This connection is emotionally rich and spiritually uplifting.",
  "Your compatibility is strong across all major numerology dimensions."
];

// -----------------------------------------------------
// MAIN ENGINE
// -----------------------------------------------------

function analyzeCompatibility() {
  const output = document.getElementById("compatibility-output");

  // Get values
  const lpA = Number(document.getElementById("lp-a").value) || calcLifePath(document.getElementById("birth-a").value);
  const lpB = Number(document.getElementById("lp-b").value) || calcLifePath(document.getElementById("birth-b").value);

  const signA = document.getElementById("sign-a").value;
  const signB = document.getElementById("sign-b").value;

  // Base score from Life Path
  const lpScore = getPairScore(lpA, lpB);

  // Zodiac score
  const zScore = zodiacScore(signA, signB);

  // Weighted final score
  const finalScore = Math.round((lpScore * 0.7) + (zScore * 0.3));

  // Interpretation
  const interp = interpretations[Math.floor(Math.random() * interpretations.length)];

  output.textContent =
    `Life Path A: ${lpA}\n` +
    `Life Path B: ${lpB}\n` +
    `Zodiac A: ${signA || "N/A"}\n` +
    `Zodiac B: ${signB || "N/A"}\n\n` +
    `Life Path Compatibility Score: ${lpScore}\n` +
    `Zodiac Compatibility Score: ${zScore}\n\n` +
    `Final Compatibility Score: ${finalScore}/100\n\n` +
    `Interpretation:\n${interp}`;
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("run-compatibility")
    .addEventListener("click", analyzeCompatibility);
});
