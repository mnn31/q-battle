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
from characters.higscrozma.quantum_move import (
    quantum_move_higscrozma_q_void_rift,
    quantum_move_higscrozma_prismatic_laser,
    quantum_move_higscrozma_shadow_force,
    quantum_move_higscrozma_barrier,
    HigscrozmaQuantumState
)
from characters.higscrozma.ability import ability_quantum_bulwark
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
higscrozma_state = HigscrozmaQuantumState()
singulon_state = SingulonQuantumState()

def start_game(character="Bitzy"):
    global game_state, bitzy_state, neutrinette_state, resona_state, higscrozma_state, singulon_state
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
        hp = 90  # Fixed to match character info
        moves = ["Q-PHOTON GEYSER", "GLITCH CLAW", "ENTANGLE", "SWITCHEROO"]
    elif character == "Resona":
        print(f"[DEBUG] Game engine start_game called with character: {character}")
        player_state = resona_state
        hp = 95
        moves = ["Q-METRONOME", "WAVE CRASH", "METAL NOISE", "SHIFT GEAR"]
    elif character == "Higscrozma":
        print(f"[DEBUG] Game engine start_game called with character: {character}")
        player_state = higscrozma_state
        hp = 100
        moves = ["Q-VOID RIFT", "PRISMATIC LASER", "SHADOW FORCE", "BARRIER"]
    else:
        return {"error": f"Unknown character: {character}"}
    
    game_state = {
        "player": {
            "hp": hp,
            "moves": moves,
            "character": character,
            "qubit_state": "|0⟩"  # Player qubit state
        },
        "enemy": {
            "hp": 400,  # Singulon's HP
            "qubit_state": "|0⟩"  # Enemy qubit state for BIT-FLIP
        },
        "turn": "player",
        "log": [],
        "is_entangled": False  # Track entanglement state
    }
    
    # Reset quantum states
    player_state.qubit_state = "|0⟩"
    singulon_state.qubit_state = "|0⟩"
    
    # Reset entanglement state
    if hasattr(player_state, 'is_entangled'):
        player_state.is_entangled = False
    
    return {
        "message": f"Game started with {character}!",
        "state": game_state
    }

