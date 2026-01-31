// js/spirit/guide-engine.js

// ---------- SENTENCE POOLS (100+ SENTENCES TOTAL) ----------

// Core grounding / meta
const coreOpeners = [
  "You’re not off your path; you’re in the middle of a chapter that’s still being written.",
  "Your timing isn’t late or early; it’s syncing with a rhythm you’re just starting to hear.",
  "You’ve already survived the hardest parts; now you’re learning how to move with more intention.",
  "Your map isn’t missing—it's unfolding one decision at a time.",
  "You’re not behind; you’re exactly where your next choice can still change everything.",
  "Your energy is recalibrating, not failing you.",
  "You’re allowed to pause without losing momentum.",
  "You’re not stuck; you’re gathering data for your next move.",
  "Your sensitivity is not a weakness; it’s your navigation system.",
  "You’re closer to clarity than your doubt wants you to believe.",
  "Your path doesn’t need to look linear to be aligned.",
  "You’re allowed to outgrow versions of yourself that once kept you safe.",
  "Your intuition has been speaking; this is you finally listening.",
  "You’re not asking for too much; you’re asking for what actually fits.",
  "Your next step doesn’t need to be huge; it just needs to be honest.",
  "You’re not lost; you’re in a transition between identities.",
  "Your body knows when something is wrong long before your mind admits it.",
  "You’re allowed to choose what feels alive over what looks impressive.",
  "Your fear is loud, but your deeper self is steady underneath it.",
  "You’re not starting from zero; you’re starting from experience."
];

// Numerology-focused
const numerologyLines = [
  "Your numbers don’t trap you; they describe the terrain you’re walking through.",
  "Your Life Path is the long arc; your Personal Year is the current chapter.",
  "When your Life Path and Personal Year echo each other, the lessons get louder but also more rewarding.",
  "Your core numbers show your default wiring, not your limits.",
  "Repeating numbers in your chart highlight themes you came here to master.",
  "When your Personal Day feels heavy, it’s often asking for integration, not productivity.",
  "Your Expression Number shows how your energy wants to move in the world.",
  "Your Soul Urge reveals what actually nourishes you, not what just looks good on paper.",
  "Your Personality Number is the mask; your Soul Urge is the voice behind it.",
  "When your Life Path and Soul Urge align, decisions feel less like guessing and more like remembering.",
  "Your Attitude Number colors how you enter new cycles and relationships.",
  "Numerology doesn’t predict events; it describes the energetic weather you’re moving through.",
  "Your numbers can’t choose for you, but they can show you where choices have the most impact.",
  "When you resist your Life Path, life feels like friction; when you lean into it, it feels like momentum.",
  "Your chart is a mirror, not a sentence.",
  "Your Personal Year can explain why certain doors feel open while others feel sealed.",
  "Your numbers often confirm what your intuition already knows.",
  "When you feel off-track, revisiting your core numbers can remind you of your original blueprint.",
  "Your cycles repeat, but you don’t—you meet them with more experience each time.",
  "Your numbers are a language; you’re learning how to read yourself fluently."
];

// Astrology-focused
const astrologyLines = [
  "Your Sun sign describes your core vitality; it’s the fuel you run on.",
  "Your Moon sign reveals how you process emotion and recharge your inner world.",
  "Your Rising sign shows how life tends to meet you and how others first experience your energy.",
  "When your Sun and Moon feel at odds, you may feel pulled between what you do and what you need.",
  "Your chart doesn’t tell you who to be; it shows you the energies you’re learning to integrate.",
  "Transits don’t control you; they highlight themes that are already alive in your story.",
  "Your Rising sign can explain why people misread you or project certain roles onto you.",
  "When your Moon is honored, your nervous system relaxes and your intuition gets louder.",
  "Your Sun sign thrives when you give it environments that match its element.",
  "Your chart is less about fate and more about patterns you’re invited to work with consciously.",
  "Your houses show where life keeps asking you to pay attention.",
  "Planetary aspects describe conversations between parts of you, not external punishments.",
  "Your chart can validate why certain spaces drain you and others feel like home.",
  "When you work with your chart, you stop fighting your own nature and start collaborating with it.",
  "Your Rising ruler’s condition often explains the tone of your life story.",
  "Your Moon sign’s element hints at how you best self-soothe.",
  "Your Sun sign’s modality shows how you approach change and stability.",
  "Your chart doesn’t expire; you grow into it over time.",
  "Astrology can’t tell you what to do, but it can show you why certain choices feel aligned.",
  "Your chart is a map of potential, not a cage."
];

// Decision / stuck / path specific
const decisionLines = [
  "If a choice drains you just imagining it, your body is already voting no.",
  "When both options feel scary, choose the one that feels more like expansion than contraction.",
  "If you’re waiting for zero fear, you might be waiting forever; aim for a choice that feels honest instead.",
  "When you can’t see the whole staircase, commit to the next clear step.",
  "If you’re choosing between safety and aliveness, your soul usually leans toward aliveness.",
  "Sometimes the right decision is the one that lets you respect yourself in the morning.",
  "If you’re asking whether this is a sign, it already matters to you.",
  "When your mind is noisy, track how your body reacts to each option.",
  "If you had to choose based only on truth, not obligation, what would you pick?",
  "The right decision often feels like relief and grief at the same time."
];

