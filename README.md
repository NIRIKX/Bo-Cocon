# Bo’Cocon — site internet

Cuisine à domicile post-partum & familiale.

Site statique à plusieurs pages (HTML / CSS / JavaScript) : il suffit d’ouvrir `index.html`
dans un navigateur ou de publier les fichiers du site tels quels.

## Structure

```
index.html            Accueil (ouverture animée, aperçu du concept et des formules)
concept.html          Le concept, Mon parcours, Le déroulé, Mes engagements
formules.html         Les bocaux, l’option bocaux, le crédit d’impôt
reserver.html         Demande de réservation
offrir.html           Carte cadeau
contact.html          Contact
cgv.html              Conditions générales de vente (texte à venir)
confidentialite.html  Politique de confidentialité (texte à venir)
pages/                Contenu de chaque page + _gabarit.html (en-tête, menu, pied de page communs)
outils/generer_pages.py  Fabrique les pages de la racine à partir de pages/
css/style.css         Styles : palette, typographies, animations, responsive
js/main.js            Intro, en-tête, menu mobile, formulaires, apparitions au défilement
assets/               Logo d’origine détouré (fond transparent)
  logo-bococon.png    Logo ovale complet
  logo-wordmark.png   « Bo’Cocon » seul (en-tête, pied de page, intro)
  monogramme-b.png    Monogramme « B » dans son arche
  b-seul.png          « B » seul (décor)
  favicon.png         Icône d’onglet
app.py                Affichage du site sur Streamlit
requirements.txt      Dépendances Streamlit
.streamlit/config.toml  Thème Streamlit aux couleurs du site
```

## Publier sur Streamlit

`app.py` assemble toutes les pages, `css/style.css` et `js/main.js` en un seul document et
l’affiche en plein écran (l’interface Streamlit est masquée) ; les liens entre pages y
restent dans le même document. Les modifications du site se font dans `pages/`, `css/` et
`js/`, puis `python3 outils/generer_pages.py` refabrique les pages.

En local :

```
pip install -r requirements.txt
streamlit run app.py
```

En ligne (Streamlit Community Cloud, gratuit) :

1. Se connecter sur https://share.streamlit.io avec son compte GitHub.
2. « Create app » → « Deploy a public app from GitHub ».
3. Dépôt `NIRIKX/Bo-Cocon`, branche `main`, fichier principal `app.py`.
4. Choisir l’adresse (par exemple `bococon.streamlit.app`) puis « Deploy ».

Chaque modification poussée sur la branche est ensuite mise en ligne automatiquement.

## Feuille de route

1. **Construction** : on termine le site en le regardant sur Streamlit
   (https://bo-cocon.streamlit.app, branche `claude/great-cray-oy302g`).
2. **Mise en ligne définitive** : quand le site est fini, tout est regroupé sur `main`
   et le site est publié sur **Cloudflare Pages** (gratuit, visites illimitées), avec `main`
   comme version en ligne.
3. **Domaine** : relier bococon.fr au site sur Cloudflare Pages.

## Intro d’ouverture

À l’ouverture du site, deux battants portant l’arche « B » s’écartent de chaque côté, puis deux
dessins au trait se tracent, séparés : la silhouette du Pic Saint-Loup (« Du Pic Saint-Loup »), puis
le contour du territoire de la Vaunage (« à la Vaunage » — contour réel des 9 communes : Boissières,
Calvisson, Caveirac, Clarensac, Congénies, Langlade, Nages-et-Solorgues, Saint-Côme-et-Maruéjols,
Saint-Dionisy). Un soleil se lève derrière le Pic et les 9 villages s’allument un à un dans la
Vaunage, avant l’arrivée sur la page d’accueil (environ 5,5 s).
Un clic, la molette ou la touche Échap permettent de la passer. L’intro n’est pas rejouée
lorsque l’on revient sur l’accueil depuis une autre page du site.

## Les pages

- Accueil : le titre, un aperçu du concept (« Découvrir le concept ») et les 3 bocaux
  (« Voir le détail des formules »).
- Le concept : le concept, Mon parcours, Le déroulé « Comment ça se passe ? » (fond taupe
  clair), Mes engagements (la charte de la cuisinière, en 4 cartes).
- Formules : les 5 bocaux, l’option bocaux, le bandeau crédit d’impôt.
- Réserver, Offrir, Contact : chacun sa page.
- CGV et politique de confidentialité : liens discrets en bas de chaque page.

Menu du haut et pied de page : Le concept, Formules, Réserver, Offrir, Contact.
Le menu a aussi des sous-parties : Mon parcours, Le déroulé et Mes engagements sous Le concept, L’option
bocaux et Le crédit d’impôt sous Formules. Sur téléphone, elles sont écrites sous le titre ;
sur ordinateur, elles apparaissent au passage de la souris.

## Formules

Trois formules en haut, de la moins chère à la plus chère (Première lueur, Semaine allégée,
Cocon mois d’or), puis
« + Pour compléter votre formule » : Douces énergies et Les courses, qui ne se prennent
qu’en plus d’une formule. Chaque bocal se retourne pour montrer ce qu’il contient, avec un
bouton « Réserver ».

Sous les bocaux, l’encadré « L’option bocaux » (la consigne) explique comment marchent les
contenants en verre prêtés par la cuisinière : inclus dans Semaine allégée et Cocon mois
d’or, 15 € par prestation avec Première lueur, caution de 80 €. Le dos de ces trois bocaux
a un lien qui y mène.

## Réserver

La section « Réserver » permet de demander une réservation : formule, compléments,
nom, téléphone, commune, date souhaitée et message facultatif. Un récapitulatif en forme
d’arche se met à jour en direct (prix de départ et prix après crédit d’impôt). Le bouton
« C’est pour offrir » emmène à la section Offrir avec les mêmes choix.

## Offrir (carte cadeau)

La section « Offrir » permet de composer une carte cadeau : formule, compléments, prénom de
la personne, le sien et un petit mot. La carte s’affiche en direct, puis le bouton
« Commander la carte cadeau » ouvre la messagerie avec la demande déjà écrite, envoyée à
bococon.contact@gmail.com. Il n’y a pas de paiement en ligne : Bo’Cocon recontacte la
personne pour finaliser.

## Palette

| Rôle            | Couleur   |
|-----------------|-----------|
| Crème (fond)    | `#fef9f0` |
| Lin             | `#ede8e2` |
| Taupe           | `#c6b6a9` |
| Caramel         | `#be9a80` |
| Brun            | `#744537` |
| Expresso        | `#512814` |
| Texte           | `#63584d` |

Typographies : Cormorant Garamond (titres) et Jost (textes), via Google Fonts.

## Coordonnées affichées

bococon.contact@gmail.com · 07 81 18 86 07 · du Pic Saint-Loup à la Vaunage
(dans `index.html`, sections Contact et pied de page).
