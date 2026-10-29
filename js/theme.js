// Dark / light toggle. The initial theme is set by theme-init.js.
(function () {
  var root = document.documentElement;
  var button = document.querySelector("[data-theme-toggle]");
  var media = window.matchMedia("(prefers-color-scheme: dark)");

  function current() {
    return root.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }

  function apply(theme, persist) {
    root.setAttribute("data-theme", theme);
    var next = theme === "dark" ? "light" : "dark";
    button.setAttribute("aria-label", "Switch to " + next + " theme");
    button.setAttribute("aria-pressed", String(theme === "dark"));
    if (persist) {
      try {
        localStorage.setItem("theme", theme);
      } catch (e) {
        // Not saved; the choice still applies for this visit.
      }
    }
  }

  function hasSavedChoice() {
    try {
      return localStorage.getItem("theme") !== null;
    } catch (e) {
      return false;
    }
  }

  apply(current(), false);

  button.addEventListener("click", function () {
    apply(current() === "dark" ? "light" : "dark", true);
  });

  // Follow OS changes until the visitor picks a theme themselves
  media.addEventListener("change", function (event) {
    if (!hasSavedChoice()) apply(event.matches ? "dark" : "light", false);
  });
})();
