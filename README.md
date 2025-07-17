# 🔮 Q-Battle: Quantumons

A quantum-powered battle game where you fight using quantum abilities! This project is built with Python and Qiskit to simulate quantum mechanics inside game mechanics. Players use "Quantumons" — creatures that attack with quantum moves like superposition, entanglement, and interference.

---

## ⚙️ Technologies Used

- 🧠 **Qiskit** – IBM’s quantum computing framework
- 🌐 **Flask** – Backend API server
- 🐍 **Python** – Game logic and quantum simulation
- 🎯 **CLI Interface** – Sample game for testing

---

## 🎮 Game Overview

**Q-Battle** is a player-vs-computer (PvC) game featuring three unique quantum characters:

### **Bitzy** - The Superposition Master
- **Theme**: Superposition manipulation and state control
- **Signature Move**: Q-THUNDER (90 damage if in superposition)
- **Ability**: QUANTUM HIJACK (+10 damage if enemy qubit is |1⟩)

### **Neutrinette** - The Entanglement Specialist
- **Theme**: Entanglement and shared quantum effects
- **Signature Move**: Q-PHOTON GEYSER (75 damage, costs HP, enemy loses HP if entangled)
- **Ability**: QUANTUM AFTERBURN (+10 damage if entangled)

### **Resona** - The Interference Scaler
- **Theme**: Waveform stacking and interference patterns
- **Signature Move**: Q-METRONOME (95 damage if |1⟩, 10 if |0⟩, scales with stacks)
- **Ability**: QUANTUM WAVEFORM (stacks increase collapse probability and damage)

A sample CLI game (`sample_game.py`) lets you pick a character and battle a boss in a turn-based quantum duel, with full move descriptions, quantum state tracking, and battle logs.

---

## 🚀 How to Run (Local Dev)

### 1. Clone this repository:
```bash
git clone https://github.com/mnn31/q-battle.git
cd q-battle
```

### 2. Set up environment (recommended: conda)
```bash
conda env create -f environment.yml
conda activate qbattle310
```

If you're not using conda, just make sure you have Python 3.10+ and run:
```bash
pip install qiskit qiskit-aer flask
```

### 3. Start the Flask backend:
```bash
python app.py
```
Then go to:
```
http://127.0.0.1:5000/api/hadamard
```
You’ll see quantum randomness output like `{ "1": 1 }` or `{ "0": 1 }`.

---

## 🧪 Testing
We're simulating quantum mechanics for gameplay.
Each move has a separate file, e.g.:

- `move_hadamard.py` → simulates a quantum superposition (50% attack hit chance)

Later, we’ll add:
- `move_cnot.py`
- `move_entangle.py`

Each move returns a result based on a quantum circuit run through Aer simulator.

---

## 👥 Team Roles
| Name  | Role         | Focus                                 |
|-------|--------------|---------------------------------------|
| Manan | Lead / Backend | Qiskit moves, Flask API, repo structure |
| Rohan | Game Logic   | PvC flow, classical mechanics         |
| Peter | Testing      | Unit tests, integration, fetch calls  |
| Chris | Design       | UI mockups, card layout, docs         |

---

## ✅ Week 2 Goals
- Finalize Flask backend for 2 Quantumon moves
- Set up frontend framework (React or basic HTML)
- Complete design doc + wireframes
- Add basic player/computer turn engine

---

## 🧠 Why Quantum?
Instead of fake randomness (like `random.random()`), we simulate true quantum behavior:

- **Hadamard** → 50/50 chance moves
- **Entanglement** → linked outcomes
- **Measurement** → unknown result until circuit is run

Qiskit lets us embed real quantum logic in our gameplay!

---

## 📁 Repo Structure (Work in Progress)
```
q-battle/
├── app.py                  # Flask API
├── move_hadamard.py        # Quantum move logic
├── environment.yml         # Conda environment
├── README.md               # Project info
├── static/                 # (optional frontend assets)
└── tests/                  # Test scripts (coming soon)
```

---

## 🤖 Tips for AI Code Assistants
- All quantum move files should return a dictionary of result counts
- Flask endpoints wrap the quantum functions for HTTP access
- Frontend will call these endpoints using fetch or axios
- We’re building this as a fun, beginner-friendly intro to quantum computing through games!

---