def process_move(move):
    global game_state, bitzy_state, neutrinette_state, resona_state, singulon_state

    if game_state["turn"] != "player":
        return {"error": "It's not your turn."}

    character = game_state["player"]["character"]
    valid_moves = game_state["player"]["moves"]
    print(f"[DEBUG] process_move: Received move: '{move}' for character: {character}")
    print(f"[DEBUG] process_move: Valid moves: {valid_moves}")
    
    if move not in valid_moves:
        print(f"[DEBUG] process_move: Move '{move}' is not in valid moves!")
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
            singulon_state.qubit_state = result["enemy_qubit_state"]  # Also update the quantum state object
    
    elif character == "Neutrinette":
        player_state = neutrinette_state
        if move == "Q-PHOTON GEYSER":
            result = quantum_move_neutrinette_q_photon_geyser(player_state, game_state["player"]["hp"], game_state["enemy"]["hp"], player_state.is_entangled, singulon_state.defense)
            if result.get("enemy_hp_cost", 0) > 0:
                game_state["enemy"]["hp"] -= result["enemy_hp_cost"]
            # Add the specific message from the quantum move
            if "message" in result:
                log.append(result["message"])
        elif move == "GLITCH CLAW":
            result = quantum_move_neutrinette_glitch_claw(player_state, game_state["player"]["hp"], singulon_state.defense)
            if result.get("heal", 0) > 0:
                game_state["player"]["hp"] = min(90, game_state["player"]["hp"] + result["heal"])
            # Add the specific message from the quantum move
            if "message" in result:
                log.append(result["message"])
        elif move == "ENTANGLE":
            result = quantum_move_neutrinette_entangle(player_state, game_state["enemy"]["qubit_state"])
        elif move == "SWITCHEROO":
            result = quantum_move_neutrinette_switcheroo(player_state, game_state["enemy"]["qubit_state"])
            game_state["enemy"]["qubit_state"] = result["enemy_qubit_state"]
            if "is_entangled" in result:
                game_state["is_entangled"] = result["is_entangled"]
    
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
    
    elif character == "Higscrozma":
        player_state = higscrozma_state
        if move == "Q-VOID RIFT":
            result = quantum_move_higscrozma_q_void_rift(player_state, game_state["player"]["hp"], 100, singulon_state.defense)
        elif move == "PRISMATIC LASER":
            result = quantum_move_higscrozma_prismatic_laser(player_state, singulon_state.defense)
        elif move == "SHADOW FORCE":
            result = quantum_move_higscrozma_shadow_force(player_state, singulon_state.defense)
        elif move == "BARRIER":
            result = quantum_move_higscrozma_barrier(player_state)

    # 1. Bitzy used <move>!
    log.append(f"{character} used {move}!")
    
    # Add specific move descriptions
    if move == "DUALIZE":
        log.append(f"{character} put its qubit into superposition!")
        # Update qubit state immediately for real-time display
        if "qubit_state" in result:
            player_state.qubit_state = result["qubit_state"]
            game_state["player"]["qubit_state"] = result["qubit_state"]
    elif move == "BIT-FLIP":
        new_state = result.get("enemy_qubit_state", game_state["enemy"]["qubit_state"])
        log.append(f"{character} flipped Singulon's qubit to {new_state}!")
        # Update enemy qubit state immediately for real-time display
        if "enemy_qubit_state" in result:
            game_state["enemy"]["qubit_state"] = result["enemy_qubit_state"]
            singulon_state.qubit_state = result["enemy_qubit_state"]
    elif move == "ENTANGLE":
        log.append(f"{character} creates quantum entanglement!")
        # Update entanglement state
        if "is_entangled" in result:
            player_state.is_entangled = result["is_entangled"]
            game_state["is_entangled"] = result["is_entangled"]
    elif move == "SWITCHEROO":
        log.append(f"{character} swaps qubit states!")
        # Update enemy qubit state immediately for real-time display
        if "enemy_qubit_state" in result:
            game_state["enemy"]["qubit_state"] = result["enemy_qubit_state"]
            singulon_state.qubit_state = result["enemy_qubit_state"]
    
    # Check if move failed
    if not result.get("success", True):
        log.append("But it failed!")
        # Update qubit states even for failed moves
        if "qubit_state" in result and move != "BIT-FLIP":
            player_state.qubit_state = result["qubit_state"]
            game_state["player"]["qubit_state"] = result["qubit_state"]
        if "enemy_qubit_state" in result:
            game_state["enemy"]["qubit_state"] = result["enemy_qubit_state"]
        
        # Check if enemy is dead (even if move failed)
        if game_state["enemy"]["hp"] <= 0:
            log.append("Singulon fainted! You win!")
            log.append(f"Your qubit is {game_state['player']['qubit_state']}.")
            log.append(f"Singulon's qubit is {game_state['enemy']['qubit_state']}.")
            return {"state": game_state}
        
        # Enemy's turn even if player move failed
        game_state["turn"] = "enemy"
        enemy_move_info = enemy_attack()
        
        # 5. Your qubit is <state>.
        log.append(f"Your qubit is {game_state['player']['qubit_state']}.")
        # 6. Singulon's qubit is <state>.
        log.append(f"Singulon's qubit is {game_state['enemy']['qubit_state']}.")
        
        return {"state": game_state, "enemy_move": enemy_move_info}
    
    # 2. Dealt <damage> damage! (only if damage > 0)
    damage = result.get("damage", 0)
    if damage > 0:
        log.append(f"Dealt {damage} damage!")
    game_state["enemy"]["hp"] = max(0, game_state["enemy"]["hp"] - damage)  # Prevent negative HP

    # Update player's qubit state (if not already updated)
    if "qubit_state" in result and move != "DUALIZE" and move != "BIT-FLIP":
        player_state.qubit_state = result["qubit_state"]
        game_state["player"]["qubit_state"] = result["qubit_state"]

    # Update enemy's qubit state if changed (if not already updated)
    if "enemy_qubit_state" in result and move != "BIT-FLIP":
        game_state["enemy"]["qubit_state"] = result["enemy_qubit_state"]

    # Check if enemy is dead
    if game_state["enemy"]["hp"] <= 0:
        log.append("Singulon fainted! You win!")
        # Add qubit state summary
        log.append(f"Your qubit is {game_state['player']['qubit_state']}.")
        log.append(f"Singulon's qubit is {game_state['enemy']['qubit_state']}.")
        return {"state": game_state}

    # Enemy's turn
    game_state["turn"] = "enemy"
    enemy_move_info = enemy_attack()

    # 5. Your qubit is <state>.
    log.append(f"Your qubit is {game_state['player']['qubit_state']}.")
    # 6. Singulon's qubit is <state>.
    log.append(f"Singulon's qubit is {game_state['enemy']['qubit_state']}.")

    return {"state": game_state, "enemy_move": enemy_move_info}

