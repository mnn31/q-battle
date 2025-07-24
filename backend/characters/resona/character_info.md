# Resona

## Stats
- **HP**: 95
- **Attack**: 55
- **Defense**: 100
- **Speed**: 6

## Ability: Quantum Waveform
Every time Resona collapses the qubit, it gains one Waveform stack. A Waveform stack increases the probability of collapsing to a 1 by an additional 2% and increases the damage of Q-Metronome by 15.

## Moves

### Q-METRONOME
**Type**: Quantum Move  
**Requirement**: Qubit must be in superposition state  
**Effect**: Collapses the qubit. If it collapses to |1⟩, deals 100% of max HP as damage. If it collapses to |0⟩, deals base damage (10). Gains a waveform stack.

### WAVE CRASH
**Type**: Physical Move  
**Effect**: Deals damage and deals additional damage if the qubit and/or the enemy's qubit is in a state of SUPERPOSITION. Collapses the qubit.

### METAL NOISE
**Type**: Status Move  
**Effect**: Prevents the enemy from using moves that change their qubit state for the next turn. If the enemy's qubit is in a state of 1, they may not use a Q-Move. If it is in a state of 0, deal damage.

### SHIFT GEAR
**Type**: Status Move  
**Effect**: Puts the qubit in a state of SUPERPOSITION. For the next turn, increase the probability of the qubit collapsing to 1 by 25%.

## Strategy
Resona excels at waveform stacking and interference tactics. Use SHIFT GEAR to create superposition, then WAVE CRASH to gain waveform stacks. Build up stacks for powerful Q-METRONOME hits. METAL NOISE provides control and conditional damage. The key is managing waveform stacks for late-game scaling.

## Damage Calculation
Final Damage = ((2 * Level + 10) / 250 + 2) * Attack * Base Power / Defense + 2
Where Level = 50, Attack = 65, Defense = 50 (placeholder)

## Waveform Stacking Mechanics
- Each collapse grants +1 waveform stack
- Each stack: +2% probability of collapsing to |1⟩
- Each stack: +15 damage to Q-METRONOME
- Stacks persist throughout battle 