def ability_quantum_afterburn(enemy_qubit_state="|0⟩", is_entangled=False):
    """QUANTUM AFTERBURN: Additional 10 damage if qubits are entangled"""
    if is_entangled:
        return {"bonus_damage": 10, "message": "QUANTUM AFTERBURN deals 10 bonus damage!"}
    else:
        return {"bonus_damage": 0, "message": "QUANTUM AFTERBURN: No bonus damage (not entangled)."} 