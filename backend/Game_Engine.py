import random
import sys
import os

# Add the characters directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), 'characters'))

from characters.bitzy.quantum_move import (
    quantum_move_bitzy_q_thunder,
    quantum_move_bitzy_shock,
    quantum_move_bitzy_dualize,
    quantum_move_bitzy_bit_flip,
    BitzyQuantumState
)
from characters.bitzy.ability import ability_superhijack

#Store game data like hp, moves, turn, and also same for enemy 
game_state = {
    "player": None,
    "enemy": None,
    "turn": "player",
    "log": [],
    "character": None  # <- track the current character
}
bitzy_state = BitzyQuantumState()

def start_game(character="Bitzy"):
    global game_state

    # create player and enemy here based on character
    player = create_player(character)  # assumes you have this
    enemy = create_enemy()

    game_state["player"] = player
    game_state["enemy"] = enemy
    game_state["turn"] = "player"
    game_state["log"] = []
    game_state["character"] = character  # <-- track which one

    return {
        "message": f"Game started with {character}!",
        "state": game_state
    }

def process_move(move):
    global game_state, bitzy_state

    if game_state["turn"] != "player":
        return {"error": "It's not your turn."}

    if move not in game_state["player"]["moves"]:
        return {"error": f"Invalid move: {move}"}

    log = game_state["log"]

    # Process Bitzy's moves
    if move == "Q-THUNDER":
        result = quantum_move_bitzy_q_thunder(bitzy_state)
        if result["success"]:
            damage = result["damage"]
            game_state["enemy"]["hp"] -= damage
            log.append(f"Bitzy used Q-THUNDER: {result['message']}")
            log.append(f"Dealt {damage} damage!")
        else:
            log.append(f"Q-THUNDER failed: {result['message']}")
    
    elif move == "SHOCK":
        result = quantum_move_bitzy_shock(bitzy_state, game_state["enemy"]["qubit_state"])
        damage = result["damage"]
        game_state["enemy"]["hp"] -= damage
        log.append(f"Bitzy used SHOCK: {result['message']}")
        log.append(f"Dealt {damage} damage!")
    
    elif move == "DUALIZE":
        result = quantum_move_bitzy_dualize(bitzy_state)
        if result["success"]:
            log.append(f"Bitzy used DUALIZE: {result['message']}")
        else:
            log.append(f"DUALIZE failed: {result['message']}")
    
    elif move == "BIT-FLIP":
        result = quantum_move_bitzy_bit_flip(bitzy_state, game_state["enemy"]["qubit_state"])
        game_state["enemy"]["qubit_state"] = result["enemy_qubit_state"]
        log.append(f"Bitzy used BIT-FLIP: {result['message']}")

    # Check if enemy is dead
    if game_state["enemy"]["hp"] <= 0:
        log.append("Enemy fainted! You win!")
        return {"state": game_state}

    # Enemy's turn
    game_state["turn"] = "enemy"
    enemy_attack()

    return {"state": game_state}

def enemy_attack():
    global game_state
    log = game_state["log"]

    dmg = random.randint(8, 18)
    game_state["player"]["hp"] -= dmg
    log.append(f"Enemy attacks and deals {dmg} damage!")

    if game_state["player"]["hp"] <= 0:
        log.append("You fainted! Game over.")
    else:
        game_state["turn"] = "player"

def get_game_state():
    return game_state

import random
import sys
import os

# Add the characters directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), 'characters'))

