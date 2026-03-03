// js/state.js

const STORAGE_KEY = 'destinedToBeState_v2';
const SCHEMA_VERSION = 2;

// ===============================
// DEFAULT STATE
// ===============================

const defaultState = {
  version: SCHEMA_VERSION,
  user: {
    id: null,
    username: null,
    fullName: '',
    preferredName: '',
    birthdate: '',
    challenge: '',
    goal: '',
    avatarDataUrl: null
  },
  tier: 'free',
  numbers: {},
  settings: {
    theme: 'cosmic',     // future-proof
    animations: true,    // toggle cinematic transitions
    geometryMode: 'auto' // future sacred-geometry modes
  }
};

// ===============================
// INTERNAL STATE
// ===============================

let state = loadState();

// ===============================
// LOAD + MIGRATE
// ===============================

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(defaultState);

    const parsed = JSON.parse(raw);

    // If version mismatch → migrate
    if (!parsed.version || parsed.version !== SCHEMA_VERSION) {
      return migrateState(parsed);
    }

    // Merge with defaults to fill missing fields
    return deepMerge(structuredClone(defaultState), parsed);
  } catch {
    return structuredClone(defaultState);
  }
}

// ===============================
// MIGRATION ENGINE
// ===============================

function migrateState(oldState) {
  const migrated = deepMerge(structuredClone(defaultState), oldState);
  migrated.version = SCHEMA_VERSION;
  saveState(migrated);
  return migrated;
}

// ===============================
// DEEP MERGE
// ===============================

function deepMerge(base, patch) {
  for (const key in patch) {
    if (
      typeof base[key] === 'object' &&
      base[key] !== null &&
      typeof patch[key] === 'object' &&
      patch[key] !== null &&
      !Array.isArray(base[key])
    ) {
      base[key] = deepMerge(base[key], patch[key]);
    } else {
      base[key] = patch[key];
    }
  }
  return base;
}

// ===============================
// SAVE
// ===============================

function saveState(newState = state) {
  state = newState;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  emit('state:updated', state);
}

// ===============================
// PUBLIC API
// ===============================

export function getState() {
  return state;
}

export function updateState(patch) {
  const merged = deepMerge(structuredClone(state), patch);
  saveState(merged);
}

export function updateUser(patch) {
  const merged = deepMerge(structuredClone(state), {
    user: patch
  });
  saveState(merged);
}

export function setTier(tier) {
  updateState({ tier });
}

export function setNumbers(numbers) {
  updateState({ numbers });
}

export function resetState() {
  saveState(structuredClone(defaultState));
}

// ===============================
// EVENT EMITTER (for UI reactivity)
// ===============================

const listeners = {};

export function on(event, callback) {
  if (!listeners[event]) listeners[event] = [];
  listeners[event].push(callback);
}

export function emit(event, payload) {
  if (!listeners[event]) return;
  listeners[event].forEach(cb => cb(payload));
}