const stuckLines = [
  "Feeling stuck is often a sign that your old strategies can’t carry your next version.",
  "Stagnation usually hides a decision you’ve been postponing.",
  "When you feel frozen, shrink the next step until it feels almost embarrassingly small.",
  "Sometimes you’re not stuck; you’re just still trying to fit into a life you’ve outgrown.",
  "Your stuckness is data, not a verdict.",
  "When nothing moves, it’s often time to change how you’re asking the question.",
  "Rest can feel like stuckness when you’re used to running on survival mode.",
  "You’re allowed to pivot without having a full replacement plan.",
  "Stuck seasons often precede identity upgrades.",
  "You’re not failing; you’re recalibrating your direction."
];

const pathLines = [
  "Your bigger path is less about a job title and more about the impact your energy leaves behind.",
  "Your calling often hides in what you do naturally when no one is watching.",
  "Your path doesn’t have to be one thing; it can be a thread that runs through many roles.",
  "What you’re obsessed with refining is often a clue to your deeper work.",
  "Your bigger path usually feels like service, not performance.",
  "You don’t have to see the final form of your purpose to take the next aligned step.",
  "Your path is allowed to evolve as you do.",
  "The things you can’t stop thinking about are often invitations, not distractions.",
  "Your bigger path is where your gifts, your wounds, and the world’s needs intersect.",
  "You’re not late to your purpose; you’re arriving with the exact experience you need."
];

// Integration / custom info
const integrationLines = [
  "Use what you learn here as a mirror, not a script.",
  "Let this guidance be a starting point, not a final answer.",
  "Write down what resonates and what resists; both are messages.",
  "If a line lands hard, sit with it before you act on it.",
  "You don’t have to implement everything at once; choose one small shift.",
  "Your next step is to translate this insight into one concrete action.",
  "Return to this guidance after a few days and notice what still feels true.",
  "Pair this insight with a simple ritual—journaling, a walk, or a quiet check-in.",
  "Let your body confirm what your mind is reading here.",
  "You’re allowed to disagree with guidance and still be guided."
];

// ---------- UTILS ----------

function pickRandom(arr, seedOffset = 0) {
  const seed = Date.now() + seedOffset;
  const idx = Math.floor((Math.sin(seed) + 1) / 2 * arr.length) % arr.length;
  return arr[idx];
}

function buildBaseContext(state) {
  const user = state?.user || {};
  const name = user.preferredName || user.fullName || 'You';
  return { name };
}

// ---------- MAIN ENGINE ----------

export function generateGuideResponse(focus, { state, extra }) {
  const ctx = buildBaseContext(state);
  const parts = [];

  // Always start with a core opener
  parts.push(`${ctx.name}, ${pickRandom(coreOpeners)}`);

  if (focus === 'tour') {
    const area = extra.tourArea || 'overview';
    if (area === 'numbers') {
      parts.push("Start with your core numbers—Life Path, Expression, and Soul Urge—then explore how each page unpacks them.");
    } else if (area === 'tools') {
      parts.push("Begin in your dashboard tools: journal, patterns, and cycles will show you how your numbers move through time.");
    } else if (area === 'spirit') {
      parts.push("Use this Spirit Guide whenever you feel unsure where to tap next; it’s your navigation layer.");
    } else {
      parts.push("Think of this app as your map: numbers explain your wiring, tools track your cycles, and readings give you language for what you’re feeling.");
    }
    parts.push(pickRandom(integrationLines, 3));
  }

  if (focus === 'numbers') {
    const lp = extra.lifePath || state?.numbers?.lifePath?.value;
    if (lp) {
      parts.push(`Your Life Path ${lp} is the long arc of your story, shaping how you grow through every cycle.`);
    }
    parts.push(pickRandom(numerologyLines, 5));
    parts.push(pickRandom(integrationLines, 7));
  }

  if (focus === 'decision') {
    if (extra.decisionText) {
      parts.push("The decision you’re holding is already important because you’re feeling its weight in your body.");
    }
    parts.push(pickRandom(decisionLines, 9));
    parts.push(pickRandom(integrationLines, 11));
  }

  if (focus === 'stuck') {
    if (extra.stuckText) {
      parts.push("The way you described feeling stuck is a clue to what part of you is asking for change.");
    }
    parts.push(pickRandom(stuckLines, 13));
    parts.push(pickRandom(integrationLines, 15));
  }

  if (focus === 'path') {
    if (extra.pathText) {
      parts.push("The themes you’re drawn to are not random; they’re breadcrumbs from your deeper self.");
    }
    if (extra.sun || extra.moon || extra.rising) {
      parts.push("Your Sun, Moon, and Rising together describe how you shine, feel, and move through the world.");
      parts.push(pickRandom(astrologyLines, 17));
    } else {
      parts.push(pickRandom(pathLines, 19));
    }
    parts.push(pickRandom(integrationLines, 21));
  }

  // If nothing specific added beyond opener, add a generic numerology/astro blend
  if (parts.length === 1) {
    parts.push(pickRandom(numerologyLines, 23));
    parts.push(pickRandom(astrologyLines, 25));
  }

  // Limit to 2–3 sentences
  return parts.slice(0, 3).join(' ');
}
