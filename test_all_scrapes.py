import urllib.request
from bs4 import BeautifulSoup

def test_scrape(name, url, selector):
    print(f"\n--- Testing {name} ({url}) with selector '{selector}' ---")
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=10) as resp:
            soup = BeautifulSoup(resp.read().decode('utf-8'), 'html.parser')
            items = []
            for el in soup.select(selector):
                text = el.get_text().strip()
                href = el.get('href')
                if text and href and len(text) > 10:
                    items.append((text, href))
            print(f"Extracted {len(items)} items:")
            for t, h in items[:3]:
                print(f"  • {t[:60]} -> {h}")
            return len(items)
    except Exception as e:
        print(f"Error: {e}")
        return 0

test_scrape("Sports Abidjan", "https://sports.abidjan.net/", "a[href*='/actualites/']")
test_scrape("FratMat Sports", "https://www.fratmat.info/sports", "h2 a, .article-title a, a[href*='/article/']")
test_scrape("Sport News Africa", "https://sportnewsafrica.com/", "a[href*='/articles/']")
