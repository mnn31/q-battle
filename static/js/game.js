// Game state
let currentCharacter = null;
let gameState = null;
let turnCount = 1;

// Character data
const characterData = {
    "Bitzy": {
        sprite: "/static/sprites/blitzle.gif",
        moves: [
            { name: "Q-THUNDER", desc: "Massive damage if in superposition" },
            { name: "SHOCK", desc: "Damage + bonus if different states" },
            { name: "DUALIZE", desc: "Creates superposition" },
            { name: "BIT-FLIP", desc: "Flips enemy qubit state" }
        ],
        maxHp: 90
    },
    "Neutrinette": {
        sprite: "/static/sprites/neutrinette.gif",
        moves: [
            { name: "Q-PHOTON GEYSER", desc: "High damage, costs HP, enemy loses HP if entangled" },
            { name: "GLITCH CLAW", desc: "Damage + healing" },
            { name: "ENTANGLE", desc: "Entangles with enemy" },
            { name: "SWITCHEROO", desc: "Swaps qubit states" }
        ],
        maxHp: 80
    },
    "Resona": {
        sprite: "/static/sprites/resona.gif",
        moves: [
            { name: "Q-METRONOME", desc: "High damage if |1⟩, low if |0⟩, scales with stacks" },
            { name: "WAVE CRASH", desc: "Damage based on waveform stacks" },
            { name: "METAL NOISE", desc: "Damage + defense boost" },
            { name: "SHIFT GEAR", desc: "Increases waveform stacks" }
        ],
        maxHp: 95
    },
    "Higscrozma": {
        sprite: "/static/sprites/higscrozma.gif",
        moves: [
            { name: "Q-VOID RIFT", desc: "Damage + 10% Defense, heals per barrier" },
            { name: "QUANTUM BULWARK", desc: "Creates barriers" },
            { name: "TUNNEL STRIKE", desc: "High damage through barriers" },
            { name: "BARRIER SHIFT", desc: "Manipulates barriers" }
        ],
        maxHp: 100
    }
};

// DOM elements
const characterSelection = document.getElementById('character-selection');
const battleScreen = document.getElementById('battle-screen');
const playerSprite = document.getElementById('player-sprite');
const playerName = document.getElementById('player-name');
const playerHp = document.getElementById('player-hp');
const playerHealthFill = document.getElementById('player-health-fill');
const enemyHp = document.getElementById('enemy-hp');
const enemyHealthFill = document.getElementById('enemy-health-fill');
const playerQubit = document.getElementById('player-qubit');
const enemyQubit = document.getElementById('enemy-qubit');
const turnNumber = document.getElementById('turn-number');
const battleLog = document.getElementById('battle-log');

// Initialize character selection
document.addEventListener('DOMContentLoaded', function() {
    const characterOptions = document.querySelectorAll('.character-option');
    
    characterOptions.forEach(option => {
        option.addEventListener('click', function() {
            const character = this.getAttribute('data-character');
            selectCharacter(character);
        });
    });
});

// Character selection handler
function selectCharacter(character) {
    currentCharacter = character;
    const charData = characterData[character];
    
    // Update player sprite and name
    playerSprite.src = charData.sprite;
    playerName.textContent = character;
    
    // Set up move buttons
    setupMoveButtons(charData.moves);
    
    // Start the game
    startBattle(character);
}

// Set up move buttons
function setupMoveButtons(moves) {
    for (let i = 0; i < 4; i++) {
        const moveButton = document.getElementById(`move${i + 1}`);
        const moveName = document.getElementById(`move${i + 1}-name`);
        const moveDesc = document.getElementById(`move${i + 1}-desc`);
        
        if (i < moves.length) {
            moveName.textContent = moves[i].name;
            moveDesc.textContent = moves[i].desc;
            moveButton.style.display = 'block';
            
            // Add click handler
            moveButton.onclick = () => executeMove(moves[i].name);
        } else {
            moveButton.style.display = 'none';
        }
    }
}

// Start battle
async function startBattle(character) {
    try {
        const response = await fetch(`/start?character=${character.toLowerCase()}`);
        const result = await response.json();
        
        if (result.state) {
            gameState = result.state;
            updateBattleDisplay();
            showBattleScreen();
            addLogEntry(`Battle started with ${character}!`);
        } else {
            console.error('Failed to start game:', result);
        }
    } catch (error) {
        console.error('Error starting battle:', error);
    }
}

