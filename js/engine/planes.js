export function computePlanes(fullName) {
  if (!fullName) return null;

  // Normalize: uppercase, letters only
  const clean = fullName
    .toUpperCase()
    .replace(/[^A-Z]/g, "");

  if (!clean) {
    return {
      rawInput: fullName,
      lettersUsed: [],
      physical: { value: 0, letters: [], label: "Physical Plane" },
      mental: { value: 0, letters: [], label: "Mental Plane" },
      emotional: { value: 0, letters: [], label: "Emotional Plane" },
      intuitive: { value: 0, letters: [], label: "Intuitive Plane" }
    };
  }

  // Plane groups (Pythagorean)
  const PHYSICAL = "BDGJMPRTV";
  const MENTAL = "CFHKLNPQ";
  const EMOTIONAL = "AEIOUY";
  const INTUITIVE = "WXYZ";

  const physicalLetters = [];
  const mentalLetters = [];
  const emotionalLetters = [];
  const intuitiveLetters = [];

  clean.split("").forEach(l => {
    if (PHYSICAL.includes(l)) physicalLetters.push(l);
    if (MENTAL.includes(l)) mentalLetters.push(l);
    if (EMOTIONAL.includes(l)) emotionalLetters.push(l);
    if (INTUITIVE.includes(l)) intuitiveLetters.push(l);
  });

  return {
    rawInput: fullName,
    lettersUsed: clean.split(""),

    physical: {
      value: physicalLetters.length,
      letters: physicalLetters,
      label: "Physical Plane",
      breakdown: physicalLetters.join(" ")
    },

    mental: {
      value: mentalLetters.length,
      letters: mentalLetters,
      label: "Mental Plane",
      breakdown: mentalLetters.join(" ")
    },

    emotional: {
      value: emotionalLetters.length,
      letters: emotionalLetters,
      label: "Emotional Plane",
      breakdown: emotionalLetters.join(" ")
    },

    intuitive: {
      value: intuitiveLetters.length,
      letters: intuitiveLetters,
      label: "Intuitive Plane",
      breakdown: intuitiveLetters.join(" ")
    }
  };
}
