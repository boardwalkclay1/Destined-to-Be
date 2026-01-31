// js/spirit/guide-modes.js

export function setupGuideModes() {
  const focusEl = document.getElementById('guide-focus');
  const extraEl = document.getElementById('guide-extra');

  function renderExtra() {
    const focus = focusEl.value;
    extraEl.innerHTML = '';

    if (focus === 'numbers') {
      extraEl.innerHTML = `
        <h4>Your Numbers (optional)</h4>
        <input class="bubble-input" id="life-path" type="number" placeholder="Life Path">
        <input class="bubble-input" id="expression" type="number" placeholder="Expression Number">
        <input class="bubble-input" id="soul-urge" type="number" placeholder="Soul Urge">
      `;
    } else if (focus === 'decision') {
      extraEl.innerHTML = `
        <h4>Decision Context</h4>
        <textarea id="decision-text" class="bubble-input" rows="3" placeholder="Describe the decision or crossroads..."></textarea>
      `;
    } else if (focus === 'stuck') {
      extraEl.innerHTML = `
        <h4>Where do you feel stuck?</h4>
        <textarea id="stuck-text" class="bubble-input" rows="3" placeholder="Describe how you feel stuck right now..."></textarea>
      `;
    } else if (focus === 'path') {
      extraEl.innerHTML = `
        <h4>Path & Dreams</h4>
        <textarea id="path-text" class="bubble-input" rows="3" placeholder="What do you feel called toward?"></textarea>

        <h4>Astrology (optional)</h4>
        <input class="bubble-input" id="sun-sign" placeholder="Sun sign (e.g. Aries)">
        <input class="bubble-input" id="moon-sign" placeholder="Moon sign (e.g. Scorpio)">
        <input class="bubble-input" id="rising-sign" placeholder="Rising sign (e.g. Libra)">
      `;
    } else if (focus === 'tour') {
      extraEl.innerHTML = `
        <h4>What do you want to learn first?</h4>
        <select id="tour-area" class="bubble-select">
          <option value="overview">Overview of everything</option>
          <option value="numbers">Numbers & readings</option>
          <option value="tools">Tools & trackers</option>
          <option value="spirit">Spirit & guidance</option>
        </select>
      `;
    }
  }

  focusEl.addEventListener('change', renderExtra);
  renderExtra();
}

export function collectExtraData() {
  const focus = document.getElementById('guide-focus').value;
  const data = { focus };

  if (focus === 'numbers') {
    data.lifePath = numOrNull('life-path');
    data.expression = numOrNull('expression');
    data.soulUrge = numOrNull('soul-urge');
  } else if (focus === 'decision') {
    data.decisionText = valOrEmpty('decision-text');
  } else if (focus === 'stuck') {
    data.stuckText = valOrEmpty('stuck-text');
  } else if (focus === 'path') {
    data.pathText = valOrEmpty('path-text');
    data.sun = valOrEmpty('sun-sign');
    data.moon = valOrEmpty('moon-sign');
    data.rising = valOrEmpty('rising-sign');
  } else if (focus === 'tour') {
    const el = document.getElementById('tour-area');
    data.tourArea = el ? el.value : 'overview';
  }

  return data;
}

function valOrEmpty(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

function numOrNull(id) {
  const el = document.getElementById(id);
  if (!el) return null;
  const n = Number(el.value);
  return Number.isNaN(n) ? null : n;
}
