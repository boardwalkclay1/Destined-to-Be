// js/readings/readings.js
import { getState } from '../state.js';
import { applyTierToDom, getTier } from '../tier.js';

// ---------- NUMEROLOGY HELPERS ----------

function reduceNum(n) {
  while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
    n = n.toString().split('').reduce((a, b) => a + Number(b), 0);
  }
  return n;
}

function calcLifePathFromDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  const sum = d.getDate() + (d.getMonth() + 1) + d.getFullYear();
  return reduceNum(sum);
}

// ---------- FREE LIFE PATH READING ----------

const lifePathTexts = {
  1: "Life Path 1: The Pioneer. You’re here to initiate, lead, and carve your own lane.",
  2: "Life Path 2: The Diplomat. You’re here to harmonize, support, and build bridges.",
  3: "Life Path 3: The Creator. You’re here to express, perform, and inspire through story.",
  4: "Life Path 4: The Builder. You’re here to structure, stabilize, and make things real.",
  5: "Life Path 5: The Explorer. You’re here to experience freedom, change, and adventure.",
  6: "Life Path 6: The Guardian. You’re here to nurture, protect, and hold community.",
  7: "Life Path 7: The Seeker. You’re here to question, research, and decode the unseen.",
  8: "Life Path 8: The Powerhouse. You’re here to master resources, impact, and legacy.",
  9: "Life Path 9: The Humanitarian. You’re here to heal, complete cycles, and serve.",
  11: "Life Path 11: The Visionary. You’re here to channel insight and awaken others.",
  22: "Life Path 22: The Master Builder. You’re here to build what others only imagine.",
  33: "Life Path 33: The Master Healer. You’re here to embody compassion at scale."
};

function renderFreeReading() {
  const container = document.getElementById('free-reading');
  if (!container) return;

  let lp = null;
  let name = 'You';

  try {
    const state = getState();
    const birth = state.user?.birthDate;
    name = state.user?.preferredName || state.user?.fullName || 'You';
    lp = state.numbers?.lifePath?.value || calcLifePathFromDate(birth);
  } catch {
    // fallback: try localStorage
    const birth = localStorage.getItem('birthDate');
    lp = calcLifePathFromDate(birth);
  }

  if (!lp) {
    container.textContent =
      "We couldn’t find your birth date. Go to Profile or Numbers to set it, then return here.";
    return;
  }

  const base = lifePathTexts[lp] || `Life Path ${lp}: A unique blend of drive, lessons, and gifts.`;
  container.textContent = `${name}, ${base}`;
}

// ---------- ASTROLOGY (SYMBOLIC ENGINE) ----------

const signs = [
  "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
  "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"
];

const planets = [
  "Sun","Moon","Mercury","Venus","Mars",
  "Jupiter","Saturn","Uranus","Neptune","Pluto"
];

function seededRandom(seed) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function buildAstroChart(seed) {
  const chart = {
    sun: null,
    moon: null,
    rising: null,
    houses: [],
    planets: []
  };

  // Sun, Moon, Rising
  chart.sun = signs[Math.floor(seededRandom(seed) * 12)];
  chart.moon = signs[Math.floor(seededRandom(seed + 1) * 12)];
  chart.rising = signs[Math.floor(seededRandom(seed + 2) * 12)];

  // 12 houses with symbolic degrees
  for (let i = 1; i <= 12; i++) {
    const sign = signs[Math.floor(seededRandom(seed + i * 3) * 12)];
    const degree = Math.floor(seededRandom(seed + i * 7) * 30);
    chart.houses.push({ house: i, sign, degree });
  }

  // Planets in signs and degrees
  planets.forEach((p, idx) => {
    const sign = signs[Math.floor(seededRandom(seed + idx * 11) * 12)];
    const degree = Math.floor(seededRandom(seed + idx * 13) * 30);
    chart.planets.push({ planet: p, sign, degree });
  });

  return chart;
}

function renderAstroReading(seed) {
  const el = document.getElementById('astro-reading');
  if (!el) return;

  const chart = buildAstroChart(seed);

  let out = '';
  out += `Sun: ${chart.sun}\n`;
  out += `Moon: ${chart.moon}\n`;
  out += `Rising: ${chart.rising}\n\n`;

  out += `Houses:\n`;
  chart.houses.forEach(h => {
    out += `  House ${h.house}: ${h.sign} ${h.degree}°\n`;
  });

  out += `\nPlanets:\n`;
  chart.planets.forEach(p => {
    out += `  ${p.planet}: ${p.sign} ${p.degree}°\n`;
  });

  el.textContent = out;
}

