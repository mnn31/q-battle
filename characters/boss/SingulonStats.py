import random
from qiskit import QuantumCircuit
from basic_gates import (
    hadamard_gate, x_gate, cnot_gate, swap_gate, create_superposition, 
    measure_qubit, run_quantum_circuit, calculate_damage
)

def calculate_damage_rpg(attacker_attack, move_base_power, defender_defense):
    """RPG-style damage formula: (Attack + Base Power) * 0.8 / (Defense * 0.1 + 1)"""
    damage = (attacker_attack + move_base_power) * 0.8 / (defender_defense * 0.1 + 1)
    return max(1, int(damage))  # Minimum 1 damage

class SingulonQuantumState:
    def __init__(self):
        self.qubit_state = "|0⟩"  # |0⟩, |1⟩, or "superposition"
        self.attack_stat = 60
        self.defense = 80
        self.speed = 5
        self.hp = 400
        self.max_hp = 400