// Game state
let currentCharacter = null;
let gameState = null;
let turnCount = 1;
let isProcessingMove = false; // Prevent multiple move processing

// Character data with speed stats
const characterData = {
    "Bitzy": {
        sprite: "/static/sprites/blitzle.gif",
        speed: 85, // Speed stat for turn order
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
        speed: 90, // Speed stat for turn order
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
        speed: 70, // Speed stat for turn order
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
        speed: 60, // Speed stat for turn order
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
    
    // Set up sprite hover for ability descriptions
    setupSpriteHover(character);
    
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
            currentCharacter = character;
            turnCount = 1;
            turnNumber.textContent = `Turn ${turnCount}`;
            updateBattleDisplay();
            showBattleScreen();
            
            // Check for special effects based on move
            if (result.state.log && result.state.log.length > 0) {
                const lastLog = result.state.log[result.state.log.length - 1];
                if (lastLog.includes('BARRIER')) {
                    showSpecialEffect('barrier');
                } else if (lastLog.includes('WAVE CRASH') || lastLog.includes('Q-METRONOME')) {
                    showSpecialEffect('waveform');
                }
            }
        } else {
            console.error('Failed to start game:', result);
        }
    } catch (error) {
        console.error('Error starting battle:', error);
    }
}

// Update battle display
function updateBattleDisplay() {
    if (!gameState) return;
    
    // Update qubit states only (HP updates are handled in real-time damage logic)
    const playerState = gameState.player.qubit_state || "|0⟩";
    const enemyState = gameState.enemy.qubit_state || "|0⟩";
    
    // Convert superposition to "S" for display
    playerQubit.textContent = playerState === "superposition" ? "S" : playerState;
    enemyQubit.textContent = enemyState === "superposition" ? "S" : enemyState;

    // Flip player sprite to face right (towards Singulon)
    if (playerSprite) {
        playerSprite.classList.remove('player-facing');
        playerSprite.classList.add('enemy-facing');
    }
    // Flip enemy sprite to face left (towards player)
    const enemySprite = document.querySelector('.enemy-sprite img');
    if (enemySprite) {
        enemySprite.classList.remove('enemy-facing');
        enemySprite.classList.add('player-facing');
    }
}

