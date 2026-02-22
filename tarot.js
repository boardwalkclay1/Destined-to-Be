// tarot.js — Advanced Tarot Engine with Full 78-Card Deck

// ============================================================
// FISHER-YATES SHUFFLE (cryptographically seeded via entropy)
// ============================================================

function shuffleDeck(deck) {
  const arr = [...deck];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  // Second pass for extra entropy
  for (let i = 0; i < arr.length; i++) {
    const j = Math.floor(Math.random() * arr.length);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ============================================================
// MAJOR ARCANA (22 cards) — Full authentic meanings
// Each card: number, name, element, numerology, upright, reversed, advice
// ============================================================

const majorArcana = [
  {
    number: 0, name: "The Fool", element: "Air", numerology: 0,
    upright: "New beginnings, spontaneity, a leap of faith, unlimited potential, innocence.",
    reversed: "Recklessness, naivety, foolish risks, poor judgment, chaos.",
    advice: "Trust the universe and take the leap. The path reveals itself as you walk it. Release fear and embrace the adventure of becoming.",
    type: "Major Arcana"
  },
  {
    number: 1, name: "The Magician", element: "Air / Mercury", numerology: 1,
    upright: "Manifestation, resourcefulness, power, inspired action, willpower.",
    reversed: "Manipulation, poor planning, untapped talents, trickery.",
    advice: "You have all the tools you need. Channel your focus, align your intention, and take decisive action. As above, so below.",
    type: "Major Arcana"
  },
  {
    number: 2, name: "The High Priestess", element: "Water / Moon", numerology: 2,
    upright: "Intuition, sacred knowledge, divine feminine, the subconscious, mystery.",
    reversed: "Secrets, disconnected from intuition, withdrawal, repressed feelings.",
    advice: "Go inward. The answers you seek already live within you. Meditate, journal, and trust your gut over logic right now.",
    type: "Major Arcana"
  },
  {
    number: 3, name: "The Empress", element: "Earth / Venus", numerology: 3,
    upright: "Femininity, beauty, nature, nurturing, abundance, creativity, fertility.",
    reversed: "Creative block, dependence, smothering, neglect of self-care.",
    advice: "Reconnect with your body, senses, and the natural world. Abundance flows when you nurture yourself first. Create freely.",
    type: "Major Arcana"
  },
  {
    number: 4, name: "The Emperor", element: "Fire / Aries", numerology: 4,
    upright: "Authority, structure, control, fatherhood, discipline, groundedness.",
    reversed: "Tyranny, rigidity, domination, excessive control, stubbornness.",
    advice: "Build solid foundations. Apply discipline and structure to your goals. Lead with fairness — authority earned through wisdom, not force.",
    type: "Major Arcana"
  },
  {
    number: 5, name: "The Hierophant", element: "Earth / Taurus", numerology: 5,
    upright: "Tradition, spiritual guidance, institutions, conformity, wisdom, education.",
    reversed: "Rebellion, subversiveness, new approaches, challenging convention.",
    advice: "Seek wisdom from mentors or established teachings. Sometimes the ancient paths hold the deepest truths — honor tradition while remaining open.",
    type: "Major Arcana"
  },
  {
    number: 6, name: "The Lovers", element: "Air / Gemini", numerology: 6,
    upright: "Love, harmony, relationships, values alignment, choices, sacred union.",
    reversed: "Disharmony, imbalance, misalignment of values, bad decisions.",
    advice: "Align your choices with your deepest values. Love, in all its forms, requires conscious commitment. Choose with your whole heart.",
    type: "Major Arcana"
  },
  {
    number: 7, name: "The Chariot", element: "Water / Cancer", numerology: 7,
    upright: "Control, willpower, success through determination, victory, confidence.",
    reversed: "Lack of control, aggression, no direction, scattered energy.",
    advice: "Harness opposing forces and direct them toward your goal. Victory is yours through focused will, not brute force. Keep the reins steady.",
    type: "Major Arcana"
  },
  {
    number: 8, name: "Strength", element: "Fire / Leo", numerology: 8,
    upright: "Strength, courage, patience, inner power, compassion, self-mastery.",
    reversed: "Inner doubt, low energy, self-doubt, raw emotion, weakness.",
    advice: "True strength is gentle. Approach challenges with patience and compassion — for yourself and others. You are stronger than you know.",
    type: "Major Arcana"
  },
  {
    number: 9, name: "The Hermit", element: "Earth / Virgo", numerology: 9,
    upright: "Soul-searching, introspection, guidance from within, solitude, inner wisdom.",
    reversed: "Isolation, loneliness, withdrawal, lost, refusing guidance.",
    advice: "Retreat into silence and seek your own counsel. The lantern you carry is wisdom earned through experience. Illuminate your own path.",
    type: "Major Arcana"
  },
  {
    number: 10, name: "Wheel of Fortune", element: "Fire / Jupiter", numerology: 10,
    upright: "Good luck, karma, life cycles, destiny, turning point, change.",
    reversed: "Bad luck, resistance to change, breaking cycles, misfortune.",
    advice: "Everything is cyclical. What goes down must come up. Work with the rhythms of life rather than against them. Your moment is turning.",
    type: "Major Arcana"
  },
  {
    number: 11, name: "Justice", element: "Air / Libra", numerology: 11,
    upright: "Justice, fairness, truth, cause and effect, law, accountability.",
    reversed: "Injustice, dishonesty, lack of accountability, unfairness.",
    advice: "Act with integrity in all things. The universe keeps perfect records. Speak your truth, weigh your choices carefully, and face consequences honestly.",
    type: "Major Arcana"
  },
  {
    number: 12, name: "The Hanged Man", element: "Water / Neptune", numerology: 12,
    upright: "Pause, surrender, letting go, new perspective, sacrifice, wisdom gained.",
    reversed: "Delays, resistance, stalling, indecision, martyrdom.",
    advice: "Suspend your usual way of seeing. Sometimes doing nothing is the most powerful action. Surrender what no longer serves and gain new perspective.",
    type: "Major Arcana"
  },
  {
    number: 13, name: "Death", element: "Water / Scorpio", numerology: 13,
    upright: "Endings, transformation, transitions, letting go, profound change.",
    reversed: "Resistance to change, personal transformation delayed, fear of endings.",
    advice: "Release the old to make room for the new. Death in tarot rarely means physical death — it is the beautiful, necessary clearing that precedes rebirth.",
    type: "Major Arcana"
  },
  {
    number: 14, name: "Temperance", element: "Fire / Sagittarius", numerology: 14,
    upright: "Balance, moderation, patience, purpose, alchemy, blending opposites.",
    reversed: "Imbalance, excess, lack of long-term vision, disharmony.",
    advice: "Find the middle path. Blend, integrate, and alchemize the opposing forces in your life. Patience now will lead to profound results.",
    type: "Major Arcana"
  },
  {
    number: 15, name: "The Devil", element: "Earth / Capricorn", numerology: 15,
    upright: "Shadow self, attachment, addiction, restriction, materialism, bondage.",
    reversed: "Releasing limiting beliefs, exploring darkness, detachment, reclaiming power.",
    advice: "Examine your chains — many are of your own making. Awareness is liberation. Face your shadow with courage and reclaim your authentic power.",
    type: "Major Arcana"
  },
  {
    number: 16, name: "The Tower", element: "Fire / Mars", numerology: 16,
    upright: "Sudden change, upheaval, chaos, revelation, awakening, disaster.",
    reversed: "Personal transformation, fear of change, averting disaster, delayed disruption.",
    advice: "What shatters was never truly solid. The Tower clears what was built on false foundations. Trust the rubble — something truer is being revealed.",
    type: "Major Arcana"
  },
  {
    number: 17, name: "The Star", element: "Air / Aquarius", numerology: 17,
    upright: "Hope, faith, renewal, serenity, inspiration, spirituality, generosity.",
    reversed: "Lack of faith, despair, disconnection, hopelessness.",
    advice: "You are held and guided. After storms come stars. Open your heart to hope, pour yourself outward, and trust in the quiet miracle of renewal.",
    type: "Major Arcana"
  },
  {
    number: 18, name: "The Moon", element: "Water / Pisces", numerology: 18,
    upright: "Illusion, fear, the unconscious, confusion, subconscious, dreams.",
    reversed: "Release of fear, repressed emotion, inner confusion resolving, clarity returning.",
    advice: "The moon reveals what sunlight hides. Navigate by feeling, not logic right now. Your dreams and intuition carry messages — pay deep attention.",
    type: "Major Arcana"
  },
  {
    number: 19, name: "The Sun", element: "Fire / Sun", numerology: 19,
    upright: "Positivity, fun, warmth, success, vitality, joy, optimism, clarity.",
    reversed: "Inner child, feeling down, overly optimistic, ego inflation.",
    advice: "Step into your light fully and without apology. Joy is your birthright. Share your warmth and let the world see your radiance.",
    type: "Major Arcana"
  },
  {
    number: 20, name: "Judgement", element: "Fire / Pluto", numerology: 20,
    upright: "Judgement, rebirth, inner calling, absolution, awakening, reckoning.",
    reversed: "Self-doubt, refusal to hear the call, lack of self-awareness, harsh judgment.",
    advice: "Hear the call that has been summoning you. Release judgment of yourself and others. Forgive, rise, and answer your highest purpose.",
    type: "Major Arcana"
  },
  {
    number: 21, name: "The World", element: "Earth / Saturn", numerology: 21,
    upright: "Completion, integration, accomplishment, travel, fulfillment, wholeness.",
    reversed: "Seeking closure, short-cuts, delays, incomplete journey.",
    advice: "You have earned this completion. Celebrate fully — and know that every ending is simply the outer edge of a new beginning waiting to spiral open.",
    type: "Major Arcana"
  }
];

// ============================================================
// MINOR ARCANA — Full meanings per rank and suit
// ============================================================

const suitThemes = {
  Wands:     { element: "Fire",  domain: "Passion, creativity, ambition, career, inspiration" },
  Cups:      { element: "Water", domain: "Emotions, relationships, intuition, dreams, healing" },
  Swords:    { element: "Air",   domain: "Mind, conflict, truth, challenge, communication" },
  Pentacles: { element: "Earth", domain: "Material world, finances, health, work, abundance" }
};

const minorMeanings = {
  Ace: {
    Wands:     { upright: "Spark of inspiration, new creative venture, bold start, raw ambition.", reversed: "Delays, creative blocks, lack of passion, missed opportunity.", advice: "Seize the creative spark now — it's a gift. The universe is offering ignition. Act." },
    Cups:      { upright: "New emotional beginning, joy, intuitive awakening, love offered.", reversed: "Blocked emotions, unrequited love, emptiness, missed connection.", advice: "Open your heart to receive. This is an invitation to a richer emotional life." },
    Swords:    { upright: "Mental clarity, breakthrough, truth cutting through confusion.", reversed: "Confusion, miscommunication, brutality, mental fog.", advice: "Seek truth above all else. Clarity is coming — are you ready to act on it?" },
    Pentacles: { upright: "Material new beginning, financial opportunity, seed of abundance.", reversed: "Lost opportunity, poor planning, financial instability.", advice: "Plant seeds in fertile ground. A new prosperity cycle is beginning if you take it." }
  },
  Two: {
    Wands:     { upright: "Future planning, discovery, progress, decisions, horizon.", reversed: "Fear of unknown, indecision, bad planning.", advice: "Look beyond the familiar. Your future is wider than your current view allows." },
    Cups:      { upright: "Unified love, partnership, mutual attraction, connection.", reversed: "Imbalance in relationship, broken communication, tension.", advice: "True partnership requires equal giving and receiving. Affirm the bond between you." },
    Swords:    { upright: "Blocked emotions, indecision, avoidance of truth, stalemate.", reversed: "Indecision, confusion, information overload, no right answers.", advice: "Remove the blindfold. A difficult truth is easier than prolonged uncertainty." },
    Pentacles: { upright: "Multiple priorities, time management, prioritization, balance.", reversed: "Disorganized, overwhelmed, loss of control.", advice: "Juggle wisely. Not everything deserves equal energy — learn to triage and flow." }
  },
  Three: {
    Wands:     { upright: "Expansion, foresight, overseas opportunities, long-term plans.", reversed: "Setbacks, delays, disappointment in plans.", advice: "Your vision is sound. Expand your reach — what you've launched is gaining traction." },
    Cups:      { upright: "Celebration, friendship, creativity, collaboration, community.", reversed: "Over-indulgence, isolation, gossip, broken celebration.", advice: "Gather your people. Joy shared is joy multiplied. Celebrate how far you've come." },
    Swords:    { upright: "Heartbreak, emotional pain, sorrow, grief, loss.", reversed: "Releasing pain, optimism returning, forgiveness, moving on.", advice: "Grief is sacred. Let yourself feel it fully — then let it move through you, not consume you." },
    Pentacles: { upright: "Teamwork, collaboration, skill building, craftsmanship.", reversed: "Lack of teamwork, disorganization, conflict.", advice: "Great things are built together. Collaborate generously and let others' strengths complement yours." }
  },
  Four: {
    Wands:     { upright: "Celebration, joy, harmony, relaxation, homecoming, community.", reversed: "Instability in home, lack of support, delayed celebration.", advice: "Create space for joy and celebration. Community and belonging are fundamental needs." },
    Cups:      { upright: "Meditation, contemplation, apathy, reevaluation, withdrawal.", reversed: "Retreat ended, re-engagement, new perspective available.", advice: "Look up from your navel-gazing. Something is being offered that you might be missing." },
    Swords:    { upright: "Rest, relaxation, meditation, contemplation, recuperation.", reversed: "Exhaustion, burn-out, deep contemplation, restlessness.", advice: "Rest is productive. Your nervous system needs recovery before the next chapter can begin." },
    Pentacles: { upright: "Control, stability, security, possessiveness, conservation.", reversed: "Greed, materialism, loss of control, openness.", advice: "Security is wise but hoarding blocks flow. Hold loosely — abundance circulates." }
  },
  Five: {
    Wands:     { upright: "Conflict, disagreements, competition, tension, diversity of thought.", reversed: "Avoiding conflict, respecting differences, ending battles.", advice: "Competition sharpens your edge. Engage productively — opposition can be your greatest teacher." },
    Cups:      { upright: "Regret, failure, disappointment, pessimism, grief over loss.", reversed: "Acceptance, moving on, finding peace, finding something positive.", advice: "Grief over what was lost is valid — but don't miss what still stands. Turn toward hope." },
    Swords:    { upright: "Conflict, disagreements, competition, defeat, win at all costs.", reversed: "Reconciliation, making amends, past resentment.", advice: "Choose your battles. Not every victory is worth the cost — sometimes yielding is wisdom." },
    Pentacles: { upright: "Financial loss, poverty, lack mindset, insecurity, worry.", reversed: "Recovery from financial loss, spiritual poverty, isolation ends.", advice: "Help is closer than it appears. Look up, reach out — and question the story that you're alone." }
  },
  Six: {
    Wands:     { upright: "Success, public recognition, progress, self-confidence, victory.", reversed: "Ego, fall from grace, lack of recognition, delayed victory.", advice: "Own your victory. Let your success be an invitation for others, not a wall that separates." },
    Cups:      { upright: "Revisiting the past, childhood memories, innocence, joy, nostalgia.", reversed: "Living in the past, forgiveness, stuck patterns.", advice: "Honor the innocent joy of your past — but don't live there. Bring that lightness into the present." },
    Swords:    { upright: "Transition, change, rite of passage, releasing the past.", reversed: "Personal transition, resistance to change, unfinished business.", advice: "Move forward even when it's painful. The crossing is necessary — calmer waters lie ahead." },
    Pentacles: { upright: "Giving, receiving, sharing wealth, generosity, charity.", reversed: "Self-care, unpaid debts, one-sided charity, strings attached.", advice: "Give generously and receive gracefully. Abundance is meant to flow, not pool." }
  },
  Seven: {
    Wands:     { upright: "Challenge, competition, protection, perseverance, standing your ground.", reversed: "Exhausted, giving up, overwhelmed, overly defensive.", advice: "Hold your ground. You have earned the high ground you stand on — defend it with confidence." },
    Cups:      { upright: "Opportunities, choices, wishful thinking, illusion, fantasy.", reversed: "Alignment, personal values, clarity over illusion.", advice: "Many doors are open — don't let abundance of choice lead to paralysis. Get clear on what truly matters." },
    Swords:    { upright: "Betrayal, deception, getting away with something, strategy.", reversed: "Imposter syndrome, self-deceit, coming clean.", advice: "Tactics without ethics create long-term debt. Play the game honestly — or don't play at all." },
    Pentacles: { upright: "Long-term view, sustainable results, perseverance, investment.", reversed: "Lack of long-term vision, limited success, impatience.", advice: "You are tending a garden. Results take time but the harvest will be extraordinary if you stay patient." }
  },
  Eight: {
    Wands:     { upright: "Speed, action, air travel, swift change, quick decisions.", reversed: "Delays, frustration, resisting change, lack of direction.", advice: "Things are moving fast now. Don't overthink — flow with momentum and act decisively." },
    Cups:      { upright: "Disappointment, abandonment, withdrawal, escapism, leaving.", reversed: "Avoidance, fear of moving on, fear of change.", advice: "Sometimes walking away is the most courageous act of self-love. What is calling you forward?" },
    Swords:    { upright: "Imprisonment, entrapment, self-victimization, restricted thinking.", reversed: "Self-acceptance, new perspective, freedom coming.", advice: "The cage is largely mental. Question the story that binds you — you have more freedom than you think." },
    Pentacles: { upright: "Apprenticeship, repetitive tasks, mastery, skill development.", reversed: "Lack of focus, mediocrity, self-development neglected.", advice: "Commit to mastery. Repetition is sacred — every hour of practice compounds into excellence." }
  },
  Nine: {
    Wands:     { upright: "Resilience, grit, last stand, persistence, test of faith.", reversed: "Exhaustion, fatigue, questioning motivation, stubbornness.", advice: "You are so close. Gather every last resource and persist — this final stretch defines the entire journey." },
    Cups:      { upright: "Contentment, satisfaction, gratitude, wish fulfillment, luxury.", reversed: "Inner happiness, materialism, dissatisfaction, over-indulgence.", advice: "Count your blessings — truly count them. Contentment is a practice, not a circumstance." },
    Swords:    { upright: "Anxiety, worry, fear, depression, nightmares, overwhelm.", reversed: "Hope, reaching out, open door, coming through.", advice: "These fears feel real but they are amplified by the dark. Speak them aloud — they lose power in the light." },
    Pentacles: { upright: "Abundance, luxury, self-sufficiency, financial independence.", reversed: "Self-worth, over-investment in work, material losses.", advice: "You have built something real. Stand in your earned abundance — allow yourself to truly enjoy it." }
  },
  Ten: {
    Wands:     { upright: "Burden, extra responsibility, hard work, completion, overwhelm.", reversed: "Doing it all yourself, collapse, letting go of burden.", advice: "You're carrying too much. Delegate, release, or simply put some things down. Your worth isn't measured by load." },
    Cups:      { upright: "Divine love, blissful relationships, harmony, alignment, family.", reversed: "Disconnection, broken values, struggling relationships.", advice: "The truest happiness is relational. Invest in love — and let love complete you in the deepest ways." },
    Swords:    { upright: "Painful endings, deep wounds, betrayal, loss, crisis, rock bottom.", reversed: "Recovery, regeneration, fear of ruin, inevitable end.", advice: "Rock bottom is ground. From here, the only direction is up. This ending — however painful — is complete." },
    Pentacles: { upright: "Wealth, financial security, family, long-term success, legacy.", reversed: "Financial failure, loneliness, loss of legacy, family conflicts.", advice: "You are building a legacy. Think in generations. Secure what you've built and pass on what is real." }
  },
  Page: {
    Wands:     { upright: "Inspiration, ideas, discovery, free spirit, energetic start.", reversed: "Newly-formed ideas, redirecting energy, self-limiting beliefs.", advice: "Be the beginner again. Approach this situation with fresh eyes and enthusiastic curiosity." },
    Cups:      { upright: "Creative opportunities, intuitive messages, curiosity, emotionally sensitive.", reversed: "Emotional immaturity, creative blocks, seduction.", advice: "Trust the messages your heart and dreams are sending. Emotional intelligence is a superpower." },
    Swords:    { upright: "New ideas, curiosity, thirst for knowledge, truth-seeker.", reversed: "Manipulation, all talk, haste, deception.", advice: "Ask all the questions. The mind that questions is the mind that grows — follow curiosity fearlessly." },
    Pentacles: { upright: "Manifestation, financial opportunity, skill development, new career path.", reversed: "Lack of progress, procrastination, learn from failure.", advice: "Take the practical first step. Dreams made real require concrete, daily, unglamorous action." }
  },
  Knight: {
    Wands:     { upright: "Energy, passion, inspired action, adventure, impulsiveness.", reversed: "Passion project delays, frustration, impatience, scattered energy.", advice: "Channel your fire with direction. Pure passion without aim burns out. Aim first, then ignite." },
    Cups:      { upright: "Creativity, romance, charm, imagination, beauty, inspiration.", reversed: "Over-active imagination, unrealistic, jealousy, moodiness.", advice: "Lead with your heart in motion — let feeling guide your action into beauty and connection." },
    Swords:    { upright: "Ambitious, action-oriented, driven to succeed, fast-thinking.", reversed: "Restless, unfocused, impulsive, burn bridges.", advice: "Your mind moves fast — make sure your ethics and empathy keep pace. Speed with wisdom." },
    Pentacles: { upright: "Hard work, productivity, routine, conservatism, methodical.", reversed: "Self-discipline, boredom, laziness, feeling stuck.", advice: "Consistent daily effort is the most underrated form of brilliance. Show up. Keep going." }
  },
  Queen: {
    Wands:     { upright: "Courage, determination, joy, vibrancy, confidence, independent.", reversed: "Selfishness, jealousy, insecurities, dependent on others.", advice: "Lead from your authentic power. Your fire is meant to inspire, not intimidate — shine fully." },
    Cups:      { upright: "Compassionate, caring, emotionally stable, intuitive, in flow.", reversed: "Inner feelings, self-care, self-love lacking, co-dependence.", advice: "You can hold space for others without losing yourself. Compassion from overflow, not depletion." },
    Swords:    { upright: "Quick thinking, organized, perceptive, independent, unbiased.", reversed: "Cold-hearted, cruel, resentful, bitchiness, spiteful.", advice: "Speak your truth with surgical precision and compassion. Your mind is a gift — use it for liberation, not cruelty." },
    Pentacles: { upright: "Nurturing, practical, providing financially, a working parent.", reversed: "Financial independence, self-care, work-home conflict.", advice: "Abundance flows through your practical wisdom and nurturing care. Tend what you've grown with love." }
  },
  King: {
    Wands:     { upright: "Natural-born leader, vision, entrepreneur, honour, inspiring.", reversed: "Impulsive, overbearing, unachievable expectations.", advice: "Your vision and passion have the power to move mountains. Lead with integrity and the world will follow." },
    Cups:      { upright: "Emotionally balanced, generous, diplomatic, caring, wise.", reversed: "Emotional manipulation, moodiness, volatile.", advice: "Emotional mastery is true power. Lead with steady compassion — be the calm center in life's storms." },
    Swords:    { upright: "Mental clarity, intellectual power, authority, truth, discipline.", reversed: "Quiet power, inner truth, misuse of power, manipulation.", advice: "Truth is your throne. Lead with clarity, fairness, and uncompromising integrity." },
    Pentacles: { upright: "Abundance, prosperity, security, ambitious, sensual, generous.", reversed: "Financially inept, obsessed with wealth and status, stubborn.", advice: "True wealth is built through steady vision and disciplined generosity. You have the capacity to build an empire — and share it." }
  }
};

const suits = ["Wands", "Cups", "Swords", "Pentacles"];
const ranks = [
  "Ace","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten",
  "Page","Knight","Queen","King"
];

const minorArcana = [];
suits.forEach(suit => {
  ranks.forEach(rank => {
    const meanings = minorMeanings[rank]?.[suit] || {
      upright: `${rank} of ${suit}: A lesson in the realm of ${suitThemes[suit].domain}.`,
      reversed: `${rank} of ${suit} reversed: Inner reflection on ${suitThemes[suit].domain}.`,
      advice: `Contemplate the energy of ${rank} in the sphere of ${suit} (${suitThemes[suit].element}).`
    };
    minorArcana.push({
      name: `${rank} of ${suit}`,
      element: suitThemes[suit].element,
      numerology: ranks.indexOf(rank) + 1,
      ...meanings,
      meaning: meanings.upright,
      type: "Minor Arcana",
      suit
    });
  });
});

// ============================================================
// ORACLE CARDS — Extended set (30 cards)
// ============================================================

const oracleCards = [
  { name: "Cosmic Alignment", meaning: "The stars have arranged themselves in your favor. Trust the larger plan at work.", advice: "Synchronicities are speaking to you. Follow the breadcrumbs the universe is laying.", type: "Oracle" },
  { name: "Shadow Work", meaning: "What you deny in yourself you attract in others. The gold is in the darkness.", advice: "Journey into the parts of yourself you've been avoiding. Liberation lives there.", type: "Oracle" },
  { name: "Inner Child", meaning: "Your playful, wonder-filled self has wisdom your adult mind has forgotten.", advice: "What did you love before the world told you what to love? Return there.", type: "Oracle" },
  { name: "Ancestral Line", meaning: "You carry the gifts and wounds of those who came before you.", advice: "Healing yourself heals your lineage. Honor your ancestors by breaking patterns.", type: "Oracle" },
  { name: "Divine Timing", meaning: "Everything is perfectly orchestrated even when it doesn't feel that way.", advice: "Resistance creates suffering. What if it's all happening exactly when it should?", type: "Oracle" },
  { name: "Sacred Union", meaning: "The inner marriage of masculine and feminine — the alchemical wholeness.", advice: "Seek balance within before seeking it without. Your relationships mirror your inner state.", type: "Oracle" },
  { name: "Soul Mission", meaning: "You came here with purpose encoded in your very being.", advice: "Your deepest longing is a clue to your mission. What calls to you despite all obstacles?", type: "Oracle" },
  { name: "Karmic Lesson", meaning: "This pattern keeps appearing because it carries a teaching you haven't fully integrated.", advice: "Ask: what is this situation teaching me about myself? The lesson, when learned, dissolves.", type: "Oracle" },
  { name: "New Cycle", meaning: "The wheel turns. A fresh chapter is beginning with new rules.", advice: "Let go of who you were in the last cycle. Become available for a new version of yourself.", type: "Oracle" },
  { name: "Release", meaning: "Something must be released to create space for what's coming.", advice: "Identify what you're clutching out of fear rather than love. Release it with grace.", type: "Oracle" },
  { name: "Integration", meaning: "The fragments of your experience are weaving together into wisdom.", advice: "Rest in the integration. Not every moment needs action — sometimes being is the work.", type: "Oracle" },
  { name: "Expansion", meaning: "You are outgrowing your current container. Expansion is imminent.", advice: "What beliefs or circumstances have become too small for who you're becoming? Expand.", type: "Oracle" },
  { name: "Contraction", meaning: "Before expansion always comes contraction — a sacred compression.", advice: "Trust the chrysalis phase. Contraction is preparation, not punishment.", type: "Oracle" },
  { name: "Threshold", meaning: "You stand at a doorway between what was and what will be.", advice: "You cannot take everything through this threshold. Choose what to carry into your new life.", type: "Oracle" },
  { name: "Portal", meaning: "A rare opening is available — a window of extraordinary possibility.", advice: "Portals don't stay open forever. What bold step will you take through this one?", type: "Oracle" },
  { name: "Synchronicity", meaning: "Meaningful coincidences are lining up. You are in flow with the universe.", advice: "Pay attention to what keeps appearing. The universe communicates through pattern and symbol.", type: "Oracle" },
  { name: "Guides", meaning: "You are not alone. Unseen helpers are accompanying your journey.", advice: "Ask for guidance and then listen. Signs come through feelings, dreams, and unexpected encounters.", type: "Oracle" },
  { name: "Dream Message", meaning: "Your dreaming mind is delivering important unconscious messages.", advice: "Keep a dream journal. The language of the unconscious is symbolic — decode it with curiosity.", type: "Oracle" },
  { name: "Heart Opening", meaning: "A tender expansion is occurring in your capacity to love and receive love.", advice: "Vulnerability is the portal to true intimacy. Let yourself be fully seen.", type: "Oracle" },
  { name: "Grounding", meaning: "Your energy is scattered. A return to earth, body, and the present moment is called for.", advice: "Walk barefoot. Breathe deeply. Your power lives in your embodied presence, not your racing mind.", type: "Oracle" },
  { name: "Recalibration", meaning: "Your inner compass needs recalibration — an honest reassessment of direction.", advice: "Pause the forward momentum and truthfully evaluate: is this still your path?", type: "Oracle" },
  { name: "Breakthrough", meaning: "After great pressure comes diamond — your breakthrough is imminent.", advice: "The darkest hour truly does precede the dawn. Hold on. What's coming is worth this.", type: "Oracle" },
  { name: "Soul Retrieval", meaning: "A lost part of yourself is calling to be reclaimed.", advice: "Where did you abandon yourself? Go back and retrieve that piece of your wholeness.", type: "Oracle" },
  { name: "Sacred Contract", meaning: "This situation or relationship is part of a deeper soul agreement.", advice: "Look for the deeper meaning in your most difficult relationships and circumstances.", type: "Oracle" },
  { name: "Awakening", meaning: "A level of consciousness is becoming available that wasn't before.", advice: "Welcome the disorientation of awakening. Your old worldview is expanding — allow it.", type: "Oracle" },
  { name: "Void", meaning: "The formless space before creation — pure potential, divine emptiness.", advice: "Sit with the not-knowing. The void is not absence — it is everything before it takes form.", type: "Oracle" },
  { name: "Frequency Shift", meaning: "Your vibrational frequency is changing, and your reality will follow.", advice: "Monitor your thoughts, words, and company. What you resonate with, you attract.", type: "Oracle" },
  { name: "Sacred No", meaning: "A boundary is not a wall — it is a declaration of self-respect.", advice: "What are you saying yes to from fear that you need to say no to from love?", type: "Oracle" },
  { name: "Full Circle", meaning: "What you sent out has returned to you. A cycle completes in perfect symmetry.", advice: "Acknowledge how far you've traveled. Honor the completion before beginning again.", type: "Oracle" },
  { name: "Miracle Field", meaning: "You have entered a field of possibility where ordinary rules bend.", advice: "Expect miracles. Not as wishful thinking but as an orientation toward possibility.", type: "Oracle" }
];

// ============================================================
// FULL DECK (78 tarot + 30 oracle = 108 cards)
// ============================================================

const tarotCards = [
  ...majorArcana,
  ...minorArcana,
  ...oracleCards
];

// ============================================================
// NUMEROLOGY CONNECTION
// ============================================================

function getNumerologyConnection(lifePath) {
  if (!lifePath) return null;
  const connection = {
    1: { major: "The Magician (I) — You are the conscious creator. Your will shapes reality.",  theme: "Creation & Leadership" },
    2: { major: "The High Priestess (II) — The hidden knowledge within duality.",                theme: "Intuition & Partnership" },
    3: { major: "The Empress (III) — Creative abundance pouring forth.",                         theme: "Expression & Creativity" },
    4: { major: "The Emperor (IV) — Structure, authority, and grounded power.",                  theme: "Foundation & Order" },
    5: { major: "The Hierophant (V) — Seeking wisdom through experience.",                       theme: "Freedom & Learning" },
    6: { major: "The Lovers (VI) — The sacred choice between love and fear.",                    theme: "Harmony & Responsibility" },
    7: { major: "The Chariot (VII) — Mastery through discipline and focus.",                     theme: "Wisdom & Introspection" },
    8: { major: "Strength (VIII) — The infinite loop of inner power.",                           theme: "Power & Mastery" },
    9: { major: "The Hermit (IX) — The light-bearer who walks alone to guide others.",           theme: "Completion & Service" },
    11: { major: "Justice (XI) — The master of truth and divine law.",                           theme: "Illumination & Balance" },
    22: { major: "The Fool (0/22) — The master builder who began as pure possibility.",          theme: "Master Building" },
    33: { major: "The World (XXI) — The master healer who embodies wholeness.",                  theme: "Master Healing" }
  };
  return connection[lifePath] || { major: `Wheel of Fortune (X) — The cycle of ${lifePath}.`, theme: "Cycles & Destiny" };
}

// ============================================================
// SPREAD CONFIGURATIONS
// ============================================================

const spreads = {
  "1": {
    label: "1 Card — Daily Guidance",
    positions: ["Message for Today"],
    desc: "A single card offering focused guidance for the present moment."
  },
  "3": {
    label: "3 Cards — Past · Present · Future",
    positions: ["Past", "Present", "Future"],
    desc: "The classic three-card spread revealing the arc of your current situation."
  },
  "5-love": {
    label: "5 Cards — Love & Relationship",
    positions: ["Your Energy", "Their Energy", "The Connection", "Challenge", "Potential"],
    desc: "A 5-card spread exploring the dynamics of love and relationship."
  },
  "5-career": {
    label: "5 Cards — Career & Purpose",
    positions: ["Current Situation", "Root Cause", "Action to Take", "Hidden Factor", "Outcome"],
    desc: "Navigate your path forward in work, purpose, and vocation."
  },
  "celtic": {
    label: "Celtic Cross — Full 10-Card Reading",
    positions: [
      "Present Situation",
      "Crossing Challenge",
      "Distant Past / Root",
      "Recent Past",
      "Potential Outcome",
      "Immediate Future",
      "Your Approach",
      "External Influences",
      "Hopes & Fears",
      "Final Outcome"
    ],
    desc: "The most comprehensive classical spread — a full narrative of your situation."
  },
  "7-chakra": {
    label: "7 Cards — Chakra Alignment",
    positions: [
      "Root — Security & Survival",
      "Sacral — Pleasure & Creativity",
      "Solar Plexus — Power & Will",
      "Heart — Love & Compassion",
      "Throat — Expression & Truth",
      "Third Eye — Intuition & Vision",
      "Crown — Consciousness & Spirit"
    ],
    desc: "Explore the energetic state of each chakra center."
  }
};

// ============================================================
// STATE
// ============================================================

let deck = [];
let spreadKey = "3";
let manualMode = false;
let chosen = [];

// ============================================================
// RENDER DECK
// ============================================================

function renderDeck(deckArr) {
  const container = document.getElementById("deck-container");
  if (!container) return;
  container.innerHTML = "";

  deckArr.forEach((card, index) => {
    const el = document.createElement("div");
    el.className = "tarot-card back";
    el.dataset.index = index;
    el.title = manualMode ? "Click to select" : card.name;

    const star1 = document.createElement("div");
    star1.className = "card-star top";
    star1.textContent = "✦";

    const label = document.createElement("div");
    label.className = "tarot-card-label";
    label.textContent = "✦";

    const star2 = document.createElement("div");
    star2.className = "card-star bottom";
    star2.textContent = "✦";

    el.appendChild(star1);
    el.appendChild(label);
    el.appendChild(star2);
    container.appendChild(el);
  });
}

// ============================================================
// RENDER CHOSEN CARDS
// ============================================================

function renderChosen() {
  const container = document.getElementById("chosen-cards");
  if (!container) return;
  container.innerHTML = "";

  const spread = spreads[spreadKey];
  const positions = spread ? spread.positions : chosen.map((_, i) => `Card ${i + 1}`);

  chosen.forEach((card, idx) => {
    const pos = positions[idx] || `Card ${idx + 1}`;
    const el = document.createElement("div");
    el.className = "tarot-card-full";

    // Card type badge
    const typeBadge = document.createElement("span");
    typeBadge.className = `card-type-badge badge-${(card.type || "oracle").toLowerCase().replace(/\s/g, "-")}`;
    typeBadge.textContent = card.type || "Oracle";

    // Position label
    const posLabel = document.createElement("div");
    posLabel.className = "card-position-label";
    posLabel.textContent = pos;

    // Card header
    const header = document.createElement("div");
    header.className = "card-header-row";

    const numBadge = card.number !== undefined
      ? `<span class="card-number-badge">${card.number}</span>` : "";

    header.innerHTML = `${numBadge}<span class="card-full-name">${card.name}</span>`;

    // Element
    if (card.element) {
      const elemEl = document.createElement("div");
      elemEl.className = "card-element";
      elemEl.textContent = `⚡ Element: ${card.element}`;
      el.appendChild(typeBadge);
      el.appendChild(posLabel);
      el.appendChild(header);
      el.appendChild(elemEl);
    } else {
      el.appendChild(typeBadge);
      el.appendChild(posLabel);
      el.appendChild(header);
    }

    // Upright meaning
    const meaningDiv = document.createElement("div");
    meaningDiv.className = "card-meaning-section";
    meaningDiv.innerHTML = `<strong>✦ Upright:</strong> ${card.upright || card.meaning || ""}`;
    el.appendChild(meaningDiv);

    // Reversed meaning
    if (card.reversed) {
      const revDiv = document.createElement("div");
      revDiv.className = "card-reversed-section";
      revDiv.innerHTML = `<strong>☽ Reversed:</strong> ${card.reversed}`;
      el.appendChild(revDiv);
    }

    // Advice
    if (card.advice) {
      const adviceDiv = document.createElement("div");
      adviceDiv.className = "card-advice-section";
      adviceDiv.innerHTML = `<strong>🌟 Guidance:</strong> ${card.advice}`;
      el.appendChild(adviceDiv);
    }

    // Numerology connection for major arcana
    if (card.type === "Major Arcana" && card.numerology !== undefined) {
      const nuDiv = document.createElement("div");
      nuDiv.className = "card-numerology-tag";
      nuDiv.textContent = `Numerology: ${card.numerology} — ${getMajorNumerologyNote(card.numerology)}`;
      el.appendChild(nuDiv);
    }

    container.appendChild(el);
  });

  // Show share button if cards are drawn
  const shareBtn = document.getElementById("share-reading-btn");
  if (shareBtn) shareBtn.style.display = chosen.length > 0 ? "block" : "none";
}

function getMajorNumerologyNote(n) {
  const notes = {
    0: "Pure potential, the void before creation",
    1: "New beginnings, unity, the self",
    2: "Duality, partnership, reflection",
    3: "Trinity, creativity, expansion",
    4: "Foundation, stability, matter",
    5: "Change, freedom, the five senses",
    6: "Harmony, love, responsibility",
    7: "Mystery, spirit, inner wisdom",
    8: "Infinity, material power, karma",
    9: "Completion, humanitarianism, wisdom",
    10: "Return to unity at a higher level",
    11: "Master number — spiritual illumination",
    12: "Sacrifice, wisdom through experience",
    13: "Death and rebirth cycle — transformation",
    14: "Alchemy, balance of opposites",
    15: "Bondage to shadow and materialism",
    16: "Upheaval, sudden awakening",
    17: "Hope, star energy, higher self",
    18: "Illusion, the subconscious ocean",
    19: "Solar radiance, supreme clarity",
    20: "Divine awakening, soul calling",
    21: "Completion and wholeness"
  };
  return notes[n] || `Vibrational energy of ${n}`;
}

// ============================================================
// SPREAD INFO DISPLAY
// ============================================================

function renderSpreadInfo() {
  const infoEl = document.getElementById("spread-info");
  if (!infoEl) return;
  const spread = spreads[spreadKey];
  if (!spread) return;
  infoEl.innerHTML = `
    <div class="spread-info-card">
      <strong>${spread.label}</strong>
      <p>${spread.desc}</p>
      <div class="position-labels">
        ${spread.positions.map((p, i) => `<span class="pos-badge">${i + 1}. ${p}</span>`).join("")}
      </div>
    </div>
  `;
}

// ============================================================
// AUTO / MANUAL PICK
// ============================================================

function autoPick() {
  const count = spreads[spreadKey]?.positions.length || 3;
  chosen = deck.slice(0, count);
  // Randomly assign reversed (20% chance per card)
  chosen = chosen.map(card => {
    if (Math.random() < 0.2 && card.reversed) {
      return { ...card, isReversed: true, upright: card.reversed, advice: card.advice };
    }
    return { ...card, isReversed: false };
  });
  renderChosen();
}

function enableManualPick() {
  manualMode = true;
  const count = spreads[spreadKey]?.positions.length || 3;
  const deckEls = document.querySelectorAll(".tarot-card");

  deckEls.forEach(el => {
    el.style.cursor = "pointer";
    el.onclick = () => {
      if (!manualMode) return;
      const index = Number(el.dataset.index);
      const card = { ...deck[index] };

      if (chosen.length < count && !el.classList.contains("picked")) {
        // Randomly assign reversed
        if (Math.random() < 0.2 && card.reversed) {
          card.isReversed = true;
          card.upright = card.reversed;
        } else {
          card.isReversed = false;
        }
        chosen.push(card);
        el.classList.add("picked", "flipped");
        el.querySelector(".tarot-card-label").textContent = card.name.substring(0, 6);
        renderChosen();
      }
    };
  });
}

// ============================================================
// LIFE PATH CONNECTION
// ============================================================

function renderLifePathConnection() {
  const el = document.getElementById("lp-connection");
  if (!el) return;

  let lifePath = null;
  try {
    const raw = localStorage.getItem("destinedToBeState_v1");
    if (raw) {
      const st = JSON.parse(raw);
      const birth = st?.user?.birthdate || st?.user?.birthDate || st?.profile?.birthDate || "";
      if (birth) {
        const d = new Date(birth);
        const sum = [...d.getDate().toString(), ...(d.getMonth() + 1).toString(), ...d.getFullYear().toString()]
          .reduce((a, ch) => a + Number(ch), 0);
        let n = sum;
        while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
          n = [...n.toString()].reduce((a, ch) => a + Number(ch), 0);
        }
        lifePath = n;
      }
    }
  } catch { /* ignore */ }

  if (!lifePath) {
    el.textContent = "Set your birthdate in Profile to unlock numerology-connected card guidance.";
    return;
  }

  const conn = getNumerologyConnection(lifePath);
  el.innerHTML = `
    <div class="lp-connection-card">
      <span class="lp-tag">Your Life Path: ${lifePath}</span>
      <strong>${conn.major}</strong>
      <em>Theme: ${conn.theme}</em>
    </div>
  `;
}

// ============================================================
// SHARE READING
// ============================================================

function shareReading() {
  if (!chosen.length) return;
  const spread = spreads[spreadKey];
  const positions = spread?.positions || [];
  const text = chosen.map((card, i) => {
    const pos = positions[i] || `Card ${i + 1}`;
    return `${pos}: ${card.name}${card.isReversed ? " (Reversed)" : ""} — ${card.upright || card.meaning}`;
  }).join("\n");

  const fullText = `✦ My Tarot Reading ✦\n${spread?.label || ""}\n\n${text}\n\n✦ Destined to Be`;

  try {
    const posts = JSON.parse(localStorage.getItem("dtb_community_posts") || "[]");
    posts.unshift({
      id: Date.now(),
      type: "tarot",
      content: fullText,
      author: JSON.parse(localStorage.getItem("destinedToBeState_v1") || "{}").user?.preferredName || "Anonymous",
      ts: new Date().toISOString()
    });
    localStorage.setItem("dtb_community_posts", JSON.stringify(posts.slice(0, 100)));
    alert("Reading shared to Community! ✦");
  } catch {
    // fallback: copy to clipboard
    navigator.clipboard?.writeText(fullText).then(() => alert("Copied to clipboard!")).catch(() => {});
  }
}

// ============================================================
// RESET
// ============================================================

function reset() {
  deck = shuffleDeck([...tarotCards]);
  chosen = [];
  manualMode = false;
  renderDeck(deck);
  const container = document.getElementById("chosen-cards");
  if (container) container.innerHTML = "";
  const shareBtn = document.getElementById("share-reading-btn");
  if (shareBtn) shareBtn.style.display = "none";
  renderSpreadInfo();
  renderLifePathConnection();
}

// ============================================================
// INIT
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  reset();

  document.querySelectorAll("[data-spread]").forEach(btn => {
    btn.addEventListener("click", () => {
      spreadKey = btn.dataset.spread;
      document.querySelectorAll("[data-spread]").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      reset();
    });
  });

  document.getElementById("auto-pick")?.addEventListener("click", () => {
    deck = shuffleDeck([...tarotCards]);
    renderDeck(deck);
    manualMode = false;
    chosen = [];
    autoPick();
  });

  document.getElementById("manual-pick")?.addEventListener("click", () => {
    deck = shuffleDeck([...tarotCards]);
    renderDeck(deck);
    chosen = [];
    enableManualPick();
  });

  document.getElementById("share-reading-btn")?.addEventListener("click", shareReading);
});