from characters.bitzy.quantum_move import (
    quantum_move_bitzy_q_thunder,
    quantum_move_bitzy_shock,
    quantum_move_bitzy_dualize,
    quantum_move_bitzy_bit_flip,
    BitzyQuantumState
)
from characters.bitzy.ability import ability_superhijack
from characters.neutrinette.quantum_move import (
    quantum_move_neutrinette_q_photon_geyser,
    quantum_move_neutrinette_glitch_claw,
    quantum_move_neutrinette_entangle,
    quantum_move_neutrinette_switcheroo,
    NeutrinetteQuantumState
)
from characters.neutrinette.ability import ability_quantum_afterburn
from characters.resona.quantum_move import (
    quantum_move_resona_q_metronome,
    quantum_move_resona_wave_crash,
    quantum_move_resona_metal_noise,
    quantum_move_resona_shift_gear,
    ResonaQuantumState
)
from characters.resona.ability import ability_quantum_waveform
from characters.boss.SingulonStats import SingulonQuantumState
from characters.boss.Moves import (
    quantum_move_singulon_dualize,
    quantum_move_singulon_haze,
    quantum_move_singulon_bullet_muons,
    quantum_move_singulon_q_prismatic_laser
)

#Store game data like hp, moves, turn, and also same for enemy 
game_state = {}
bitzy_state = BitzyQuantumState()
neutrinette_state = NeutrinetteQuantumState()
resona_state = ResonaQuantumState()
singulon_state = SingulonQuantumState()

def start_game(character="Bitzy"):
    global game_state, bitzy_state, neutrinette_state, resona_state, singulon_state
    print(f"[ENGINE] start_game called with: {character}")
    # Set up character-specific data
    if character == "Bitzy":
        print(f"[DEBUG] Game engine start_game called with character: {character}")
        player_state = bitzy_state
        hp = 90
        moves = ["Q-THUNDER", "SHOCK", "DUALIZE", "BIT-FLIP"]
    elif character == "Neutrinette":
        print(f"[DEBUG] Game engine start_game called with character: {character}")
        player_state = neutrinette_state
        hp = 80
        moves = ["Q-PHOTON GEYSER", "GLITCH CLAW", "ENTANGLE", "SWITCHEROO"]
    elif character == "Resona":
        print(f"[DEBUG] Game engine start_game called with character: {character}")
        player_state = resona_state
        hp = 95
        moves = ["Q-METRONOME", "WAVE CRASH", "METAL NOISE", "SHIFT GEAR"]
    else:
        return {"error": f"Unknown character: {character}"}
    
    game_state = {
        "player": {
            "hp": hp,
            "moves": moves,
            "character": character
        },
        "enemy": {
            "hp": 400,  # Singulon's HP
            "qubit_state": "|0⟩"  # Enemy qubit state for BIT-FLIP
        },
        "turn": "player",
        "log": []
    }
    
    # Reset quantum states
    player_state.qubit_state = "|0⟩"
    singulon_state.qubit_state = "|0⟩"
    
    return {
        "message": f"Game started with {character}!",
        "state": game_state
    }

