import requests

def test_character_move(character_name):
    try:
        response = requests.get(f"http://127.0.0.1:5000/api/{character_name}")
        response.raise_for_status()
        result = response.json()
        print(f"{character_name.capitalize()}’s quantum move result:", result)
    except requests.RequestException as e:
        print(f"Error contacting {character_name} API:", e)

if __name__ == "__main__":
    test_character_move("bitzy")
    test_character_move("hadamard")
    test_character_move("cnot")
