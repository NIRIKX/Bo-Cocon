"""Bo'Cocon — affichage du site sur Streamlit.

Le site reste un site statique (index.html + css/ + js/) ; cette application
l'assemble en une seule page et l'affiche en plein écran.

Lancer en local :  streamlit run app.py
"""

import base64
import re
from pathlib import Path

import streamlit as st
import streamlit.components.v1 as components

ROOT = Path(__file__).parent


def data_uri(match: re.Match) -> str:
    """Remplace un chemin « assets/... » par l'image elle-même (data URI)."""
    path = ROOT / "assets" / match.group(1)
    mime = "image/svg+xml" if path.suffix == ".svg" else f"image/{path.suffix[1:]}"
    return f"data:{mime};base64,{base64.b64encode(path.read_bytes()).decode()}"


def build_site() -> str:
    """Retourne index.html avec la feuille de style, le script et les images intégrés."""
    html = (ROOT / "index.html").read_text(encoding="utf-8")
    css = (ROOT / "css" / "style.css").read_text(encoding="utf-8")
    js = (ROOT / "js" / "main.js").read_text(encoding="utf-8")

    html = html.replace('<link rel="stylesheet" href="css/style.css">', f"<style>\n{css}\n</style>")
    html = html.replace('<script src="js/main.js" defer></script>', "")
    html = re.sub(r'\s*<link rel="preload"[^>]*>', "", html)
    html = html.replace("</body>", f"<script>\n{js}\n</script>\n</body>")
    # dans Streamlit, la page est servie seule : on y intègre aussi les images
    return re.sub(r"(?:\.\./)?assets/([\w.-]+\.(?:png|jpg|svg))", data_uri, html)


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
      html, body, [data-testid="stApp"], [data-testid="stAppViewContainer"], [data-testid="stMain"] {
        overflow: hidden !important;
        background: #fef9f0;
      }
      [data-testid="stMainBlockContainer"], .block-container {
        padding: 0 !important;
        max-width: 100% !important;
      }
      [data-testid="stVerticalBlock"] { gap: 0 !important; }
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

components.html(build_site(), height=900, scrolling=True)
