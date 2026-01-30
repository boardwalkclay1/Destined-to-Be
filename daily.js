// js/daily/daily.js

// ---------------------------------------------
// NUMEROLOGY HELPERS
// ---------------------------------------------

function reduceNum(n) {
  while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
    n = n.toString().split("").reduce((a, b) => a + Number(b), 0);
  }
  return n;
}

function getUniversalDay() {
  const now = new Date();
  const d = now.getDate();
  const m = now.getMonth() + 1;
  const y = now.getFullYear();
  return reduceNum(d + m + y);
}

function getPersonalDay() {
  // Personal Day = reduce(birth month + birth day + universal day)
  // For now, use placeholder birthday until user system is built
  const birthday = localStorage.getItem("birthday") || "01-01"; // MM-DD
  const [mm, dd] = birthday.split("-").map(Number);

  return reduceNum(mm + dd + getUniversalDay());
}

// ---------------------------------------------
// 200 DAILY INTERPRETATIONS
// ---------------------------------------------

const interpretations = [
  "A surge of clarity arrives today.",
  "Your intuition is louder than usual.",
  "A cycle is closing—let it fall away.",
  "Momentum builds behind the scenes.",
  "Today favors bold decisions.",
  "A message or sign will stand out.",
  "Your energy is magnetic right now.",
  "A small risk brings a big reward.",
  "You may feel pulled toward reflection.",
  "A breakthrough is forming beneath the surface.",
  "Your creativity is heightened today.",
  "Someone may reveal useful information.",
  "A new opportunity is aligning for you.",
  "Your patience will pay off today.",
  "You may feel a shift in priorities.",
  "A conversation brings clarity.",
  "Your confidence rises naturally today.",
  "Let intuition guide your next step.",
  "A subtle sign confirms your direction.",
  "Your energy supports fresh starts.",
  "Today is ideal for planning ahead.",
  "A moment of insight changes everything.",
  "You may feel called to simplify.",
  "Your influence is stronger than you realize.",
  "A new idea wants your attention.",
  "You’re aligning with something bigger.",
  "A cycle of growth is beginning.",
  "Your inner voice is trustworthy today.",
  "A chance encounter holds meaning.",
  "You may feel a surge of motivation.",
  "Today supports emotional clarity.",
  "A hidden truth becomes visible.",
  "Your path becomes clearer today.",
  "You may feel a push toward action.",
  "A new rhythm is forming in your life.",
  "Your energy attracts the right people.",
  "A shift in perspective empowers you.",
  "You may feel more grounded today.",
  "Your intuition is guiding you forward.",
  "A new chapter quietly begins.",
  "Today supports letting go of old patterns.",
  "Your focus sharpens naturally.",
  "A meaningful insight arrives unexpectedly.",
  "You may feel called to reorganize.",
  "Your energy supports healing today.",
  "A new opportunity is forming.",
  "You may feel more expressive today.",
  "Your clarity is increasing.",
  "A moment of alignment appears.",
  "You may feel a pull toward rest.",
  "Your energy supports connection today.",
  "A new idea sparks excitement.",
  "You may feel more decisive today.",
  "Your intuition is especially sharp.",
  "A cycle of renewal begins.",
  "You may feel more balanced today.",
  "Your energy supports progress.",
  "A subtle shift brings relief.",
  "You may feel more open to change.",
  "Your path becomes lighter today.",
  "A new insight brings direction.",
  "You may feel more confident today.",
  "Your energy supports manifestation.",
  "A moment of clarity arrives.",
  "You may feel more inspired today.",
  "Your intuition leads you well.",
  "A cycle of growth continues.",
  "You may feel more focused today.",
  "Your energy supports alignment.",
  "A new opportunity becomes visible.",
  "You may feel more grounded today.",
  "Your clarity strengthens.",
  "A moment of truth appears.",
  "You may feel more motivated today.",
  "Your energy supports expansion.",
  "A new rhythm emerges.",
  "You may feel more connected today.",
  "Your intuition deepens.",
  "A cycle of transformation begins.",
  "You may feel more centered today.",
  "Your energy supports breakthroughs.",
  "A new insight shifts your path.",
  "You may feel more aligned today.",
  "Your clarity sharpens.",
  "A moment of realization arrives.",
  "You may feel more empowered today.",
  "Your energy supports new beginnings.",
  "A new direction becomes clear.",
  "You may feel more intuitive today.",
  "Your insight strengthens.",
  "A cycle of renewal continues.",
  "You may feel more expressive today.",
  "Your energy supports clarity.",
  "A new idea takes shape.",
  "You may feel more open today.",
  "Your intuition guides your next step.",
  "A moment of alignment appears.",
  "You may feel more determined today.",
  "Your energy supports progress.",
  "A new opportunity aligns.",
  "You may feel more balanced today.",
  "Your clarity increases.",
  "A moment of insight arrives.",
  "You may feel more connected today.",
  "Your intuition is strong.",
  "A cycle of growth deepens.",
  "You may feel more focused today.",
  "Your energy supports healing.",
  "A new realization forms.",
  "You may feel more grounded today.",
  "Your clarity expands.",
  "A moment of truth emerges.",
  "You may feel more inspired today.",
  "Your intuition sharpens.",
  "A cycle of transformation continues.",
  "You may feel more aligned today.",
  "Your energy supports breakthroughs.",
  "A new insight lights the path.",
  "You may feel more empowered today.",
  "Your clarity strengthens.",
  "A moment of realization appears.",
  "You may feel more intuitive today.",
  "Your energy supports new beginnings.",
  "A new direction opens.",
  "You may feel more expressive today.",
  "Your intuition deepens.",
  "A cycle of renewal strengthens.",
  "You may feel more centered today.",
  "Your clarity sharpens.",
  "A moment of alignment arrives.",
  "You may feel more motivated today.",
  "Your energy supports expansion.",
  "A new rhythm takes shape.",
  "You may feel more connected today.",
  "Your intuition guides you.",
  "A cycle of growth expands.",
  "You may feel more grounded today.",
  "Your clarity increases.",
  "A moment of truth appears.",
  "You may feel more inspired today.",
  "Your intuition strengthens.",
  "A cycle of transformation deepens.",
  "You may feel more aligned today.",
  "Your energy supports breakthroughs.",
  "A new insight emerges.",
  "You may feel more empowered today.",
  "Your clarity expands.",
  "A moment of realization arrives.",
  "You may feel more intuitive today.",
  "Your energy supports new beginnings.",
  "A new direction becomes visible.",
  "You may feel more expressive today.",
  "Your intuition sharpens.",
  "A cycle of renewal continues.",
  "You may feel more centered today.",
  "Your clarity strengthens.",
  "A moment of alignment appears.",
  "You may feel more motivated today.",
  "Your energy supports expansion.",
  "A new rhythm emerges.",
  "You may feel more connected today.",
  "Your intuition deepens.",
  "A cycle of growth continues.",
  "You may feel more grounded today.",
  "Your clarity increases.",
  "A moment of truth arrives.",
  "You may feel more inspired today.",
  "Your intuition strengthens.",
  "A cycle of transformation continues.",
  "You may feel more aligned today.",
  "Your energy supports breakthroughs.",
  "A new insight forms.",
  "You may feel more empowered today.",
  "Your clarity expands.",
  "A moment of realization appears.",
  "You may feel more intuitive today.",
  "Your energy supports new beginnings.",
  "A new direction opens.",
  "You may feel more expressive today.",
  "Your intuition deepens.",
  "A cycle of renewal strengthens.",
  "You may feel more centered today.",
  "Your clarity sharpens.",
  "A moment of alignment arrives.",
  "You may feel more motivated today.",
  "Your energy supports expansion.",
  "A new rhythm takes shape.",
  "You may feel more connected today.",
  "Your intuition guides you.",
  "A cycle of growth expands.",
  "You may feel more grounded today.",
  "Your clarity increases.",
  "A moment of truth appears.",
  "You may feel more inspired today.",
  "Your intuition strengthens.",
  "A cycle of transformation deepens.",
  "You may feel more aligned today.",
  "Your energy supports breakthroughs.",
  "A new insight emerges."
];

// ---------------------------------------------
// RENDER
// ---------------------------------------------

function render() {
  const personal = getPersonalDay();
  const universal = getUniversalDay();

  document.getElementById("daily-personal").textContent =
    `Personal Day: ${personal}`;

  document.getElementById("daily-universal").textContent =
    `Universal Day: ${universal}`;

  const randomIndex = Math.floor(Math.random() * interpretations.length);
  document.getElementById("daily-interpretation").textContent =
    interpretations[randomIndex];
}

document.addEventListener("DOMContentLoaded", render);
