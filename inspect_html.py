import urllib.request
from bs4 import BeautifulSoup

def inspect_site(url, name):
    print(f"=== Inspecting {name} ({url}) ===")
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            soup = BeautifulSoup(resp.read().decode('utf-8'), 'html.parser')
            # Print title tags / headings / class names containing 'title' or 'article' or 'news'
            print("Headings:")
            for h in soup.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'div'], limit=30):
                a = h.find('a') if h.name != 'a' else h
                if a and a.get('href') and len(a.get_text().strip()) > 15:
                    print(f"  [{h.name}] class={h.get('class')} -> Text: {a.get_text().strip()[:60]} | Href: {a.get('href')}")
    except Exception as e:
        print("Error:", e)

inspect_site("https://sports.abidjan.net/", "Sports Abidjan")
print("\n" + "="*50 + "\n")
inspect_site("https://sportnewsafrica.com/", "Sport News Africa")
