import sys
import os
import random
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..', 'quantum_gates'))

from basic_gates import (
    hadamard_gate, x_gate, cnot_gate, swap_gate, create_superposition, 
    measure_qubit, run_quantum_circuit, calculate_damage, apply_damage_roll
)

def calculate_damage_rpg(attacker_attack, move_base_power, defender_defense):
    """RPG-style damage formula: (Attack + Base Power) * 0.9 / (Defense * 0.05 + 1)"""
    damage = (attacker_attack + move_base_power) * 0.9 / (defender_defense * 0.05 + 1)
    return max(1, int(damage))  # Minimum 1 damage

class HigscrozmaQuantumState:
    """Manages HIGSCROZMA's quantum state throughout battle"""
    def __init__(self):
        self.qubit_state = "|0⟩"  # |0⟩, |1⟩, or "superposition"
        self.attack_stat = 70
        self.defense = 25  # Extremely low, must use BARRIER to increase
        self.speed = 12  # High speed for SHADOW FORCE priority
        self.barriers_in_front = 3  # Start with 3 barriers in front (behind first barrier)
        self.barriers_behind = 0    # Start with 0 barriers behind
        self.next_turn_strike = False  # For SHADOW FORCE invincibility
        self.next_turn_strike_damage = 0  # Damage for next turn strike
        self.cannot_move_next_turn = False  # For SHADOW FORCE |1⟩ effect

def quantum_move_higscrozma_q_void_rift(quantum_state, current_hp=85, max_hp=85, defender_defense=50):
    """Q-VOID RIFT: Higscrozma's Q-Move. Deals damage and additional damage equal to 10% of Defense stat. Heals the user 10% max HP per barrier behind the user, and then shatters those barriers."""
    # Create circuit for quantum randomness
    qc = create_superposition(0)
    qc = measure_qubit(qc, 0)
    result = run_quantum_circuit(qc, shots=1)
    
    # Calculate base damage (150 base power for Q-Move) with proper RPG formula
    base_damage = calculate_damage_rpg(quantum_state.attack_stat, 150, defender_defense)
    
    # Add 10% of Defense stat as additional damage
    defense_bonus = int(quantum_state.defense * 0.10)
    total_damage = base_damage + defense_bonus
    
    # Apply damage roll to final damage
    total_damage = apply_damage_roll(total_damage)
    
    # Calculate healing (10% max HP per barrier behind)
    heal_amount = int(max_hp * 0.10 * quantum_state.barriers_behind)
    
    # Shatter barriers behind (they get destroyed)
    barriers_shattered = quantum_state.barriers_behind
    quantum_state.barriers_behind = 0
    
    # Collapse qubit randomly
    if "1" in result:
        quantum_state.qubit_state = "|1⟩"
    else:
        quantum_state.qubit_state = "|0⟩"
    
    message = f"Q-VOID RIFT deals {total_damage} damage! (+{defense_bonus} from Defense)"
    if heal_amount > 0:
        message += f" Heals {heal_amount} HP! Shatters {barriers_shattered} barriers!"
    else:
        message += f" Shatters {barriers_shattered} barriers!"
    
    # Print barrier effects
    barrier_effect = f" (Barriers: {quantum_state.barriers_in_front} front, {quantum_state.barriers_behind} back)"
    message += barrier_effect
    
    return {
        "success": True,
        "damage": total_damage,
        "heal": heal_amount,
        "barriers_shattered": barriers_shattered,
        "message": message,
        "qubit_state": quantum_state.qubit_state,
        "barriers_in_front": quantum_state.barriers_in_front,
        "barriers_behind": quantum_state.barriers_behind,
        "quantum_result": result
    }

def quantum_move_higscrozma_prismatic_laser(quantum_state, defender_defense=50):
    """PRISMATIC LASER: Deals damage and shatters one random barrier. Places the qubit in a state of SUPERPOSITION. (DMG: 90)"""
    # Create circuit for quantum randomness
    qc = create_superposition(0)
    qc = measure_qubit(qc, 0)
    result = run_quantum_circuit(qc, shots=1)
    
    # Calculate damage (90 base power) with proper RPG formula and damage roll
    base_damage = calculate_damage_rpg(quantum_state.attack_stat, 90, defender_defense)
    damage = apply_damage_roll(base_damage)
    
    # Shatter one random barrier
    total_barriers = quantum_state.barriers_in_front + quantum_state.barriers_behind
    if total_barriers > 0:
        # Randomly choose which barrier to shatter
        if random.random() < quantum_state.barriers_in_front / total_barriers:
            # Shatter front barrier
            quantum_state.barriers_in_front -= 1
            barrier_shattered = "front"
        else:
            # Shatter back barrier
            quantum_state.barriers_behind -= 1
            barrier_shattered = "back"
    else:
        barrier_shattered = "none"
    
    # Put qubit in superposition
    quantum_state.qubit_state = "superposition"
    
    if barrier_shattered != "none":
        message = f"PRISMATIC LASER deals {damage} damage! Shatters {barrier_shattered} barrier! Qubit in superposition!"
    else:
        message = f"PRISMATIC LASER deals {damage} damage! Qubit in superposition!"
    
    # Print barrier effects
    barrier_effect = f" (Barriers: {quantum_state.barriers_in_front} front, {quantum_state.barriers_behind} back)"
    message += barrier_effect
    
    return {
        "success": True,
        "damage": damage,
        "barrier_shattered": barrier_shattered,
        "message": message,
        "qubit_state": quantum_state.qubit_state,
        "barriers_in_front": quantum_state.barriers_in_front,
        "barriers_behind": quantum_state.barriers_behind,
        "quantum_result": result
    }