// ---------- HUMAN DESIGN (SYMBOLIC) ----------

const hdTypes = ["Generator","Manifesting Generator","Projector","Manifestor","Reflector"];
const hdAuthorities = ["Emotional","Sacral","Splenic","Ego","Self-Projected","Lunar"];
const hdStrategies = [
  "To respond","To wait for the invitation","To inform","To wait a lunar cycle"
];

function buildHumanDesign(seed) {
  return {
    type: hdTypes[Math.floor(seededRandom(seed + 101) * hdTypes.length)],
    authority: hdAuthorities[Math.floor(seededRandom(seed + 202) * hdAuthorities.length)],
    strategy: hdStrategies[Math.floor(seededRandom(seed + 303) * hdStrategies.length)]
  };
}

function renderHDReading(seed) {
  const el = document.getElementById('hd-reading');
  if (!el) return;

  const hd = buildHumanDesign(seed);
  let out = '';
  out += `Type: ${hd.type}\n`;
  out += `Authority: ${hd.authority}\n`;
  out += `Strategy: ${hd.strategy}\n`;
  el.textContent = out;
}

// ---------- TAROT (SYMBOLIC 3-CARD SPREAD) ----------

const tarotCards = [
  "The Fool","The Magician","The High Priestess","The Empress","The Emperor",
  "The Hierophant","The Lovers","The Chariot","Strength","The Hermit",
  "Wheel of Fortune","Justice","The Hanged Man","Death","Temperance",
  "The Devil","The Tower","The Star","The Moon","The Sun",
  "Judgement","The World"
];

function drawTarot(seed) {
  const cards = [];
  const used = new Set();
  let s = seed + 500;

  while (cards.length < 3) {
    const idx = Math.floor(seededRandom(s) * tarotCards.length);
    if (!used.has(idx)) {
      used.add(idx);
      cards.push(tarotCards[idx]);
    }
    s += 17;
  }
  return {
    past: cards[0],
    present: cards[1],
    future: cards[2]
  };
}

function renderTarotReading(seed) {
  const el = document.getElementById('tarot-reading');
  if (!el) return;

  const spread = drawTarot(seed);
  let out = '';
  out += `Past: ${spread.past}\n`;
  out += `Present: ${spread.present}\n`;
  out += `Future: ${spread.future}\n`;
  el.textContent = out;
}

// ---------- PAYWALL / TIER HANDLING ----------

function setupAdvancedReadings() {
  let seed = Date.now();
  try {
    const state = getState();
    const birth = state.user?.birthDate;
    if (birth) {
      seed = new Date(birth).getTime();
    }
  } catch {
    // fallback: keep Date.now seed
  }

  const tier = getTier ? getTier() : 'free';
  const isPro = tier === 'pro';

  const astroBtn = document.getElementById('astro-unlock-btn');
  const astroPay = document.getElementById('astro-paywall');

  const hdBtn = document.getElementById('hd-unlock-btn');
  const hdPay = document.getElementById('hd-paywall');

  const tarotBtn = document.getElementById('tarot-unlock-btn');
  const tarotPay = document.getElementById('tarot-paywall');

  if (isPro) {
    if (astroPay) astroPay.style.display = 'none';
    if (hdPay) hdPay.style.display = 'none';
    if (tarotPay) tarotPay.style.display = 'none';

    astroBtn?.addEventListener('click', () => renderAstroReading(seed));
    hdBtn?.addEventListener('click', () => renderHDReading(seed));
    tarotBtn?.addEventListener('click', () => renderTarotReading(seed));
  } else {
    // free tier: show paywalls, buttons just scroll to PayPal
    astroBtn?.addEventListener('click', () => {
      astroPay?.scrollIntoView({ behavior: 'smooth' });
    });
    hdBtn?.addEventListener('click', () => {
      hdPay?.scrollIntoView({ behavior: 'smooth' });
    });
    tarotBtn?.addEventListener('click', () => {
      tarotPay?.scrollIntoView({ behavior: 'smooth' });
    });
  }
}

// ---------- NAV FROM READINGS PAGE ----------

function wireNavFromReadings() {
  const btn = document.getElementById('go-to-numbers');
  if (btn) {
    btn.addEventListener('click', () => {
      window.location.href = 'number.html';
    });
  }
}

// ---------- INIT ----------

document.addEventListener('DOMContentLoaded', () => {
  try {
    if (typeof applyTierToDom === 'function') {
      applyTierToDom();
    }
  } catch {
    // ignore
  }

  renderFreeReading();
  setupAdvancedReadings();
  wireNavFromReadings();
});
