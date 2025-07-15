from qiskit import QuantumCircuit
from qiskit_aer import Aer

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

def cnot_gate(control=0, target=1):
    """Apply CNOT gate with control and target qubits"""
    qc = QuantumCircuit(max(control, target) + 1, max(control, target) + 1)
    qc.cx(control, target)
    qc.measure([control, target], [control, target])
    return qc

def run_quantum_circuit(qc, shots=1):
    """Run quantum circuit and return results"""
    sim = Aer.get_backend('qasm_simulator')
    result = sim.run(qc, shots=shots).result().get_counts()
    return result 