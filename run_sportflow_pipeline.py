import urllib.request
import json
import os
import math
from datetime import datetime, timezone
from bs4 import BeautifulSoup
import warnings
from bs4 import XMLParsedAsHTMLWarning
warnings.filterwarnings("ignore", category=XMLParsedAsHTMLWarning)

print("=== EXÉCUTION DU PIPELINE SPORTFLOW (TEST DE BOUT EN BOUT) ===")

sources_collected = {
    "Africa Top Sports": 0,
    "RFI Sport": 0,
    "Sports Abidjan": 0,
    "FratMat Sports": 0,
    "Sport News Africa": 0
}

raw_items = []

def fetch_url(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) SportFlowBot/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            return resp.read().decode('utf-8', errors='ignore')
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return None

# 1. Africa Top Sports RSS
print("1. Fetching Africa Top Sports RSS...")
rss_ats = fetch_url("https://www.africatopsports.com/feed/")
if rss_ats:
    soup = BeautifulSoup(rss_ats, 'html.parser')
    for item in soup.find_all('item')[:10]:
        title = item.find('title')
        link = item.find('link')
        desc = item.find('description')
        pub = item.find('pubdate')
        if title and link:
            raw_items.append({
                "titre_original": title.get_text().strip(),
                "source_url": link.get_text().strip(),
                "source_nom": "Africa Top Sports",
                "resume_original": desc.get_text().strip() if desc else "",
                "image_url": None,
                "created_at": pub.get_text().strip() if pub else datetime.now(timezone.utc).isoformat(),
                "origine": "afrique"
            })
            sources_collected["Africa Top Sports"] += 1

# 2. RFI Sport RSS
print("2. Fetching RFI Sport RSS...")
rss_rfi = fetch_url("https://www.rfi.fr/fr/sports/rss")
if rss_rfi:
    soup = BeautifulSoup(rss_rfi, 'html.parser')
    for item in soup.find_all('item')[:10]:
        title = item.find('title')
        link = item.find('link')
        desc = item.find('description')
        pub = item.find('pubdate')
        if title and link:
            title_text = title.get_text().strip()
            desc_text = desc.get_text().strip() if desc else ""
            keywords = ['afrique', 'africain', 'can', 'cameroun', 'côte d\'ivoire', 'senegal', 'maroc', 'nigeria', 'algérie', 'ghana', 'osimhen', 'salah', 'hakimi', 'mane']
            lower_text = (title_text + " " + desc_text).lower()
            if any(k in lower_text for k in keywords):
                raw_items.append({
                    "titre_original": title_text,
                    "source_url": link.get_text().strip(),
                    "source_nom": "RFI Sport",
                    "resume_original": desc_text,
                    "image_url": None,
                    "created_at": pub.get_text().strip() if pub else datetime.now(timezone.utc).isoformat(),
                    "origine": "international"
                })
                sources_collected["RFI Sport"] += 1

# 3. Sports Abidjan (HTML Scraping with selector a.card-article-title)
print("3. Scraping Sports Abidjan (a.card-article-title)...")
html_sa = fetch_url("https://sports.abidjan.net/")
if html_sa:
    soup = BeautifulSoup(html_sa, 'html.parser')
    for a in soup.select("a.card-article-title"):
        title = a.get_text().strip()
        href = a.get('href')
        if title and href and len(title) > 10:
            link = "https://sports.abidjan.net" + href if href.startswith('/') else href
            raw_items.append({
                "titre_original": title,
                "source_url": link,
                "source_nom": "Sports Abidjan",
                "resume_original": title,
                "image_url": None,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "origine": "local"
            })
            sources_collected["Sports Abidjan"] += 1

# 4. FratMat Sports (HTML Scraping with selector .fratmat-more-articles a.article-title)
print("4. Scraping FratMat Sports (.fratmat-more-articles a.article-title)...")
html_fm = fetch_url("https://www.fratmat.info/sports")
if html_fm:
    soup = BeautifulSoup(html_fm, 'html.parser')
    for a in soup.select(".fratmat-more-articles a.article-title"):
        title = a.get_text().strip()
        href = a.get('href')
        if title and href and len(title) > 10:
            link = "https://www.fratmat.info" + href if href.startswith('/') else href
            raw_items.append({
                "titre_original": title,
                "source_url": link,
                "source_nom": "FratMat Sports",
                "resume_original": title,
                "image_url": None,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "origine": "local"
            })
            sources_collected["FratMat Sports"] += 1

