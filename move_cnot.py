from qiskit import QuantumCircuit
from qiskit_aer import Aer

def quantum_move_cnot():
    qc = QuantumCircuit(2, 2)
    qc.h(0)      # Put qubit 0 in superposition
    qc.cx(0, 1)  # CNOT: qubit 0 controls qubit 1
    qc.measure([0, 1], [0, 1])

    sim = Aer.get_backend('qasm_simulator')
    result = sim.run(qc, shots=1).result().get_counts()
    return result 