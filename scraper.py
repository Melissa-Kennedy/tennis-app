import requests
from bs4 import BeautifulSoup
import json
import re

def scrape_toronto_tennis_courts():
    """
    Scrapes tennis court information from Toronto.ca
    Returns: List of dictionaries containing Location, Winter play, Lights, Courts
    Filters out entries where Type is "Club"
    """
    url = "https://www.toronto.ca/explore-enjoy/parks-recreation/places-spaces/parks-and-recreation-facilities/tennis-court-listings/"
    
    try:
        # Send GET request with headers to mimic a browser
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        
        # Parse HTML content
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Find the table with tennis court data
        table = soup.find('table')
        if not table:
            print("No table found on the page")
            return []
        
        courts_data = []
        
        # Find all table rows (skip header row)
        rows = table.find_all('tr')[1:]  # Skip header row
        
        for row in rows:
            cells = row.find_all(['td', 'th'])
            
            if len(cells) >= 8:  # Ensure we have enough columns
                # Extract data from cells
                location = cells[0].get_text(strip=True) if cells[0] else ""
                club_name = cells[1].get_text(strip=True) if cells[1] else ""
                public_hours = cells[2].get_text(strip=True) if cells[2] else ""
                winter_play = cells[3].get_text(strip=True) if cells[3] else ""
                map_link = cells[4].get_text(strip=True) if cells[4] else ""
                phone = cells[5].get_text(strip=True) if cells[5] else ""
                court_type = cells[6].get_text(strip=True) if cells[6] else ""
                lights = cells[7].get_text(strip=True) if cells[7] else ""
                courts = cells[8].get_text(strip=True) if len(cells) > 8 and cells[8] else ""
                
                # Filter out Club type entries
                if court_type.lower() == "club":
                    continue
                
                # Create dictionary entry
                court_entry = {
                    "Location": location,
                    "Winter play": winter_play,
                    "Lights": lights,
                    "Courts": courts
                }
                
                courts_data.append(court_entry)
        
        return courts_data
        
    except requests.RequestException as e:
        print(f"Error fetching the webpage: {e}")
        return []
    except Exception as e:
        print(f"Error parsing data: {e}")
        return []

def save_to_json(data, filename="toronto_tennis_courts.json"):
    """
    Save the scraped data to a JSON file
    """
    try:
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"Data saved to {filename}")
    except Exception as e:
        print(f"Error saving to JSON: {e}")

if __name__ == "__main__":
    print("Scraping Toronto tennis courts...")
    courts = scrape_toronto_tennis_courts()
    
    if courts:
        print(f"Found {len(courts)} tennis courts (excluding clubs)")
        print("\nFirst few entries:")
        for i, court in enumerate(courts[:3]):
            print(f"{i+1}. {court}")
        
        # Save to JSON file
        save_to_json(courts)
    else:
        print("No data found or error occurred")