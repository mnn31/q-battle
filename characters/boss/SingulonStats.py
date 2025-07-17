import random
from qiskit import QuantumCircuit
from basic_gates import (
    hadamard_gate, x_gate, cnot_gate, swap_gate, create_superposition, 
    measure_qubit, run_quantum_circuit, calculate_damage
)

class SingulonQuantumState:
    def __init__(self):
        self.qubit_state = "|0⟩"  # |0⟩, |1⟩, or "superposition"
        self.attack_stat = 60
        self.defense = 50  # placeholder
        self.speed = 5  # placeholder
        self.hp = 400
        self.max_hp = 400