def process_move(move):
    global game_state, bitzy_state, neutrinette_state, resona_state, singulon_state

    if game_state["turn"] != "player":
        return {"error": "It's not your turn."}

    character = game_state["player"]["character"]
    
    if move not in game_state["player"]["moves"]:
        return {"error": f"Invalid move: {move}"}

    log = game_state["log"]

    # Process moves based on character
    if character == "Bitzy":
        player_state = bitzy_state
        if move == "Q-THUNDER":
            result = quantum_move_bitzy_q_thunder(player_state, singulon_state.defense)
        elif move == "SHOCK":
            result = quantum_move_bitzy_shock(player_state, game_state["enemy"]["qubit_state"], singulon_state.defense)
        elif move == "DUALIZE":
            result = quantum_move_bitzy_dualize(player_state)
        elif move == "BIT-FLIP":
            result = quantum_move_bitzy_bit_flip(player_state, game_state["enemy"]["qubit_state"])
            game_state["enemy"]["qubit_state"] = result["enemy_qubit_state"]
    
    elif character == "Neutrinette":
        player_state = neutrinette_state
        if move == "Q-PHOTON GEYSER":
            result = quantum_move_neutrinette_q_photon_geyser(player_state, game_state["player"]["hp"], game_state["enemy"]["hp"], player_state.is_entangled, singulon_state.defense)
            if result.get("enemy_hp_cost", 0) > 0:
                game_state["enemy"]["hp"] -= result["enemy_hp_cost"]
        elif move == "GLITCH CLAW":
            result = quantum_move_neutrinette_glitch_claw(player_state, game_state["player"]["hp"], singulon_state.defense)
            if result.get("heal", 0) > 0:
                game_state["player"]["hp"] = min(80, game_state["player"]["hp"] + result["heal"])
        elif move == "ENTANGLE":
            result = quantum_move_neutrinette_entangle(player_state, game_state["enemy"]["qubit_state"])
        elif move == "SWITCHEROO":
            result = quantum_move_neutrinette_switcheroo(player_state, game_state["enemy"]["qubit_state"])
            game_state["enemy"]["qubit_state"] = result["enemy_qubit_state"]
    
    elif character == "Resona":
        player_state = resona_state
        if move == "Q-METRONOME":
            result = quantum_move_resona_q_metronome(player_state, game_state["player"]["hp"], game_state["enemy"]["qubit_state"], singulon_state.defense)
        elif move == "WAVE CRASH":
            result = quantum_move_resona_wave_crash(player_state, game_state["enemy"]["qubit_state"], singulon_state.defense)
        elif move == "METAL NOISE":
            result = quantum_move_resona_metal_noise(player_state, game_state["enemy"]["qubit_state"], singulon_state.defense)
        elif move == "SHIFT GEAR":
            result = quantum_move_resona_shift_gear(player_state)

    # Apply damage if move was successful
    if result.get("success", True):
        damage = result.get("damage", 0)
        game_state["enemy"]["hp"] -= damage
        log.append(f"{character} used {move}: {result['message']}")
        if damage > 0:
            log.append(f"Dealt {damage} damage!")
    else:
        log.append(f"{move} failed: {result['message']}")

    # Check if enemy is dead
    if game_state["enemy"]["hp"] <= 0:
        log.append("Singulon fainted! You win!")
        return {"state": game_state}

    # Enemy's turn
    game_state["turn"] = "enemy"
    enemy_attack()

    return {"state": game_state}

def enemy_attack():
    global game_state, singulon_state, bitzy_state, neutrinette_state, resona_state
    log = game_state["log"]

    # Get current player state based on character
    character = game_state["player"]["character"]
    if character == "Bitzy":
        player_state = bitzy_state
    elif character == "Neutrinette":
        player_state = neutrinette_state
    elif character == "Resona":
        player_state = resona_state

    # Singulon boss moves
    boss_moves = [
        ("DUALIZE", quantum_move_singulon_dualize),
        ("HAZE", quantum_move_singulon_haze),
        ("BULLET MUONS", quantum_move_singulon_bullet_muons),
        ("Q-PRISMATIC LASER", quantum_move_singulon_q_prismatic_laser)
    ]
    
    move_name, move_func = random.choice(boss_moves)
    
    # Execute the move with player defense
    if move_name == "Q-PRISMATIC LASER":
        result = move_func(singulon_state, player_state.qubit_state, player_state.defense)
    elif move_name == "BULLET MUONS":
        result = move_func(singulon_state, player_state.defense)
    else:
        result = move_func(singulon_state)
    
    # Update Singulon's qubit state
    if "qubit_state" in result:
        singulon_state.qubit_state = result["qubit_state"]
        game_state["enemy"]["qubit_state"] = result["qubit_state"]
    
    # Apply damage to player
    if result.get("success", True):
        damage = result.get("damage", 0)
        game_state["player"]["hp"] -= damage
        
        log.append(f"Singulon used {move_name}: {result['message']}")
        if damage > 0:
            log.append(f"Dealt {damage} damage!")
    else:
        log.append(f"Singulon used {move_name}: {result['message']}")

    if game_state["player"]["hp"] <= 0:
        log.append("You fainted! Game over.")
    else:
        game_state["turn"] = "player"

def get_game_state():
    return game_state