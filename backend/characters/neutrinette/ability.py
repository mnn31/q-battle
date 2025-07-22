def ability_quantum_afterburn(quantum_state, damage_taken=0):
    """QUANTUM AFTERBURN: When Neutrinette takes damage while entangled, 25% of that damage is dealt as recoil to the enemy"""
    if quantum_state.is_entangled and damage_taken > 0:
        recoil_damage = int(damage_taken * 0.25)  # 25% of damage taken
        return {
            "recoil_damage": recoil_damage,
            "message": f"QUANTUM AFTERBURN reflects {recoil_damage} damage back to the enemy!"
        }
    else:
        return {
            "recoil_damage": 0,
            "message": "QUANTUM AFTERBURN: No recoil damage (not entangled or no damage taken)."
        } 