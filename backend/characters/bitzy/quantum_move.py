import sys
import os
import random
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..', 'quantum_gates'))

from basic_gates import (
    hadamard_gate, x_gate, cnot_gate, swap_gate, create_superposition, 
    measure_qubit, run_quantum_circuit, calculate_damage, apply_damage_roll
)

def calculate_damage_rpg(attacker_attack, move_base_power, defender_defense):
    """RPG-style damage formula: (Attack + Base Power) * 0.9 / (Defense * 0.05 + 1)"""
    damage = (attacker_attack + move_base_power) * 0.9 / (defender_defense * 0.05 + 1)
    return max(1, int(damage))  # Minimum 1 damage

class BitzyQuantumState:
    """Manages Bitzy's quantum state throughout battle"""
    def __init__(self):
        self.qubit_state = "|0⟩"  # |0⟩, |1⟩, or "superposition"
        self.attack_stat = 60  # Reduced by 10
        self.defense = 85  # Increased by 5
        self.speed = 8

def quantum_move_bitzy_q_thunder(quantum_state, defender_defense=50, enemy_qubit_state="|0⟩"):
    """Q-THUNDER: Requires superposition, deals massive damage and collapses qubit"""
    if quantum_state.qubit_state != "superposition":
        return {
            "success": False,
            "damage": 0,
            "message": "Q-THUNDER failed! Qubit not in superposition.",
            "qubit_state": quantum_state.qubit_state
        }
    
    # Create circuit to measure superposition state
    qc = create_superposition(0)
    qc = measure_qubit(qc, 0)
    result = run_quantum_circuit(qc, shots=1)
    
    # Calculate damage (90 base power) with proper RPG formula
    base_damage = calculate_damage_rpg(quantum_state.attack_stat, 90, defender_defense)
    damage = base_damage
    
    # Apply ability bonus (SUPERHIJACK) if enemy qubit is |1⟩
    if enemy_qubit_state == "|1⟩":
        damage += 10
    
    # Apply damage roll to final damage
    damage = apply_damage_roll(damage)
    
    # Collapse qubit randomly
    if "1" in result:
        quantum_state.qubit_state = "|1⟩"
    else:
        quantum_state.qubit_state = "|0⟩"
    
    return {
        "success": True,
        "damage": damage,
        "message": f"Q-THUNDER strikes for {damage} damage!",
        "qubit_state": quantum_state.qubit_state,
        "quantum_result": result
    }

def quantum_move_bitzy_shock(quantum_state, enemy_qubit_state="|0⟩", defender_defense=50):
    """SHOCK: Deals damage with bonus if qubits are in different states"""
    # Create circuit for quantum randomness
    qc = create_superposition(0)
    qc = measure_qubit(qc, 0)
    result = run_quantum_circuit(qc, shots=1)
    
    # Calculate base damage (30) with proper RPG formula
    base_damage = calculate_damage_rpg(quantum_state.attack_stat, 30, defender_defense)
    total_damage = base_damage
    
    # Check if qubits are in different states
    if quantum_state.qubit_state != enemy_qubit_state:
        bonus_damage = 20  # Flat 20 damage bonus
        total_damage += bonus_damage
        message = f"SHOCK deals {total_damage} damage! (+{bonus_damage} different states bonus)"
    else:
        message = f"SHOCK deals {total_damage} damage!"
    
    # Apply damage roll to final damage
    total_damage = apply_damage_roll(total_damage)
    
    return {
        "success": True,
        "damage": total_damage,
        "message": message,
        "qubit_state": quantum_state.qubit_state,
        "quantum_result": result
    }

def quantum_move_bitzy_dualize(quantum_state):
    """DUALIZE: Puts the qubit in a state of SUPERPOSITION if it wasn't previously"""
    if quantum_state.qubit_state == "superposition":
        return {
            "success": False,
            "damage": 0,
            "message": "DUALIZE failed! Qubit already in superposition.",
            "qubit_state": quantum_state.qubit_state
        }
    
    # Create superposition using Hadamard gate
    qc = hadamard_gate(0)
    result = run_quantum_circuit(qc, shots=1)
    
    quantum_state.qubit_state = "superposition"
    
    return {
        "success": True,
        "damage": 0,
        "message": "DUALIZE puts qubit in superposition!",
        "qubit_state": quantum_state.qubit_state,
        "quantum_result": result
    }

def quantum_move_bitzy_bit_flip(quantum_state, enemy_qubit_state="|0⟩"):
    """BIT-FLIP: Flips the enemy's qubit state"""
    # Create X gate circuit
    qc = x_gate(0)
    result = run_quantum_circuit(qc, shots=1)
    
    # Flip the enemy qubit state
    if enemy_qubit_state == "|0⟩":
        new_enemy_state = "|1⟩"
    elif enemy_qubit_state == "|1⟩":
        new_enemy_state = "|0⟩"
    else:  # superposition
        new_enemy_state = "|0⟩"  # Collapse to |0⟩
    
    return {
        "success": True,
        "damage": 0,
        "message": f"BIT-FLIP changes enemy qubit from {enemy_qubit_state} to {new_enemy_state}!",
        "qubit_state": quantum_state.qubit_state,
        "enemy_qubit_state": new_enemy_state,
        "quantum_result": result
    }

def ability_superhijack(quantum_state, enemy_qubit_state="|0⟩"):
    """SUPERHIJACK: Additional 10 damage when using Q-Thunder or Shock if enemy qubit is |1⟩"""
    if enemy_qubit_state == "|1⟩":
        bonus_damage = 10
        return {
            "bonus_damage": bonus_damage,
            "message": f"SUPERHIJACK deals {bonus_damage} bonus damage!"
        }
    else:
        return {
            "bonus_damage": 0,
            "message": "SUPERHIJACK: No bonus damage (enemy qubit not |1⟩)."
        }

# Legacy function for backward compatibility
def quantum_move_bitzy():
    """Legacy function - now calls Q-THUNDER with default state"""
    quantum_state = BitzyQuantumState()
    return quantum_move_bitzy_q_thunder(quantum_state) 