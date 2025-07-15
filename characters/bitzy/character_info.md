# Bitzy - The Mischievous Quantumon

## Character Stats
- **Name**: Bitzy
- **Element/Type**: Quantum / Spark
- **Tagline**: "A mischievous qubit wrapped in crackling energy."
- **HP**: 90
- **Attack**: 75
- **Defense**: 50 (placeholder for future implementation)

## Ability: SUPERHIJACK
Deals an additional 10 damage to the opponent if the enemy's qubit is in the state of 1.

## Moves

### Q-THUNDER* (Signature Q-Move)
- **Description**: Bitzy's Q-Move. If the qubit is in a state of SUPERPOSITION, this move deals massive damage and collapses the qubit randomly. Else, fails.
- **Base Damage**: 90
- **Quantum Logic**: Requires superposition state, then collapses it
- **Effect**: Massive damage when qubit is in superposition

### SHOCK
- **Description**: Does damage. Additional damage is dealt if the qubit and the enemy's qubit are in different states.
- **Base Damage**: 20 + 30 (additional if states differ)
- **Quantum Logic**: Compares qubit states between players
- **Effect**: Variable damage based on state comparison

### DUALIZE
- **Description**: Puts the qubit in a state of SUPERPOSITION if it wasn't previously.
- **Base Damage**: 0 (setup move)
- **Quantum Logic**: Hadamard gate to create superposition
- **Effect**: Prepares qubit for Q-THUNDER

### BIT-FLIP
- **Description**: Flips the state of the enemy's qubit.
- **Base Damage**: 0 (utility move)
- **Quantum Logic**: X gate on enemy qubit
- **Effect**: Changes enemy qubit state

## Strategy
Bitzy excels at quantum state manipulation. Use DUALIZE to prepare for Q-THUNDER, use SHOCK for consistent damage, and BIT-FLIP to disrupt enemy strategies. SUPERHIJACK provides bonus damage against enemies with excited qubits.

## Damage Calculation
Final Damage = ((2 * Level + 10) / 250 + 2) * Attack * Base Power / Defense + 2
Where Level = 50, Attack = 75, Defense = 50 (placeholder) 