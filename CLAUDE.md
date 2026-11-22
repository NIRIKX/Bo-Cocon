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
   Ne publier que les fichiers du site (les `*.html` de la racine, `css/`, `js/`,
   `assets/`), pas `app.py`, `pages/`, `outils/`, `CLAUDE.md`, `README.md` : par exemple
   une commande de construction qui les copie dans un dossier `dist/`, publié comme
   dossier de sortie. Cloudflare Pages enlève « .html » des adresses (/formules) : les
   liens en « formules.html » restent valables (redirection).
3. Ensuite : relier le domaine **bococon.fr** (celui de la carte de visite). Pour le domaine
   nu sur Cloudflare Pages, la gestion du domaine (serveurs DNS) doit passer chez
   Cloudflare : changer les serveurs DNS chez le vendeur du domaine (à demander au
   propriétaire : où il a été acheté, identifiants). Vérifier avant qu’aucune adresse
   e-mail n’utilise bococon.fr (l’adresse actuelle est un Gmail) ; garder les éventuels
   enregistrements e-mail lors du transfert.

## À faire avant la mise en ligne (à la fin, avec le propriétaire)
- Mentions légales (obligatoires pour un site professionnel) : la cuisinière a fait ses
  démarches (INPI) ; attendre son SIRET (et, si elle en a un, son numéro de déclaration
  Services à la Personne), son nom ou celui de l’entreprise, une adresse (ou domiciliation),
  et les coordonnées de l’hébergeur (Cloudflare). Rien à inventer : demander chaque info.
- Nom de domaine bococon.fr : pas encore réservé par le propriétaire ; la cuisinière est
  peut-être en train de le faire. Le site peut d’abord tourner sur l’adresse gratuite
  `*.pages.dev`, le domaine se branche ensuite.
- Propriété : aujourd’hui le dépôt est sur le compte GitHub du propriétaire ; il veut que
  le site appartienne à sa cousine (Bo’Cocon), qui ne sait pas gérer la technique.
  Proposé : tout au nom de l’entreprise avec l’adresse bococon.contact@gmail.com (compte
  chez le vendeur du domaine, compte Cloudflare, organisation GitHub « Bo’Cocon » dont elle
  et lui sont tous deux propriétaires, dépôt transféré dedans), plus une petite fiche pour
  elle (identifiants, renouvellement du domaine). À décider avec eux à la fin ; après un
  transfert du dépôt, il faudra redonner l’accès à Claude et mettre à jour Streamlit.
- Vérifier une dernière fois le site sur Cloudflare Pages après la mise en ligne.

## Repères techniques
- Site statique à plusieurs pages (demande de la cuisinière, 21/11/2026 : « moins de trop
  d’informations », chaque partie dans son onglet) : `index.html` (accueil = **seulement le
  héros** — titre « Un cocon de douceur… », texte, boutons, 50 %, arche « B » — sur un seul
  écran, sans rien à faire défiler ; le reste passe par les onglets du haut (demande de la
  cuisinière, 21/11/2026). Sur l’accueil, le pied de page se réduit à sa dernière ligne
  (© · CGV · confidentialité) ; sur téléphone l’arche « B » passe en petit au-dessus du
  titre, avec la petite marmite qui tourne (`.badge`) à sa gauche (à garder : la cuisinière
  l’a réclamée), et disparaît sous 600 px de haut. Règles `body[data-page="index"]` dans
  css/style.css ; vérifié sans défilement de 1920×1080 à l’iPhone SE), `concept.html` (concept, parcours, déroulé,
  engagements), `formules.html` (bocaux, option bocaux, crédit d’impôt), `reserver.html`,
  `offrir.html`, `contact.html`, `cgv.html`, `confidentialite.html` ; `css/style.css`,
  `js/main.js`, `assets/`.
- **Les pages de la racine sont fabriquées** : ne jamais les modifier directement.
  Modifier `pages/<nom>.html` (contenu de la page, avec en tête titre / description /
  menu) ou `pages/_gabarit.html` (tout ce qui est commun : en-tête, menu, ouverture, pied
  de page), puis lancer `python3 outils/generer_pages.py` (vérifier :
  `python3 outils/generer_pages.py --verifier`). Le menu marque la page en cours
  (`data-nav` → `aria-current="page"`) ; `<body data-page="<nom>">` (aussi mis à jour dans
  Streamlit par js/main.js et app.py).
