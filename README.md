# Bo’Cocon — site internet

Cuisine à domicile post-partum & familiale.

Site statique (HTML / CSS / JavaScript, sans outil de build) : il suffit d’ouvrir `index.html`
dans un navigateur ou de publier le dossier tel quel (GitHub Pages, Netlify, OVH…).

## Structure

```
index.html            Page d’accueil (intro animée + sections)
css/style.css         Styles : palette, typographies, animations, responsive
js/main.js            Intro, en-tête, menu mobile, apparitions au défilement
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

`app.py` assemble `index.html`, `css/style.css` et `js/main.js` en une seule page et
l’affiche en plein écran (l’interface Streamlit est masquée). Les modifications du site
se font donc toujours dans ces fichiers.

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
   et le site est publié sur **Netlify**, relié uniquement à `main`.
3. **Domaine** : relier bococon.fr au site Netlify.

Restant à faire : menu sur téléphone (bug quand on l’ouvre après avoir défilé),
contenu de chaque formule au dos des bocaux.

## Intro d’ouverture

À l’ouverture du site, deux battants portant l’arche « B » s’écartent de chaque côté, puis un
paysage au trait se dessine de gauche à droite — le Pic Saint-Loup, la garrigue, les vignes, une
capitelle, les cyprès, un village et les collines de la Vaunage — avec « Du Pic Saint-Loup à la
Vaunage », avant l’arrivée sur la page d’accueil (environ 6,5 s).
Un clic, la molette ou la touche Échap permettent de la passer. L’intro n’est pas rejouée
lorsque l’on revient sur l’accueil depuis une autre page du site.

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
