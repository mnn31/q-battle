import requests
import json

# Start game with Bitzy
def start_bitzy_game():
    response = requests.get("http://localhost:5000/start", params={"character": "bitzy"})
    return response.json()

# Start game with Neutrinette
def start_neutrinette_game():
    response = requests.get("http://localhost:5000/start", params={"character": "neutrinette"})
    return response.json()

def test_character_moves(character_name):
    print(f"-> Entered test_character_moves for {character_name}")

    """Test individual moves for any character"""
    print(f"\n=== TESTING {character_name.upper()} INDIVIDUAL MOVES ===\n")
    
    base_url = f"http://127.0.0.1:5000/api/{character_name}"
    
    # Test each move (adjust based on character)
    if character_name == "bitzy":
        moves = [
            ("Q-THUNDER", "q-thunder"),
            ("SHOCK", "shock"),
            ("DUALIZE", "dualize"),
            ("BIT-FLIP", "bit-flip"),
            ("SUPERHIJACK", "superhijack"),
            ("State", "state")
        ]
    elif character_name == "neutrinette":
        moves = [
            ("Q-PHOTON GEYSER", "q-photon-geyser"),
            ("GLITCH CLAW", "glitch-claw"),
            ("ENTANGLE", "entangle"),
            ("SWITCHEROO", "switcheroo"),
            ("QUANTUM AFTERBURN", "quantum-afterburn"),
            ("STATE", "state")
        ]
    else:
        moves = [
            ("Quantum Move", ""),
            ("State", "state")
        ]

    
    for move_name, endpoint in moves:
        print(f"Testing {move_name}...")
        try:
            if character_name == "neutrinette" and endpoint == "q-photon-geyser":
                params = {"current_hp": 80, "enemy_hp": 100, "is_entangled": "false"}
                response = requests.get(f"{base_url}/{endpoint}", params=params)
            elif character_name == "neutrinette" and endpoint == "quantum-afterburn":
                params = {"enemy_qubit_state": "|1⟩"}
                response = requests.get(f"{base_url}/{endpoint}", params=params)
            else:
                if endpoint:
                    response = requests.get(f"{base_url}/{endpoint}")
                else:
                    response = requests.get(f"{base_url}")
            result = response.json()
            print(f"   Result: {result}")
        except requests.RequestException as e:
            print(f"   Error: {e}")
        print()


def test_game_integration(character_name="bitzy"):
    """Test the integrated game with any character's quantum moves"""
    base_url = "http://127.0.0.1:5000"
    
    print(f"=== TESTING INTEGRATED GAME WITH {character_name.upper()} ===\n")
    
    # Start a new game
    print("1. Starting new game...")
    response = requests.get(f"{base_url}/start")
    game_data = response.json()
    print(f"   Message: {game_data['message']}")
    print(f"   Player HP: {game_data['state']['player']['hp']}")
    print(f"   Enemy HP: {game_data['state']['enemy']['hp']}")
    print(f"   Available moves: {game_data['state']['player']['moves']}\n")
    
    # Test moves based on character
    if character_name == "bitzy":
        # Test Bitzy's moves
        moves_to_test = ["DUALIZE", "Q-THUNDER", "SHOCK", "BIT-FLIP"]
        
        for i, move in enumerate(moves_to_test, 2):
            print(f"{i}. Using {move}...")
            response = requests.post(f"{base_url}/move", 
                                   json={"move": move})
            result = response.json()
            
            if "log" in result and result["log"]:
                print(f"   Log: {result['state']['log'][-1]}")
            
            if "enemy" in result.get("state", {}) and "hp" in result["state"]["enemy"]:
                print(f"   Enemy HP: {result['state']['enemy']['hp']}")
            
            if move == "BIT-FLIP" and "enemy" in result.get("state", {}):
                print(f"   Enemy qubit state: {result['state']['enemy']['qubit_state']}")
            
            print()
    
    # Check final state
    print(f"{len(moves_to_test) + 2}. Final game state...")
    response = requests.get(f"{base_url}/state")
    final_state = response.json()
    print(f"   Player HP: {final_state['player']['hp']}")
    print(f"   Enemy HP: {final_state['enemy']['hp']}")
    print(f"   Turn: {final_state['turn']}")
    print(f"   Game log: {final_state['log']}")


def test_neutrinette_moves():
    print("\n=== TESTING NEUTRINETTE INDIVIDUAL MOVES ===\n")
    
    base_url = "http://127.0.0.1:5000/api/neutrinette"
    
    moves = [
        ("Q-PHOTON GEYSER", "q-photon-geyser"),
        ("GLITCH CLAW", "glitch-claw"),
        ("ENTANGLE", "entangle"),
        ("SWITCHEROO", "switcheroo"),
        ("QUANTUM AFTERBURN", "quantum-afterburn"),
        ("STATE", "state")
    ]
    
    for move_name, endpoint in moves:
        print(f"Testing {move_name}...")
        try:
            if endpoint == "q-photon-geyser":
                # Example: pass query params like current_hp, enemy_hp, is_entangled if needed
                params = {"current_hp": 80, "enemy_hp": 100, "is_entangled": "false"}
                response = requests.get(f"{base_url}/{endpoint}", params=params)
            elif endpoint == "quantum-afterburn":
                # Example: pass enemy_qubit_state if needed
                params = {"enemy_qubit_state": "|1⟩"}
                response = requests.get(f"{base_url}/{endpoint}", params=params)
            else:
                response = requests.get(f"{base_url}/{endpoint}")
            
            result = response.json()
            print(f"   Result: {result}")
        except requests.RequestException as e:
            print(f"   Error: {e}")
        print()

def test_neutrinette_integration():
    print("=== TESTING NEUTRINETTE INTEGRATED GAME ===")
    base_url = "http://127.0.0.1:5000"

    # Start game with Neutrinette explicitly
    response = requests.get(f"{base_url}/start", params={"character": "neutrinette"})
    data = response.json()
    print(f"Message: {data.get('message')}\n")

    moves_to_test = ["entangle", "q-photon-geyser", "glitch-claw", "switcheroo", "quantum-afterburn"]

    for move in moves_to_test:
        print(f"Using {move}...")
        response = requests.post(f"{base_url}/move", json={"move": move})
        result = response.json()
        print(f"Result: {result}\n")

    response = requests.get(f"{base_url}/state")
    state = response.json()
    print(f"Final State: {state}")



def test_all_characters():
    """Test all available characters"""
    print("=== TESTING ALL QUANTUMONS ===\n")

    
    characters = ["bitzy", "neutrinette"]
    
    for character in characters:
        print(f"\n--- Starting tests for: {character} ---")
        print(f"\n{'='*50}")
        print(f"TESTING {character.upper()}")
        print(f"{'='*50}")
        
        # Run individual moves for the character
        test_character_moves(character)
        
        # Run appropriate integration test
        if character == "bitzy":
            test_game_integration(character)
        elif character == "neutrinette":
            test_neutrinette_integration()



if __name__ == "__main__":
    try:
        # Test all characters
        test_all_characters()
        
        # Or test specific character
        test_character_moves("bitzy")
        test_game_integration("bitzy")
        test_character_moves("neutrinette")
        test_game_integration("neutrinette")
        
    except requests.exceptions.ConnectionError:
        print("ERROR: Flask app is not running!")
        print("Please start the Flask app first:")
        print("1. Activate conda environment: conda activate qbattle310")
        print("2. Start Flask: python app.py")
        print("3. Then run this test script")
    except Exception as e:
        print(f"ERROR: {e}")
