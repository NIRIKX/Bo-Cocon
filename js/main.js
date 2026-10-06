/* Bo'Cocon — intro d'ouverture, en-tête, menu mobile et apparitions au défilement */
(function () {
  "use strict";

  var root = document.documentElement;
  var intro = document.getElementById("intro");
  root.classList.add("js-main");

  function ready() {
    root.classList.add("is-ready");
  }

  /* ---------- Intro : les battants s'ouvrent, le logo apparaît ---------- */
  function playIntro() {
    var finished = false;

    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    root.classList.add("intro-lock");

    function finish() {
      if (finished) return;
      finished = true;
      ready();
      intro.remove();
      root.classList.remove("intro-lock", "intro-on");
    }

    function leave() {
      if (finished || intro.classList.contains("is-leaving")) return;
      intro.classList.add("is-leaving");
    }

    intro.addEventListener("animationstart", function (e) {
      // la page d'accueil apparaît pendant que l'intro s'efface
      if (e.target === intro && /^introOut/.test(e.animationName)) ready();
    });
    intro.addEventListener("animationend", function (e) {
      if (e.target === intro && /^introOut/.test(e.animationName)) finish();
    });

    intro.addEventListener("click", leave);
    window.addEventListener("wheel", leave, { passive: true, once: true });
    window.addEventListener("touchmove", leave, { passive: true, once: true });
    document.addEventListener("keydown", function onKey(e) {
      if (finished) return document.removeEventListener("keydown", onKey);
      if (["Escape", "Enter", " ", "ArrowDown", "PageDown"].indexOf(e.key) !== -1) {
        e.preventDefault();
        leave();
      }
    });

    // filet de sécurité si les animations ne se déclenchent pas
    window.setTimeout(finish, 8000);
  }

  if (intro && root.classList.contains("intro-on")) {
    playIntro();
  } else {
    if (intro) intro.remove();
    ready();
  }

  /* ---------- En-tête au défilement ---------- */
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Menu mobile ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("nav");
  function setNav(open) {
    root.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
  }
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      setNav(!root.classList.contains("nav-open"));
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setNav(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && root.classList.contains("nav-open")) {
        setNav(false);
        toggle.focus();
      }
    });
    window.matchMedia("(min-width: 901px)").addEventListener("change", function (mq) {
      if (mq.matches) setNav(false);
    });
  }

  /* ---------- Liens internes quand le site est intégré (iframe Streamlit) ----------
     Dans une iframe « srcdoc », un lien « #section » rechargerait la page parente :
     on fait défiler la page nous-mêmes. */
  if (location.protocol === "about:") {
    document.addEventListener("click", function (e) {
      var link = e.target.closest('a[href^="#"], a[href="./"]');
      if (!link) return;
      var href = link.getAttribute("href");
      var target = href === "./" || href === "#" ? null : document.querySelector(href);
      if (href !== "./" && href !== "#" && !target) return;
      e.preventDefault();
      var smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (target) {
        target.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
        if (target.tabIndex === -1) target.focus({ preventScroll: true });
      } else {
        window.scrollTo({ top: 0, behavior: smooth ? "smooth" : "auto" });
      }
    });
  }

  /* ---------- Apparitions au défilement ---------- */
  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    root.classList.add("reveal-all");
  }

  /* ---------- Année du pied de page ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
