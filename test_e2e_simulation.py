import os
import urllib.request
import json
from bs4 import BeautifulSoup

# Load OPENROUTER_API_KEY from ~/.hermes/.env if possible
api_key = ""
try:
    with open(os.path.expanduser("~/.hermes/.env"), "r") as f:
        for line in f:
            if line.startswith("OPENROUTER_API_KEY="):
                api_key = line.strip().split("=", 1)[1].strip('"\'')
except Exception as e:
    print("Could not load .env:", e)

print(f"Loaded API key status: {'Present (len=' + str(len(api_key)) + ')' if api_key else 'Missing'}")

# Test OmniRoute connection
if api_key:
    req = urllib.request.Request(
        "http://localhost:20128/v1/models",
        headers={"Authorization": f"Bearer {api_key}"}
    )
    try:
        with urllib.request.urlopen(req, timeout=5) as resp:
            print("OmniRoute /v1/models response status:", resp.status)
            data = json.loads(resp.read().decode('utf-8'))
            print("Models available:", len(data.get('data', [])))
    except Exception as e:
        print("OmniRoute test error:", e)

# Test scraping simulation for one source
print("\nTesting scraping simulation (Sports Abidjan):")
try:
    req = urllib.request.Request("https://sports.abidjan.net/", headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=10) as resp:
        soup = BeautifulSoup(resp.read().decode('utf-8'), 'html.parser')
        items = soup.select("a[href*='/actualites/']")
        print(f"Successfully scraped {len(items)} raw elements from Sports Abidjan.")
        if items:
            print(f"Sample: {items[0].get_text().strip()} -> {items[0].get('href')}")
except Exception as e:
    print("Scraping error:", e)
