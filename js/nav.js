// Mobile drawer (open/close, focus handling, Escape) and active-section highlighting.
(function () {
  var toggle = document.querySelector(".menu-toggle");
  var drawer = document.getElementById("drawer");
  var backdrop = document.querySelector(".drawer-backdrop");
  var desktop = window.matchMedia("(min-width: 768px)");
  var isOpen = false;

  function focusables() {
    return Array.prototype.slice.call(drawer.querySelectorAll("a[href], button:not([disabled])"));
  }

  function open() {
    isOpen = true;
    drawer.removeAttribute("inert");
    backdrop.hidden = false;
    // Next frame, so the backdrop fades instead of popping in
    requestAnimationFrame(function () {
      drawer.classList.add("is-open");
      backdrop.classList.add("is-visible");
      // Focus once the drawer is visible; hidden elements can't take focus
      var first = focusables()[0];
      if (first && isOpen) first.focus({ preventScroll: true });
    });
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close menu");
    document.body.classList.add("no-scroll");
  }

  function close(returnFocus) {
    if (!isOpen) return;
    isOpen = false;
    drawer.classList.remove("is-open");
    backdrop.classList.remove("is-visible");
    drawer.setAttribute("inert", "");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
    document.body.classList.remove("no-scroll");
    setTimeout(function () {
      if (!isOpen) backdrop.hidden = true;
    }, 300);
    if (returnFocus) toggle.focus();
  }

  toggle.addEventListener("click", function () {
    if (isOpen) close(true);
    else open();
  });

  backdrop.addEventListener("click", function () {
    close(true);
  });

  // Picking a link closes the drawer; the browser then scrolls smoothly to the section
  drawer.addEventListener("click", function (event) {
    if (event.target.closest("a[href^='#']")) close(false);
  });

  document.addEventListener("keydown", function (event) {
    if (!isOpen) return;
    if (event.key === "Escape") {
      close(true);
      return;
    }
    // Keep Tab inside the drawer and its toggle while it is open
    if (event.key === "Tab") {
      var items = [toggle].concat(focusables());
      var index = items.indexOf(document.activeElement);
      var last = items.length - 1;
      if (event.shiftKey && index <= 0) {
        event.preventDefault();
        items[last].focus();
      } else if (!event.shiftKey && index === last) {
        event.preventDefault();
        items[0].focus();
      }
    }
  });

  desktop.addEventListener("change", function (event) {
    if (event.matches) close(false);
  });

  // Mark the nav link for the section currently on screen
  var links = Array.prototype.slice.call(document.querySelectorAll(".nav-links a, .drawer-links a"));
  var sections = links
    .map(function (link) {
      return document.querySelector(link.getAttribute("href"));
    })
    .filter(function (section, i, all) {
      return section && all.indexOf(section) === i;
    });

  if (!("IntersectionObserver" in window)) return;

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var hash = "#" + entry.target.id;
        links.forEach(function (link) {
          if (link.getAttribute("href") === hash) link.setAttribute("aria-current", "true");
          else link.removeAttribute("aria-current");
        });
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );

  sections.forEach(function (section) {
    observer.observe(section);
  });
})();