- Choix transmis d’une page à l’autre par l’adresse : bouton « Réserver » au dos d’un bocal
  → `reserver.html?formule=…` (ou `?complement=…` pour Douces énergies / Les courses) ;
  « C’est pour offrir » → `offrir.html?formule=…&extras=…` (js/main.js : `prefill`).
- `app.py` n’existe que pour Streamlit : il met toutes les pages dans un seul document
  (iframe `srcdoc`), chacune dans un bloc `.st-page` ; js/main.js affiche la page demandée
  (`location.protocol === "about:"`, aiguillage des liens « x.html », « x.html#partie »,
  « ?formule=… »). `?page=formules` dans l’adresse Streamlit ouvre directement une page.
  Attention : les ids doivent rester uniques sur l’ensemble des pages. En changeant de
  page, on va tout de suite en haut (`jumpTo`, `behavior: "instant"`) : avec le défilement
  doux, la nouvelle page apparaissait d’abord en bas puis remontait (signalé par le
  propriétaire). Changer `style.scrollBehavior` ne suffit pas dans Chrome. La page
  choisie arrive en fondu (`.st-page.is-entering`).
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
  dos de ces 3 bocaux, un lien `.jar__option` y mène. Avantages : Zéro achat, Conservation
  saine (remplace « Gain de place », demande de la cuisinière), Du four à la table. La clause juridique (consigne et
  caution) va dans les CGV / le devis, pas sur le site. Pas encore de case « option bocaux » dans Réserver / Offrir.
- Pages et menu : Accueil (`./`, ajouté le 21/11/2026 : sans lui, le propriétaire croyait
  que la première page — titre et grand « B » — avait disparu), Le concept (`concept.html` : `#approche`, `#parcours`, `#deroule` fond
  taupe clair, `#engagements` fond lin), Formules (`formules.html` : `#formules`,
  `#option-bocaux`, `#credit-impot`), Commander (lien vers `reserver.html`,
  `data-nav="commander"`, marqué sur les pages Réserver et Offrir : regroupe Réserver et
  Offrir, essai demandé par la cuisinière le 22/11/2026, mot proposé par Claude), Contact,
  avec des sous-parties (`.nav__sub`) : sous Le concept « Mon parcours, Le déroulé, Mes
  engagements », sous Formules « L’option bocaux, Le crédit d’impôt », sous Commander
  « Réserver, Offrir » (séparées par un
  simple espace sur téléphone, sans point). Sur téléphone, elles sont écrites en petit sous
  le titre dans le menu ; sur ordinateur, un petit menu apparaît au survol de la souris (ou au clavier), avec une
  petite flèche ; il se replie après un choix ou avec Échap (`.is-folded`, js/main.js) et
  se rouvre au survol suivant. Au clavier, la section choisie reçoit le focus
  (`focusSection`). Le menu du téléphone s’ouvre toujours par le haut et tient sur les
  téléphones couchés (règles `max-height` 620 / 520 / 360 / 300 px ; sous 300 px de haut,
  « Accueil » est caché, le logo juste au-dessus y mène) ; sous 300 px de large, les
  sous-parties passent l’une sous l’autre. Mot à ne pas couper : `<span class="nowrap">`
  (pas de trait d’union insécable U+2011, absent de la police Cormorant).
- Le concept (`#approche`) : 3 points « Fait maison, chez vous », « Pour le post-partum »
  (au lieu de « Pensé pour le post-partum », demande de la cuisinière), « Pour toute la
  famille ». Le déroulé : 01 « Faisons connaissance » (au lieu de « On fait connaissance »,
  demande de la cuisinière, mot choisi par le propriétaire), 02 « Un menu sur-mesure »,
  03 « Je cuisine chez vous ».
- CSS : le bloc `@media (max-width: 900px)` contient aussi `.pillars, .steps`, `.tax__inner`
  et `.footer__grid` (une colonne sur tablette / téléphone) ; en ajoutant des règles,
  ne pas le refermer avant elles (erreur faite puis corrigée le 22/11/2026).
