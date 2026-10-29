// Runs in <head> before the CSS paints: picks the saved theme, or the OS one,
// and marks the page as JS-enabled so scroll-reveal styles apply.
(function () {
  var root = document.documentElement;
  root.classList.add("js");
  var saved = null;
  try {
    saved = localStorage.getItem("theme");
  } catch (e) {
    // Storage blocked (private mode): fall back to the OS preference.
  }
  var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  root.setAttribute("data-theme", saved === "light" || saved === "dark" ? saved : prefersDark ? "dark" : "light");
})();
