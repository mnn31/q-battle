import random
from qiskit import QuantumCircuit
from basic_gates import (
    hadamard_gate, x_gate, cnot_gate, swap_gate, create_superposition, 
    measure_qubit, run_quantum_circuit, calculate_damage
)



def quantum_move_singulon_dualize(quantum_state):
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
        "message": "DUALIZE creates superposition!",
        "qubit_state": quantum_state.qubit_state,
        "quantum_result": result
    }

def quantum_move_singulon_haze(quantum_state):
    """HAZE: Reset the boss's qubit to |0⟩"""
    quantum_state.qubit_state = "|0⟩"
    
    return {
        "success": True,
        "damage": 0,
        "message": "HAZE resets qubit to |0⟩!",
        "qubit_state": quantum_state.qubit_state
    }

def quantum_move_singulon_bullet_muons(quantum_state):
    """BULLET MUONS: Base damage 70 if boss's qubit is in state of |0⟩, else fails"""
    if quantum_state.qubit_state != "|0⟩":
        return {
            "success": False,
            "damage": 0,
            "message": "BULLET MUONS failed! Qubit must be in |0⟩ state.",
            "qubit_state": quantum_state.qubit_state
        }
    
    # Calculate damage (70 base power)
    damage = calculate_damage(quantum_state.attack_stat, 70, defense=quantum_state.defense)
    
    return {
        "success": True,
        "damage": damage,
        "message": f"BULLET MUONS deals {damage} damage!",
        "qubit_state": quantum_state.qubit_state
    }

def quantum_move_singulon_q_prismatic_laser(quantum_state, player_qubit_state="|0⟩"):
    """Q-PRISMATIC LASER: If both qubits are in superposition, deals 80 damage, else 20 damage"""
    # Check if both qubits are in superposition
    if quantum_state.qubit_state == "superposition" and player_qubit_state == "superposition":
        base_damage = 80
        message = "Q-PRISMATIC LASER deals massive damage! (Both qubits in superposition)"
    else:
        base_damage = 20
        message = "Q-PRISMATIC LASER deals reduced damage. (Qubits not both in superposition)"
    
    # Calculate damage
    damage = calculate_damage(quantum_state.attack_stat, base_damage, defense=quantum_state.defense)
    
    return {
        "success": True,
        "damage": damage,
        "message": f"{message} Dealt {damage} damage!",
        "qubit_state": quantum_state.qubit_state
    }
