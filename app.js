// app.js
// Global navigation + pageflip + background system

document.addEventListener("DOMContentLoaded", () => {
  // PAGEFLIP: hide UI until flip ends
  setTimeout(() => {
    document.body.classList.add("ui-ready");
  }, 2200);

  // GLOBAL NAVIGATION HANDLER
  document.querySelectorAll("[data-nav]").forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-nav");
      if (target) window.location.href = target;
    });
  });
});
