import sys
import os
import random
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..', 'quantum_gates'))

from basic_gates import (
    hadamard_gate, x_gate, cnot_gate, swap_gate, create_superposition, 
    measure_qubit, run_quantum_circuit, calculate_damage
)

def simple_damage(base_power, qmove=False):
    if qmove:
        return min(int(base_power * 0.8), 60)
    else:
        return min(int(base_power * 0.4), 30)

class NeutrinetteQuantumState:
    """Manages Neutrinette's quantum state throughout battle"""
    def __init__(self):
        self.qubit_state = "|0⟩"  # |0⟩, |1⟩, or "superposition"
        self.attack_stat = 80
        self.defense = 50  # placeholder
        self.speed = 7  # placeholder
        self.is_entangled = False  # Track entanglement state

def quantum_move_neutrinette_q_photon_geyser(quantum_state, current_hp=80, enemy_hp=100, is_entangled=False):
    """Q-PHOTON GEYSER: Requires |0⟩ or |1⟩ state, deals damage with HP cost"""
    if quantum_state.qubit_state == "superposition":
        return {
            "success": False,
            "damage": 0,
            "message": "Q-PHOTON GEYSER failed! Qubit must be in |0⟩ or |1⟩ state.",
            "qubit_state": quantum_state.qubit_state
        }
    
    # Calculate HP cost (25% of current HP)
    hp_cost = int(current_hp * 0.25)
    
    # Create circuit to measure current qubit state
    qc = create_superposition(0)
    qc = measure_qubit(qc, 0)
    result = run_quantum_circuit(qc, shots=1)
    
    # Calculate damage (75 base power) - reduced scaling
    damage = simple_damage(75, qmove=True)
    
    # Collapse qubit randomly
    if "1" in result:
        quantum_state.qubit_state = "|1⟩"
    else:
        quantum_state.qubit_state = "|0⟩"
    
    # Handle entanglement effects - boss loses exactly the same HP
    if is_entangled:
        enemy_hp_cost = hp_cost  # Boss loses exactly the same amount
        message = f"Q-PHOTON GEYSER deals {damage} damage! (Cost: {hp_cost} HP, Enemy loses {enemy_hp_cost} HP due to entanglement!)"
        return {
            "success": True,
            "damage": damage,
            "hp_cost": hp_cost,
            "enemy_hp_cost": enemy_hp_cost,
            "message": message,
            "qubit_state": quantum_state.qubit_state,
            "quantum_result": result,
            "entanglement_effect": True
        }
    else:
        message = f"Q-PHOTON GEYSER deals {damage} damage! (Cost: {hp_cost} HP)"
        return {
            "success": True,
            "damage": damage,
            "hp_cost": hp_cost,
            "enemy_hp_cost": 0,
            "message": message,
            "qubit_state": quantum_state.qubit_state,
            "quantum_result": result,
            "entanglement_effect": False
        }

def quantum_move_neutrinette_glitch_claw(quantum_state, current_hp=80):
    """GLITCH CLAW: Deals damage with chance to heal"""
    # Create circuit for quantum randomness
    qc = create_superposition(0)
    qc = measure_qubit(qc, 0)
    result = run_quantum_circuit(qc, shots=1)
    
    # Calculate damage (40 base power) - reduced scaling
    damage = simple_damage(40)
    
    # 30% chance to heal (based on quantum randomness)
    heal_chance = random.random()
    if heal_chance < 0.30:  # 30% chance
        heal_amount = int(80 * 0.20)  # 20% of max HP
        message = f"GLITCH CLAW deals {damage} damage and heals {heal_amount} HP!"
        return {
            "success": True,
            "damage": damage,
            "heal": heal_amount,
            "message": message,
            "qubit_state": quantum_state.qubit_state,
            "quantum_result": result
        }
    else:
        message = f"GLITCH CLAW deals {damage} damage!"
        return {
            "success": True,
            "damage": damage,
            "heal": 0,
            "message": message,
            "qubit_state": quantum_state.qubit_state,
            "quantum_result": result
        }

def quantum_move_neutrinette_entangle(quantum_state, enemy_qubit_state="|0⟩"):
    """ENTANGLE: Creates entanglement between qubits"""
    if quantum_state.is_entangled:
        return {
            "success": False,
            "damage": 0,
            "message": "ENTANGLE failed! Qubits already entangled.",
            "qubit_state": quantum_state.qubit_state
        }
    
    # Create entanglement using CNOT
    qc = cnot_gate(0, 1)
    result = run_quantum_circuit(qc, shots=1)
    
    # Set entanglement state
    quantum_state.is_entangled = True
    
    return {
        "success": True,
        "damage": 0,
        "message": "ENTANGLE creates quantum entanglement!",
        "qubit_state": quantum_state.qubit_state,
        "enemy_qubit_state": enemy_qubit_state,
        "is_entangled": True,
        "quantum_result": result
    }

def quantum_move_neutrinette_switcheroo(quantum_state, enemy_qubit_state="|0⟩"):
    """SWITCHEROO: Swaps qubit states"""
    # Create SWAP circuit
    qc = swap_gate(0, 1)
    result = run_quantum_circuit(qc, shots=1)
    
    # Swap the states
    new_enemy_state = quantum_state.qubit_state
    quantum_state.qubit_state = enemy_qubit_state
    
    return {
        "success": True,
        "damage": 0,
        "message": f"SWITCHEROO swaps qubit states!",
        "qubit_state": quantum_state.qubit_state,
        "enemy_qubit_state": new_enemy_state,
        "quantum_result": result
    }

def ability_quantum_afterburn(quantum_state, enemy_qubit_state="|0⟩"):
    """QUANTUM AFTERBURN: Additional 10 damage if qubits are entangled"""
    if quantum_state.is_entangled:
        bonus_damage = 10
        return {
            "bonus_damage": bonus_damage,
            "message": f"QUANTUM AFTERBURN deals {bonus_damage} bonus damage!"
        }
    else:
        return {
            "bonus_damage": 0,
            "message": "QUANTUM AFTERBURN: No bonus damage (not entangled)."
        } 