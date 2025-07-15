from qiskit import QuantumCircuit
from qiskit_aer import Aer
import math

def hadamard_gate(qubit=0):
    """Apply Hadamard gate to specified qubit"""
    qc = QuantumCircuit(qubit + 1, qubit + 1)
    qc.h(qubit)
    qc.measure(qubit, qubit)
    return qc

def z_gate(qubit=0):
    """Apply Z gate to specified qubit"""
    qc = QuantumCircuit(qubit + 1, qubit + 1)
    qc.z(qubit)
    qc.measure(qubit, qubit)
    return qc

def x_gate(qubit=0):
    """Apply X gate (bit flip) to specified qubit"""
    qc = QuantumCircuit(qubit + 1, qubit + 1)
    qc.x(qubit)
    qc.measure(qubit, qubit)
    return qc

def cnot_gate(control=0, target=1):
    """Apply CNOT gate with control and target qubits"""
    qc = QuantumCircuit(max(control, target) + 1, max(control, target) + 1)
    qc.cx(control, target)
    qc.measure([control, target], [control, target])
    return qc

def ry_gate(qubit=0, theta=math.pi/4):
    """Apply Ry rotation gate for biased quantum states"""
    qc = QuantumCircuit(qubit + 1, qubit + 1)
    qc.ry(theta, qubit)
    qc.measure(qubit, qubit)
    return qc

def biased_quantum_state(qubit=0, hit_probability=0.6):
    """Create a quantum state with custom hit probability"""
    theta = 2 * math.acos(math.sqrt(1 - hit_probability))
    return ry_gate(qubit, theta)

def create_superposition(qubit=0):
    """Create superposition state without measurement"""
    qc = QuantumCircuit(qubit + 1, qubit + 1)
    qc.h(qubit)
    return qc

def measure_qubit(qc, qubit=0):
    """Measure a specific qubit in a circuit"""
    qc.measure(qubit, qubit)
    return qc

def run_quantum_circuit(qc, shots=1):
    """Run quantum circuit and return results"""
    sim = Aer.get_backend('qasm_simulator')
    result = sim.run(qc, shots=shots).result().get_counts()
    return result

def calculate_damage(attack_stat, base_power, level=50, defense=50):
    """Calculate damage using Pokemon-style formula"""
    damage = ((2 * level + 10) / 250 + 2) * attack_stat * base_power / defense + 2
    return int(damage) 