def enemy_attack():
    global game_state, singulon_state, bitzy_state, neutrinette_state, resona_state, higscrozma_state
    log = game_state["log"]

    # Get current player state based on character
    character = game_state["player"]["character"]
    if character == "Bitzy":
        player_state = bitzy_state
    elif character == "Neutrinette":
        player_state = neutrinette_state
    elif character == "Resona":
        player_state = resona_state
    elif character == "Higscrozma":
        player_state = higscrozma_state

    # Singulon boss moves ONLY - no random character selection
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
    
    # Update player's qubit state if changed
    if "player_qubit_state" in result:
        player_state.qubit_state = result["player_qubit_state"]
        game_state["player"]["qubit_state"] = result["player_qubit_state"]
    
    # Apply damage to player
    if result.get("success", True):
        damage = result.get("damage", 0)
        game_state["player"]["hp"] = max(0, game_state["player"]["hp"] - damage)  # Prevent negative HP
        
        # 3. Singulon used <move>!
        log.append(f"Singulon used {move_name}!")
        
        # Add specific move descriptions for enemy
        if move_name == "DUALIZE":
            log.append("Singulon put its qubit into superposition!")
            # Update qubit state immediately for real-time display
            if "qubit_state" in result:
                singulon_state.qubit_state = result["qubit_state"]
                game_state["enemy"]["qubit_state"] = result["qubit_state"]
        elif move_name == "HAZE":
            log.append("Singulon reset its qubit to |0⟩!")
            # Update qubit state immediately for real-time display
            if "qubit_state" in result:
                singulon_state.qubit_state = result["qubit_state"]
                game_state["enemy"]["qubit_state"] = result["qubit_state"]
        
        # 4. Dealt <damage> damage! (only if damage > 0)
        if damage > 0:
            log.append(f"Dealt {damage} damage!")
            
            # QUANTUM AFTERBURN: Check if Neutrinette is entangled and apply recoil damage
            if character == "Neutrinette" and player_state.is_entangled:
                from .characters.neutrinette.ability import ability_quantum_afterburn
                afterburn_result = ability_quantum_afterburn(player_state, damage)
                if afterburn_result["recoil_damage"] > 0:
                    game_state["enemy"]["hp"] = max(0, game_state["enemy"]["hp"] - afterburn_result["recoil_damage"])
                    log.append(afterburn_result["message"])
    else:
        # 3. Singulon used <move>!
        log.append(f"Singulon used {move_name}!")
        # But it failed!
        log.append("But it failed!")
        # No damage message for failed moves

    if game_state["player"]["hp"] <= 0:
        log.append("You fainted! Game over.")
    else:
        game_state["turn"] = "player"

    # Return enemy move information
    return {
        "move_name": move_name,
        "damage": result.get("damage", 0),
        "success": result.get("success", True)
    }

def get_game_state():
    return game_state