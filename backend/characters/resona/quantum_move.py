import sys
import os
import random
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..', 'quantum_gates'))

from basic_gates import (
    hadamard_gate, x_gate, cnot_gate, swap_gate, create_superposition, 
    measure_qubit, run_quantum_circuit, calculate_damage, apply_damage_roll,
    biased_quantum_state
)

def calculate_damage_rpg(attacker_attack, move_base_power, defender_defense):
    """RPG-style damage formula: (Attack + Base Power) * 0.9 / (Defense * 0.05 + 1)"""
    damage = (attacker_attack + move_base_power) * 0.9 / (defender_defense * 0.05 + 1)
    return max(1, int(damage))  # Minimum 1 damage

class ResonaQuantumState:
    """Manages Resona's quantum state throughout battle"""
    def __init__(self):
        self.qubit_state = "|0⟩"  # |0⟩, |1⟩, or "superposition"
        self.attack_stat = 55  # Reduced by 10
        self.defense = 100  # Updated to 100
        self.speed = 6
        self.waveform_stacks = 0  # Track waveform stacks
        self.next_turn_collapse_bonus = 0  # For SHIFT GEAR effect

def quantum_move_resona_q_metronome(quantum_state, current_hp=95, enemy_qubit_state="|0⟩", defender_defense=50):
    """Q-METRONOME: Requires superposition, collapses qubit, deals 100% max HP if |1⟩, base damage if |0⟩"""
    
    # Check if qubit is in superposition - if not, fail
    if quantum_state.qubit_state != "superposition":
        return {
            "success": False,
            "damage": 0,
            "message": "",
            "qubit_state": quantum_state.qubit_state
        }
    
    # Apply waveform ability effects
    from .ability import ability_quantum_waveform
    waveform_effect = ability_quantum_waveform(quantum_state.waveform_stacks)
    collapse_bonus = waveform_effect["collapse_probability_bonus"]
    damage_bonus = waveform_effect["damage_bonus"]
    
    # Create circuit to measure current qubit state with collapse probability bonus
    if quantum_state.next_turn_collapse_bonus > 0:
        # Use biased quantum state for higher |1⟩ probability
        qc = biased_quantum_state(0, 0.5 + quantum_state.next_turn_collapse_bonus)
        result = run_quantum_circuit(qc, shots=1)
        quantum_state.next_turn_collapse_bonus = 0  # Reset after use
    else:
        qc = create_superposition(0)
        qc = measure_qubit(qc, 0)
        result = run_quantum_circuit(qc, shots=1)
    
    # Determine collapse result with waveform bonus
    if "1" in result:
        quantum_state.qubit_state = "|1⟩"
        # Calculate damage: 100% max HP + waveform bonus with proper RPG formula and damage roll
        base_power = current_hp + damage_bonus
        base_damage = calculate_damage_rpg(quantum_state.attack_stat, base_power, defender_defense)
        damage = apply_damage_roll(base_damage)
        message = f"Q-METRONOME deals {damage} damage! (|1⟩ state, {quantum_state.waveform_stacks} waveform stacks)"
    else:
        quantum_state.qubit_state = "|0⟩"
        # Calculate damage: 10 base + waveform bonus with proper RPG formula and damage roll
        base_power = 10 + damage_bonus
        base_damage = calculate_damage_rpg(quantum_state.attack_stat, base_power, defender_defense)
        damage = apply_damage_roll(base_damage)
        message = f"Q-METRONOME deals {damage} damage! (|0⟩ state, {quantum_state.waveform_stacks} waveform stacks)"
    
    # Gain waveform stack since qubit was in superposition before collapsing
    quantum_state.waveform_stacks += 1
    waveform_gained = 1
    message += " (gained waveform stack)"
    
    return {
        "success": True,
        "damage": damage,
        "message": message,
        "qubit_state": quantum_state.qubit_state,
        "waveform_stacks": quantum_state.waveform_stacks,
        "quantum_result": result,
        "waveform_gained": waveform_gained
    }

def quantum_move_resona_wave_crash(quantum_state, enemy_qubit_state="|0⟩", defender_defense=50):
    """WAVE CRASH: Deals damage + bonus if superposition, collapses qubit"""
    # Check for superposition bonus
    superposition_bonus = 0
    if quantum_state.qubit_state == "superposition":
        superposition_bonus += 20
    if enemy_qubit_state == "superposition":
        superposition_bonus += 20
    
    # Create circuit for quantum randomness with collapse probability bonus
    if quantum_state.next_turn_collapse_bonus > 0:
        # Use biased quantum state for higher |1⟩ probability
        qc = biased_quantum_state(0, 0.5 + quantum_state.next_turn_collapse_bonus)
        result = run_quantum_circuit(qc, shots=1)
        quantum_state.next_turn_collapse_bonus = 0  # Reset after use
    else:
        qc = create_superposition(0)
        qc = measure_qubit(qc, 0)
        result = run_quantum_circuit(qc, shots=1)
    
    # Calculate base damage (15) with proper RPG formula
    base_damage = calculate_damage_rpg(quantum_state.attack_stat, 15, defender_defense)
    total_damage = base_damage
    
    # Check if qubit was in superposition before collapsing
    was_in_superposition = quantum_state.qubit_state == "superposition"
    
    # Add superposition bonus as flat damage
    if superposition_bonus > 0:
        bonus_damage = superposition_bonus  # Flat bonus, not calculated through formula
        total_damage += bonus_damage
    
    # Apply damage roll to final damage
    total_damage = apply_damage_roll(total_damage)
    
    # Collapse qubit randomly
    if "1" in result:
        quantum_state.qubit_state = "|1⟩"
    else:
        quantum_state.qubit_state = "|0⟩"
    
    # Gain waveform stack only if qubit was in superposition before collapsing
    waveform_gained = 0
    if was_in_superposition:
        quantum_state.waveform_stacks += 1
        waveform_gained = 1
    
    if superposition_bonus > 0:
        if waveform_gained > 0:
            message = f"WAVE CRASH deals {total_damage} damage! (+{superposition_bonus} superposition bonus, gained waveform stack)"
        else:
            message = f"WAVE CRASH deals {total_damage} damage! (+{superposition_bonus} superposition bonus)"
    else:
        if waveform_gained > 0:
            message = f"WAVE CRASH deals {total_damage} damage! (gained waveform stack)"
        else:
            message = f"WAVE CRASH deals {total_damage} damage!"
    
    return {
        "success": True,
        "damage": total_damage,
        "message": message,
        "qubit_state": quantum_state.qubit_state,
        "waveform_stacks": quantum_state.waveform_stacks,
        "quantum_result": result,
        "waveform_gained": waveform_gained
    }

def quantum_move_resona_metal_noise(quantum_state, enemy_qubit_state="|0⟩", defender_defense=50):
    """METAL NOISE: Prevents enemy state changes, conditional damage"""
    # Check enemy qubit state for conditional damage
    if enemy_qubit_state == "|0⟩":
        base_damage = calculate_damage_rpg(quantum_state.attack_stat, 20, defender_defense)
        damage = apply_damage_roll(base_damage)
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