// Show battle screen
function showBattleScreen() {
    characterSelection.style.display = 'none';
    battleScreen.style.display = 'block';
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

// Update health bar color based on HP percentage
function updateHealthBarColor(healthFill, hpPercent) {
    if (hpPercent > 70) {
        healthFill.style.background = 'linear-gradient(90deg, #44ff44 0%, #22cc22 100%)'; // Green
    } else if (hpPercent > 20) {
        healthFill.style.background = 'linear-gradient(90deg, #ffaa44 0%, #ff8800 100%)'; // Yellow/Orange
    } else {
        healthFill.style.background = 'linear-gradient(90deg, #ff4444 0%, #cc2222 100%)'; // Red
    }
}

// Force refresh HP from server
async function refreshHPFromServer() {
    try {
        const response = await fetch('/game-state');
        const data = await response.json();
        if (data.state) {
            gameState = data.state;
            updateBattleDisplay();
            console.log('HP refreshed from server:', gameState);
        }
    } catch (error) {
        console.error('Error refreshing HP from server:', error);
    }
}

// Manual HP update function for debugging
function forceHPUpdate() {
    console.log('Forcing HP update...');
    updateBattleDisplay();
    refreshHPFromServer();
}

// Make it available globally for debugging
window.forceHPUpdate = forceHPUpdate;
window.updateBattleDisplay = updateBattleDisplay;

// Set up sprite hover for ability descriptions
function setupSpriteHover(character) {
    const abilityDescriptions = {
        "Bitzy": "SUPERHIJACK: +10 damage when using Q-Thunder or Shock if enemy qubit is |1⟩",
        "Neutrinette": "QUANTUM AFTERBURN: +10 damage if entangled with enemy",
        "Resona": "QUANTUM WAVEFORM: Stacks increase collapse probability and damage",
        "Higscrozma": "QUANTUM BULWARK: Barriers reduce damage taken/dealt, back barriers boost damage"
    };
    
    const sprite = document.querySelector('.player-sprite');
    if (sprite) {
        sprite.setAttribute('data-description', abilityDescriptions[character] || '');
    }
}

// Show special effects
function showSpecialEffect(effectType) {
    const battleScreen = document.getElementById('battle-screen');
    
    if (effectType === 'barrier') {
        // Pink screen effect for Higscrozma barrier
        const pinkOverlay = document.createElement('div');
        pinkOverlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(45deg, #ff69b4, #ff1493);
            opacity: 0.3;
            z-index: 1000;
            pointer-events: none;
            animation: barrierEffect 1s ease-out;
        `;
        battleScreen.appendChild(pinkOverlay);
        
        setTimeout(() => {
            if (pinkOverlay.parentNode) {
                pinkOverlay.parentNode.removeChild(pinkOverlay);
            }
        }, 1000);
    } else if (effectType === 'waveform') {
        // Waveform sprite effect for Resona
        const waveformSprite = document.createElement('div');
        waveformSprite.style.cssText = `
            position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
            width: 50px;
            height: 50px;
            background: url('/static/sprites/waveform.png') no-repeat center;
            background-size: contain;
        z-index: 1000;
            animation: waveformEffect 2s ease-out;
        `;
        battleScreen.appendChild(waveformSprite);
        
        setTimeout(() => {
            if (waveformSprite.parentNode) {
                waveformSprite.parentNode.removeChild(waveformSprite);
            }
        }, 2000);
    }
}

// End battle
function endBattle(victory) {
    disableMoveButtons();
    
    if (victory) {
        showBattleMessage("🎉 Congratulations! You've won the quantum battle!");
    } else {
        showBattleMessage("💀 Better luck next time!");
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

// Simple battle message display - shows one message at a time
function showBattleMessage(message, duration = 3000) {
    // Clear any existing message
    battleLog.innerHTML = '';
    
    // Create new message element
    const messageElement = document.createElement('div');
    messageElement.className = 'log-entry';
    messageElement.textContent = message;
    battleLog.appendChild(messageElement);
    
    // Remove message after duration
    setTimeout(() => {
        if (messageElement.parentNode) {
            messageElement.parentNode.removeChild(messageElement);
        }
    }, duration);
}

// Clear battle message screen
function clearBattleMessage() {
    battleLog.innerHTML = '';
}

// Execute move with simple backend log replay
async function executeMove(moveName) {
    if (!gameState || gameState.turn !== 'player' || isProcessingMove) {
        return;
    }
    
    isProcessingMove = true;
    disableMoveButtons();
    
    try {
        // Store current log length
        const oldLogLength = gameState.log ? gameState.log.length : 0;
        
        // Send move to backend
        const response = await fetch('/move', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ move: moveName })
        });
        
        const result = await response.json();
        
        if (result.state) {
            gameState = result.state;
            
            // Get new log entries
            const newLog = gameState.log || [];
            const newEntries = newLog.slice(oldLogLength);
            
            // Display each new log entry one at a time with real-time updates
            for (let i = 0; i < newEntries.length; i++) {
                const entry = newEntries[i];
                showBattleMessage(entry, 3000);
                
                // Update qubit states based on the message being displayed
                updateQubitStatesFromMessage(entry);
                
                // Wait for message to be seen
                await new Promise(resolve => setTimeout(resolve, 3000));
            }
            
        } else {
            showBattleMessage(`Error: ${result.error || 'Unknown error'}`, 3000);
        }
        
        // Check for game end
        if (gameState.enemy.hp <= 0) {
            showBattleMessage("🎉 You defeated Singulon! Victory!", 4000);
            setTimeout(() => endBattle(true), 4000);
        } else if (gameState.player.hp <= 0) {
            showBattleMessage("💀 You fainted! Game over.", 4000);
            setTimeout(() => endBattle(false), 4000);
        } else {
            // Clear message screen and continue to next turn
            clearBattleMessage();
            turnCount++;
            turnNumber.textContent = `Turn ${turnCount}`;
            enableMoveButtons();
        }
        
    } catch (error) {
        console.error('Error executing move:', error);
        showBattleMessage('Error executing move', 3000);
        enableMoveButtons();
    } finally {
        isProcessingMove = false;
    }
}

// Update qubit states based on the message being displayed
function updateQubitStatesFromMessage(message) {
    // Check for player DUALIZE
    if (message.includes("put its qubit into superposition")) {
        const playerQubit = document.getElementById('player-qubit');
        if (playerQubit) {
            playerQubit.textContent = "S";
        }
    }
    
    // Check for BIT-FLIP
    if (message.includes("flipped Singulon's qubit to")) {
        const enemyQubit = document.getElementById('enemy-qubit');
        if (enemyQubit) {
            if (message.includes("to |1⟩")) {
                enemyQubit.textContent = "|1⟩";
            } else if (message.includes("to |0⟩")) {
                enemyQubit.textContent = "|0⟩";
            }
        }
    }
    
    // Check for enemy DUALIZE
    if (message.includes("Singulon put its qubit into superposition")) {
        const enemyQubit = document.getElementById('enemy-qubit');
        if (enemyQubit) {
            enemyQubit.textContent = "S";
        }
    }
    
    // Check for enemy HAZE
    if (message.includes("Singulon reset its qubit to |0⟩")) {
        const enemyQubit = document.getElementById('enemy-qubit');
        if (enemyQubit) {
            enemyQubit.textContent = "|0⟩";
        }
    }
    
    // Check for damage messages and update HP bars in real-time
    if (message.includes("Dealt") && message.includes("damage!")) {
        // Extract damage amount from message
        const damageMatch = message.match(/Dealt (\d+) damage!/);
        if (damageMatch) {
            const damage = parseInt(damageMatch[1]);
            
            // Determine if it's player or enemy damage based on context
            if (message.includes("Singulon used")) {
                // Enemy dealt damage to player - update visual display only
                const currentPlayerHp = gameState.player.hp;
                const newPlayerHp = Math.max(0, currentPlayerHp - damage);
                
                // Update player HP bar and text immediately (visual only)
                const playerHpPercent = (newPlayerHp / 90) * 100;
                playerHealthFill.style.width = `${Math.max(0, playerHpPercent)}%`;
                updateHealthBarColor(playerHealthFill, playerHpPercent);
                
                const playerHp = document.getElementById('player-hp');
                if (playerHp) {
                    playerHp.textContent = `${newPlayerHp}/90`;
                }
            } else {
                // Player dealt damage to enemy - update visual display only
                const currentEnemyHp = gameState.enemy.hp;
                const newEnemyHp = Math.max(0, currentEnemyHp - damage);
                
                // Update enemy HP bar and text immediately (visual only)
                const enemyHpPercent = (newEnemyHp / 400) * 100;
                enemyHealthFill.style.width = `${Math.max(0, enemyHpPercent)}%`;
                updateHealthBarColor(enemyHealthFill, enemyHpPercent);
                
                const enemyHp = document.getElementById('enemy-hp');
                if (enemyHp) {
                    enemyHp.textContent = `${newEnemyHp}/400`;
                }
            }
        }
    }
    
    // Check for final qubit state messages and update to current state
    if (message.includes("Your qubit is")) {
        const playerQubit = document.getElementById('player-qubit');
        if (playerQubit) {
            // Keep the current qubit state as displayed (don't override)
            // The qubit state should already be correct from previous real-time updates
        }
    }
    
    if (message.includes("Singulon's qubit is")) {
        const enemyQubit = document.getElementById('enemy-qubit');
        if (enemyQubit) {
            // Keep the current qubit state as displayed (don't override)
            // The qubit state should already be correct from previous real-time updates
        }
    }
}

// New function to update only HP bars and text (without qubit states)
function updateHPDisplay() {
    if (!gameState) return;
    
    // Only update HP bars and text, NOT qubit states
    const playerHpPercent = (gameState.player.hp / 90) * 100;
    const enemyHpPercent = (gameState.enemy.hp / 400) * 100;
    
    playerHealthFill.style.width = `${Math.max(0, playerHpPercent)}%`;
    enemyHealthFill.style.width = `${Math.max(0, enemyHpPercent)}%`;
    
    const playerHp = document.getElementById('player-hp');
    const enemyHp = document.getElementById('enemy-hp');
    if (playerHp) { 
        playerHp.textContent = `${Math.max(0, gameState.player.hp)}/90`; 
    }
    if (enemyHp) { 
        enemyHp.textContent = `${Math.max(0, gameState.enemy.hp)}/400`; 
    }
    
    updateHealthBarColor(playerHealthFill, playerHpPercent);
    updateHealthBarColor(enemyHealthFill, enemyHpPercent);
}