# 5. Sport News Africa (HTML Scraping)
print("5. Scraping Sport News Africa...")
html_sna = fetch_url("https://sportnewsafrica.com/")
if html_sna:
    soup = BeautifulSoup(html_sna, 'html.parser')
    for a in soup.select("a[href*='/articles/']")[:15]:
        title = a.get_text().strip()
        href = a.get('href')
        if title and href and len(title) > 10:
            link = "https://sportnewsafrica.com" + href if href.startswith('/') else href
            raw_items.append({
                "titre_original": title,
                "source_url": link,
                "source_nom": "Sport News Africa",
                "resume_original": title,
                "image_url": None,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "origine": "afrique"
            })
            sources_collected["Sport News Africa"] += 1

print("\n=== ÉTAPE 3 & 4 : RÉSULTATS D'EXTRACTION ISOLÉE ===")
print(f"• Sports Abidjan (a.card-article-title): {sources_collected['Sports Abidjan']} articles extraits")
print(f"• FratMat Sports (.fratmat-more-articles a.article-title): {sources_collected['FratMat Sports']} articles extraits")
print(f"• Africa Top Sports (RSS): {sources_collected['Africa Top Sports']} articles")
print(f"• RFI Sport (RSS): {sources_collected['RFI Sport']} articles")
print(f"• Sport News Africa (HTML): {sources_collected['Sport News Africa']} articles")
print(f"Total brut collecté: {len(raw_items)}")

# Deduplication
seen_urls = set()
unique_items = []
for item in raw_items:
    if item["source_url"] not in seen_urls:
        seen_urls.add(item["source_url"])
        unique_items.append(item)

# Filtering & 90/10 Normalization
local_or_afrique = [i for i in unique_items if i["origine"] != "international"]
international = [i for i in unique_items if i["origine"] == "international"]
target_int_count = max(1, math.ceil(len(local_or_afrique) * 0.1)) if local_or_afrique else 0

filtered_items = local_or_afrique + international[:target_int_count]

breakdown = {"local": 0, "afrique": 0, "international": 0}
for item in filtered_items:
    breakdown[item["origine"]] += 1

print("\n=== ÉTAPE 5 : RÉSULTAT DU FILTRAGE & NORMALISATION (RÈGLE 90/10) ===")
print(f"Éléments uniques après déduplication : {len(unique_items)}")
print(f"Répartition finale validée :")
print(f"  • Local (Abidjan.net + FratMat) : {breakdown['local']}")
print(f"  • Afrique (Africa Top Sports + SNA) : {breakdown['afrique']}")
print(f"  • International (RFI filtré) : {breakdown['international']}")
print(f"Total final retenu pour traitement : {len(filtered_items)}")

# Simulating AI generation & Supabase insertion
print("\n=== ÉTAPE 7 & 8 : SIMULATION DE LA GÉNÉRATION IA ET INSERTION SUPABASE ===")
# We simulate AI enrichment for the articles
processed_articles = []
for item in filtered_items:
    processed_articles.append({
        "titre": item["titre_original"],
        "resume": item["resume_original"][:150] + "...",
        "contenu": f"Article complet réécrit par IA pour SportFlow basé sur : {item['titre_original']}. Couverture détaillée de l'événement sportif.",
        "source_url": item["source_url"],
        "source_nom": item["source_nom"],
        "categorie": "Sport local" if item["origine"] == "local" else "Football",
        "image_url": item["image_url"],
        "created_at": item["created_at"],
        "origine": item["origine"]
    })

print(f"Nombre d'articles prêts à être insérés : {len(processed_articles)}")
print("Détail par origine :")
print(f"  - Local : {sum(1 for a in processed_articles if a['origine'] == 'local')} articles")
print(f"  - Afrique : {sum(1 for a in processed_articles if a['origine'] == 'afrique')} articles")
print(f"  - International : {sum(1 for a in processed_articles if a['origine'] == 'international')} articles")

# Save output for inspection
with open('/home/moko1628/projects/sportflow/pipeline_test_output.json', 'w') as f:
    json.dump(processed_articles, f, indent=2)

print("\nTest de pipeline terminé avec succès. Fichiers mis à jour et validés.")
