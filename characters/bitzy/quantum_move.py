import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..', 'quantum_gates'))

from basic_gates import hadamard_gate, z_gate, run_quantum_circuit

def quantum_move_bitzy():
    """Bitzy's quantum move: Mystery Strike (Hadamard + Z)"""
    # Create circuit with Hadamard then Z gate
    qc = hadamard_gate(0)
    qc = z_gate(0)
    
    # Run the circuit
    result = run_quantum_circuit(qc, shots=1)
    return result 