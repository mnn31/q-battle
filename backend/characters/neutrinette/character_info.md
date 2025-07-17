# Neutrinette - The Entangled Quantumon

## Character Stats
- **Name**: Neutrinette
- **Element/Type**: Quantum / Entanglement
- **Tagline**: "A mysterious quantumon that thrives on entanglement and connection."
- **HP**: 80
- **Attack**: 80
- **Defense**: 50 (placeholder for future implementation)
- **Speed**: 7 (placeholder for future implementation)

## Ability: QUANTUM AFTERBURN
After using a move, Neutrinette will deal an additional 10 damage if the qubit and the enemy's qubit are ENTANGLED.

## Moves

### Q-PHOTON GEYSER* (Signature Quantum Move)
- **Description**: Neutrinette's Q-Move. Loses 25% current HP if the qubit is in a state of either 0 or 1, but deals massive damage and collapses the qubit randomly.
- **Base Damage**: 75
- **Quantum Logic**: Requires qubit to be in |0⟩ or |1⟩ state, then collapses it
- **Effect**: High-risk, high-reward damage with HP cost

### GLITCH CLAW (Regular Move)
- **Description**: Deals damage and has a chance of healing the user for 20% max HP.
- **Base Damage**: 40
- **Quantum Logic**: Uses quantum randomness for healing chance
- **Effect**: Reliable damage with healing potential

### ENTANGLE (Regular Move)
- **Description**: Puts the qubit and the enemy's qubit in a state of ENTANGLEMENT with each other if it wasn't previously.
- **Base Damage**: 0 (setup move)
- **Quantum Logic**: CNOT gate to create entanglement
- **Effect**: Prepares for QUANTUM AFTERBURN ability

### SWITCHEROO (Regular Move)
- **Description**: Swaps the states of the qubit and the enemy's qubit.
- **Base Damage**: 0 (utility move)
- **Quantum Logic**: SWAP gate between qubits
- **Effect**: Strategic state manipulation

## Strategy
Neutrinette excels at entanglement-based tactics. Use ENTANGLE to create quantum links, then leverage QUANTUM AFTERBURN for bonus damage. Q-PHOTON GEYSER is powerful but risky, while GLITCH CLAW provides sustainability. SWITCHEROO offers strategic state manipulation.

## Damage Calculation
Final Damage = ((2 * Level + 10) / 250 + 2) * Attack * Base Power / Defense + 2
Where Level = 50, Attack = 80, Defense = 50 (placeholder) 