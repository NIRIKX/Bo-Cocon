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
    window.setTimeout(finish, 8500);
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
     on fait défiler la page nous-mêmes. On n'utilise pas scrollIntoView(), qui
     ferait aussi défiler la page Streamlit autour du site et cacherait l'en-tête. */
  if (location.protocol === "about:") {
    document.addEventListener("click", function (e) {
      var link = e.target.closest('a[href^="#"], a[href="./"]');
      if (!link) return;
      var href = link.getAttribute("href");
      var target = href === "./" || href === "#" ? null : document.querySelector(href);
      if (href !== "./" && href !== "#" && !target) return;
      e.preventDefault();
      var smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      var top = 0;
      if (target) {
        var offset = parseFloat(getComputedStyle(root).scrollPaddingTop) || 0;
        top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - offset);
      }
      window.scrollTo({ top: top, behavior: smooth ? "smooth" : "auto" });
      if (target && target.tabIndex === -1) target.focus({ preventScroll: true });
    });
  }

  /* ---------- Formules : les bocaux se retournent ----------
     Survol = retournement seulement avec une vraie souris ;
     clic / toucher / Entrée / Espace = bascule partout. */
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)");
  document.querySelectorAll(".jar").forEach(function (jar) {
    var btn = jar.querySelector(".jar__toggle");
    var front = jar.querySelector(".jar__face--front");
    var back = jar.querySelector(".jar__face--back");
    var pinned = null;   /* null = suit le survol ; true / false = choix explicite */
    var hovering = false;

    function render() {
      var flipped = pinned === null ? (hovering && fine.matches) : pinned;
      jar.classList.toggle("is-flipped", flipped);
      btn.setAttribute("aria-expanded", String(flipped));
      front.inert = flipped;
      back.inert = !flipped;
      front.setAttribute("aria-hidden", String(flipped));
      back.setAttribute("aria-hidden", String(!flipped));
    }
    function toggle() {
      pinned = !jar.classList.contains("is-flipped");
      render();
    }

    /* le bouton dit « Voir le détail » / « Revenir » : il bascule toujours */
    btn.addEventListener("click", toggle);
    /* tap / clic n'importe où sur le bocal (sauf sur le lien ou le bouton).
       Si la souris l'a déjà retourné au survol, le clic le « garde » ouvert ;
       un second clic le referme. */
    jar.addEventListener("click", function (e) {
      if (e.target.closest("a, button")) return;
      if (pinned === null && hovering && fine.matches) { pinned = true; render(); return; }
      toggle();
    });
    jar.addEventListener("pointerenter", function (e) {
      if (e.pointerType !== "mouse") return;
      hovering = true;
      render();
    });
    jar.addEventListener("pointerleave", function (e) {
      if (e.pointerType !== "mouse") return;
      hovering = false;
      if (pinned === false) pinned = null;   /* le survol suivant retourne de nouveau */
      render();
    });
    render();
  });

  /* ---------- Offrir : aperçu de la carte cadeau et e-mail prérempli ---------- */
  var giftForm = document.getElementById("gift-form");
  if (giftForm) {
    var giftOrder = document.getElementById("gift-order");
    var out = {};
    document.querySelectorAll("[data-gift]").forEach(function (el) {
      out[el.getAttribute("data-gift")] = { el: el, fallback: el.textContent };
    });
    var giftUpdate = function () {
      var checked = giftForm.querySelector('input[name="gift-formule"]:checked');
      var values = {
        formule: checked ? checked.value : "",
        to: giftForm.elements["gift-to"].value.trim(),
        from: giftForm.elements["gift-from"].value.trim(),
        msg: giftForm.elements["gift-msg"].value.trim()
      };
      Object.keys(out).forEach(function (key) {
        out[key].el.textContent = values[key] || out[key].fallback;
        out[key].el.classList.toggle("is-empty", !values[key]);
      });
      var body = [
        "Bonjour,",
        "",
        "Je souhaite offrir une carte cadeau Bo’Cocon.",
        "",
        "Formule : " + (values.formule || "à définir ensemble"),
        "Pour : " + (values.to || "…"),
        "De la part de : " + (values.from || "…"),
        "Petit mot : " + (values.msg || "…"),
        "",
        "Merci de me recontacter pour finaliser la commande."
      ].join("\n");
      giftOrder.href = "mailto:bococon.contact@gmail.com?subject=" +
        encodeURIComponent("Carte cadeau Bo’Cocon" + (values.formule ? " – " + values.formule : "")) +
        "&body=" + encodeURIComponent(body);
    };
    giftForm.addEventListener("input", giftUpdate);
    giftForm.addEventListener("change", giftUpdate);
    giftForm.addEventListener("submit", function (e) { e.preventDefault(); });
    giftUpdate();
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
