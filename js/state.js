// js/state.js
const STORAGE_KEY = 'destinedToBeState_v1';

const defaultState = {
  user: {
    username: null,
    fullName: '',
    preferredName: '',
    birthdate: '',
    challenge: '',
    goal: '',
    avatarDataUrl: null,
  },
  tier: 'free', // 'free' | 'pro'
  numbers: {},  // computed numerology map
};

let state = loadState();

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(defaultState);
    return { ...structuredClone(defaultState), ...JSON.parse(raw) };
  } catch {
    return structuredClone(defaultState);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function getState() {
  return state;
}

export function updateState(patch) {
  state = { ...state, ...patch };
  saveState();
}

export function updateUser(patch) {
  state.user = { ...state.user, ...patch };
  saveState();
}

export function setTier(tier) {
  state.tier = tier;
  saveState();
}

export function setNumbers(numbers) {
  state.numbers = numbers;
  saveState();
}

export function resetState() {
  state = structuredClone(defaultState);
  saveState();
}
