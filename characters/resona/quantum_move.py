import sys
import os
import random
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..', 'quantum_gates'))

from basic_gates import (
    hadamard_gate, x_gate, cnot_gate, swap_gate, create_superposition, 
    measure_qubit, run_quantum_circuit, calculate_damage
)

def simple_damage(base_power, qmove=False):
    if qmove:
        return min(int(base_power * 0.8), 60)
    else:
        return min(int(base_power * 0.4), 30)

class ResonaQuantumState:
    """Manages Resona's quantum state throughout battle"""
    def __init__(self):
        self.qubit_state = "|0⟩"  # |0⟩, |1⟩, or "superposition"
        self.attack_stat = 65
        self.defense = 50  # placeholder
        self.speed = 6  # placeholder
        self.waveform_stacks = 0  # Track waveform stacks
        self.next_turn_collapse_bonus = 0  # For SHIFT GEAR effect

def quantum_move_resona_q_metronome(quantum_state, current_hp=95, enemy_qubit_state="|0⟩"):
    """Q-METRONOME: Collapses qubit, deals 100% max HP if |1⟩, base damage if |0⟩"""
    # Apply waveform ability effects
    from .ability import ability_quantum_waveform
    waveform_effect = ability_quantum_waveform(quantum_state.waveform_stacks)
    collapse_bonus = waveform_effect["collapse_probability_bonus"]
    damage_bonus = waveform_effect["damage_bonus"]
    
    # Create circuit to measure current qubit state
    qc = create_superposition(0)
    qc = measure_qubit(qc, 0)
    result = run_quantum_circuit(qc, shots=1)
    
    # Determine collapse result with waveform bonus
    if "1" in result:
        quantum_state.qubit_state = "|1⟩"
        # Calculate damage: 100% max HP + waveform bonus (reduced scaling)
        damage = simple_damage(current_hp + damage_bonus, qmove=True)
        message = f"Q-METRONOME deals {damage} damage! (|1⟩ state + {damage_bonus} waveform bonus)"
    else:
        quantum_state.qubit_state = "|0⟩"
        # Calculate damage: 10 base + waveform bonus (reduced scaling)
        base_damage = 10 + damage_bonus
        damage = simple_damage(base_damage)
        message = f"Q-METRONOME deals {damage} damage! (|0⟩ state + {damage_bonus} waveform bonus)"
    
    # Gain waveform stack from collapse
    quantum_state.waveform_stacks += 1
    
    return {
        "success": True,
        "damage": damage,
        "message": message,
        "qubit_state": quantum_state.qubit_state,
        "waveform_stacks": quantum_state.waveform_stacks,
        "quantum_result": result,
        "waveform_gained": 1
    }

def quantum_move_resona_wave_crash(quantum_state, enemy_qubit_state="|0⟩"):
    """WAVE CRASH: Deals damage + bonus if superposition, collapses qubit"""
    # Check for superposition bonus
    superposition_bonus = 0
    if quantum_state.qubit_state == "superposition":
        superposition_bonus += 40
    if enemy_qubit_state == "superposition":
        superposition_bonus += 40
    
    # Create circuit for quantum randomness
    qc = create_superposition(0)
    qc = measure_qubit(qc, 0)
    result = run_quantum_circuit(qc, shots=1)
    
    # Calculate base damage (20) - reduced scaling
    base_damage = 20
    total_damage = simple_damage(base_damage)
    
    # Add superposition bonus (reduced scaling)
    total_damage += simple_damage(superposition_bonus)
    
    # Collapse qubit randomly
    if "1" in result:
        quantum_state.qubit_state = "|1⟩"
    else:
        quantum_state.qubit_state = "|0⟩"
    
    # Gain waveform stack from collapse
    quantum_state.waveform_stacks += 1
    
    if superposition_bonus > 0:
        message = f"WAVE CRASH deals {total_damage} damage! (+{superposition_bonus} superposition bonus, gained waveform stack)"
    else:
        message = f"WAVE CRASH deals {total_damage} damage! (gained waveform stack)"
    
    return {
        "success": True,
        "damage": total_damage,
        "message": message,
        "qubit_state": quantum_state.qubit_state,
        "waveform_stacks": quantum_state.waveform_stacks,
        "quantum_result": result,
        "waveform_gained": 1
    }

def quantum_move_resona_metal_noise(quantum_state, enemy_qubit_state="|0⟩"):
    """METAL NOISE: Prevents enemy state changes, conditional damage"""
    # Check enemy qubit state for conditional damage
    if enemy_qubit_state == "|0⟩":
        damage = simple_damage(20)
        message = f"METAL NOISE deals {damage} damage! (enemy in |0⟩ state)"
        return {
            "success": True,
            "damage": damage,
            "message": message,
            "qubit_state": quantum_state.qubit_state,
            "enemy_state_blocked": True,
            "q_move_blocked": False
        }
    elif enemy_qubit_state == "|1⟩":
        message = "METAL NOISE blocks enemy Q-Moves! (enemy in |1⟩ state)"
        return {
            "success": True,
            "damage": 0,
            "message": message,
            "qubit_state": quantum_state.qubit_state,
            "enemy_state_blocked": True,
            "q_move_blocked": True
        }
    else:  # superposition
        message = "METAL NOISE blocks enemy state changes! (enemy in superposition)"
        return {
            "success": True,
            "damage": 0,
            "message": message,
            "qubit_state": quantum_state.qubit_state,
            "enemy_state_blocked": True,
            "q_move_blocked": False
        }

def quantum_move_resona_shift_gear(quantum_state):
    """SHIFT GEAR: Creates superposition with collapse probability boost"""
    # Put qubit in superposition
    quantum_state.qubit_state = "superposition"
    
    # Set collapse probability boost for next turn
    quantum_state.next_turn_collapse_bonus = 0.25  # 25% bonus
    
    return {
        "success": True,
        "damage": 0,
        "message": "SHIFT GEAR creates superposition! (+25% collapse to |1⟩ next turn)",
        "qubit_state": quantum_state.qubit_state,
        "next_turn_collapse_bonus": 0.25
    }

def ability_quantum_waveform(quantum_state):
    """QUANTUM WAVEFORM: Returns current waveform effects"""
    from .ability import ability_quantum_waveform
    return ability_quantum_waveform(quantum_state.waveform_stacks) 