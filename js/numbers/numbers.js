// js/numbers/numbers.js
import { getState } from '../state.js';
import { applyTierToDom, isPro } from '../tier.js';

window.addEventListener('DOMContentLoaded', () => {
  applyTierToDom();
  renderNumbers();
});

function renderNumbers() {
  const { numbers } = getState();

  renderCore(numbers);
  renderName(numbers);
  renderPhases(numbers);
  renderPlanesIntensity(numbers);
  renderPersonalCycles(numbers);
  renderApplied(numbers);
  wireSeenNumber(numbers);
}

function renderCore(numbers) {
  const el = document.getElementById('core-numbers');
  if (!el) return;

  const lp = numbers.lifePath;
  const birthday = numbers.birthday;
  const attitude = numbers.attitude;

  el.innerHTML = `
    <h3>Core Path</h3>
    <ul class="number-list">
      <li><strong>Life Path:</strong> ${lp ? lp.value : '—'}</li>
      <li><strong>Birthday:</strong> ${birthday ? birthday.value : '—'}</li>
      <li><strong>Attitude:</strong> ${attitude ? attitude.value : '—'}</li>
    </ul>
  `;
}

function renderName(numbers) {
  const el = document.getElementById('name-numbers');
  if (!el) return;

  const { expression, soul, personality, maturity, hiddenPassion, balance, subconscious, cornerstone, capstone, firstVowel } = numbers;

  el.innerHTML = `
    <h3>Name-Based Numbers</h3>
    <ul class="number-list">
      <li><strong>Expression:</strong> ${expression?.value ?? '—'}</li>
      <li><strong>Soul Urge:</strong> ${soul?.value ?? '—'}</li>
      <li><strong>Personality:</strong> ${personality?.value ?? '—'}</li>
      <li><strong>Maturity:</strong> ${maturity?.value ?? '—'}</li>
      <li><strong>Hidden Passion:</strong> ${hiddenPassion?.value ?? '—'}</li>
      <li><strong>Balance:</strong> ${balance?.value ?? '—'}</li>
      <li><strong>Subconscious Self:</strong> ${subconscious?.value ?? '—'}</li>
      <li><strong>Cornerstone:</strong> ${cornerstone?.value ?? '—'}</li>
      <li><strong>Capstone:</strong> ${capstone?.value ?? '—'}</li>
      <li><strong>First Vowel:</strong> ${firstVowel?.value ?? '—'}</li>
    </ul>
  `;
}

function renderPhases(numbers) {
  const el = document.getElementById('phases');
  if (!el) return;

  const { cycles, pinnacles, challenges, karmicLessons, karmicDebt } = numbers;

  el.innerHTML = `
    <h3>Life Phases & Lessons</h3>
    <div class="phases-grid">
      <div>
        <h4>Cycles</h4>
        <pre>${JSON.stringify(cycles || {}, null, 2)}</pre>
      </div>
      <div>
        <h4>Pinnacles</h4>
        <pre>${JSON.stringify(pinnacles || {}, null, 2)}</pre>
      </div>
      <div>
        <h4>Challenges</h4>
        <pre>${JSON.stringify(challenges || {}, null, 2)}</pre>
      </div>
      <div>
        <h4>Karmic Lessons</h4>
        <pre>${JSON.stringify(karmicLessons || {}, null, 2)}</pre>
      </div>
      <div>
        <h4>Karmic Debt</h4>
        <pre>${JSON.stringify(karmicDebt || {}, null, 2)}</pre>
      </div>
    </div>
  `;
}

function renderPlanesIntensity(numbers) {
  const el = document.getElementById('planes-intensity');
  if (!el) return;
  if (!isPro()) {
    el.innerHTML = `
      <h3>Planes & Intensity (Pro)</h3>
      <p>Unlock Pro to see your planes of expression and intensity chart.</p>
      <a href="upgrade.html" class="primary-btn">Upgrade – $6</a>
    `;
    return;
  }

  const { planes, intensity } = numbers;
  el.innerHTML = `
    <h3>Planes & Intensity</h3>
    <div class="phases-grid">
      <div>
        <h4>Planes of Expression</h4>
        <pre>${JSON.stringify(planes || {}, null, 2)}</pre>
      </div>
      <div>
        <h4>Intensity Chart</h4>
        <pre>${JSON.stringify(intensity || {}, null, 2)}</pre>
      </div>
    </div>
  `;
}

function renderPersonalCycles(numbers) {
  const el = document.getElementById('personal-cycles');
  if (!el) return;
  if (!isPro()) {
    el.innerHTML = `
      <h3>Personal Cycles (Pro)</h3>
      <p>Unlock Pro to see your personal year, month, and day.</p>
      <a href="upgrade.html" class="primary-btn">Upgrade – $6</a>
    `;
    return;
  }

  const { personalYear, personalMonth, personalDay } = numbers;
  el.innerHTML = `
    <h3>Personal Cycles</h3>
    <ul class="number-list">
      <li><strong>Personal Year:</strong> ${personalYear?.value ?? '—'}</li>
      <li><strong>Personal Month:</strong> ${personalMonth?.value ?? '—'}</li>
      <li><strong>Personal Day:</strong> ${personalDay?.value ?? '—'}</li>
    </ul>
  `;
}

function renderApplied(numbers) {
  const el = document.getElementById('applied');
  if (!el) return;
  if (!isPro()) {
    el.innerHTML = `
      <h3>Applied Numerology (Pro)</h3>
      <p>Unlock Pro to analyze addresses, business names, and project names.</p>
      <a href="upgrade.html" class="primary-btn">Upgrade – $6</a>
    `;
    return;
  }

  const { address, businessName, projectName } = numbers.applied || {};
  el.innerHTML = `
    <h3>Applied Numerology</h3>
    <pre>${JSON.stringify({ address, businessName, projectName }, null, 2)}</pre>
  `;
}

function wireSeenNumber(numbers) {
  const input = document.getElementById('seen-number');
  const btn = document.getElementById('interpret-number');
  const out = document.getElementById('seen-result');

  if (!input || !btn || !out) return;

  btn.addEventListener('click', () => {
    const value = input.value.trim();
    if (!value) {
      out.textContent = 'Enter a number you keep seeing.';
      return;
    }
    const meaning = numbers.repeating?.[value] || 'This number is asking you to pay attention to the pattern around it.';
    out.textContent = meaning;
  });
}
