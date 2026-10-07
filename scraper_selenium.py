import time
import json
import re
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options

def scrape_toronto_tennis_courts_selenium():
    """
    Scrapes tennis court information from Toronto.ca using Selenium
    Returns: List of dictionaries containing Location, Winter play, Lights, Courts
    Filters out entries where Type is "Club"
    """
    url = "https://www.toronto.ca/explore-enjoy/parks-recreation/places-spaces/parks-and-recreation-facilities/tennis-court-listings/"
    
    # Set up Chrome options
    chrome_options = Options()
    chrome_options.add_argument("--headless")  # Run in background
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    
    courts_data = []
    
    try:
        # Initialize the driver
        driver = webdriver.Chrome(options=chrome_options)
        driver.get(url)
        
        # Wait for the table to load
        wait = WebDriverWait(driver, 20)
        table = wait.until(EC.presence_of_element_located((By.TAG_NAME, "table")))
        
        # Wait a bit more for dynamic content
        time.sleep(3)
        
        # Find all table rows
        rows = driver.find_elements(By.CSS_SELECTOR, "table tbody tr")
        
        for row in rows:
            try:
                cells = row.find_elements(By.TAG_NAME, "td")
                
                if len(cells) >= 8:
                    # Extract data based on column positions
                    location = cells[0].text.strip()
                    club_name = cells[1].text.strip()
                    public_hours = cells[2].text.strip()
                    winter_play = cells[3].text.strip()
                    map_link = cells[4].text.strip()
                    phone = cells[5].text.strip()
                    court_type = cells[6].text.strip()
                    lights = cells[7].text.strip()
                    courts = cells[8].text.strip() if len(cells) > 8 else ""
                    
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
                    
            except Exception as e:
                print(f"Error processing row: {e}")
                continue
        
        driver.quit()
        return courts_data
        
    except Exception as e:
        print(f"Error with Selenium scraper: {e}")
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
    print("Scraping Toronto tennis courts with Selenium...")
    courts = scrape_toronto_tennis_courts_selenium()
    
    if courts:
        print(f"Found {len(courts)} tennis courts (excluding clubs)")
        print("\nFirst few entries:")
        for i, court in enumerate(courts[:3]):
            print(f"{i+1}. {court}")
        
        # Save to JSON file
        save_to_json(courts)
    else:
        print("No data found or error occurred")