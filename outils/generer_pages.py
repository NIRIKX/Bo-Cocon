"""Bo'Cocon — fabrique les pages du site à partir du gabarit commun.

Chaque page a son contenu dans pages/<nom>.html ; l'en-tête, le menu, l'ouverture et
le pied de page sont communs, dans pages/_gabarit.html. Ce script assemble les deux
et écrit <nom>.html à la racine du site (ce sont ces fichiers qui sont publiés).

    python3 outils/generer_pages.py            # (re)fabrique toutes les pages
    python3 outils/generer_pages.py --verifier # dit si une page n'est pas à jour

Début d'un fichier de pages/ (en commentaire) :
    titre: …         (balise <title>)
    description: …   (description pour les moteurs de recherche)
    menu: formules   (lien du menu marqué comme page en cours ; vide pour aucun)
"""

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PAGES = ROOT / "pages"
# ordre des pages (utilisé aussi par app.py pour Streamlit)
ORDRE = ["index", "concept", "formules", "reserver", "offrir", "contact", "cgv", "confidentialite"]
BANNIERE = ("<!-- Page fabriquée par outils/generer_pages.py à partir de pages/{nom}.html "
            "et pages/_gabarit.html : ne pas la modifier ici. -->\n")


def lire_page(nom: str) -> tuple[dict, str]:
    texte = (PAGES / f"{nom}.html").read_text(encoding="utf-8")
    m = re.match(r"<!--\n(.*?)\n-->\n", texte, re.S)
    if not m:
        raise SystemExit(f"pages/{nom}.html : en-tête (titre, description, menu) manquant")
    infos = dict(re.findall(r"^(\w+): ?(.*)$", m.group(1), re.M))
    return infos, texte[m.end():]


def fabriquer(nom: str, gabarit: str) -> str:
    infos, contenu = lire_page(nom)
    html = (gabarit.replace("{{titre}}", infos["titre"])
                   .replace("{{description}}", infos["description"])
                   .replace("{{contenu}}", contenu)
                   .replace("{{page}}", nom))
    menu = infos.get("menu", "").strip()
    if menu:
        html, n = re.subn(rf'data-nav="{menu}"', f'data-nav="{menu}" aria-current="page"', html)
        if not n:
            raise SystemExit(f"pages/{nom}.html : menu « {menu} » introuvable dans le gabarit")
    return html.replace("<!doctype html>\n", "<!doctype html>\n" + BANNIERE.format(nom=nom), 1)


def main() -> None:
    gabarit = (PAGES / "_gabarit.html").read_text(encoding="utf-8")
    verifier = "--verifier" in sys.argv
    pas_a_jour = []
    for nom in ORDRE:
        html = fabriquer(nom, gabarit)
        cible = ROOT / f"{nom}.html"
        if verifier:
            if not cible.exists() or cible.read_text(encoding="utf-8") != html:
                pas_a_jour.append(cible.name)
        else:
            cible.write_text(html, encoding="utf-8")
    if verifier:
        if pas_a_jour:
            raise SystemExit("Pages pas à jour : " + ", ".join(pas_a_jour) +
                             " — lancer : python3 outils/generer_pages.py")
        print("Toutes les pages sont à jour.")
    else:
        print("Pages fabriquées :", ", ".join(f"{n}.html" for n in ORDRE))


if __name__ == "__main__":
    main()
