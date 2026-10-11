/* Bo'Cocon — intro d'ouverture, en-tête, menu mobile, formulaires et apparitions au défilement */
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
  /* derrière le menu ouvert, la page est inerte (Tab et lecteurs d'écran restent dans le menu) */
  var behind = ["main", ".site-footer", ".skip-link"].map(function (s) {
    return document.querySelector(s);
  }).filter(Boolean);
  var openY = 0;
  /* keepPlace : en refermant (X ou Échap), on revient exactement où l'on était */
  function setNav(open, keepPlace) {
    if (open) openY = window.scrollY;
    root.classList.toggle("nav-open", open);
    behind.forEach(function (el) { el.inert = open; });
    if (!open && keepPlace && Math.abs(window.scrollY - openY) > 1) {
      root.style.scrollBehavior = "auto";
      window.scrollTo(0, openY);
      root.style.scrollBehavior = "";
    }
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
  }
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      setNav(!root.classList.contains("nav-open"), true);
    });
    /* un lien du menu, ou le logo : le menu se ferme */
    (header || nav).addEventListener("click", function (e) {
      if (e.target.closest("a")) setNav(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && root.classList.contains("nav-open")) {
        setNav(false, true);
        toggle.focus();
      }
    });
    window.matchMedia("(min-width: 901px)").addEventListener("change", function (mq) {
      if (mq.matches) setNav(false);
    });
    /* menu ouvert : la page derrière ne défile pas. On ne touche pas au défilement de
       html / body (ça faisait disparaître l'en-tête sur téléphone) : on bloque juste le
       geste, sauf si le menu est plus haut que l'écran et doit défiler lui-même.
       Le zoom à deux doigts reste possible. */
    var holdPage = function (e) {
      if (!root.classList.contains("nav-open")) return;
      if ((e.touches && e.touches.length > 1) || e.ctrlKey) return;
      if (nav.scrollHeight > nav.clientHeight + 1 && nav.contains(e.target)) return;
      e.preventDefault();
    };
    if (header) {
      header.addEventListener("touchmove", holdPage, { passive: false });
      header.addEventListener("wheel", holdPage, { passive: false });
    }
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

  /* ---------- Compléments (Douces énergies, Les courses) ----------
     Ils ne se prennent qu'en plus d'une formule : les cases restent grisées tant
     qu'aucune formule n'est choisie. Renvoie les compléments cochés. */
  function syncAddons(form, hasFormula) {
    var chosen = [];
    form.querySelectorAll(".addon input").forEach(function (x) {
      x.disabled = !hasFormula;
      if (!hasFormula) x.checked = false;
      if (x.checked) chosen.push(x);
    });
    return chosen;
  }
  var addonNames = function (chosen) { return chosen.map(function (x) { return x.value; }); };

  /* ---------- Réserver : récapitulatif en direct et e-mail prérempli ---------- */
  var bookForm = document.getElementById("booking-form");
  if (bookForm) {
    var bookSend = document.getElementById("booking-send");
    var bookExtraLine = document.querySelector("[data-book-extra]");
    var wantedAddon = "";   /* « Réserver » au dos de Douces énergies / Les courses */
    var recap = {};
    document.querySelectorAll("[data-book]").forEach(function (el) {
      recap[el.getAttribute("data-book")] = { el: el, fallback: el.textContent };
    });
    /* « 1 010 € », « 62,5 € » */
    var euros = function (n) { return n.toLocaleString("fr-FR", { maximumFractionDigits: 2 }) + "\u00a0€"; };
    var pad = function (n) { return (n < 10 ? "0" : "") + n; };
    var now = new Date();
    var minIso = now.getFullYear() + "-" + pad(now.getMonth() + 1) + "-" + pad(now.getDate());
    bookForm.elements["book-date"].min = minIso;
    /* date en toutes lettres ; une date passée (ou une année incomplète) est ignorée */
    var longDate = function (iso) {
      var p = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
      if (!p || iso < minIso) return "";
      var d = new Date(+p[1], p[2] - 1, +p[3]);
      var s = d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
      return d.getDate() === 1 ? s.replace(" 1 ", " 1er ") : s;
    };
    /* « à Calvisson », mais « aux Matelles », « au Triadou » */
    var inTown = function (t) {
      var m = /^(les|le)\s+(.+)$/i.exec(t);
      return m ? (m[1].toLowerCase() === "les" ? "aux " : "au ") + m[2] : "à " + t;
    };
    var bookUpdate = function () {
      var checked = bookForm.querySelector('input[name="book-formule"]:checked');
      if (checked && wantedAddon) {
        bookForm.querySelectorAll(".addon input").forEach(function (x) {
          if (x.value === wantedAddon) x.checked = true;
        });
        wantedAddon = "";
      }
      var chosen = syncAddons(bookForm, !!checked);
      var extras = addonNames(chosen);
      var price = checked ? +checked.getAttribute("data-price") : 0;
      /* prix total ; le crédit d'impôt n'est compté que sur ce qui y a droit (data-credit) */
      var total = price, net = price / 2;
      chosen.forEach(function (x) {
        var p = +x.getAttribute("data-price");
        total += p;
        net += x.getAttribute("data-credit") === "1" ? p / 2 : p;
      });
      var v = {
        formule: checked ? checked.value : "",
        name: bookForm.elements["book-name"].value.trim(),
        tel: bookForm.elements["book-tel"].value.trim(),
        town: bookForm.elements["book-town"].value.trim(),
        date: longDate(bookForm.elements["book-date"].value),
        msg: bookForm.elements["book-msg"].value.trim()
      };
      var shown = {
        formule: v.formule,
        price: price ? "À partir de " + euros(total) + ", soit" : "",
        net: price ? euros(net) : "",
        "net-label": price ? "après crédit d’impôt" : "",
        date: v.date ? "À partir du " + v.date : "",
        town: v.town ? "Chez vous, " + inTown(v.town) : ""
      };
      Object.keys(recap).forEach(function (key) {
        recap[key].el.textContent = shown[key] || recap[key].fallback;
        if (key === "formule" || key === "date" || key === "town") {
          recap[key].el.classList.toggle("is-empty", !shown[key]);
        }
      });
      if (bookExtraLine) {
        bookExtraLine.hidden = !extras.length;
        bookExtraLine.textContent = "+ " + extras.join(" · ");
      }
      var body = [
        "Bonjour,",
        "",
        "Je souhaite réserver une formule Bo’Cocon.",
        "",
        "Formule : " + (v.formule ? v.formule + " (à partir de " + euros(price) + ")" : "à définir ensemble"),
        "En plus : " + (chosen.length ? chosen.map(function (x) {
          return x.value + " (" + x.getAttribute("data-price-text") + ")";
        }).join(", ") : "non"),
        "Date souhaitée : " + (v.date || "à définir ensemble"),
        "Commune : " + (v.town || "…"),
        "Nom : " + (v.name || "…"),
        "Téléphone : " + (v.tel || "…"),
        "Message : " + (v.msg || "…"),
        "",
        "Merci de me recontacter pour confirmer la réservation."
      ].join("\n");
      bookSend.href = "mailto:bococon.contact@gmail.com?subject=" +
        encodeURIComponent("Réservation Bo’Cocon" + (v.formule ? " – " + v.formule : "") + extras.map(function (n) { return " + " + n; }).join("")) +
        "&body=" + encodeURIComponent(body);
    };
    /* « Réserver » au dos d'un bocal : la formule (ou le complément) est déjà choisie */
    document.querySelectorAll("[data-reserve]").forEach(function (cta) {
      cta.addEventListener("click", function () {
        var name = cta.getAttribute("data-reserve");
        var radio = [].slice.call(bookForm.querySelectorAll('input[name="book-formule"]'))
          .filter(function (x) { return x.value === name; })[0];
        if (radio) radio.checked = true;
        else wantedAddon = name;
        bookUpdate();
      });
    });
    bookForm.addEventListener("input", bookUpdate);
    bookForm.addEventListener("change", bookUpdate);
    bookForm.addEventListener("submit", function (e) { e.preventDefault(); });
    bookUpdate();
  }

  /* ---------- Offrir : aperçu de la carte cadeau et e-mail prérempli ---------- */
  var giftForm = document.getElementById("gift-form");
  if (giftForm) {
    var giftOrder = document.getElementById("gift-order");
    var giftExtraLine = document.querySelector("[data-gift-extra]");
    var out = {};
    document.querySelectorAll("[data-gift]").forEach(function (el) {
      out[el.getAttribute("data-gift")] = { el: el, fallback: el.textContent };
    });
    var giftUpdate = function () {
      var checked = giftForm.querySelector('input[name="gift-formule"]:checked');
      var extras = addonNames(syncAddons(giftForm, !!checked));
      if (giftExtraLine) {
        giftExtraLine.hidden = !extras.length;
        giftExtraLine.textContent = "+ " + extras.join(" · ");
      }
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
        "En plus : " + (extras.length ? extras.join(", ") : "non"),
        "Pour : " + (values.to || "…"),
        "De la part de : " + (values.from || "…"),
        "Petit mot : " + (values.msg || "…"),
        "",
        "Merci de me recontacter pour finaliser la commande."
      ].join("\n");
      giftOrder.href = "mailto:bococon.contact@gmail.com?subject=" +
        encodeURIComponent("Carte cadeau Bo’Cocon" + (values.formule ? " – " + values.formule : "") + extras.map(function (n) { return " + " + n; }).join("")) +
        "&body=" + encodeURIComponent(body);
    };
    giftForm.addEventListener("input", giftUpdate);
    giftForm.addEventListener("change", giftUpdate);
    giftForm.addEventListener("submit", function (e) { e.preventDefault(); });
    giftUpdate();
  }

  /* ---------- Réserver → « C'est pour offrir » : on passe à Offrir avec les mêmes choix ---------- */
  var giftSwitch = document.querySelector("[data-gift-switch]");
  if (giftSwitch && bookForm && giftForm) {
    giftSwitch.addEventListener("click", function () {
      var picked = bookForm.querySelector('input[name="book-formule"]:checked');
      var extras = [].slice.call(bookForm.querySelectorAll(".addon input:checked")).map(function (x) { return x.value; });
      if (picked) {
        giftForm.querySelectorAll('input[name="gift-formule"]').forEach(function (x) { x.checked = x.value === picked.value; });
      }
      giftForm.dispatchEvent(new Event("change", { bubbles: true }));   /* active les compléments */
      giftForm.querySelectorAll(".addon input").forEach(function (x) {
        if (!x.disabled && extras.indexOf(x.value) !== -1) x.checked = true;
      });
      giftForm.dispatchEvent(new Event("change", { bubbles: true }));   /* met à jour la carte */
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
