// Game state
let currentCharacter = null;
let gameState = null;
let turnCount = 1;

// Character data
const characterData = {
    "Bitzy": {
        sprite: "/static/sprites/blitzle.gif",
        moves: [
            { name: "Q-THUNDER", desc: "Bitzy's Q-Move. If the qubit is in a state of SUPERPOSITION, this move deals massive damage and collapses the qubit randomly. Else, fails. (DMG: 90)" },
            { name: "SHOCK", desc: "Deals damage. Additional damage is dealt if the qubit and the enemy's qubit are in different states. (DMG: 30 + 20)" },
            { name: "DUALIZE", desc: "Puts the qubit in a state of SUPERPOSITION if it wasn't previously." },
            { name: "BIT-FLIP", desc: "Flips the state of the enemy's qubit." }
        ],
        maxHp: 90
    },
    "Neutrinette": {
        sprite: "/static/sprites/neutrinette.gif",
        moves: [
            { name: "Q-PHOTON GEYSER", desc: "Neutrinette's Q-Move. Loses 25% current HP if the qubit is in a state of either 0 or 1, but deals massive damage and collapses the qubit randomly. (DMG: 75)" },
            { name: "GLITCH CLAW", desc: "Deals damage and has a chance of healing the user for 20% max HP. (DMG: 40)" },
            { name: "ENTANGLE", desc: "Puts the qubit and the enemy's qubit in a state of ENTANGLEMENT with each other if it wasn't previously." },
            { name: "SWITCHEROO", desc: "Swaps the states of the qubit and the enemy's qubit." }
        ],
        maxHp: 80
    },
    "Resona": {
        sprite: "/static/sprites/resona.gif",
        moves: [
            { name: "Q-METRONOME", desc: "Resona's Q-Move. Collapses the qubit. If it is in a state of 1, deals 100% of max HP as damage. If it is in a state of 0, deal base damage. (DMG: 10)." },
            { name: "WAVE CRASH", desc: "Deals damage and deals additional damage if the qubit and/or the enemy's qubit is in a state of SUPERPOSITION. Collapses the qubit. (DMG: 20 + 40)" },
            { name: "METAL NOISE", desc: "Prevents the enemy from using moves that change their qubit state for the next turn. If the enemy's qubit is in a state of 1, they may not use a Q-Move. If it is in a state of 0, deal damage. (DMG: 20)" },
            { name: "SHIFT GEAR", desc: "Puts the qubit in a state of SUPERPOSITION. For the next turn, increase the probability of the qubit collapsing to 1 by 25%." }
        ],
        maxHp: 95
    },
    "Higscrozma": {
        sprite: "/static/sprites/higscrozma.gif",
        moves: [
            { name: "Q-VOID RIFT", desc: "Higscrozma's Q-Move. Deals damage and additional damage equal to 10% of Defense stat. Heals the user 10% max HP per barrier behind the user, and then shatters those barriers." },
            { name: "PRISMATIC LASER", desc: "Deals damage and shatters one random barrier. Places the qubit in a state of SUPERPOSITION. (DMG: 90)" },
            { name: "SHADOW FORCE", desc: "If the qubit is not in SUPERPOSITION, this move fails. Collapses the qubit. If 0, the user does damage. If 1, the user becomes invincible for the current turn, but strikes for massive damage next turn. Moves up one barrier. (DMG 0: 70, DMG 1: 110)" },
            { name: "BARRIER", desc: "Increases the defense stat by 10 if the maximum number of barriers are active. Creates a new barrier in front of the user's current position if not. Puts the qubit in a state of SUPERPOSITION." }
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
            
            // Set up tooltip with full description
            moveButton.setAttribute('data-description', moves[i].desc);
            
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
    const playerState = gameState.player.qubit_state || "|0⟩";
    const enemyState = gameState.enemy.qubit_state || "|0⟩";
    
    // Convert superposition to "S" for display
    playerQubit.textContent = playerState === "superposition" ? "S" : playerState;
    enemyQubit.textContent = enemyState === "superposition" ? "S" : enemyState;
    
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