def quantum_move_higscrozma_shadow_force(quantum_state, defender_defense=50):
    """SHADOW FORCE: If the qubit is not in SUPERPOSITION, this move fails. Collapses the qubit. If 0, the user does damage. If 1, the user becomes invincible for the current turn, but strikes for massive damage next turn. Moves up one barrier. (DMG 0: 70, DMG 1: 110)"""
    if quantum_state.qubit_state != "superposition":
        return {
            "success": False,
            "damage": 0,
            "message": "SHADOW FORCE failed! Qubit not in superposition.",
            "qubit_state": quantum_state.qubit_state
        }
    
    # Create circuit to measure superposition state
    qc = create_superposition(0)
    qc = measure_qubit(qc, 0)
    result = run_quantum_circuit(qc, shots=1)
    
    # Move up one barrier (if possible)
    if quantum_state.barriers_in_front > 0:
        quantum_state.barriers_in_front -= 1
        quantum_state.barriers_behind += 1
        barrier_moved = True
    else:
        barrier_moved = False
    
    # Determine collapse result
    if "1" in result:
        quantum_state.qubit_state = "|1⟩"
        # User becomes invincible for current turn, strikes for massive damage next turn
        quantum_state.next_turn_strike = True
        quantum_state.next_turn_strike_damage = 110  # Massive damage next turn
        quantum_state.cannot_move_next_turn = True  # Set flag to prevent move usage next turn
        message = f"SHADOW FORCE collapses to |1⟩! User becomes invincible this turn, will strike for {110} damage next turn!"
    else:
        quantum_state.qubit_state = "|0⟩"
        # Deal damage immediately (70 base power)
        base_damage = calculate_damage_rpg(quantum_state.attack_stat, 70, defender_defense)
        damage = apply_damage_roll(base_damage)
        message = f"SHADOW FORCE deals {damage} damage! (collapsed to |0⟩)"
    
    if barrier_moved:
        message += " Moved up one barrier!"
    
    # Print barrier effects
    barrier_effect = f" (Barriers: {quantum_state.barriers_in_front} front, {quantum_state.barriers_behind} back)"
    message += barrier_effect
    
    return {
        "success": True,
        "damage": damage if "0" in result else 0,
        "next_turn_strike": quantum_state.next_turn_strike,
        "next_turn_strike_damage": quantum_state.next_turn_strike_damage,
        "cannot_move_next_turn": quantum_state.cannot_move_next_turn,
        "message": message,
        "qubit_state": quantum_state.qubit_state,
        "barriers_in_front": quantum_state.barriers_in_front,
        "barriers_behind": quantum_state.barriers_behind,
        "quantum_result": result
    }

def quantum_move_higscrozma_barrier(quantum_state):
    """BARRIER: Increases the defense stat by 10 if the maximum number of barriers are active. Creates a new barrier in front of the user's current position if not. Puts the qubit in a state of SUPERPOSITION."""
    # Check if maximum number of barriers are active (3 total)
    total_barriers = quantum_state.barriers_in_front + quantum_state.barriers_behind
    
    if total_barriers >= 3:
        # Maximum barriers active, increase defense by 10
        quantum_state.defense += 10
        defense_buff = 10
        barrier_created = False
        message = f"BARRIER increases Defense by {defense_buff}! (max barriers active)"
    else:
        # Create new barrier in front of current position
        quantum_state.barriers_in_front += 1
        defense_buff = 0
        barrier_created = True
        message = f"BARRIER creates new barrier in front! ({quantum_state.barriers_in_front} front, {quantum_state.barriers_behind} back)"
    
    # Put qubit in superposition
    quantum_state.qubit_state = "superposition"
    
    # Print barrier effects
    barrier_effect = f" (Barriers: {quantum_state.barriers_in_front} front, {quantum_state.barriers_behind} back)"
    message += barrier_effect
    
    return {
        "success": True,
        "damage": 0,
        "defense_buff": defense_buff,
        "barrier_created": barrier_created,
        "message": message,
        "qubit_state": quantum_state.qubit_state,
        "barriers_in_front": quantum_state.barriers_in_front,
        "barriers_behind": quantum_state.barriers_behind
    }

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