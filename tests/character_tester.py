import requests
import json

def test_character_moves(character_name):
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
    else:
        # Generic moves for other characters (to be expanded)
        moves = [
            ("Quantum Move", ""),
            ("State", "state")
        ]
    
    for move_name, endpoint in moves:
        print(f"Testing {move_name}...")
        try:
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

def test_all_characters():
    """Test all available characters"""
    print("=== TESTING ALL QUANTUMONS ===\n")
    
    # List of characters to test
    characters = ["bitzy"]  # Add more characters here as we build them
    
    for character in characters:
        print(f"\n{'='*50}")
        print(f"TESTING {character.upper()}")
        print(f"{'='*50}")
        
        # Test individual moves
        test_character_moves(character)
        
        # Test integrated game
        test_game_integration(character)

if __name__ == "__main__":
    try:
        # Test all characters
        test_all_characters()
        
        # Or test specific character
        # test_character_moves("bitzy")
        # test_game_integration("bitzy")
        
    except requests.exceptions.ConnectionError:
        print("ERROR: Flask app is not running!")
        print("Please start the Flask app first:")
        print("1. Activate conda environment: conda activate qbattle310")
        print("2. Start Flask: python app.py")
        print("3. Then run this test script")
    except Exception as e:
        print(f"ERROR: {e}")
