# Resona - The Interference Quantumon

## Character Stats
- **Name**: Resona
- **Element/Type**: Quantum / Interference
- **Tagline**: "A mysterious quantumon that manipulates waveforms and interference patterns."
- **HP**: 95
- **Attack**: 65
- **Defense**: 50 (placeholder for future implementation)
- **Speed**: 6 (placeholder for future implementation)

## Ability: QUANTUM WAVEFORM
Every time Resona collapses the qubit, it gains one Waveform stack. A Waveform stack increases the probability of collapsing to a 1 by an additional 2% and increases the damage of Q-Metronome by 1.

## Moves

### Q-METRONOME* (Signature Quantum Move)
- **Description**: Resona's Q-Move. Collapses the qubit. If it is in a state of 1, deals 100% of max HP as damage. If it is in a state of 0, deal base damage.
- **Base Damage**: 10 (or 100% max HP if |1⟩)
- **Quantum Logic**: Collapses qubit state, damage scales with waveform stacks
- **Effect**: High-risk, high-reward damage that scales with waveform stacks

### WAVE CRASH (Regular Move)
- **Description**: Deals damage and deals additional damage if the qubit and/or the enemy's qubit is in a state of SUPERPOSITION. Collapses the qubit.
- **Base Damage**: 20 + 40 (if superposition)
- **Quantum Logic**: Uses quantum randomness, collapses qubit
- **Effect**: Reliable damage with superposition bonus

### METAL NOISE (Regular Move)
- **Description**: Prevents the enemy from using moves that change their qubit state for the next turn. If the enemy's qubit is in a state of 1, they may not use a Q-Move. If it is in a state of 0, deal damage.
- **Base Damage**: 20 (if enemy qubit is |0⟩)
- **Quantum Logic**: Conditional damage based on enemy qubit state
- **Effect**: Control move with conditional damage

### SHIFT GEAR (Regular Move)
- **Description**: Puts the qubit in a state of SUPERPOSITION. For the next turn, increase the probability of the qubit collapsing to 1 by 25%.
- **Base Damage**: 0 (setup move)
- **Quantum Logic**: Creates superposition with collapse probability boost
- **Effect**: Setup move for future waveform stacking

## Strategy
Resona excels at waveform stacking and interference tactics. Use SHIFT GEAR to create superposition, then WAVE CRASH to gain waveform stacks. Build up stacks for powerful Q-METRONOME hits. METAL NOISE provides control and conditional damage. The key is managing waveform stacks for late-game scaling.

## Damage Calculation
Final Damage = ((2 * Level + 10) / 250 + 2) * Attack * Base Power / Defense + 2
Where Level = 50, Attack = 65, Defense = 50 (placeholder)

## Waveform Stacking Mechanics
- Each collapse grants +1 waveform stack
- Each stack: +2% probability of collapsing to |1⟩
- Each stack: +1 damage to Q-METRONOME
- Stacks persist throughout battle 