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
game_state = {}
bitzy_state = BitzyQuantumState()

def start_game():
    global game_state, bitzy_state
    game_state = {
        "player": {
            "hp": 90,  # Bitzy's HP
            "moves": ["Q-THUNDER", "SHOCK", "DUALIZE", "BIT-FLIP"],
            "character": "Bitzy"
        },
        "enemy": {
            "hp": 100,
            "qubit_state": "|0⟩"  # Enemy qubit state for BIT-FLIP
        },
        "turn": "player",
        "log": []
    }
    # Reset Bitzy's quantum state
    bitzy_state.qubit_state = "|0⟩"
    return {
        "message": "Game started with Bitzy!",
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
=======
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

#Store game data like hp, moves, turn, and also same for enemy 
game_state = {}
bitzy_state = BitzyQuantumState()
neutrinette_state = NeutrinetteQuantumState()
resona_state = ResonaQuantumState()

def start_game():
    global game_state, bitzy_state
    game_state = {
        "player": {
            "hp": 90,  # Bitzy's HP
            "moves": ["Q-THUNDER", "SHOCK", "DUALIZE", "BIT-FLIP"],
            "character": "Bitzy"
        },
        "enemy": {
            "hp": 100,
            "qubit_state": "|0⟩"  # Enemy qubit state for BIT-FLIP
        },
        "turn": "player",
        "log": []
    }
    # Reset Bitzy's quantum state
    bitzy_state.qubit_state = "|0⟩"
    return {
        "message": "Game started with Bitzy!",
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