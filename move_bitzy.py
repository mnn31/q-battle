from qiskit import QuantumCircuit
from qiskit_aer import Aer

def quantum_move_bitzy():
    qc = QuantumCircuit(1, 1)
    qc.h(0)  # Hadamard: superposition
    qc.z(0)  # Z gate: Bitzy's 'quirk'
    qc.measure(0, 0)

    sim = Aer.get_backend('qasm_simulator')
    result = sim.run(qc, shots=1).result().get_counts()
    return result 