- « Mes engagements » : charte éthique et professionnelle envoyée par la cuisinière,
  condensée à sa demande en 4 cartes (`.pledges` / `.pledge`) : Respect et bienveillance
  (intimité, sans jugement, écoute ; carte large, 3 colonnes), Sécurité alimentaire et
  traçabilité (normes HACCP), Nutrition sur-mesure pour le post-partum, Transparence légale
  et confiance (Services à la Personne, tarifs clairs). Son nom, Shannon Gaidoz, y figure
  (donné par elle dans la charte). Sur la page `concept.html`.
- Offrir est une page à part (choix du propriétaire). Dans Réserver, le bouton
  « C’est pour offrir » (`[data-gift-switch]`, lien vers `offrir.html`) emmène à Offrir en
  reprenant la formule et les compléments déjà choisis.
- Sections « Réserver » (demande de réservation) et « Offrir » (carte cadeau) : aperçu en
  direct + e-mail prérempli vers bococon.contact@gmail.com (`js/main.js`), pas de paiement
  en ligne. Sous le bouton (`.form-note`) : « En cliquant, un e-mail déjà rempli s’ouvre
  dans votre messagerie : vous n’avez plus qu’à l’envoyer. » (demande de la cuisinière,
  22/11/2026 : dire clairement que l’e-mail est prérempli), puis, sur ordinateur seulement,
  « Rien ne s’ouvre ? Écrire depuis Gmail » (`[data-gmail]`, même e-mail dans Gmail, nouvel
  onglet : quand on lit ses e-mails sur le site de Gmail, l’ordinateur n’a pas de
  messagerie à ouvrir). Fonction `setMail` dans js/main.js. Styles de formulaire partagés :
  `.field`, `.field-row`, `.chips`, `.chip`.
- E-mail et téléphone dans Streamlit : « rien ne se passe » quand on cliquait (signalé le
  22/11/2026, téléphone et ordinateur) : le cadre de Streamlit n’a pas le droit d’ouvrir
  la messagerie. Correction (js/main.js, `openFromHost`) : les liens `mailto:`, `tel:` et
  « nouvel onglet » sont ouverts depuis la page qui contient le site (window.top, sinon
  window.parent, même adresse que le cadre). Tests : la demande `mailto:` doit partir de
  la page, pas du cadre `about:srcdoc`.
- Barre du haut (`.site-header`) : couleur crème « comme avant » (transparente en haut de
  page, crème une fois défilé ; le propriétaire n’a pas voulu de taupe ni d’autre couleur)
  et un fin trait dessous, toujours visible, pour la séparer de la page (accueil compris).
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
  760 px ; texte donné par le propriétaire, au « je ») : « Mes études » — Diplômée en
  hôtellerie-restauration ; « Expérience » — 10 ans de métier en restauration (mots de la
  cuisinière, 21/11/2026) ; naissance de son petit garçon en 2023, puis l’envie de créer
  une entreprise qui lui corresponde : Bo’Cocon. Rien d’autre à inventer (pas de prénom,
  pas de lieu).
- Bas de page : à droite, à la place de la phrase sur le crédit d’impôt (demande de la
  cuisinière), deux liens discrets « CGV · Politique de confidentialité » (`.footer__legal`)
  vers les pages `cgv.html` et `confidentialite.html` (`.legal-page`). Textes pas encore
  reçus : un simple message « bientôt disponibles ». Bas de page resserré à la demande de
  la cuisinière (22/11/2026) : moins de marges, « Navigation » sur deux colonnes
  (`.footer__list--nav`) ; sur l’accueil, la barre fait 46 px (50 sur téléphone, 62 sous
  380 px de large, sur deux lignes). Une partie des CGV est
  prête chez elle ; l’autre attend les infos de l’hébergeur (Cloudflare, Inc., 101
  Townsend Street, San Francisco, CA 94107, États-Unis, +1 (650) 319-8930).
- Ouverture (intro) : les battants au « B » s’ouvrent (à garder absolument : le propriétaire
  y tient), puis le Pic Saint-Loup et la Vaunage au trait (soleil, 9 villages, « Du Pic
  Saint-Loup » / « à la Vaunage »). Accélérée à sa demande : environ 5,5 s au lieu de 7,2 s.
  Timings dans `css/style.css` (`.intro…`), sécurité JS à 7,5 s.
- Coordonnées : bococon.contact@gmail.com · 07 81 18 86 07 · du Pic Saint-Loup à la
  Vaunage.