// Execute move
async function executeMove(moveName) {
    if (!gameState || gameState.turn !== 'player') {
        addLogEntry("It's not your turn!");
        return;
    }
    
    // Disable move buttons during execution
    disableMoveButtons();
    
    try {
        const response = await fetch('/move', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ move: moveName })
        });
        
        const result = await response.json();
        
        if (result.state) {
            gameState = result.state;
            updateBattleDisplay();
            
            // Check for game end
            if (gameState.enemy.hp <= 0) {
                addLogEntry("🎉 You defeated Singulon! Victory!");
                endBattle(true);
                return;
            }
            
            if (gameState.player.hp <= 0) {
                addLogEntry("💀 You fainted! Game over.");
                endBattle(false);
                return;
            }
            
            // Enemy turn
            if (gameState.turn === 'enemy') {
                addLogEntry("Singulon is thinking...");
                setTimeout(() => {
                    updateBattleDisplay();
                    enableMoveButtons();
                    turnCount++;
                    turnNumber.textContent = `Turn ${turnCount}`;
                }, 1500);
            } else {
                enableMoveButtons();
            }
        } else {
            addLogEntry(`Error: ${result.error || 'Unknown error'}`);
            enableMoveButtons();
        }
    } catch (error) {
        console.error('Error executing move:', error);
        addLogEntry('Error executing move');
        enableMoveButtons();
    }
}

// Update battle display
function updateBattleDisplay() {
    if (!gameState) return;
    
    // Update health bars
    const playerMaxHp = characterData[currentCharacter].maxHp;
    const playerHpPercent = (gameState.player.hp / playerMaxHp) * 100;
    const enemyHpPercent = (gameState.enemy.hp / 400) * 100;
    
    playerHp.textContent = `${gameState.player.hp}/${playerMaxHp}`;
    playerHealthFill.style.width = `${Math.max(0, playerHpPercent)}%`;
    
    enemyHp.textContent = `${gameState.enemy.hp}/400`;
    enemyHealthFill.style.width = `${Math.max(0, enemyHpPercent)}%`;
    
    // Update qubit states
    playerQubit.textContent = gameState.player.qubit_state || "|0⟩";
    enemyQubit.textContent = gameState.enemy.qubit_state || "|0⟩";
    
    // Update battle log
    if (gameState.log && gameState.log.length > 0) {
        const lastEntry = gameState.log[gameState.log.length - 1];
        addLogEntry(lastEntry);
    }
}

// Show battle screen
function showBattleScreen() {
    characterSelection.style.display = 'none';
    battleScreen.style.display = 'block';
}

// Add log entry
function addLogEntry(message) {
    const logEntry = document.createElement('div');
    logEntry.className = 'log-entry';
    logEntry.textContent = message;
    battleLog.appendChild(logEntry);
    
    // Scroll to bottom
    battleLog.scrollTop = battleLog.scrollHeight;
    
    // Keep only last 10 entries
    while (battleLog.children.length > 10) {
        battleLog.removeChild(battleLog.firstChild);
    }
}

// Disable move buttons
function disableMoveButtons() {
    const moveButtons = document.querySelectorAll('.move-button');
    moveButtons.forEach(button => {
        button.disabled = true;
        button.style.opacity = '0.5';
    });
}

// Enable move buttons
function enableMoveButtons() {
    const moveButtons = document.querySelectorAll('.move-button');
    moveButtons.forEach(button => {
        button.disabled = false;
        button.style.opacity = '1';
    });
}

// End battle
function endBattle(victory) {
    disableMoveButtons();
    
    if (victory) {
        addLogEntry("🎉 Congratulations! You've won the quantum battle!");
    } else {
        addLogEntry("💀 Better luck next time!");
    }
    
    // Add restart button after a delay
    setTimeout(() => {
        const restartButton = document.createElement('button');
        restartButton.textContent = 'Play Again';
        restartButton.className = 'move-button';
        restartButton.style.margin = '20px auto';
        restartButton.style.display = 'block';
        restartButton.onclick = () => {
            location.reload();
        };
        
        const moveSelection = document.querySelector('.move-selection');
        moveSelection.appendChild(restartButton);
    }, 2000);
} 