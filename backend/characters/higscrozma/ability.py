def ability_quantum_bulwark(quantum_state, barriers_in_front=2, barriers_behind=0):
    """QUANTUM BULWARK: Provides barrier-based damage reduction and power modification"""
    # Calculate damage reduction from front barriers (10% per barrier)
    damage_reduction = barriers_in_front * 0.10
    
    # Calculate damage boost from back barriers (10% per barrier)
    damage_boost = barriers_behind * 0.10
    
    return {
        "damage_reduction": damage_reduction,
        "damage_boost": damage_boost,
        "barriers_in_front": barriers_in_front,
        "barriers_behind": barriers_behind,
        "message": f"QUANTUM BULWARK: {barriers_in_front} front barriers (-{damage_reduction*100:.0f}% damage taken, -{damage_reduction*100:.0f}% damage dealt), {barriers_behind} back barriers (+{damage_boost*100:.0f}% damage dealt)"
    } 