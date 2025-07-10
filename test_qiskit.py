from qiskit import QuantumCircuit
from qiskit_aer import Aer

# Create 1-qubit circuit
qc = QuantumCircuit(1, 1)
qc.h(0)               # Put qubit into superposition
qc.measure(0, 0)      # Measure into classical bit

# Simulate it
sim = Aer.get_backend('qasm_simulator')
job = sim.run(qc, shots=10)
result = job.result().get_counts()

print("Quantum result:", result)
