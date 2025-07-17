def ability_quantum_afterburn(quantum_state, enemy_qubit_state="|0⟩"):
    """QUANTUM AFTERBURN: Deals additional 10 damage if qubits are entangled"""
    if quantum_state.is_entangled:
        bonus_damage = 10
        return {
            "bonus_damage": bonus_damage,
            "message": f"QUANTUM AFTERBURN deals {bonus_damage} bonus damage!"
        }
    else:
        return {
            "bonus_damage": 0,
            "message": "QUANTUM AFTERBURN: No bonus damage (not entangled)."
        } 