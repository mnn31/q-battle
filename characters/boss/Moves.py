import random
from qiskit import QuantumCircuit
from basic_gates import (
    hadamard_gate, x_gate, cnot_gate, swap_gate, create_superposition, 
    measure_qubit, run_quantum_circuit
)

def simple_damage(base_power, qmove=False):
    if qmove:
        return min(int(base_power * 1.0), 80)
    else:
        return min(int(base_power * 0.5), 40)

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

def quantum_move_singulon_bullet_muons(quantum_state):
    """BULLET MUONS: Base damage 70 if boss's qubit is in state of |0⟩, else fails"""
    if quantum_state.qubit_state != "|0⟩":
        return {
            "success": False,
            "damage": 0,
            "message": "BULLET MUONS failed! Singulon's qubit must be in |0⟩ state.",
            "qubit_state": quantum_state.qubit_state
        }
    damage = simple_damage(70)
    return {
        "success": True,
        "damage": damage,
        "message": f"BULLET MUONS deals {damage} damage!",
        "qubit_state": quantum_state.qubit_state
    }

def quantum_move_singulon_q_prismatic_laser(quantum_state, player_qubit_state="|0⟩"):
    """Q-PRISMATIC LASER: If both qubits are in superposition, deals 80 damage, else 20 damage"""
    if quantum_state.qubit_state == "superposition" and player_qubit_state == "superposition":
        base_damage = 80
        message = "Q-PRISMATIC LASER deals massive damage! (Both qubits in superposition)"
        damage = simple_damage(base_damage, qmove=True)
    else:
        base_damage = 20
        message = "Q-PRISMATIC LASER deals reduced damage. (Qubits not both in superposition)"
        damage = simple_damage(base_damage)
    return {
        "success": True,
        "damage": damage,
        "message": f"{message} Dealt {damage} damage!",
        "qubit_state": quantum_state.qubit_state
    }
