from qiskit import QuantumCircuit
from qiskit_aer import Aer

qc = QuantumCircuit(1, 1)
qc.h(0)
qc.measure(0, 0)

sim = Aer.get_backend('qasm_simulator')
job = sim.run(qc, shots=10)
result = job.result().get_counts()
print(result)
