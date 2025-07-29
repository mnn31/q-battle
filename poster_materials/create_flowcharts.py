import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.patches import FancyBboxPatch, ConnectionPatch
import numpy as np

# Set up the plotting style
plt.style.use('default')
plt.rcParams['font.size'] = 10
plt.rcParams['font.family'] = 'serif'

def create_quantum_gate_flowchart():
    """Create Figure 2: Quantum Gate Flowchart"""
    fig, ax = plt.subplots(1, 1, figsize=(12, 8))
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 8)
    ax.axis('off')
    
    # Title
    ax.text(5, 7.5, 'Quantum Gate Flowchart: Hadamard Gate in Bitzy\'s Moves', 
            fontsize=14, fontweight='bold', ha='center')
    
    # Boxes
    boxes = [
        {'pos': (1, 6), 'text': 'Classical Bit\n|0⟩', 'color': 'lightblue'},
        {'pos': (3, 6), 'text': 'Apply H-Gate\nH|0⟩', 'color': 'lightgreen'},
        {'pos': (5, 6), 'text': 'Superposition\n(|0⟩ + |1⟩)/√2', 'color': 'lightyellow'},
        {'pos': (7, 6), 'text': 'Measurement\n|0⟩ or |1⟩', 'color': 'lightcoral'},
        {'pos': (2, 4), 'text': '50% Probability\n|0⟩', 'color': 'lightblue'},
        {'pos': (6, 4), 'text': '50% Probability\n|1⟩', 'color': 'lightcoral'},
        {'pos': (4, 2), 'text': 'Game Effect:\nDamage or No Damage', 'color': 'lightgreen'}
    ]
    
    # Draw boxes
    for box in boxes:
        x, y = box['pos']
        rect = FancyBboxPatch((x-0.8, y-0.6), 1.6, 1.2, 
                             boxstyle="round,pad=0.1", 
                             facecolor=box['color'], 
                             edgecolor='black', linewidth=2)
        ax.add_patch(rect)
        ax.text(x, y, box['text'], ha='center', va='center', fontweight='bold')
    
    # Arrows
    arrows = [
        ((1.8, 6), (2.2, 6)),  # |0⟩ to H-gate
        ((3.8, 6), (4.2, 6)),  # H-gate to superposition
        ((5.8, 6), (6.2, 6)),  # superposition to measurement
        ((7, 5.4), (2, 4.6)),  # measurement to |0⟩
        ((7, 5.4), (6, 4.6)),  # measurement to |1⟩
        ((2, 3.4), (4, 2.6)),  # |0⟩ to game effect
        ((6, 3.4), (4, 2.6)),  # |1⟩ to game effect
    ]
    
    for start, end in arrows:
        arrow = ConnectionPatch(start, end, "data", "data",
                              arrowstyle="->", shrinkA=5, shrinkB=5,
                              mutation_scale=20, fc="black", lw=2)
        ax.add_patch(arrow)
    
    plt.tight_layout()
    plt.savefig('quantum_gate_flowchart.png', dpi=300, bbox_inches='tight')
    plt.close()

def create_entanglement_flowchart():
    """Create Figure 3: Entanglement Flowchart"""
    fig, ax = plt.subplots(1, 1, figsize=(12, 8))
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 8)
    ax.axis('off')
    
    # Title
    ax.text(5, 7.5, 'Entanglement Flowchart: Neutrinette\'s Quantum Afterburn', 
            fontsize=14, fontweight='bold', ha='center')
    
    # Boxes
    boxes = [
        {'pos': (1, 6), 'text': 'Two Qubits\n|00⟩', 'color': 'lightblue'},
        {'pos': (3, 6), 'text': 'Apply CNOT\nGate', 'color': 'lightgreen'},
        {'pos': (5, 6), 'text': 'Bell State\n(|00⟩ + |11⟩)/√2', 'color': 'lightyellow'},
        {'pos': (7, 6), 'text': 'Measure\nOne Qubit', 'color': 'lightcoral'},
        {'pos': (2, 4), 'text': 'Player Qubit\nCollapses', 'color': 'lightblue'},
        {'pos': (6, 4), 'text': 'Enemy Qubit\nInstantly Collapses', 'color': 'lightcoral'},
        {'pos': (4, 2), 'text': 'Game Effect:\nShared Damage/Healing', 'color': 'lightgreen'}
    ]
    
    # Draw boxes
    for box in boxes:
        x, y = box['pos']
        rect = FancyBboxPatch((x-0.8, y-0.6), 1.6, 1.2, 
                             boxstyle="round,pad=0.1", 
                             facecolor=box['color'], 
                             edgecolor='black', linewidth=2)
        ax.add_patch(rect)
        ax.text(x, y, box['text'], ha='center', va='center', fontweight='bold')
    
    # Arrows
    arrows = [
        ((1.8, 6), (2.2, 6)),  # |00⟩ to CNOT
        ((3.8, 6), (4.2, 6)),  # CNOT to Bell state
        ((5.8, 6), (6.2, 6)),  # Bell state to measurement
        ((7, 5.4), (2, 4.6)),  # measurement to player
        ((7, 5.4), (6, 4.6)),  # measurement to enemy
        ((2, 3.4), (4, 2.6)),  # player to game effect
        ((6, 3.4), (4, 2.6)),  # enemy to game effect
    ]
    
    for start, end in arrows:
        arrow = ConnectionPatch(start, end, "data", "data",
                              arrowstyle="->", shrinkA=5, shrinkB=5,
                              mutation_scale=20, fc="black", lw=2)
        ax.add_patch(arrow)
    
    plt.tight_layout()
    plt.savefig('entanglement_flowchart.png', dpi=300, bbox_inches='tight')
    plt.close()

