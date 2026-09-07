import urllib.request
from bs4 import BeautifulSoup

req = urllib.request.Request("https://sportnewsafrica.com/", headers={"User-Agent": "Mozilla/5.0"})
with urllib.request.urlopen(req) as resp:
    soup = BeautifulSoup(resp.read().decode('utf-8'), 'html.parser')
    for a in soup.find_all('a', href=True):
        href = a['href']
        text = a.get_text().strip()
        if ('/article' in href or '/actualite' in href or '/football' in href or '/basket' in href) and len(text) > 10:
            print(f"{text[:60]} -> {href}")
