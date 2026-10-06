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
- Corriger le menu sur téléphone : ouvert après avoir fait défiler la page, l’en-tête
  sort de l’écran et le menu se réduit à 68 px (cause : `overflow: hidden` sur `html` et
  `body` quand le menu est ouvert + `backdrop-filter` sur `.site-header.is-scrolled`, qui
  devient le bloc conteneur du menu `position: fixed`). Correctif testé :
  `body { overflow-x: clip }`, `.nav-open { overflow: hidden }`,
  `.nav-open body { overflow: visible }`, et pas de `backdrop-filter` sur l’en-tête quand
  le menu est ouvert.
- Ajouter le contenu de chaque formule au dos des bocaux (la cousine du propriétaire
  doit le fournir ; ne rien inventer). Un modèle de liste commenté est prêt dans
  `index.html`.
- Vérifier une dernière fois le site sur Netlify après la mise en ligne.

## Repères techniques
- Site statique : `index.html`, `css/style.css`, `js/main.js`, `assets/` (logo d’origine
  détouré en PNG). Pas d’outil de build.
- `app.py` n’existe que pour Streamlit : il intègre CSS, JS et images dans une iframe
  `srcdoc`. Les liens internes y sont gérés en JS (`location.protocol === "about:"`).
- Prix des formules (repris des maquettes du propriétaire) : Douces énergies 60 €,
  Première lueur 180 €, Semaine allégée 250 €, Cocon mois d’or 900 € — moitié prix après
  crédit d’impôt immédiat.
- Ordre des sections : accueil, L’approche + Déroulé (même fond, Déroulé absent du menu),
  Formules, crédit d’impôt, Réserver, Offrir, Contact. Menu : L’approche, Formules,
  Réserver, Offrir, Contact (choix du propriétaire).
- Sections « Réserver » (demande de réservation) et « Offrir » (carte cadeau) : aperçu en
  direct + e-mail prérempli vers bococon.contact@gmail.com (`js/main.js`), pas de paiement
  en ligne. Styles de formulaire partagés : `.field`, `.field-row`, `.chips`, `.chip`.
- Coordonnées : bococon.contact@gmail.com · 07 81 18 86 07 · du Pic Saint-Loup à la
  Vaunage.
