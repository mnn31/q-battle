import requests

def test_cnot():
    try:
        response = requests.get("http://127.0.0.1:5000/api/cnot")
        response.raise_for_status()
        result = response.json()
        print("CNOT quantum move result:", result)
    except requests.RequestException as e:
        print("Error contacting CNOT API:", e)

if __name__ == "__main__":
    test_cnot() 