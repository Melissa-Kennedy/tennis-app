import requests
import json

def scrape_toronto_tennis_courts():
    """
    Scrapes tennis court information from Toronto.ca JSON API
    Returns: List of dictionaries containing Location, Winter play, Lights, Courts
    Filters out entries where Type is "Club"
    """
    primary_url = "https://www.toronto.ca/data/parks/live/tennislist.json"
    
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        response = requests.get(primary_url, headers=headers)
        response.raise_for_status()
        
        # Parse JSON data
        data = response.json()
        all_courts = data.get('all', [])
        
        courts_data = []
        clubs_filtered = 0
        
        print(f"Found {len(all_courts)} total entries")
        
        for entry in all_courts:
            # Check if Type is "Club" and skip if so
            court_type = (entry.get('Type') or '').strip()
            if court_type.lower() == 'club':
                clubs_filtered += 1
                continue
            
            # Extract required fields with safe None handling
            court_entry = {
                "Location": (entry.get('Name') or '').strip(),
                "Winter play": (entry.get('WinterPlay') or '').strip() or 'No', 
                "Lights": (entry.get('Lights') or '').strip(),
                "Courts": (entry.get('Courts') or '').strip()
            }
            
            # Only add if we have meaningful data
            if court_entry["Location"]:
                courts_data.append(court_entry)
        
        print(f"Filtered out {clubs_filtered} club entries")
        print(f"Found {len(courts_data)} public courts")
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

def display_summary(courts):
    """Display summary statistics"""
    if not courts:
        return
        
    winter_play_yes = sum(1 for court in courts if court.get('Winter play', '').lower() in ['yes', 'y'])
    lights_yes = sum(1 for court in courts if court.get('Lights', '').lower() in ['yes', 'y'])
    
    total_courts = 0
    for court in courts:
        try:
            courts_count = int(court.get('Courts', '0'))
            total_courts += courts_count
        except:
            pass
    
    print(f"\nSummary:")
    print(f"- Total locations: {len(courts)}")
    print(f"- Total courts: {total_courts}")
    print(f"- Locations with winter play: {winter_play_yes}")
    print(f"- Locations with lights: {lights_yes}")

if __name__ == "__main__":
    print("Fetching Toronto tennis courts from JSON API...")
    courts = scrape_toronto_tennis_courts()
    
    if courts:
        print(f"\nFirst 10 entries:")
        for i, court in enumerate(courts[:10]):
            print(f"{i+1:2d}. {court}")
        
        if len(courts) > 10:
            print(f"... and {len(courts) - 10} more entries")
        
        # Save to JSON file
        save_to_json(courts)
        
        # Display summary statistics
        display_summary(courts)
        
    else:
        print("No data found or error occurred")