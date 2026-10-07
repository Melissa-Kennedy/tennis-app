import requests
import json

def debug_toronto_tennis_api():
    """Debug the Toronto tennis courts JSON API to understand the data structure"""
    primary_url = "https://www.toronto.ca/data/parks/live/tennislist.json"
    
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        response = requests.get(primary_url, headers=headers)
        response.raise_for_status()
        
        # Get raw response text first
        print("Raw response text:")
        print(response.text[:500])
        print("\n" + "="*50 + "\n")
        
        # Try to parse as JSON
        data = response.json()
        print(f"Data type: {type(data)}")
        print(f"Data length/content: {len(data) if hasattr(data, '__len__') else 'No length'}")
        
        if isinstance(data, list):
            print("Data is a list")
            if data:
                print(f"First item type: {type(data[0])}")
                print(f"First item: {data[0]}")
        elif isinstance(data, dict):
            print("Data is a dictionary")
            print(f"Keys: {list(data.keys())}")
        else:
            print(f"Data is: {data}")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    debug_toronto_tennis_api()