import random
from qiskit import QuantumCircuit
from basic_gates import (
    hadamard_gate, x_gate, cnot_gate, swap_gate, create_superposition, 
    measure_qubit, run_quantum_circuit, calculate_damage
)


class SingulonQuantumState:
    def __init__(self):
        self.qubit_state = "|0⟩"  # |0⟩, |1⟩, or "superposition"
        self.attack_stat = 85
        self.defense = 55  #placeholder
        self.speed = 6  #placeholder
        self.status = {}
        self.qe = 100  #Quantum Energy
        self.hp_history = [] #Tracks HP over turns for rewind
        self.ghz_state = None #Tracks 3 qubit GHZ state
        self.linked_targets = []
        self.rewind_used = False #Tracks if rewind has been used