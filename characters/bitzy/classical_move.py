import random

def classical_move_bitzy():
    """Bitzy's classical move: Basic attack"""
    return {"damage": 15, "move": "Basic Attack"}

def ability_superhijack(enemy_qubit_state="|0⟩"):
    """SUPERHIJACK: Additional 10 damage if enemy qubit is |1⟩"""
    if enemy_qubit_state == "|1⟩":
        return {"bonus_damage": 10, "message": "SUPERHIJACK deals 10 bonus damage!"}
    else:
        return {"bonus_damage": 0, "message": "SUPERHIJACK: No bonus damage."} 