import urllib.request
from bs4 import BeautifulSoup

urls = {
    "Sports Abidjan": "https://sports.abidjan.net/",
    "FratMat Sports": "https://www.fratmat.info/sports",
    "Sport News Africa": "https://sportnewsafrica.com/"
}

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

for name, url in urls.items():
    print(f"\n--- Testing {name} ({url}) ---")
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as response:
            html = response.read().decode('utf-8')
            soup = BeautifulSoup(html, 'html.parser')
            
            # Let's try multiple common selectors
            selectors = [
                "h3 a", "h2 a", ".article-title a", ".entry-title a", 
                "article a", ".post-title a", "h4 a", ".card-title a"
            ]
            
            found = False
            for sel in selectors:
                elements = soup.select(sel)
                # Filter elements that have text and href
                valid = [e for e in elements if e.get('href') and e.get_text().strip()]
                if len(valid) > 0:
                    print(f"Selector '{sel}': found {len(valid)} items.")
                    for e in valid[:3]:
                        print(f"  - {e.get_text().strip()[:60]} -> {e.get('href')}")
                    found = True
                    break
            if not found:
                print("No standard selectors matched. Dumping some sample links:")
                links = [a for a in soup.find_all('a', href=True) if len(a.get_text().strip()) > 10]
                for a in links[:5]:
                    print(f"  - {a.get_text().strip()[:60]} -> {a.get('href')}")
    except Exception as e:
        print(f"Error fetching {name}: {e}")