def create_interference_flowchart():
    """Create Figure 4: Interference Flowchart"""
    fig, ax = plt.subplots(1, 1, figsize=(12, 8))
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 8)
    ax.axis('off')
    
    # Title
    ax.text(5, 7.5, 'Interference Flowchart: Resona\'s Waveform Mechanics', 
            fontsize=14, fontweight='bold', ha='center')
    
    # Boxes
    boxes = [
        {'pos': (1, 6), 'text': 'SHIFT GEAR\nGain Waveform', 'color': 'lightblue'},
        {'pos': (3, 6), 'text': 'Multiple\nWaveform Stacks', 'color': 'lightgreen'},
        {'pos': (5, 6), 'text': 'Q-METRONOME\nTriggers Interference', 'color': 'lightyellow'},
        {'pos': (7, 6), 'text': 'Phase\nCalculation', 'color': 'lightcoral'},
        {'pos': (2, 4), 'text': 'Constructive\nInterference', 'color': 'lightblue'},
        {'pos': (6, 4), 'text': 'Destructive\nInterference', 'color': 'lightcoral'},
        {'pos': (4, 2), 'text': 'Game Effect:\nHigh/Low Damage', 'color': 'lightgreen'}
    ]
    
    # Draw boxes
    for box in boxes:
        x, y = box['pos']
        rect = FancyBboxPatch((x-0.8, y-0.6), 1.6, 1.2, 
                             boxstyle="round,pad=0.1", 
                             facecolor=box['color'], 
                             edgecolor='black', linewidth=2)
        ax.add_patch(rect)
        ax.text(x, y, box['text'], ha='center', va='center', fontweight='bold')
    
    # Arrows
    arrows = [
        ((1.8, 6), (2.2, 6)),  # SHIFT GEAR to stacks
        ((3.8, 6), (4.2, 6)),  # stacks to Q-METRONOME
        ((5.8, 6), (6.2, 6)),  # Q-METRONOME to phase
        ((7, 5.4), (2, 4.6)),  # phase to constructive
        ((7, 5.4), (6, 4.6)),  # phase to destructive
        ((2, 3.4), (4, 2.6)),  # constructive to game effect
        ((6, 3.4), (4, 2.6)),  # destructive to game effect
    ]
    
    for start, end in arrows:
        arrow = ConnectionPatch(start, end, "data", "data",
                              arrowstyle="->", shrinkA=5, shrinkB=5,
                              mutation_scale=20, fc="black", lw=2)
        ax.add_patch(arrow)
    
    plt.tight_layout()
    plt.savefig('interference_flowchart.png', dpi=300, bbox_inches='tight')
    plt.close()

