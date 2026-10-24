# Consignes pour Claude — site Bo’Cocon

## Façon de travailler avec le propriétaire du site
- Toujours répondre en français, simplement, sans jargon technique.
- Dès que le propriétaire propose une idée ou une modification, la réaliser et la mettre
  en ligne directement (commit + push), sans attendre son feu vert.
- Avant de pousser, vérifier le rendu (captures Playwright ordinateur + téléphone,
  site seul et dans Streamlit).

## Plan de mise en ligne (décidé avec le propriétaire)
1. **Pendant la construction** : le site est affiché sur Streamlit
   (https://bo-cocon.streamlit.app), qui suit la branche de travail
   `claude/great-cray-oy302g`. On y pousse toutes les modifications.
2. **Quand le propriétaire dit que le site est fini** (pas encore : la cuisinière veut
   peut-être ajouter des choses) : regrouper tout le travail sur la branche `main`, puis
   l’aider à créer le site sur **Cloudflare Pages** (choisi à la place de Netlify le
   24/10/2026 : visites illimitées, 500 mises à jour par mois, pas de risque de site coupé ;
   le gratuit de Netlify, 300 crédits, coupe le site quand ils sont épuisés). Branche de
   production : `main`.
   Ne publier que les fichiers du site (`index.html`, `css/`, `js/`, `assets/`), pas
   `app.py`, `CLAUDE.md`, `README.md` : par exemple une commande de construction qui les
   copie dans un dossier `dist/`, publié comme dossier de sortie.
3. Ensuite : relier le domaine **bococon.fr** (celui de la carte de visite). Pour le domaine
   nu sur Cloudflare Pages, la gestion du domaine (serveurs DNS) doit passer chez
   Cloudflare : changer les serveurs DNS chez le vendeur du domaine (à demander au
   propriétaire : où il a été acheté, identifiants). Vérifier avant qu’aucune adresse
   e-mail n’utilise bococon.fr (l’adresse actuelle est un Gmail) ; garder les éventuels
   enregistrements e-mail lors du transfert.

## À faire avant la mise en ligne
- Vérifier une dernière fois le site sur Cloudflare Pages après la mise en ligne.

## Repères techniques
- Site statique : `index.html`, `css/style.css`, `js/main.js`, `assets/` (logo d’origine
  détouré en PNG). Pas d’outil de build.
- `app.py` n’existe que pour Streamlit : il intègre CSS, JS et images dans une iframe
  `srcdoc`. Les liens internes y sont gérés en JS (`location.protocol === "about:"`).
- Prix des formules (repris des maquettes du propriétaire) : Douces énergies 60 €,
  Première lueur 180 €, Semaine allégée 250 €, Cocon mois d’or 900 € — moitié prix après
  crédit d’impôt immédiat. Sur les bocaux, « À PARTIR DE … € » (prix avant crédit d’impôt, texte en arc
  `.jar__arc`) a été agrandi à la demande de la cuisinière (17,5 px au lieu de 14).
- Bocaux (choix du propriétaire) : en haut les 3 formules, de la moins chère à la plus chère
  (demande de la famille) : Première lueur, Semaine allégée, Cocon mois d’or
  (`.formulas--main`), même ordre dans les choix de Réserver et d’Offrir ; puis « + Pour compléter votre formule » avec
  Douces énergies (des en-cas, à partir de 60 €) et Les courses (faites par la cuisinière,
  à partir de 50 €, soit 25 € après crédit d’impôt) (`.formulas--extras`). Ces deux compléments ne se réservent ni ne s’offrent seuls :
  dans « Réserver » et « Offrir », ce sont des cases (`.addon`), actives seulement quand une
  formule est choisie. Les courses ont droit au crédit d’impôt comme le reste
  (`data-credit="1"`, choix du propriétaire).
- Dos des bocaux (`.jar__list`, contenu donné par le propriétaire) : Première lueur = 4 repas
  (entrée + plat), nettoyage, 2 à 3 h en moyenne ; Semaine allégée = 6 repas, 1 collation,
  nettoyage, environ 4 h ; Cocon mois d’or = 4 prestations d’environ 4 h chacune, puis « À
  chaque prestation : » et, ligne par ligne comme Semaine allégée, 6 repas, 1 collation,
  le nettoyage (choix du propriétaire) ; une collation = « un des en-cas de Douces
  énergies » (précision en italique `.jar__hint` sous la collation, demandée par la famille ;
  Cocon et Semaine en `.jar__sheet--dense`, Cocon aussi `--denser` pour que tout tienne) ; Douces énergies = 3 en-cas au choix, « 100 % fait
  maison, équilibrés, riches en nutriments essentiels » (mots de la cuisinière), par exemple
  granola, overnight skyr, pancakes, compotes, dattes snickers, barres chocolatées saines
  (liste plus large au dos : `.jar__sheet--dense`) ; Les courses = 0 % de
  charge mentale, « Je fais les courses à votre place » (au « je », choix du propriétaire).
  Au dos : le nom, le contenu et le bouton, sans « Ce qui est compris » ni prix (choix du
  propriétaire).
  Bouton « Réserver » au dos de chaque bocal (`[data-reserve]`) : mène à Réserver avec la
  formule déjà choisie (pour un complément : coché dès qu’une formule est choisie).
- Option bocaux (consigne, texte donné par la cuisinière) : bloc `#option-bocaux` sous les
  bocaux, à la place de l’ancienne phrase sur le crédit d’impôt (le bandeau juste dessous
  suffit). Incluse dans Semaine allégée et Cocon mois d’or, 15 € par prestation avec
  Première lueur ; caution de 80 € (chèque non encaissé) avant la première prestation. Au
  dos de ces 3 bocaux, un lien `.jar__option` y mène. La clause juridique (consigne et
  caution) va dans les CGV / le devis, pas sur le site. Pas encore de case « option bocaux » dans Réserver / Offrir.
- Ordre des sections : accueil, Le concept (`#approche`, s’appelait « L’approche »), Mon
  parcours (`#parcours`), Déroulé (`#deroule`, fond taupe clair), Mes engagements
  (`#engagements`, fond lin), Formules, crédit d’impôt (`#credit-impot`), Réserver, Offrir,
  Contact. Menu : Le concept, Formules, Réserver, Offrir, Contact (choix du propriétaire),
  avec des sous-parties (`.nav__sub`) : sous Le concept « Mon parcours, Le déroulé, Mes
  engagements », sous Formules « L’option bocaux, Le crédit d’impôt » (séparées par un
  simple espace sur téléphone, sans point). Sur téléphone, elles sont écrites en petit sous
  le titre dans le menu ; sur ordinateur, un petit menu apparaît au survol de la souris (ou au clavier), avec une
  petite flèche ; il se replie après un choix ou avec Échap (`.is-folded`, js/main.js) et
  se rouvre au survol suivant. Au clavier, la section choisie reçoit le focus
  (`focusSection`). Le menu du téléphone s’ouvre toujours par le haut et tient sur les
  téléphones couchés (règles `max-height` 520 / 360 / 300 px) ; sous 300 px de large, les
  sous-parties passent l’une sous l’autre. Mot à ne pas couper : `<span class="nowrap">`
  (pas de trait d’union insécable U+2011, absent de la police Cormorant).
- « Mes engagements » : charte éthique et professionnelle envoyée par la cuisinière,
  condensée à sa demande en 4 cartes (`.pledges` / `.pledge`) : Respect et bienveillance
  (intimité, sans jugement, écoute ; carte large, 3 colonnes), Sécurité alimentaire et
  traçabilité (normes HACCP), Nutrition sur-mesure pour le post-partum, Transparence légale
  et confiance (Services à la Personne, tarifs clairs). Son nom, Shannon Gaidoz, y figure
  (donné par elle dans la charte). C’est une partie de la page d’accueil, pas une page à
  part (elle parlait d’une « page » : possible plus tard, une fois sur Cloudflare Pages, si elle y tient).
- Offrir reste une section à part (choix du propriétaire). Dans Réserver, le bouton
  « C’est pour offrir » (`[data-gift-switch]`, lien vers `#offrir`) emmène à Offrir en
  reprenant la formule et les compléments déjà choisis.
- Sections « Réserver » (demande de réservation) et « Offrir » (carte cadeau) : aperçu en
  direct + e-mail prérempli vers bococon.contact@gmail.com (`js/main.js`), pas de paiement
  en ligne. Styles de formulaire partagés : `.field`, `.field-row`, `.chips`, `.chip`.
- Menu sur téléphone (corrigé) : l’ouverture du menu ne doit rien changer d’autre que le
  menu. Jamais d’`overflow` sur `html` / `body` à l’ouverture, jamais de `backdrop-filter`
  sur l’en-tête en dessous de 900 px — sinon, après avoir fait défiler, l’en-tête sort de
  l’écran et le menu se réduit à 68 px. Le défilement derrière le menu est bloqué en JS
  (`touchmove` / `wheel` sur l’en-tête). Le body utilise `overflow-x: clip`.
  Tests Playwright : toucher avec `touchscreen.tap(x, y)` (`locator.tap()` fait défiler la
  page tout seul) et faire défiler au doigt avec `Input.dispatchTouchEvent` (CDP).
- Streamlit ne se met pas toujours à jour tout seul après un push : si le propriétaire voit
  encore l’ancienne version, lui faire relancer l’appli (share.streamlit.io → ⋮ à côté de
  l’appli → « Reboot »), puis fermer et rouvrir l’onglet.
- « Mon parcours » (frise chronologique sans logo, de gauche à droite ; de haut en bas sous
  760 px ; texte donné par le propriétaire, au « je ») : études en
  hôtellerie-restauration, 10 ans dans la restauration, naissance de son petit garçon en
  2023, puis l’envie de créer une entreprise qui lui corresponde : Bo’Cocon. Rien d’autre
  à inventer (pas de prénom, pas de lieu).
- Coordonnées : bococon.contact@gmail.com · 07 81 18 86 07 · du Pic Saint-Loup à la
  Vaunage.
