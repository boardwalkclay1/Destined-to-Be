// js/router-lite.js
export function goTo(page) {
  window.location.href = page;
}

export function wireNavLinks() {
  document.querySelectorAll('[data-nav]').forEach(el => {
    el.addEventListener('click', () => {
      const target = el.getAttribute('data-nav');
      if (target) goTo(target);
    });
  });
}
