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
        self.boss_state = SingulonQuantumState()
        self.boss_state.hp = 400  # Set boss HP
        self.boss_name = "Singulon"
        self.turn = 1
        self.battle_log = []
        
    def select_character(self):
        """Let user select their character"""
        print("Pick your character (Bitzy, Neutrinette, Resona): ")
        choice = input().strip().lower()
        
        if choice == "bitzy":
            self.player_state = BitzyQuantumState()
            self.player_hp = 90
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
            self.player_hp = 80
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
            self.player_hp = 95
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
        print(f"\nYou are fighting {self.boss_name}!")
        print(f"\nYour ability is {self.ability_name}, which does {self.ability_desc}")
        print("\n" + "="*50)
    
    def display_turn(self):
        """Display current turn information"""
        print(f"\n----Turn {self.turn}----")
        print(f"Your HP: {self.player_hp}")
        print(f"Boss's HP: {self.boss_state.hp}")
        print(f"\nYour move choices are:")
        
        for i, (move_name, move_desc) in enumerate(self.moves, 1):
            print(f"{i}. {move_name} - {move_desc}")
        
        print(f"\nYour Qubit: {self.player_state.qubit_state}")
        print(f"Boss's Qubit: {self.boss_state.qubit_state}")  # For testing
        print("\nSelect one to perform (1-4): ")
    
    def get_player_move(self):
        """Get and validate player move choice"""
        while True:
            try:
                choice = int(input()) - 1
                if 0 <= choice <= 3:
                    return choice
                else:
                    print("Please enter a number between 1 and 4.")
            except ValueError:
                print("Please enter a valid number.")
    
    def execute_player_move(self, move_index):
        """Execute player's chosen move"""
        move_name, move_desc = self.moves[move_index]
        move_func = self.move_functions[move_index]
        
        print(f"\n___Turn START___")
        
        # Execute move based on character
        if self.character_name == "Bitzy":
            if move_name == "Q-THUNDER":
                result = move_func(self.player_state)
            elif move_name == "SHOCK":
                result = move_func(self.player_state, self.boss_state.qubit_state)
            elif move_name == "DUALIZE":
                result = move_func(self.player_state)
            elif move_name == "BIT-FLIP":
                result = move_func(self.player_state, self.boss_state.qubit_state)
                self.boss_state.qubit_state = result["enemy_qubit_state"]
                # Specify whose qubit is changed
                result["message"] = result["message"].replace("enemy qubit", "Singulon's qubit")
        elif self.character_name == "Neutrinette":
            if move_name == "Q-PHOTON GEYSER":
                result = move_func(self.player_state, self.player_hp, self.boss_state.hp, self.player_state.is_entangled)
                if result.get("enemy_hp_cost", 0) > 0:
                    self.boss_state.hp -= result["enemy_hp_cost"]
            elif move_name == "GLITCH CLAW":
                result = move_func(self.player_state, self.player_hp)
                if result.get("heal", 0) > 0:
                    self.player_hp = min(80, self.player_hp + result["heal"])
            elif move_name == "ENTANGLE":
                result = move_func(self.player_state, self.boss_state.qubit_state)
            elif move_name == "SWITCHEROO":
                result = move_func(self.player_state, self.boss_state.qubit_state)
                self.boss_state.qubit_state = result["enemy_qubit_state"]
                # Specify whose qubit is changed
                result["message"] = result["message"].replace("enemy qubit", "Singulon's qubit")
        elif self.character_name == "Resona":
            if move_name == "Q-METRONOME":
                result = move_func(self.player_state, self.player_hp, self.boss_state.qubit_state)
            elif move_name == "WAVE CRASH":
                result = move_func(self.player_state, self.boss_state.qubit_state)
            elif move_name == "METAL NOISE":
                result = move_func(self.player_state, self.boss_state.qubit_state)
            elif move_name == "SHIFT GEAR":
                result = move_func(self.player_state)
        # Apply damage
        if result.get("success", True):
            damage = result.get("damage", 0)
            
            # Apply ability bonus damage
            if self.character_name == "Bitzy":
                if self.boss_state.qubit_state == "|1⟩":
                    damage += 10
                    print("SUPERHIJACK: +10 bonus damage!")
            elif self.character_name == "Neutrinette":
                if self.player_state.is_entangled:
                    damage += 10
                    print("QUANTUM AFTERBURN: +10 bonus damage!")
            
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
        print(f"Boss's HP: {boss_hp_display}")

    def execute_boss_move(self):
        """Execute Singulon boss move"""
        boss_moves = [
            ("DUALIZE", quantum_move_singulon_dualize),
            ("HAZE", quantum_move_singulon_haze),
            ("BULLET MUONS", quantum_move_singulon_bullet_muons),
            ("Q-PRISMATIC LASER", quantum_move_singulon_q_prismatic_laser)
        ]
        move_name, move_func = random.choice(boss_moves)
        if move_name == "Q-PRISMATIC LASER":
            result = move_func(self.boss_state, self.player_state.qubit_state)
        else:
            result = move_func(self.boss_state)
        # Specify whose qubit is changed in log
        if move_name == "DUALIZE":
            result["message"] = result["message"].replace("creates superposition!", "Singulon's qubit is now in superposition!")
        if move_name == "HAZE":
            result["message"] = result["message"].replace("resets qubit to |0⟩!", "Singulon's qubit is now |0⟩!")
        # Apply damage to player
        if result.get("success", True):
            damage = result.get("damage", 0)
            self.player_hp -= damage
            print(f"Singulon used {move_name}: {result['message']}")
            if damage > 0:
                print(f"Dealt {damage} damage!")
        else:
            print(f"Singulon used {move_name}: {result['message']}")
        # Clamp HP to 0 for display
        player_hp_display = max(0, self.player_hp)
        boss_hp_display = max(0, self.boss_state.hp)
        print(f"\nYour HP: {player_hp_display}")
        print(f"Boss's HP: {boss_hp_display}")
    
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
            self.execute_player_move(move_choice)
            
            if self.check_battle_end():
                break
                
            self.execute_boss_move()
            
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