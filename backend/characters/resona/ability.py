def ability_quantum_waveform(waveform_stacks=0):
    """QUANTUM WAVEFORM: Increases collapse probability and Q-METRONOME damage based on stacks"""
    collapse_bonus = waveform_stacks * 0.02  # 2% per stack
    damage_bonus = waveform_stacks * 50  # +50 damage per stack (much more significant!)
    
    return {
        "collapse_probability_bonus": collapse_bonus,
        "damage_bonus": damage_bonus,
        "waveform_stacks": waveform_stacks,
        "message": f"QUANTUM WAVEFORM: {waveform_stacks} stacks (+{collapse_bonus:.1%} collapse chance, +{damage_bonus} damage)"
    } 