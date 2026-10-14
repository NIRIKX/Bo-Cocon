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
2. **Quand le propriétaire dit que le site est fini** : regrouper tout le travail sur la
   branche `main`, puis l’aider à créer le site sur **Netlify** relié uniquement à `main`
   (une seule mise à jour utilisée). Le forfait gratuit de Netlify compte environ
   20 mises à jour par mois : ne jamais relier Netlify à la branche de travail.
3. Ensuite : relier le domaine **bococon.fr** (celui de la carte de visite).

## À faire avant le passage sur Netlify
- Vérifier une dernière fois le site sur Netlify après la mise en ligne.

## Repères techniques
- Site statique : `index.html`, `css/style.css`, `js/main.js`, `assets/` (logo d’origine
  détouré en PNG). Pas d’outil de build.
- `app.py` n’existe que pour Streamlit : il intègre CSS, JS et images dans une iframe
  `srcdoc`. Les liens internes y sont gérés en JS (`location.protocol === "about:"`).
- Prix des formules (repris des maquettes du propriétaire) : Douces énergies 60 €,
  Première lueur 180 €, Semaine allégée 250 €, Cocon mois d’or 900 € — moitié prix après
  crédit d’impôt immédiat.
- Bocaux (choix du propriétaire) : en haut les 3 formules Cocon mois d’or, Semaine allégée,
  Première lueur (`.formulas--main`) ; puis « + Pour compléter votre formule » avec
  Douces énergies (des en-cas, à partir de 60 €) et Les courses (faites par la cuisinière,
  à partir de 50 €, soit 25 € après crédit d’impôt) (`.formulas--extras`). Ces deux compléments ne se réservent ni ne s’offrent seuls :
  dans « Réserver » et « Offrir », ce sont des cases (`.addon`), actives seulement quand une
  formule est choisie. Les courses ont droit au crédit d’impôt comme le reste
  (`data-credit="1"`, choix du propriétaire).
- Dos des bocaux (`.jar__list`, contenu donné par le propriétaire) : Première lueur = 4 repas
  (entrée + plat), nettoyage, 2 à 3 h en moyenne ; Semaine allégée = 6 repas, 1 collation,
  nettoyage, environ 4 h ; Cocon mois d’or = 4 prestations d’environ 4 h (6 repas + 1
  collation + nettoyage à chaque fois) ; Douces énergies = 3 en-cas au choix (granola, overnight skyr,
  pancakes, compotes, dattes snickers, barres chocolatées saines) ; Les courses = 0 % de
  charge mentale, « Je fais les courses à votre place » (au « je », choix du propriétaire).
  Au dos : le nom, le contenu et le bouton, sans « Ce qui est compris » ni prix (choix du
  propriétaire).
  Bouton « Réserver » au dos de chaque bocal (`[data-reserve]`) : mène à Réserver avec la
  formule déjà choisie (pour un complément : coché dès qu’une formule est choisie).
- Option bocaux (consigne, texte donné par la cuisinière) : bloc `#option-bocaux` sous les
  bocaux, à la place de l’ancienne phrase sur le crédit d’impôt (le bandeau juste dessous
  suffit). Incluse dans Semaine allégée et Cocon mois d’or, 15 € par prestation avec
  Première lueur ; caution de 80 € avant la première prestation. Au dos de ces 3 bocaux, un
  lien `.jar__option` y mène. La clause juridique (consigne et caution) va dans les CGV /
  le devis, pas sur le site. Pas encore de case « option bocaux » dans Réserver / Offrir.
- Ordre des sections : accueil, L’approche, Mon parcours (`#parcours`, absent du menu),
  Déroulé (fond taupe clair, absent du menu), Formules, crédit d’impôt, Réserver, Offrir,
  Contact. Menu : L’approche, Formules,
  Réserver, Offrir, Contact (choix du propriétaire).
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
