// Contact form: inline validation, then hands the message to the visitor's
// mail app. No backend needed, so it works on any static host.
(function () {
  var form = document.getElementById("contact-form");
  var status = document.getElementById("cf-status");
  var TO = "barnwal6201@gmail.com";

  var rules = {
    name: function (v) {
      return v.trim() ? "" : "Please enter your name.";
    },
    email: function (v) {
      if (!v.trim()) return "Please enter your email.";
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? "" : "That email doesn't look right.";
    },
    message: function (v) {
      return v.trim().length >= 10 ? "" : "Please write at least 10 characters.";
    },
  };

  function check(field) {
    var message = rules[field.name](field.value);
    var error = document.getElementById(field.id + "-err");
    error.textContent = message;
    if (message) field.setAttribute("aria-invalid", "true");
    else field.removeAttribute("aria-invalid");
    return !message;
  }

  Object.keys(rules).forEach(function (name) {
    var field = form.elements[name];
    // Validate on leaving a field, then live once it has shown an error
    field.addEventListener("blur", function () {
      if (field.value) check(field);
    });
    field.addEventListener("input", function () {
      if (field.getAttribute("aria-invalid") === "true") check(field);
    });
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    status.textContent = "";

    var invalid = Object.keys(rules)
      .map(function (name) {
        return form.elements[name];
      })
      .filter(function (field) {
        return !check(field);
      });

    if (invalid.length) {
      invalid[0].focus();
      return;
    }

    var name = form.elements.name.value.trim();
    var email = form.elements.email.value.trim();
    var body = form.elements.message.value.trim() + "\n\n— " + name + " (" + email + ")";
    var subject = "Portfolio enquiry from " + name;

    window.location.href =
      "mailto:" + TO + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);

    status.textContent = "Opening your email app… If nothing happens, write to " + TO + ".";
    form.reset();
  });
})();
