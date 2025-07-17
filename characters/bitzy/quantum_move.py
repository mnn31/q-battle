import sys
import os
import random
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..', 'quantum_gates'))

from basic_gates import (
    hadamard_gate, x_gate, cnot_gate, create_superposition, 
    measure_qubit, run_quantum_circuit, calculate_damage
)

class BitzyQuantumState:
    """Manages Bitzy's quantum state throughout battle"""
    def __init__(self):
        self.qubit_state = "|0⟩"  # |0⟩, |1⟩, or "superposition"
        self.attack_stat = 75
        self.defense = 50  # placeholder
        self.speed = 8  # placeholder

def quantum_move_bitzy_q_thunder(quantum_state):
    """Q-THUNDER: Requires superposition, deals massive damage and collapses qubit"""
    if quantum_state.qubit_state != "superposition":
        return {
            "success": False,
            "damage": 0,
            "message": "Q-THUNDER failed! Qubit not in superposition.",
            "qubit_state": quantum_state.qubit_state
        }
    
    # Create superposition circuit and measure
    qc = create_superposition(0)
    qc = measure_qubit(qc, 0)
    result = run_quantum_circuit(qc, shots=1)
    
    # Calculate damage (90 base power)
    damage = calculate_damage(quantum_state.attack_stat, 90, defense=quantum_state.defense)
    
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

def quantum_move_bitzy_shock(quantum_state, enemy_qubit_state="|0⟩"):
    """SHOCK: Base damage + bonus if qubits are in different states"""
    # Create circuit to measure current qubit state
    qc = create_superposition(0)
    qc = measure_qubit(qc, 0)
    result = run_quantum_circuit(qc, shots=1)
    
    # Determine current qubit state
    if "1" in result:
        current_state = "|1⟩"
    else:
        current_state = "|0⟩"
    
    # Calculate base damage (20 base power)
    base_damage = calculate_damage(quantum_state.attack_stat, 20, defense=quantum_state.defense)
    
    # Check if states are different
    if current_state != enemy_qubit_state:
        bonus_damage = calculate_damage(quantum_state.attack_stat, 30, defense=quantum_state.defense)
        total_damage = base_damage + bonus_damage
        message = f"SHOCK deals {total_damage} damage! (Bonus for different states)"
    else:
        total_damage = base_damage
        message = f"SHOCK deals {total_damage} damage."
    
    return {
        "success": True,
        "damage": total_damage,
        "message": message,
        "qubit_state": current_state,
        "quantum_result": result
    }

def quantum_move_bitzy_dualize(quantum_state):
    """DUALIZE: Puts qubit in superposition if not already"""
    if quantum_state.qubit_state == "superposition":
        return {
            "success": False,
            "damage": 0,
            "message": "DUALIZE failed! Qubit already in superposition.",
            "qubit_state": quantum_state.qubit_state
        }
    
    # Create superposition
    quantum_state.qubit_state = "superposition"
    
    return {
        "success": True,
        "damage": 0,
        "message": "DUALIZE puts qubit in superposition!",
        "qubit_state": quantum_state.qubit_state
    }

def quantum_move_bitzy_bit_flip(quantum_state, enemy_qubit_state="|0⟩"):
    """BIT-FLIP: Flips the enemy's qubit state"""
    # Determine new enemy state
    if enemy_qubit_state == "|0⟩":
        new_enemy_state = "|1⟩"
    elif enemy_qubit_state == "|1⟩":
        new_enemy_state = "|0⟩"
    else:
        # If enemy is in superposition, collapse to random state
        if random.random() < 0.5:
            new_enemy_state = "|0⟩"
        else:
            new_enemy_state = "|1⟩"
    
    return {
        "success": True,
        "damage": 0,
        "message": f"BIT-FLIP changes enemy qubit from {enemy_qubit_state} to {new_enemy_state}!",
        "qubit_state": quantum_state.qubit_state,
        "enemy_qubit_state": new_enemy_state
    }

def ability_superhijack(quantum_state, enemy_qubit_state="|0⟩"):
    """SUPERHIJACK: Additional 10 damage if enemy qubit is |1⟩"""
    if enemy_qubit_state == "|1⟩":
        bonus_damage = 10
        return {
            "bonus_damage": bonus_damage,
            "message": f"SUPERHIJACK deals {bonus_damage} bonus damage!"
        }
    else:
        return {
            "bonus_damage": 0,
            "message": "SUPERHIJACK: No bonus damage."
        }

# Legacy function for backward compatibility
def quantum_move_bitzy():
    """Legacy function - now calls Q-THUNDER with default state"""
    quantum_state = BitzyQuantumState()
    return quantum_move_bitzy_q_thunder(quantum_state) 