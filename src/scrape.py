import requests
from bs4 import BeautifulSoup
import json

URL = "https://www.toronto.ca/explore-enjoy/parks-recreation/places-spaces/parks-and-recreation-facilities/tennis-court-listings/"
HEADERS = {"User-Agent": "Mozilla/5.0"}

def fetch_courts():
    resp = requests.get(URL, headers=HEADERS)
    resp.raise_for_status()
    soup = BeautifulSoup(resp.text, "html.parser")

    courts = []
    for row in soup.select("table tbody tr"):
        print("****")
        print(f"row {row}")
        cells = row.select("td")
        print(f"cells {cells}")
        if not cells:
            continue

        # Build row dict by reading data-info
        data = {}
        for td in cells:
            key = td.get("data-info")
            if not key:
                continue
            data[key.lower()] = td.get_text(strip=True)

        # Skip if missing type or it's a club
        _type = data.get("type", "").strip().lower()
        if not _type or _type == "club":
            continue

        courts.append(data)

    # Convert to desired JSON structure
    output = []
    for idx, court in enumerate(courts, start=1):
        item = {
            "id": idx,
            "location": court.get("location", ""),
            "phone": court.get("0tel", court.get("phone", "")),
            "lights": court.get("lights", "").lower() in ("yes", "true", "y", "1"),
            "courts": int(court.get("courts", "0")),
        }
        output.append(item)
    return output

def main():
    results = fetch_courts()
    print(json.dumps(results, indent=2))

if __name__ == "__main__":
    main()
