// jmoore.net — small progressive enhancements. No dependencies.

// Current year in the footer.
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Trigger the entrance animation once the page is ready.
// (CSS handles reduced-motion; this just flips the class.)
requestAnimationFrame(() => document.body.classList.add("is-loaded"));
