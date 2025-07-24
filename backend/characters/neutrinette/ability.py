def ability_quantum_afterburn(quantum_state, damage_taken=0, is_attacking=False):
    """QUANTUM AFTERBURN: When Neutrinette is entangled:
    1. When taking damage: 75% of that damage is reflected back to the enemy
    2. When attacking: Deals 30 extra HP damage to the enemy"""
    
    if not quantum_state.is_entangled:
        return {
            "recoil_damage": 0,
            "extra_damage": 0,
            "message": ""
        }
    
    if is_attacking:
        # When attacking while entangled: deal 30 extra damage
        return {
            "recoil_damage": 0,
            "extra_damage": 30,
            "message": "QUANTUM AFTERBURN deals 30 extra damage!"
        }
    elif damage_taken > 0:
        # When taking damage while entangled: reflect 75% back
        recoil_damage = int(damage_taken * 0.75)
        return {
            "recoil_damage": recoil_damage,
            "extra_damage": 0,
            "message": f"QUANTUM AFTERBURN reflects {recoil_damage} damage back to the enemy!"
        }
    else:
        return {
            "recoil_damage": 0,
            "extra_damage": 0,
            "message": ""
        } 