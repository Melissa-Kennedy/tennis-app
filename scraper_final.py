import requests
import json

def scrape_toronto_tennis_courts():
    """
    Scrapes tennis court information from Toronto.ca JSON API
    Returns: List of dictionaries containing Location, Winter play, Lights, Courts
    Filters out entries where Type is "Club"
    """
    # Primary JSON data source
    primary_url = "https://www.toronto.ca/data/parks/live/tennislist.json"
    backup_url = "https://www.toronto.ca/data/parks/live/tennislist_backup.json"
    
    try:
        # Try primary URL first
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        try:
            response = requests.get(primary_url, headers=headers)
            response.raise_for_status()
            print("Successfully fetched from primary URL")
        except:
            print("Primary URL failed, trying backup...")
            response = requests.get(backup_url, headers=headers)
            response.raise_for_status()
            print("Successfully fetched from backup URL")
        
        # Parse JSON data
        data = response.json()
        courts_data = []
        
        print(f"Found {len(data)} total entries")
        
        for entry in data:
            # Check if Type is "Club" and skip if so
            court_type = entry.get('type', '').strip()
            if court_type.lower() == 'club':
                continue
            
            # Extract required fields
            court_entry = {
                "Location": entry.get('location', '').strip(),
                "Winter play": entry.get('winterplay', '').strip(), 
                "Lights": entry.get('lights', '').strip(),
                "Courts": entry.get('courts', '').strip()
            }
            
            # Only add if we have meaningful data
            if court_entry["Location"]:
                courts_data.append(court_entry)
        
        print(f"Filtered to {len(courts_data)} public courts (excluded clubs)")
        return courts_data
        
    except requests.RequestException as e:
        print(f"Error fetching data: {e}")
        return []
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON: {e}")
        return []
    except Exception as e:
        print(f"Unexpected error: {e}")
        return []

def save_to_json(data, filename="toronto_tennis_courts.json"):
    """Save the scraped data to a JSON file"""
    try:
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"Data saved to {filename}")
    except Exception as e:
        print(f"Error saving to JSON: {e}")

if __name__ == "__main__":
    print("Fetching Toronto tennis courts from JSON API...")
    courts = scrape_toronto_tennis_courts()
    
    if courts:
        print(f"\nFound {len(courts)} tennis courts (excluding clubs)")
        print("\nFirst 5 entries:")
        for i, court in enumerate(courts[:5]):
            print(f"{i+1}. {court}")
        
        if len(courts) > 5:
            print(f"... and {len(courts) - 5} more entries")
        
        # Save to JSON file
        save_to_json(courts)
        
        # Display summary statistics
        winter_play_yes = sum(1 for court in courts if court.get('Winter play', '').lower() in ['yes', 'y'])
        lights_yes = sum(1 for court in courts if court.get('Lights', '').lower() in ['yes', 'y'])
        
        print(f"\nSummary:")
        print(f"- Courts with winter play: {winter_play_yes}")
        print(f"- Courts with lights: {lights_yes}")
        
    else:
        print("No data found or error occurred")