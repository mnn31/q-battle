import requests

def test_bitzy():
    try:
        response = requests.get("http://127.0.0.1:5000/api/bitzy")
        response.raise_for_status()
        result = response.json()
        print("Bitzy’s quantum move result:", result)
    except requests.RequestException as e:
        print("Error contacting Bitzy API:", e)

if __name__ == "__main__":
    test_bitzy() 