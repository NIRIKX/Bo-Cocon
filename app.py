"""Bo'Cocon — affichage du site sur Streamlit.

Le site reste un site statique (une page HTML par partie + css/ + js/) ; cette
application assemble toutes les pages dans un seul document (chaque page dans un
bloc .st-page, js/main.js affiche celle qu'on demande) et l'affiche en plein écran.

Lancer en local :  streamlit run app.py      (une page précise : ?page=formules)
"""

import base64
import re
from pathlib import Path

import streamlit as st
import streamlit.components.v1 as components

ROOT = Path(__file__).parent


def data_uri(match: re.Match) -> str:
    """Remplace un chemin « assets/... » par le fichier lui-même (image ou police, data URI)."""
    path = ROOT / "assets" / match.group(1)
    mime = {".svg": "image/svg+xml", ".woff2": "font/woff2"}.get(path.suffix, f"image/{path.suffix[1:]}")
    return f"data:{mime};base64,{base64.b64encode(path.read_bytes()).decode()}"


# les pages du site, dans l'ordre (même liste que outils/generer_pages.py)
PAGES = ["index", "concept", "formules", "reserver", "offrir", "contact", "cgv", "confidentialite"]
MAIN = re.compile(r'(<main id="contenu" tabindex="-1">)(.*?)(</main>)', re.S)


def build_site(start: str = "index") -> str:
    """Toutes les pages dans un seul document, avec la feuille de style, le script et
    les images intégrés ; seule la page « start » est visible au départ."""
    blocks = []
    for name in PAGES:
        page = (ROOT / f"{name}.html").read_text(encoding="utf-8")
        hidden = "" if name == start else " hidden"
        blocks.append(f'\n<div class="st-page" data-page="{name}"{hidden}>{MAIN.search(page).group(2)}</div>')
    html = (ROOT / "index.html").read_text(encoding="utf-8")
    html = MAIN.sub(lambda m: m.group(1) + "".join(blocks) + "\n  " + m.group(3), html, count=1)
    html = html.replace('<body data-page="index">', f'<body data-page="{start}">', 1)
    css = (ROOT / "css" / "style.css").read_text(encoding="utf-8")
    # polices : dans Streamlit, seulement les lettres du français (« latin ») pour alléger
    # la page (les lettres « latin-ext » ne servent qu'aux autres langues)
    css = re.sub(r"@font-face \{[^}]*latin-ext[^}]*\}\n?", "", css)
    js = (ROOT / "js" / "main.js").read_text(encoding="utf-8")

    html = html.replace('<link rel="stylesheet" href="css/style.css">', f"<style>\n{css}\n</style>")
    html = html.replace('<script src="js/main.js" defer></script>', "")
    html = re.sub(r'\s*<link rel="preload"[^>]*>', "", html)
    html = html.replace("</body>", f"<script>\n{js}\n</script>\n</body>")
    # dans Streamlit, la page est servie seule : on y intègre aussi les images
    return re.sub(r"(?:\.\./)?assets/((?:fonts/)?[\w.-]+\.(?:png|jpg|svg|woff2))", data_uri, html)


st.set_page_config(
    page_title="Bo’Cocon — Cuisine à domicile post-partum & familiale",
    page_icon=str(ROOT / "assets" / "favicon.png"),
    layout="wide",
    initial_sidebar_state="collapsed",
)

# Masque l'interface Streamlit pour que le site occupe tout l'écran
st.markdown(
    """
    <style>
      header[data-testid="stHeader"], [data-testid="stToolbar"], [data-testid="stDecoration"],
      [data-testid="stStatusWidget"], #MainMenu, footer { display: none !important; }
      /* la page autour du site ne doit jamais défiler (ni à la souris, ni par programme) */
      html, body, [data-testid="stApp"], [data-testid="stAppViewContainer"], [data-testid="stMain"],
      [data-testid="stMainBlockContainer"], .block-container {
        overflow: hidden !important;
        overflow: clip !important;
        background: #fef9f0;
      }
      [data-testid="stMainBlockContainer"], .block-container {
        padding: 0 !important;
        max-width: 100% !important;
      }
      [data-testid="stVerticalBlock"] { gap: 0 !important; }
      /* le cadre prend exactement la hauteur de l'écran (sinon il reste 900 px fixes) */
      [data-testid="stElementContainer"], .element-container {
        flex: 0 0 auto !important;
        height: auto !important;
      }
      [data-testid="stElementContainer"]:has(> [data-testid="stMarkdown"] style) { display: none !important; }
      iframe[data-testid="stIFrame"], [data-testid="stIFrame"] iframe, .stIFrame {
        display: block;
        width: 100vw !important;
        height: 100vh !important;
        height: 100dvh !important;
        border: 0;
      }
    </style>
    """,
    unsafe_allow_html=True,
)

page = st.query_params.get("page", "index")
components.html(build_site(page if page in PAGES else "index"), height=900, scrolling=True)
