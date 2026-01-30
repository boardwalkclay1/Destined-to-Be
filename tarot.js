// tarot.js

// ------------------------------
// CARD DATABASE (~100 cards)
// ------------------------------

const majorArcana = [
  { name: "The Fool", meaning: "New beginnings, leap of faith." },
  { name: "The Magician", meaning: "Manifestation, focused will." },
  { name: "The High Priestess", meaning: "Intuition, hidden knowledge." },
  { name: "The Empress", meaning: "Abundance, nurturing, creation." },
  { name: "The Emperor", meaning: "Structure, authority, stability." },
  { name: "The Hierophant", meaning: "Tradition, teaching, guidance." },
  { name: "The Lovers", meaning: "Union, choice, alignment." },
  { name: "The Chariot", meaning: "Drive, victory, direction." },
  { name: "Strength", meaning: "Inner strength, courage, patience." },
  { name: "The Hermit", meaning: "Solitude, inner search, wisdom." },
  { name: "Wheel of Fortune", meaning: "Cycles, fate, turning point." },
  { name: "Justice", meaning: "Balance, truth, cause and effect." },
  { name: "The Hanged Man", meaning: "Pause, new perspective, surrender." },
  { name: "Death", meaning: "Endings, transformation, rebirth." },
  { name: "Temperance", meaning: "Harmony, moderation, blending." },
  { name: "The Devil", meaning: "Attachment, shadow, temptation." },
  { name: "The Tower", meaning: "Sudden change, revelation, upheaval." },
  { name: "The Star", meaning: "Hope, renewal, guidance." },
  { name: "The Moon", meaning: "Uncertainty, dreams, subconscious." },
  { name: "The Sun", meaning: "Joy, clarity, vitality." },
  { name: "Judgement", meaning: "Awakening, reckoning, calling." },
  { name: "The World", meaning: "Completion, integration, wholeness." }
];

const suits = ["Wands","Cups","Swords","Pentacles"];
const ranks = [
  "Ace","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten",
  "Page","Knight","Queen","King"
];

function minorMeaning(rank, suit) {
  return `${rank} of ${suit}: symbolic lesson in the realm of ${suit}.`;
}

const tarotCards = [];

// 78 tarot
majorArcana.forEach(card => {
  tarotCards.push({ ...card, type: "Major Arcana" });
});

suits.forEach(suit => {
  ranks.forEach(rank => {
    tarotCards.push({
      name: `${rank} of ${suit}`,
      meaning: minorMeaning(rank, suit),
      type: "Minor Arcana"
    });
  });
});

// ~22 extra “oracle-style” cards to push toward 100
const extraOracles = [
  "Cosmic Alignment","Shadow Work","Inner Child","Ancestral Line",
  "Divine Timing","Sacred Union","Soul Mission","Karmic Lesson",
  "New Cycle","Release","Integration","Expansion","Contraction",
  "Threshold","Portal","Synchronicity","Guides","Dream Message",
  "Heart Opening","Grounding","Recalibration","Breakthrough"
];

extraOracles.forEach(name => {
  tarotCards.push({
    name,
    meaning: `${name}: an energetic theme asking for your attention.`,
    type: "Oracle"
  });
});

// ------------------------------
// SHUFFLE
// ------------------------------

function shuffleDeck(deck) {
  let i = deck.length;
  while (i > 0) {
    const j = Math.floor(Math.random() * i);
    i--;
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

// ------------------------------
// RENDER DECK
// ------------------------------

function renderDeck(deck) {
  const container = document.getElementById("deck-container");
  container.innerHTML = "";

  deck.forEach((card, index) => {
    const el = document.createElement("div");
    el.className = "tarot-card back";
    el.dataset.index = index;

    const label = document.createElement("div");
    label.className = "tarot-card-label";
    label.textContent = "Card";

    el.appendChild(label);
    container.appendChild(el);
  });
}

// ------------------------------
// MAIN LOGIC
// ------------------------------

let deck = [];
let spreadCount = 3;
let manualMode = false;
let chosen = [];

function reset() {
  deck = shuffleDeck([...tarotCards]);
  chosen = [];
  renderDeck(deck);
  document.getElementById("chosen-cards").innerHTML = "";
  manualMode = false;
}

function autoPick() {
  chosen = deck.slice(0, spreadCount);
  renderChosen();
}

function enableManualPick() {
  manualMode = true;
  const deckEls = document.querySelectorAll(".tarot-card");

  deckEls.forEach(el => {
    el.onclick = () => {
      if (!manualMode) return;
      const index = Number(el.dataset.index);
      const card = deck[index];

      if (chosen.length < spreadCount && !el.classList.contains("picked")) {
        chosen.push(card);
        el.classList.add("picked", "flipped");
        el.querySelector(".tarot-card-label").textContent = card.name;
        renderChosen();
      }
    };
  });
}

function renderChosen() {
  const container = document.getElementById("chosen-cards");
  container.innerHTML = "";

  chosen.forEach((card, idx) => {
    const el = document.createElement("div");
    el.className = "tarot-card chosen";

    const title = document.createElement("div");
    title.className = "tarot-card-title";
    title.textContent = `${idx + 1}. ${card.name} (${card.type})`;

    const meaning = document.createElement("div");
    meaning.className = "tarot-card-meaning";
    meaning.textContent = card.meaning;

    el.appendChild(title);
    el.appendChild(meaning);
    container.appendChild(el);
  });
}

// ------------------------------
// INIT
// ------------------------------

document.addEventListener("DOMContentLoaded", () => {
  reset();

  document.querySelectorAll("[data-spread]").forEach(btn => {
    btn.addEventListener("click", () => {
      spreadCount = Number(btn.dataset.spread);
      reset();
    });
  });

  document.getElementById("auto-pick").addEventListener("click", () => {
    manualMode = false;
    autoPick();
  });

  document.getElementById("manual-pick").addEventListener("click", () => {
    manualMode = true;
    enableManualPick();
  });
});