def create_tunneling_flowchart():
    """Create Figure 5: Quantum Tunneling Flowchart"""
    fig, ax = plt.subplots(1, 1, figsize=(12, 8))
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 8)
    ax.axis('off')
    
    # Title
    ax.text(5, 7.5, 'Quantum Tunneling Flowchart: Higscrozma\'s Barrier System', 
            fontsize=14, fontweight='bold', ha='center')
    
    # Boxes
    boxes = [
        {'pos': (1, 6), 'text': 'Quantum State\nApproaches Barriers', 'color': 'lightblue'},
        {'pos': (3, 6), 'text': 'Barrier\nConfiguration', 'color': 'lightgreen'},
        {'pos': (5, 6), 'text': 'SHADOW FORCE\nTunneling Attempt', 'color': 'lightyellow'},
        {'pos': (7, 6), 'text': 'Probability\nCalculation', 'color': 'lightcoral'},
        {'pos': (2, 4), 'text': 'Tunneling\nSuccess', 'color': 'lightblue'},
        {'pos': (6, 4), 'text': 'Reflection\nNo Tunneling', 'color': 'lightcoral'},
        {'pos': (4, 2), 'text': 'Game Effect:\nDamage or Invincibility', 'color': 'lightgreen'}
    ]
    
    # Draw boxes
    for box in boxes:
        x, y = box['pos']
        rect = FancyBboxPatch((x-0.8, y-0.6), 1.6, 1.2, 
                             boxstyle="round,pad=0.1", 
                             facecolor=box['color'], 
                             edgecolor='black', linewidth=2)
        ax.add_patch(rect)
        ax.text(x, y, box['text'], ha='center', va='center', fontweight='bold')
    
    # Arrows
    arrows = [
        ((1.8, 6), (2.2, 6)),  # state to barriers
        ((3.8, 6), (4.2, 6)),  # barriers to SHADOW FORCE
        ((5.8, 6), (6.2, 6)),  # SHADOW FORCE to probability
        ((7, 5.4), (2, 4.6)),  # probability to tunneling
        ((7, 5.4), (6, 4.6)),  # probability to reflection
        ((2, 3.4), (4, 2.6)),  # tunneling to game effect
        ((6, 3.4), (4, 2.6)),  # reflection to game effect
    ]
    
    for start, end in arrows:
        arrow = ConnectionPatch(start, end, "data", "data",
                              arrowstyle="->", shrinkA=5, shrinkB=5,
                              mutation_scale=20, fc="black", lw=2)
        ax.add_patch(arrow)
    
    plt.tight_layout()
    plt.savefig('tunneling_flowchart.png', dpi=300, bbox_inches='tight')
    plt.close()

def create_system_architecture():
    """Create Figure 6: System Architecture Diagram"""
    fig, ax = plt.subplots(1, 1, figsize=(14, 10))
    ax.set_xlim(0, 12)
    ax.set_ylim(0, 10)
    ax.axis('off')
    
    # Title
    ax.text(6, 9.5, 'System Architecture: Quantum-Classical Integration', 
            fontsize=16, fontweight='bold', ha='center')
    
    # Components
    components = [
        {'pos': (2, 8), 'text': 'Frontend\n(JavaScript/CSS)', 'color': 'lightblue', 'size': (2, 1.5)},
        {'pos': (6, 8), 'text': 'Flask Backend\n(Python)', 'color': 'lightgreen', 'size': (2, 1.5)},
        {'pos': (10, 8), 'text': 'Qiskit\nQuantum Circuits', 'color': 'lightyellow', 'size': (2, 1.5)},
        {'pos': (2, 6), 'text': 'User Interface\nReal-time Updates', 'color': 'lightcoral', 'size': (2, 1.5)},
        {'pos': (6, 6), 'text': 'Game Logic\nState Management', 'color': 'lightblue', 'size': (2, 1.5)},
        {'pos': (10, 6), 'text': 'Quantum\nRandomness', 'color': 'lightgreen', 'size': (2, 1.5)},
        {'pos': (2, 4), 'text': 'Character\nAnimations', 'color': 'lightyellow', 'size': (2, 1.5)},
        {'pos': (6, 4), 'text': 'Move Processing\nDamage Calculation', 'color': 'lightcoral', 'size': (2, 1.5)},
        {'pos': (10, 4), 'text': 'Quantum State\nCollapse', 'color': 'lightblue', 'size': (2, 1.5)},
        {'pos': (6, 2), 'text': 'Real-time\nCommunication', 'color': 'lightgreen', 'size': (4, 1.5)},
    ]
    
    # Draw components
    for comp in components:
        x, y = comp['pos']
        w, h = comp['size']
        rect = FancyBboxPatch((x-w/2, y-h/2), w, h, 
                             boxstyle="round,pad=0.1", 
                             facecolor=comp['color'], 
                             edgecolor='black', linewidth=2)
        ax.add_patch(rect)
        ax.text(x, y, comp['text'], ha='center', va='center', fontweight='bold')
    
    # Arrows showing data flow
    arrows = [
        ((6, 7.25), (2, 6.75)),  # Backend to Frontend
        ((6, 7.25), (10, 6.75)), # Backend to Qiskit
        ((10, 5.25), (6, 5.75)), # Qiskit to Backend
        ((6, 3.25), (2, 4.75)),  # Backend to Frontend
        ((2, 5.25), (6, 4.75)),  # Frontend to Backend
    ]
    
    for start, end in arrows:
        arrow = ConnectionPatch(start, end, "data", "data",
                              arrowstyle="->", shrinkA=5, shrinkB=5,
                              mutation_scale=20, fc="black", lw=2)
        ax.add_patch(arrow)
    
    plt.tight_layout()
    plt.savefig('system_architecture.png', dpi=300, bbox_inches='tight')
    plt.close()

if __name__ == "__main__":
    print("Creating flowcharts...")
    create_quantum_gate_flowchart()
    create_entanglement_flowchart()
    create_interference_flowchart()
    create_tunneling_flowchart()
    create_system_architecture()
    print("All flowcharts created successfully!") 