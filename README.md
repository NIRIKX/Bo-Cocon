# Bo’Cocon — site internet

Cuisine à domicile post-partum & familiale.

Site statique (HTML / CSS / JavaScript, sans outil de build) : il suffit d’ouvrir `index.html`
dans un navigateur ou de publier le dossier tel quel (GitHub Pages, Netlify, OVH…).

## Structure

```
index.html            Page d’accueil (intro animée + sections)
css/style.css         Styles : palette, typographies, animations, responsive
js/main.js            Intro, en-tête, menu mobile, apparitions au défilement
assets/
  logo-bococon.svg    Logo ovale « Bo’Cocon » avec l’accroche en arc
  monogramme-b.svg    Monogramme « B » dans son arche
  favicon.svg / .png  Icône d’onglet
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

## Intro d’ouverture

À l’ouverture du site, deux battants s’écartent de chaque côté, l’ovale du logo se dessine,
puis « Bo’Cocon » et l’accroche apparaissent avant l’arrivée sur la page d’accueil (environ 5 s).
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

## À compléter

- L’adresse e-mail de contact (`contact@bococon.fr` est provisoire) dans `index.html`.
- Le logo est une recréation vectorielle fidèle à l’original ; il peut être remplacé
  par le fichier source si besoin.
