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
            "qubit_state": "|0⟩",  # Player qubit state
            "waveform_stacks": 0,  # Resona's waveform stacks
            "next_turn_collapse_bonus": 0  # Resona's collapse bonus
        },
        "enemy": {
            "hp": 400,  # Singulon's HP
            "qubit_state": "|0⟩"  # Enemy qubit state for BIT-FLIP
        },
        "turn": "player",
        "log": [],
        "is_entangled": False,  # Track entanglement state
        "metal_noise_active": False,  # Track Metal Noise blocking
        "metal_noise_block_type": None  # Track what type of moves are blocked
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
        elif move == "GLITCH CLAW":
            result = quantum_move_neutrinette_glitch_claw(player_state, game_state["player"]["hp"], singulon_state.defense)
            if result.get("heal", 0) > 0:
                game_state["player"]["hp"] = min(90, game_state["player"]["hp"] + result["heal"])
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

    # 1. Character used <move>!
    log.append(f"{character} used {move}!")
    
    # Add specific move descriptions AFTER the "used" message
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
    
    # Add specific move messages (like HP cost) AFTER the "used" message
    # Note: Q-PHOTON GEYSER and GLITCH CLAW already have their messages added above
    # so we don't need to add them again here
    if move == "Q-PHOTON GEYSER" and "message" in result:
        log.append(result["message"])
    elif move == "GLITCH CLAW" and "message" in result:
        log.append(result["message"])
    elif move == "Q-METRONOME" and "message" in result:
        log.append(result["message"])
    elif move == "WAVE CRASH" and "message" in result:
        log.append(result["message"])
    elif move == "METAL NOISE" and "message" in result:
        log.append(result["message"])
    elif move == "SHIFT GEAR" and "message" in result:
        log.append(result["message"])
    
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
    
    # 2. Dealt <damage> damage! (only if damage > 0 and move doesn't already include damage in message)
    damage = result.get("damage", 0)
    if damage > 0 and move not in ["Q-PHOTON GEYSER", "GLITCH CLAW", "Q-METRONOME", "WAVE CRASH", "METAL NOISE"]:
        log.append(f"Dealt {damage} damage!")
    
    # QUANTUM AFTERBURN: Check if Neutrinette is attacking while entangled
    if character == "Neutrinette" and player_state.is_entangled and damage > 0:
        from characters.neutrinette.ability import ability_quantum_afterburn
        afterburn_result = ability_quantum_afterburn(player_state, damage, is_attacking=True)
        print(f"[DEBUG] QUANTUM AFTERBURN attacking: {afterburn_result}")
        if afterburn_result["extra_damage"] > 0:
            game_state["enemy"]["hp"] = max(0, game_state["enemy"]["hp"] - afterburn_result["extra_damage"])
            log.append(afterburn_result["message"])
            print(f"[DEBUG] Applied {afterburn_result['extra_damage']} extra damage to enemy")
    
    game_state["enemy"]["hp"] = max(0, game_state["enemy"]["hp"] - damage)  # Prevent negative HP

    # Update player's qubit state (if not already updated)
    if "qubit_state" in result and move != "DUALIZE" and move != "BIT-FLIP":
        player_state.qubit_state = result["qubit_state"]
        game_state["player"]["qubit_state"] = result["qubit_state"]
    
    # Update waveform stacks for Resona
    if character == "Resona" and "waveform_stacks" in result:
        player_state.waveform_stacks = result["waveform_stacks"]
        game_state["player"]["waveform_stacks"] = result["waveform_stacks"]
    
    # Update next turn collapse bonus for Resona
    if character == "Resona" and "next_turn_collapse_bonus" in result:
        player_state.next_turn_collapse_bonus = result["next_turn_collapse_bonus"]
        game_state["player"]["next_turn_collapse_bonus"] = result["next_turn_collapse_bonus"]
    
    # Update Metal Noise blocking status
    if character == "Resona" and move == "METAL NOISE" and "enemy_state_blocked" in result:
        game_state["metal_noise_active"] = True
        if "q_move_blocked" in result and result["q_move_blocked"]:
            game_state["metal_noise_block_type"] = "q_moves"
        else:
            game_state["metal_noise_block_type"] = "state_changes"

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
    
    # Check Metal Noise blocking
    if game_state.get("metal_noise_active", False):
        block_type = game_state.get("metal_noise_block_type")
        
        # Check if the move should be blocked
        should_block = False
        if block_type == "q_moves" and move_name in ["Q-PRISMATIC LASER"]:
            should_block = True
        elif block_type == "state_changes" and move_name in ["DUALIZE", "HAZE"]:
            should_block = True
        
        if should_block:
            # Block the move
            log.append(f"Singulon used {move_name}!")
            log.append("But it failed! (blocked by METAL NOISE)")
            
            # Reset Metal Noise status
            game_state["metal_noise_active"] = False
            game_state["metal_noise_block_type"] = None
            
            # Continue to player's turn
            game_state["turn"] = "player"
            return {
                "move_name": move_name,
                "damage": 0,
                "success": False,
                "blocked": True
            }
    
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
        
        # Add specific move descriptions for enemy AFTER the "used" message
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
        elif move_name == "BULLET MUONS":
            # Add specific message for BULLET MUONS if available
            if "message" in result:
                log.append(result["message"])
        elif move_name == "Q-PRISMATIC LASER":
            # Add specific message for Q-PRISMATIC LASER if available
            if "message" in result:
                log.append(result["message"])
        
        # 4. Dealt <damage> damage! (only if damage > 0 and move doesn't already include damage in message)
        if damage > 0 and move_name not in ["BULLET MUONS", "Q-PRISMATIC LASER"]:
            log.append(f"Dealt {damage} damage!")
        
        # QUANTUM AFTERBURN: Check if Neutrinette is entangled and apply recoil damage
        if character == "Neutrinette" and player_state.is_entangled and damage > 0:
            from characters.neutrinette.ability import ability_quantum_afterburn
            afterburn_result = ability_quantum_afterburn(player_state, damage, is_attacking=False)
            print(f"[DEBUG] QUANTUM AFTERBURN defending: {afterburn_result}")
            if afterburn_result["recoil_damage"] > 0:
                game_state["enemy"]["hp"] = max(0, game_state["enemy"]["hp"] - afterburn_result["recoil_damage"])
                log.append(afterburn_result["message"])
                print(f"[DEBUG] Applied {afterburn_result['recoil_damage']} recoil damage to enemy")
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