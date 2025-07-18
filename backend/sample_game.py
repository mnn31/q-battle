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

class SampleGame:
    def __init__(self):
        self.player_state = None
        self.boss_state = None
        self.boss_name = None
        self.boss_character = None  # Track which character the boss is using
        self.turn = 1
        self.battle_log = []
        
        # Randomly determine if facing Singulon or a character
        if random.random() < 0.5:
            # 50% chance to face Singulon
            self.boss_state = SingulonQuantumState()
            self.boss_state.hp = 400
            self.boss_name = "Singulon"
            self.boss_character = "Singulon"
        else:
            # 50% chance to face a random character
            characters = ["Bitzy", "Neutrinette", "Resona"]
            self.boss_character = random.choice(characters)
            
            if self.boss_character == "Bitzy":
                self.boss_state = BitzyQuantumState()
                self.boss_state.hp = 110  # Character HP
                self.boss_name = "Bitzy"
            elif self.boss_character == "Neutrinette":
                self.boss_state = NeutrinetteQuantumState()
                self.boss_state.hp = 100  # Character HP
                self.boss_name = "Neutrinette"
            elif self.boss_character == "Resona":
                self.boss_state = ResonaQuantumState()
                self.boss_state.hp = 115  # Character HP
                self.boss_name = "Resona"
        
    def select_character(self):
        """Let user select their character"""
        print("Pick your character (Bitzy, Neutrinette, Resona): ")
        choice = input().strip().lower()
        
        if choice == "bitzy":
            self.player_state = BitzyQuantumState()
            self.player_hp = 100  # Increased by 10
            self.character_name = "Bitzy"
            self.ability_name = "QUANTUM HIJACK"
            self.ability_desc = "Deals +10 damage when using Q-Thunder or Shock if enemy qubit is |1⟩"
            self.moves = [
                ("Q-THUNDER", "Deals 90 damage if in superposition, fails otherwise"),
                ("SHOCK", "Deals 30 damage + 20 if different states"),
                ("DUALIZE", "Creates superposition if not already"),
                ("BIT-FLIP", "Flips enemy qubit state")
            ]
            self.move_functions = [
                quantum_move_bitzy_q_thunder,
                quantum_move_bitzy_shock,
                quantum_move_bitzy_dualize,
                quantum_move_bitzy_bit_flip
            ]
            
        elif choice == "neutrinette":
            self.player_state = NeutrinetteQuantumState()
            self.player_hp = 90  # Increased by 10
            self.character_name = "Neutrinette"
            self.ability_name = "QUANTUM AFTERBURN"
            self.ability_desc = "Deals +10 damage if qubits are entangled"
            self.moves = [
                ("Q-PHOTON GEYSER", "Deals 75 damage, costs 25% HP, enemy loses HP if entangled"),
                ("GLITCH CLAW", "Deals 40 damage, 30% chance to heal 20% max HP"),
                ("ENTANGLE", "Creates entanglement between qubits"),
                ("SWITCHEROO", "Swaps qubit states with enemy")
            ]
            self.move_functions = [
                quantum_move_neutrinette_q_photon_geyser,
                quantum_move_neutrinette_glitch_claw,
                quantum_move_neutrinette_entangle,
                quantum_move_neutrinette_switcheroo
            ]
            
        elif choice == "resona":
            self.player_state = ResonaQuantumState()
            self.player_hp = 105  # Increased by 10
            self.character_name = "Resona"
            self.ability_name = "QUANTUM WAVEFORM"
            self.ability_desc = "Gains waveform stacks on collapse, increases Q-METRONOME damage"
            self.moves = [
                ("Q-METRONOME", "Deals 95 damage if |1⟩, 10 damage if |0⟩, scales with stacks"),
                ("WAVE CRASH", "Deals 20 damage + 40 if superposition, gains stack"),
                ("METAL NOISE", "Blocks enemy state changes, deals 20 damage if enemy |0⟩"),
                ("SHIFT GEAR", "Creates superposition, +25% collapse to |1⟩ next turn")
            ]
            self.move_functions = [
                quantum_move_resona_q_metronome,
                quantum_move_resona_wave_crash,
                quantum_move_resona_metal_noise,
                quantum_move_resona_shift_gear
            ]
            
        else:
            print("Invalid character! Please choose Bitzy, Neutrinette, or Resona.")
            return False
            
        return True
    
    def display_battle_start(self):
        """Display battle introduction"""
        if self.boss_character == "Singulon":
            print(f"\nYou are fighting {self.boss_name}!")
        else:
            print(f"\nYou are fighting {self.boss_name} (controlled by AI)!")
        print("\n" + "="*50)
    
    def display_turn(self):
        """Display current turn information"""
        print(f"\n----Turn {self.turn}----")
        print(f"Your HP: {self.player_hp}")
        print(f"Your Stats - ATK: {self.player_state.attack_stat}, DEF: {self.player_state.defense}, SPD: {self.player_state.speed}")
        print(f"{self.boss_name}'s HP: {self.boss_state.hp}")
        print(f"{self.boss_name}'s Stats - ATK: {self.boss_state.attack_stat}, DEF: {self.boss_state.defense}, SPD: {self.boss_state.speed}")
    
    def get_player_move(self):
        """Get player's move choice"""
        print(f"\nYour move choices are:")
        
        if self.character_name == "Bitzy":
            print("1. Q-THUNDER")
            print("   Bitzy's Q-Move. If the qubit is in a state of SUPERPOSITION, this move deals massive damage and collapses the qubit randomly. Else, fails. (DMG: 90)")
            print("2. SHOCK")
            print("   Deals damage. Additional damage is dealt if the qubit and the enemy's qubit are in different states. (DMG: 30 + 20)")
            print("3. DUALIZE")
            print("   Puts the qubit in a state of SUPERPOSITION if it wasn't previously.")
            print("4. BIT-FLIP")
            print("   Flips the state of the enemy's qubit.")
            print("\nAbility: QUANTUM HIJACK")
            print("Bitzy deals an additional 10 damage when using Q-Thunder or Shock if the enemy's qubit is in the state of 1.")
        elif self.character_name == "Neutrinette":
            print("1. Q-PHOTON GEYSER")
            print("   Neutrinette's Q-Move. Loses 25% current HP if the qubit is in a state of either 0 or 1, but deals massive damage and collapses the qubit randomly. (DMG: 75)")
            print("2. GLITCH CLAW")
            print("   Deals damage and has a chance of healing the user for 20% max HP. (DMG: 40)")
            print("3. ENTANGLE")
            print("   Puts the qubit and the enemy's qubit in a state of ENTANGLEMENT with each other if it wasn't previously.")
            print("4. SWITCHEROO")
            print("   Swaps the states of the qubit and the enemy's qubit.")
            print("\nAbility: QUANTUM AFTERBURN")
            print("After using a move, Neutrinette will deal an additional 10 damage if the qubit and the enemy's qubit are ENTANGLED.")
        elif self.character_name == "Resona":
            print("1. Q-METRONOME")
            print("   Resona's Q-Move. Collapses the qubit. If it is in a state of 1, deals 100% of max HP as damage. If it is in a state of 0, deal base damage. (DMG: 10)")
            print("2. WAVE CRASH")
            print("   Deals damage and deals additional damage if the qubit and/or the enemy's qubit is in a state of SUPERPOSITION. Collapses the qubit. (DMG: 20 + 40)")
            print("3. METAL NOISE")
            print("   Prevents the enemy from using moves that change their qubit state for the next turn. If the enemy's qubit is in a state of 1, they may not use a Q-Move. If it is in a state of 0, deal damage. (DMG: 20)")
            print("4. SHIFT GEAR")
            print("   Puts the qubit in a state of SUPERPOSITION. For the next turn, increase the probability of the qubit collapsing to 1 by 25%.")
            print("\nAbility: QUANTUM WAVEFORM")
            print("Every time Resona collapses the qubit, it gains one Waveform stack. A Waveform stack increases the probability of collapsing to a 1 by an additional 2% and increases the damage of Q-Metronome by 1.")
        
        print(f"\nYour Qubit: {self.player_state.qubit_state}")
        print(f"{self.boss_name}'s Qubit: {self.boss_state.qubit_state}")
        
        while True:
            try:
                choice = int(input("\nSelect one to perform (1-4): "))
                if 1 <= choice <= 4:
                    return choice
                else:
                    print("Please enter a number between 1 and 4.")
            except ValueError:
                print("Please enter a valid number.")
    
    def execute_player_move(self, move_choice):
        """Execute the player's chosen move"""
        # Map choice to move name and function
        if self.character_name == "Bitzy":
            moves = [
                ("Q-THUNDER", quantum_move_bitzy_q_thunder),
                ("SHOCK", quantum_move_bitzy_shock),
                ("DUALIZE", quantum_move_bitzy_dualize),
                ("BIT-FLIP", quantum_move_bitzy_bit_flip)
            ]
        elif self.character_name == "Neutrinette":
            moves = [
                ("Q-PHOTON GEYSER", quantum_move_neutrinette_q_photon_geyser),
                ("GLITCH CLAW", quantum_move_neutrinette_glitch_claw),
                ("ENTANGLE", quantum_move_neutrinette_entangle),
                ("SWITCHEROO", quantum_move_neutrinette_switcheroo)
            ]
        elif self.character_name == "Resona":
            moves = [
                ("Q-METRONOME", quantum_move_resona_q_metronome),
                ("WAVE CRASH", quantum_move_resona_wave_crash),
                ("METAL NOISE", quantum_move_resona_metal_noise),
                ("SHIFT GEAR", quantum_move_resona_shift_gear)
            ]
        
        move_name, move_func = moves[move_choice - 1]  # Convert 1-4 to 0-3 index
        
        print(f"\n___Turn START___")
        
        # Execute move based on character
        if self.character_name == "Bitzy":
            if move_name == "Q-THUNDER":
                result = move_func(self.player_state, self.boss_state.defense, self.boss_state.qubit_state)
            elif move_name == "SHOCK":
                result = move_func(self.player_state, self.boss_state.qubit_state, self.boss_state.defense)
            elif move_name == "DUALIZE":
                result = move_func(self.player_state)
            elif move_name == "BIT-FLIP":
                result = move_func(self.player_state, self.boss_state.qubit_state)
                self.boss_state.qubit_state = result["enemy_qubit_state"]
                # Specify whose qubit is changed
                result["message"] = result["message"].replace("enemy qubit", f"{self.boss_name}'s qubit")
        elif self.character_name == "Neutrinette":
            if move_name == "Q-PHOTON GEYSER":
                result = move_func(self.player_state, self.player_hp, self.boss_state.hp, self.player_state.is_entangled, self.boss_state.defense)
                if result.get("enemy_hp_cost", 0) > 0:
                    self.boss_state.hp -= result["enemy_hp_cost"]
            elif move_name == "GLITCH CLAW":
                result = move_func(self.player_state, self.player_hp, self.boss_state.defense)
                if result.get("heal", 0) > 0:
                    self.player_hp = min(90, self.player_hp + result["heal"])  # Updated max HP
            elif move_name == "ENTANGLE":
                result = move_func(self.player_state, self.boss_state.qubit_state)
            elif move_name == "SWITCHEROO":
                result = move_func(self.player_state, self.boss_state.qubit_state)
                self.boss_state.qubit_state = result["enemy_qubit_state"]
                # Specify whose qubit is changed
                result["message"] = result["message"].replace("enemy qubit", f"{self.boss_name}'s qubit")
        elif self.character_name == "Resona":
            if move_name == "Q-METRONOME":
                result = move_func(self.player_state, self.player_hp, self.boss_state.qubit_state, self.boss_state.defense)
            elif move_name == "WAVE CRASH":
                result = move_func(self.player_state, self.boss_state.qubit_state, self.boss_state.defense)
            elif move_name == "METAL NOISE":
                result = move_func(self.player_state, self.boss_state.qubit_state, self.boss_state.defense)
            elif move_name == "SHIFT GEAR":
                result = move_func(self.player_state)
        # Apply damage
        if result.get("success", True):
            damage = result.get("damage", 0)
            
            # Ability bonuses are now handled within the move functions themselves
            pass
            
            self.boss_state.hp -= damage
            
            # Handle HP costs
            if result.get("hp_cost", 0) > 0:
                self.player_hp -= result["hp_cost"]
            
            print(f"You used {move_name}: {result['message']}")
            if damage > 0:
                print(f"Dealt {damage} damage!")
            if result.get("hp_cost", 0) > 0:
                print(f"Lost {result['hp_cost']} HP!")
        else:
            print(f"You used {move_name}: {result['message']}")
        
                # Clamp HP to 0 for display
        player_hp_display = max(0, self.player_hp)
        boss_hp_display = max(0, self.boss_state.hp)
        print(f"\nYour HP: {player_hp_display}")
        print(f"{self.boss_name}'s HP: {boss_hp_display}")
        
        # Check Neutrinette's end-of-turn ability
        if self.character_name == "Neutrinette" and self.player_state.is_entangled:
            from characters.neutrinette.ability import ability_quantum_afterburn
            ability_result = ability_quantum_afterburn(self.player_state, self.boss_state.qubit_state)
            if ability_result["bonus_damage"] > 0:
                self.boss_state.hp -= ability_result["bonus_damage"]
                print(f"{ability_result['message']}")
                print(f"Dealt {ability_result['bonus_damage']} bonus damage!")
                # Update display after bonus damage
                boss_hp_display = max(0, self.boss_state.hp)
                print(f"{self.boss_name}'s HP: {boss_hp_display}")
    
    def execute_boss_move(self):
        """Execute boss move - either Singulon or random character move"""
        if self.boss_character == "Singulon":
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
                result = move_func(self.boss_state, self.player_state.qubit_state, self.player_state.defense)
            elif move_name == "BULLET MUONS":
                result = move_func(self.boss_state, self.player_state.defense)
            else:
                result = move_func(self.boss_state)
            
            # Specify whose qubit is changed in log
            if move_name == "DUALIZE":
                result["message"] = result["message"].replace("creates superposition!", f"{self.boss_name}'s qubit is now in superposition!")
            if move_name == "HAZE":
                result["message"] = result["message"].replace("resets qubit to |0⟩!", f"{self.boss_name}'s qubit is now |0⟩!")
        else:
            # Character moves - random selection from their move set
            if self.boss_character == "Bitzy":
                boss_moves = [
                    ("Q-THUNDER", quantum_move_bitzy_q_thunder),
                    ("SHOCK", quantum_move_bitzy_shock),
                    ("DUALIZE", quantum_move_bitzy_dualize),
                    ("BIT-FLIP", quantum_move_bitzy_bit_flip)
                ]
            elif self.boss_character == "Neutrinette":
                boss_moves = [
                    ("Q-PHOTON GEYSER", quantum_move_neutrinette_q_photon_geyser),
                    ("GLITCH CLAW", quantum_move_neutrinette_glitch_claw),
                    ("ENTANGLE", quantum_move_neutrinette_entangle),
                    ("SWITCHEROO", quantum_move_neutrinette_switcheroo)
                ]
            elif self.boss_character == "Resona":
                boss_moves = [
                    ("Q-METRONOME", quantum_move_resona_q_metronome),
                    ("WAVE CRASH", quantum_move_resona_wave_crash),
                    ("METAL NOISE", quantum_move_resona_metal_noise),
                    ("SHIFT GEAR", quantum_move_resona_shift_gear)
                ]
            
            move_name, move_func = random.choice(boss_moves)
            
            # Execute character move with appropriate parameters
            if self.boss_character == "Bitzy":
                if move_name == "Q-THUNDER":
                    result = move_func(self.boss_state, self.player_state.defense, self.player_state.qubit_state)
                elif move_name == "SHOCK":
                    result = move_func(self.boss_state, self.player_state.qubit_state, self.player_state.defense)
                elif move_name == "DUALIZE":
                    result = move_func(self.boss_state)
                elif move_name == "BIT-FLIP":
                    result = move_func(self.boss_state, self.player_state.qubit_state)
                    self.player_state.qubit_state = result["enemy_qubit_state"]
                    result["message"] = result["message"].replace("enemy qubit", "your qubit")
            elif self.boss_character == "Neutrinette":
                if move_name == "Q-PHOTON GEYSER":
                    result = move_func(self.boss_state, self.boss_state.hp, self.player_hp, self.boss_state.is_entangled, self.player_state.defense)
                    if result.get("enemy_hp_cost", 0) > 0:
                        self.player_hp -= result["enemy_hp_cost"]
                elif move_name == "GLITCH CLAW":
                    result = move_func(self.boss_state, self.boss_state.hp, self.player_state.defense)
                    if result.get("heal", 0) > 0:
                        self.boss_state.hp = min(self.boss_state.hp + result["heal"], 100)  # Heal boss
                elif move_name == "ENTANGLE":
                    result = move_func(self.boss_state, self.player_state.qubit_state)
                elif move_name == "SWITCHEROO":
                    result = move_func(self.boss_state, self.player_state.qubit_state)
                    self.player_state.qubit_state = result["enemy_qubit_state"]
                    result["message"] = result["message"].replace("enemy qubit", "your qubit")
            elif self.boss_character == "Resona":
                if move_name == "Q-METRONOME":
                    result = move_func(self.boss_state, self.boss_state.hp, self.player_state.qubit_state, self.player_state.defense)
                elif move_name == "WAVE CRASH":
                    result = move_func(self.boss_state, self.player_state.qubit_state, self.player_state.defense)
                elif move_name == "METAL NOISE":
                    result = move_func(self.boss_state, self.player_state.qubit_state, self.player_state.defense)
                elif move_name == "SHIFT GEAR":
                    result = move_func(self.boss_state)
        
        # Apply damage to player
        if result.get("success", True):
            damage = result.get("damage", 0)
            self.player_hp -= damage
            
            print(f"{self.boss_name} used {move_name}: {result['message']}")
            if damage > 0:
                print(f"Dealt {damage} damage!")
        else:
            print(f"{self.boss_name} used {move_name}: {result['message']}")
        
        # Clamp HP to 0 for display
        player_hp_display = max(0, self.player_hp)
        boss_hp_display = max(0, self.boss_state.hp)
        print(f"\nYour HP: {player_hp_display}")
        print(f"{self.boss_name}'s HP: {boss_hp_display}")
    
    def check_battle_end(self):
        """Check if battle has ended"""
        if self.player_hp <= 0:
            print(f"\nYou fainted! {self.boss_name} wins!")
            return True
        elif self.boss_state.hp <= 0:
            print(f"\n{self.boss_name} fainted! You win!")
            return True
        return False
    
    def run_battle(self):
        """Main battle loop"""
        while True:
            self.display_turn()
            move_choice = self.get_player_move()
            
            # Determine turn order based on speed
            if self.player_state.speed >= self.boss_state.speed:
                # Player goes first
                self.execute_player_move(move_choice)
                if self.check_battle_end():
                    break
                self.execute_boss_move()
                if self.check_battle_end():
                    break
            else:
                # Boss goes first
                self.execute_boss_move()
                if self.check_battle_end():
                    break
                self.execute_player_move(move_choice)
                if self.check_battle_end():
                    break
            
            self.turn += 1

def main():
    """Main game function"""
    print("Welcome to Q-Battle Sample Game!")
    print("="*50)
    
    game = SampleGame()
    
    while not game.select_character():
        pass
    
    game.display_battle_start()
    game.run_battle()

if __name__ == "__main__":
    main() 