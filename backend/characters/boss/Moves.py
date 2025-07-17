import random
from qiskit import QuantumCircuit
from basic_gates import (
    hadamard_gate, x_gate, cnot_gate, swap_gate, create_superposition, 
    measure_qubit, run_quantum_circuit, apply_damage_roll
)

def calculate_damage_rpg(attacker_attack, move_base_power, defender_defense):
    """RPG-style damage formula: (Attack + Base Power) * 0.9 / (Defense * 0.05 + 1)"""
    damage = (attacker_attack + move_base_power) * 0.9 / (defender_defense * 0.05 + 1)
    return max(1, int(damage))  # Minimum 1 damage

def quantum_move_singulon_dualize(quantum_state):
    """DUALIZE: Puts the qubit in a state of SUPERPOSITION if it wasn't previously"""
    if quantum_state.qubit_state == "superposition":
        return {
            "success": False,
            "damage": 0,
            "message": "DUALIZE failed! Singulon's qubit already in superposition.",
            "qubit_state": quantum_state.qubit_state
        }
    qc = hadamard_gate(0)
    result = run_quantum_circuit(qc, shots=1)
    quantum_state.qubit_state = "superposition"
    return {
        "success": True,
        "damage": 0,
        "message": "Singulon's qubit is now in superposition!",
        "qubit_state": quantum_state.qubit_state,
        "quantum_result": result
    }

def quantum_move_singulon_haze(quantum_state):
    """HAZE: Reset the boss's qubit to |0⟩"""
    quantum_state.qubit_state = "|0⟩"
    return {
        "success": True,
        "damage": 0,
        "message": "Singulon's qubit is now |0⟩!",
        "qubit_state": quantum_state.qubit_state
    }

def quantum_move_singulon_bullet_muons(quantum_state, defender_defense=50):
    """BULLET MUONS: Base damage 120 if boss's qubit is in state of |0⟩, else fails"""
    if quantum_state.qubit_state != "|0⟩":
        return {
            "success": False,
            "damage": 0,
            "message": "BULLET MUONS failed! Singulon's qubit must be in |0⟩ state.",
            "qubit_state": quantum_state.qubit_state
        }
    base_damage = calculate_damage_rpg(quantum_state.attack_stat, 120, defender_defense)
    damage = apply_damage_roll(base_damage)
    return {
        "success": True,
        "damage": damage,
        "message": f"BULLET MUONS deals {damage} damage!",
        "qubit_state": quantum_state.qubit_state
    }

def quantum_move_singulon_q_prismatic_laser(quantum_state, player_qubit_state="|0⟩", defender_defense=50):
    """Q-PRISMATIC LASER: If both qubits are in superposition, deals 150 damage, else 60 damage"""
    if quantum_state.qubit_state == "superposition" and player_qubit_state == "superposition":
        base_damage = 150
        message = "Q-PRISMATIC LASER deals massive damage! (Both qubits in superposition)"
        calculated_damage = calculate_damage_rpg(quantum_state.attack_stat, base_damage, defender_defense)
        damage = apply_damage_roll(calculated_damage)
    else:
        base_damage = 60
        message = "Q-PRISMATIC LASER deals reduced damage. (Qubits not both in superposition)"
        calculated_damage = calculate_damage_rpg(quantum_state.attack_stat, base_damage, defender_defense)
        damage = apply_damage_roll(calculated_damage)
    return {
        "success": True,
        "damage": damage,
        "message": f"{message} Dealt {damage} damage!",
        "qubit_state": quantum_state.qubit_state
    }
