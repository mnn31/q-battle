from qiskit import QuantumCircuit
from basic_gates import (
    measure_qubit, run_quantum_circuit, z_gate
)

# Global battle state (can be tracked in your engine instead)
ghz_state = None
linked_targets = []

def start_turn(singulon):
    """Track HP history (for Quantum Rewind)."""
    singulon.hp_history.append(singulon.hp)
    if len(singulon.hp_history) > 3:
        singulon.hp_history.pop(0)

def event_horizon_setup(singulon, targets):
    """Creates a 3-qubit GHZ state linking Singulon to targets."""
    global ghz_state, linked_targets
    ghz_state = QuantumCircuit(3, 3)
    ghz_state.h(0)
    ghz_state.cx(0, 1)
    ghz_state.cx(0, 2)
    linked_targets = targets

def event_horizon_collapse(singulon):
    """Collapse the GHZ state and apply damage or drain."""
    global ghz_state, linked_targets
    if not ghz_state or not linked_targets:
        return

    for i in range(3):
        measure_qubit(ghz_state, i)
    
    result = run_quantum_circuit(ghz_state)
    outcome = list(result.keys())[0]  # e.g., '011'

    for i, target in enumerate(linked_targets):
        if not getattr(target, "is_alive", True):
            continue
        bit = int(outcome[2 - i])  # Reverse due to Qiskit
        if bit == 0:
            target.hp = max(0, target.hp - 35)
        else:
            drain_amount = min(25, getattr(target, "qe", 0))
            target.qe -= drain_amount
            singulon.qe += drain_amount

    ghz_state = None
    linked_targets = []

def decoherence_wave():
    """Apply confusion debuff to linked enemies."""
    global linked_targets
    for target in linked_targets:
        if getattr(target, "is_alive", True):
            target.status['confused'] = 1

def superposition_devour(singulon, target):
    """Deals 25 damage and heals Singulon."""
    if getattr(target, "is_alive", True):
        target.hp = max(0, target.hp - 25)
        singulon.hp = min(singulon.max_hp, singulon.hp + 25)

def quantum_rewind(singulon):
    """Restores Singulon's HP to 2 turns ago."""
    if singulon.rewind_used or len(singulon.hp_history) < 3:
        return
    singulon.hp = singulon.hp_history[0]
    singulon.rewind_used = True
