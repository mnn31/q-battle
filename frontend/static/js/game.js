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
            { name: "Q-PHOTON GEYSER", desc: "Neutrinette's Q-Move. Deals massive damage and collapses the qubit randomly. (DMG: 100)" },
            { name: "GLITCH CLAW", desc: "Deals damage and has a chance of healing the user for 20% max HP. (DMG: 40)" },
            { name: "ENTANGLE", desc: "Puts the qubit and the enemy's qubit in a state of ENTANGLEMENT with each other if it wasn't previously." },
            { name: "SWITCHEROO", desc: "Swaps the states of the qubit and the enemy's qubit." }
        ],
        maxHp: 90,
        ability: "QUANTUM AFTERBURN: When Neutrinette is entangled: When taking damage, 75% of that damage is reflected back to the enemy. When attacking, deals 30 extra HP damage to the enemy."
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
    
    // Get character max HP from character data
    const charData = characterData[currentCharacter];
    const maxPlayerHp = charData ? charData.maxHp : 90;
    
    // Update HP bars and text from backend state, but preserve real-time visual updates
    const playerHpPercent = (gameState.player.hp / maxPlayerHp) * 100;
    const enemyHpPercent = (gameState.enemy.hp / 400) * 100;
    
    // Only update HP bars if we haven't already updated them in real-time
    if (!window.visualPlayerHpUpdated) {
        playerHealthFill.style.width = `${Math.max(0, playerHpPercent)}%`;
        const playerHp = document.getElementById('player-hp');
        if (playerHp) {
            playerHp.textContent = `${Math.max(0, gameState.player.hp)}/${maxPlayerHp}`;
        }
        updateHealthBarColor(playerHealthFill, playerHpPercent);
    }
    
    if (!window.visualEnemyHpUpdated) {
        enemyHealthFill.style.width = `${Math.max(0, enemyHpPercent)}%`;
        const enemyHp = document.getElementById('enemy-hp');
        if (enemyHp) {
            enemyHp.textContent = `${Math.max(0, gameState.enemy.hp)}/400`;
        }
        updateHealthBarColor(enemyHealthFill, enemyHpPercent);
    }
    
    // Clear visual HP flags after sync
    window.visualPlayerHpUpdated = null;
    window.visualEnemyHpUpdated = null;

    // Update qubit states from backend
    const playerQubit = document.getElementById('player-qubit');
    const enemyQubit = document.getElementById('enemy-qubit');
    if (playerQubit && gameState.player && gameState.player.qubit_state) {
        const qubitState = gameState.player.qubit_state;
        playerQubit.textContent = qubitState === "superposition" ? "S" : qubitState;
    }
    if (enemyQubit && gameState.enemy && gameState.enemy.qubit_state) {
        const qubitState = gameState.enemy.qubit_state;
        enemyQubit.textContent = qubitState === "superposition" ? "S" : qubitState;
    }

    // Update entanglement visual state
    if (playerQubit && enemyQubit && gameState) {
        if (gameState.is_entangled) {
            playerQubit.classList.add('entangled');
            enemyQubit.classList.add('entangled');
        } else {
            playerQubit.classList.remove('entangled');
            enemyQubit.classList.remove('entangled');
        }
    }

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
        "Neutrinette": "QUANTUM AFTERBURN: When Neutrinette is entangled: When taking damage, 75% of that damage is reflected back to the enemy. When attacking, deals 30 extra HP damage to the enemy.",
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

// Execute move with animations
async function executeMove(moveName) {
    if (!gameState || isProcessingMove) {
        return;
    }
    
    isProcessingMove = true;
    disableMoveButtons();
    
    // Trigger animations based on move
    if (currentCharacter === 'Bitzy') {
        triggerBitzyAnimation(moveName);
    } else if (currentCharacter === 'Neutrinette') {
        triggerNeutrinetteAnimation(moveName);
    }
    
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
            
            // Sync HP bars with backend state after all real-time updates
            updateBattleDisplay();
            
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

// Bitzy Animation System - Based on Pokémon Showdown
function triggerBitzyAnimation(moveName) {
    console.log('Triggering Bitzy animation for:', moveName);
    
    const playerSprite = document.getElementById('player-sprite');
    const enemySprite = document.querySelector('.enemy-sprite img');
    
    if (!playerSprite || !enemySprite) {
        console.log('Animation elements not found:', { playerSprite, enemySprite });
        return;
    }
    
    switch (moveName) {
        case 'Q-THUNDER':
            triggerQThunderAnimation(playerSprite, enemySprite);
            break;
        case 'SHOCK':
            triggerShockAnimation(playerSprite, enemySprite);
            break;
        case 'DUALIZE':
            triggerDualizeAnimation(playerSprite);
            break;
        case 'BIT-FLIP':
            triggerBitFlipAnimation(enemySprite);
            break;
    }
}

// Q-THUNDER Animation - Based on PS's thunder animation
function triggerQThunderAnimation(playerSprite, enemySprite) {
    console.log('Q-THUNDER animation triggered');
    
    // Create background flash effect (like PS's backgroundEffect)
    const backgroundFlash = document.createElement('div');
    backgroundFlash.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #ffffff;
        opacity: 0;
        z-index: 999;
        pointer-events: none;
    `;
    document.body.appendChild(backgroundFlash);
    
    // Flash sequence
    setTimeout(() => {
        backgroundFlash.style.opacity = '0.7';
        setTimeout(() => {
            backgroundFlash.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(backgroundFlash);
            }, 250);
        }, 300);
    }, 100);
    
    // Create lightning bolts - MUCH CLOSER to enemy
    const enemyRect = enemySprite.getBoundingClientRect();
    const centerX = enemyRect.left + enemyRect.width / 2;
    const topY = enemyRect.top - 50; // Much closer!
    
    // Create MANY lightning bolts for dramatic effect - Q-THUNDER gets 10 MORE
    for (let i = 0; i < 25; i++) {
        const offsetX = (Math.random() - 0.5) * 120; // Spread around enemy
        const delay = i * 40; // Staggered timing
        createLightningBolt(centerX + offsetX, topY, delay);
    }
    
    // Additional lightning bolts with different timing
    setTimeout(() => {
        for (let i = 0; i < 15; i++) {
            const offsetX = (Math.random() - 0.5) * 100;
            createLightningBolt(centerX + offsetX, topY, i * 25);
        }
    }, 300);
    
    // Third wave of lightning
    setTimeout(() => {
        for (let i = 0; i < 13; i++) {
            const offsetX = (Math.random() - 0.5) * 80;
            createLightningBolt(centerX + offsetX, topY, i * 35);
        }
    }, 600);
}

// SHOCK Animation - Based on PS's thunderbolt animation
function triggerShockAnimation(playerSprite, enemySprite) {
    console.log('SHOCK animation triggered');
    
    const enemyRect = enemySprite.getBoundingClientRect();
    const centerX = enemyRect.left + enemyRect.width / 2;
    const topY = enemyRect.top - 30; // Much closer!
    
    // Create background effect
    const backgroundEffect = document.createElement('div');
    backgroundEffect.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #000000;
        opacity: 0;
        z-index: 998;
        pointer-events: none;
    `;
    document.body.appendChild(backgroundEffect);
    
    // Background flash
    setTimeout(() => {
        backgroundEffect.style.opacity = '0.2';
        setTimeout(() => {
            backgroundEffect.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(backgroundEffect);
            }, 250);
        }, 600);
    }, 100);
    
    // Create electric sparks for focused effect - SHOCK gets 10 FEWER
    for (let i = 0; i < 2; i++) {
        const offsetX = (Math.random() - 0.5) * 60;
        const delay = i * 50;
        createElectricSpark(centerX + offsetX, topY, delay);
    }
    
    // Second wave
    setTimeout(() => {
        for (let i = 0; i < 3; i++) {
            const offsetX = (Math.random() - 0.5) * 40;
            createElectricSpark(centerX + offsetX, topY, i * 40);
        }
    }, 200);
}

// DUALIZE Animation
function triggerDualizeAnimation(playerSprite) {
    console.log('DUALIZE animation triggered');
    
    const playerRect = playerSprite.getBoundingClientRect();
    const centerX = playerRect.left + playerRect.width / 2;
    const centerY = playerRect.top + playerRect.height / 2;
    
    // Create superposition wave effect with FILLED shape
    const wave = document.createElement('div');
    wave.style.cssText = `
        position: fixed;
        left: ${centerX - 60}px;
        top: ${centerY - 60}px;
        width: 120px;
        height: 120px;
        background: radial-gradient(circle, rgba(138, 43, 226, 0.8), rgba(138, 43, 226, 0.4), rgba(138, 43, 226, 0.2));
        border-radius: 50%;
        box-shadow: 0 0 30px rgba(138, 43, 226, 0.6);
        z-index: 1000;
        pointer-events: none;
        animation: superpositionWave 1.5s ease-in-out;
    `;
    document.body.appendChild(wave);
    
    setTimeout(() => {
        if (wave.parentNode) {
            document.body.removeChild(wave);
        }
    }, 1500);
}

// BIT-FLIP Animation
function triggerBitFlipAnimation(enemySprite) {
    console.log('BIT-FLIP animation triggered');
    
    const enemyRect = enemySprite.getBoundingClientRect();
    
    // Create state change flash
    const flash = document.createElement('div');
    flash.style.cssText = `
        position: fixed;
        left: ${enemyRect.left}px;
        top: ${enemyRect.top}px;
        width: ${enemyRect.width}px;
        height: ${enemyRect.height}px;
        background: rgba(255, 255, 255, 0.9);
        z-index: 1000;
        pointer-events: none;
        animation: stateChangeFlash 0.6s ease-in-out;
    `;
    document.body.appendChild(flash);
    
    setTimeout(() => {
        if (flash.parentNode) {
            document.body.removeChild(flash);
        }
    }, 600);
}

// Helper function to create lightning bolts using PS's lightning image - MUCH FATTER
function createLightningBolt(x, y, delay) {
    setTimeout(() => {
        const lightning = document.createElement('img');
        lightning.src = '/static/images/lightning.png';
        lightning.style.cssText = `
            position: fixed;
            left: ${x - 60}px;
            top: ${y}px;
            width: 120px;
            height: 400px;
            z-index: 1000;
            pointer-events: none;
            opacity: 0;
        `;
        document.body.appendChild(lightning);
        
        // Animate like PS: start with yscale 0, animate to full height
        setTimeout(() => {
            lightning.style.opacity = '1';
            lightning.style.transform = 'scaleY(0)';
            lightning.style.transformOrigin = 'top';
            
            setTimeout(() => {
                lightning.style.transform = 'scaleY(1)';
                lightning.style.transition = 'transform 0.3s linear';
                
                setTimeout(() => {
                    lightning.style.opacity = '0';
                    lightning.style.transition = 'opacity 0.6s linear';
                    
                    setTimeout(() => {
                        if (lightning.parentNode) {
                            document.body.removeChild(lightning);
                        }
                    }, 600);
                }, 300);
            }, 50);
        }, 50);
    }, delay);
}

// Helper function to create electric sparks using PS's lightning image - MUCH FATTER
function createElectricSpark(x, y, delay) {
    setTimeout(() => {
        const spark = document.createElement('img');
        spark.src = '/static/images/lightning.png';
        spark.style.cssText = `
            position: fixed;
            left: ${x - 50}px;
            top: ${y}px;
            width: 100px;
            height: 350px;
            z-index: 1000;
            pointer-events: none;
            opacity: 0;
        `;
        document.body.appendChild(spark);
        
        // Animate like PS thunderbolt: start with yscale 0, animate to full height
        setTimeout(() => {
            spark.style.opacity = '0.9';
            spark.style.transform = 'scaleY(0)';
            spark.style.transformOrigin = 'top';
            
            setTimeout(() => {
                spark.style.transform = 'scaleY(1)';
                spark.style.transition = 'transform 0.25s linear';
                
                setTimeout(() => {
                    spark.style.opacity = '0';
                    spark.style.transition = 'opacity 0.5s linear';
                    
                    setTimeout(() => {
                        if (spark.parentNode) {
                            document.body.removeChild(spark);
                        }
                    }, 500);
                }, 250);
            }, 50);
        }, 50);
    }, delay);
}

// Neutrinette Animation System - Placeholder for now
function triggerNeutrinetteAnimation(moveName) {
    console.log('Triggering Neutrinette animation for:', moveName);
    
    const playerSprite = document.getElementById('player-sprite');
    const enemySprite = document.querySelector('.enemy-sprite img');
    
    if (!playerSprite || !enemySprite) {
        console.log('Animation elements not found:', { playerSprite, enemySprite });
        return;
    }
    
    switch (moveName) {
        case 'Q-PHOTON GEYSER':
            triggerPhotonGeyserAnimation(playerSprite, enemySprite);
            break;
        case 'GLITCH CLAW':
            triggerGlitchClawAnimation(playerSprite, enemySprite);
            break;
        case 'ENTANGLE':
            triggerEntangleAnimation(playerSprite, enemySprite);
            break;
        case 'SWITCHEROO':
            triggerSwitcherooAnimation(playerSprite, enemySprite);
            break;
    }
}

// Q-PHOTON GEYSER Animation - Based on PS's psychic moves
function triggerPhotonGeyserAnimation(playerSprite, enemySprite) {
    console.log('Q-PHOTON GEYSER animation triggered');
    
    // Create psychic background effect
    const psychicBackground = document.createElement('div');
    psychicBackground.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(45deg, #8B5CF6, #EC4899, #8B5CF6);
        opacity: 0;
        z-index: 999;
        pointer-events: none;
        animation: psychicPulse 1.5s ease-in-out;
    `;
    document.body.appendChild(psychicBackground);
    
    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes psychicPulse {
            0% { opacity: 0; }
            20% { opacity: 0.3; }
            50% { opacity: 0.6; }
            80% { opacity: 0.3; }
            100% { opacity: 0; }
        }
        @keyframes photonBeam {
            0% { transform: scaleX(0); opacity: 1; }
            50% { transform: scaleX(1); opacity: 1; }
            100% { transform: scaleX(1); opacity: 0; }
        }
        @keyframes psychicOrb {
            0% { transform: scale(0) rotate(0deg); opacity: 1; }
            50% { transform: scale(1.2) rotate(180deg); opacity: 0.8; }
            100% { transform: scale(0) rotate(360deg); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    // Create photon beam effect
    const enemyRect = enemySprite.getBoundingClientRect();
    const playerRect = playerSprite.getBoundingClientRect();
    
    // Create multiple photon beams
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const photonBeam = document.createElement('div');
            photonBeam.style.cssText = `
                position: fixed;
                left: ${playerRect.left + playerRect.width / 2}px;
                top: ${playerRect.top + playerRect.height / 2}px;
                width: 16px;
                height: 16px;
                background: linear-gradient(90deg, #FFD700, #FFA500, #FF4500);
                border-radius: 50%;
                z-index: 1000;
                pointer-events: none;
                animation: photonBeam 0.8s ease-out;
                transform-origin: left center;
            `;
            document.body.appendChild(photonBeam);
            
            // Animate beam to enemy
            setTimeout(() => {
                photonBeam.style.left = `${enemyRect.left + enemyRect.width / 2}px`;
                photonBeam.style.top = `${enemyRect.top + enemyRect.height / 2}px`;
                photonBeam.style.width = '400px';
                photonBeam.style.height = '8px';
                photonBeam.style.borderRadius = '4px';
            }, 50);
            
            setTimeout(() => {
                if (document.body.contains(photonBeam)) {
                    document.body.removeChild(photonBeam);
                }
            }, 800);
        }, i * 150);
    }
    
    // Create MUCH BIGGER psychic orbs around enemy (10x size)
    setTimeout(() => {
        for (let i = 0; i < 8; i++) {
            const orb = document.createElement('div');
            const angle = (i / 8) * 2 * Math.PI;
            const radius = 120; // Increased radius
            const x = enemyRect.left + enemyRect.width / 2 + Math.cos(angle) * radius;
            const y = enemyRect.top + enemyRect.height / 2 + Math.sin(angle) * radius;
            
            orb.style.cssText = `
                position: fixed;
                left: ${x}px;
                top: ${y}px;
                width: 200px;
                height: 200px;
                background: radial-gradient(circle, #FFD700, #FFA500, #FF4500);
                border-radius: 50%;
                z-index: 1000;
                pointer-events: none;
                animation: psychicOrb 1s ease-out;
                box-shadow: 0 0 30px #FFD700;
            `;
            document.body.appendChild(orb);
            
            setTimeout(() => {
                if (document.body.contains(orb)) {
                    document.body.removeChild(orb);
                }
            }, 1000);
        }
    }, 400);
    
    // Clean up background
    setTimeout(() => {
        if (document.body.contains(psychicBackground)) {
            document.body.removeChild(psychicBackground);
        }
        if (document.head.contains(style)) {
            document.head.removeChild(style);
        }
    }, 1500);
}

// GLITCH CLAW Animation - Based on PS's dragon claw moves
function triggerGlitchClawAnimation(playerSprite, enemySprite) {
    console.log('GLITCH CLAW animation triggered');
    
    const enemyRect = enemySprite.getBoundingClientRect();
    const playerRect = playerSprite.getBoundingClientRect();
    
    // Add CSS animation for claw effects
    const style = document.createElement('style');
    style.textContent = `
        @keyframes glitchClaw {
            0% { transform: scale(0) rotate(0deg); opacity: 0; }
            50% { transform: scale(1.2) rotate(180deg); opacity: 0.8; }
            100% { transform: scale(0) rotate(360deg); opacity: 0; }
        }
        @keyframes glitchEffect {
            0% { transform: translateX(0) skewX(0deg); }
            25% { transform: translateX(-2px) skewX(-1deg); }
            50% { transform: translateX(2px) skewX(1deg); }
            75% { transform: translateX(-1px) skewX(-0.5deg); }
            100% { transform: translateX(0) skewX(0deg); }
        }
        @keyframes clawStrike {
            0% { transform: scale(0) rotate(0deg); opacity: 0; }
            20% { transform: scale(1.5) rotate(45deg); opacity: 1; }
            40% { transform: scale(1.2) rotate(90deg); opacity: 0.8; }
            60% { transform: scale(1.5) rotate(135deg); opacity: 1; }
            80% { transform: scale(1.2) rotate(180deg); opacity: 0.8; }
            100% { transform: scale(0) rotate(225deg); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    // Create actual claw effect (based on dragon claw)
    const clawEffect = document.createElement('div');
    clawEffect.style.cssText = `
        position: fixed;
        left: ${enemyRect.left + enemyRect.width / 2 - 100}px;
        top: ${enemyRect.top + enemyRect.height / 2 - 100}px;
        width: 200px;
        height: 200px;
        background: radial-gradient(circle, transparent 20%, #4A5568 30%, #2D3748 50%, #1A202C 70%, transparent 80%);
        z-index: 1000;
        pointer-events: none;
        animation: clawStrike 0.8s ease-out;
    `;
    document.body.appendChild(clawEffect);
    
    // Create individual claw marks (like dragon claw)
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const clawMark = document.createElement('div');
            const offsetX = (Math.random() - 0.5) * 150;
            const offsetY = (Math.random() - 0.5) * 150;
            
            clawMark.style.cssText = `
                position: fixed;
                left: ${enemyRect.left + enemyRect.width / 2 + offsetX}px;
                top: ${enemyRect.top + enemyRect.height / 2 + offsetY}px;
                width: 80px;
                height: 40px;
                background: linear-gradient(45deg, #2D3748, #4A5568, #2D3748);
                clip-path: polygon(0 50%, 20% 0, 40% 20%, 60% 0, 80% 20%, 100% 0, 100% 100%, 80% 80%, 60% 100%, 40% 80%, 20% 100%, 0 50%);
                z-index: 1001;
                pointer-events: none;
                animation: clawStrike 0.6s ease-out;
                transform: rotate(${Math.random() * 360}deg);
            `;
            document.body.appendChild(clawMark);
            
            setTimeout(() => {
                if (document.body.contains(clawMark)) {
                    document.body.removeChild(clawMark);
                }
            }, 600);
        }, i * 100);
    }
    
    // Create glitch effect on enemy sprite
    enemySprite.style.animation = 'glitchEffect 0.3s ease-in-out';
    setTimeout(() => {
        enemySprite.style.animation = '';
    }, 300);
    
    // Create shadow claw trails (MUCH BIGGER)
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            const shadowClaw = document.createElement('div');
            shadowClaw.style.cssText = `
                position: fixed;
                left: ${playerRect.left + playerRect.width / 2}px;
                top: ${playerRect.top + playerRect.height / 2}px;
                width: 120px;
                height: 8px;
                background: linear-gradient(90deg, #2D3748, #4A5568, #2D3748);
                border-radius: 4px;
                z-index: 999;
                pointer-events: none;
                opacity: 0.7;
                transform: rotate(${Math.random() * 30 - 15}deg);
            `;
            document.body.appendChild(shadowClaw);
            
            // Animate shadow claw to enemy
            setTimeout(() => {
                shadowClaw.style.left = `${enemyRect.left + enemyRect.width / 2}px`;
                shadowClaw.style.top = `${enemyRect.top + enemyRect.height / 2}px`;
                shadowClaw.style.opacity = '0';
            }, 50);
            
            setTimeout(() => {
                if (document.body.contains(shadowClaw)) {
                    document.body.removeChild(shadowClaw);
                }
            }, 600);
        }, i * 100);
    }
    
    // Clean up
    setTimeout(() => {
        if (document.body.contains(clawEffect)) {
            document.body.removeChild(clawEffect);
        }
        if (document.head.contains(style)) {
            document.head.removeChild(style);
        }
    }, 800);
}

// ENTANGLE Animation - Based on PS's psychic moves
function triggerEntangleAnimation(playerSprite, enemySprite) {
    console.log('ENTANGLE animation triggered');
    
    const playerRect = playerSprite.getBoundingClientRect();
    const enemyRect = enemySprite.getBoundingClientRect();
    
    // Create MUCH BIGGER entanglement effect
    const entangleEffect = document.createElement('div');
    entangleEffect.style.cssText = `
        position: fixed;
        left: ${playerRect.left + playerRect.width / 2 - 200}px;
        top: ${playerRect.top + playerRect.height / 2 - 200}px;
        width: 400px;
        height: 400px;
        background: radial-gradient(circle, transparent 20%, #8B5CF6 30%, #EC4899 50%, transparent 70%);
        z-index: 1000;
        pointer-events: none;
        animation: entanglePulse 1.2s ease-in-out;
    `;
    document.body.appendChild(entangleEffect);
    
    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes entanglePulse {
            0% { transform: scale(0) rotate(0deg); opacity: 0; }
            50% { transform: scale(1.5) rotate(180deg); opacity: 0.6; }
            100% { transform: scale(2) rotate(360deg); opacity: 0; }
        }
        @keyframes quantumLink {
            0% { stroke-dasharray: 0 1000; opacity: 0; }
            50% { stroke-dasharray: 500 500; opacity: 1; }
            100% { stroke-dasharray: 1000 0; opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    // Create quantum link between sprites
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('style', `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 999;
        pointer-events: none;
    `);
    document.body.appendChild(svg);
    
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    const playerX = playerRect.left + playerRect.width / 2;
    const playerY = playerRect.top + playerRect.height / 2;
    const enemyX = enemyRect.left + enemyRect.width / 2;
    const enemyY = enemyRect.top + enemyRect.height / 2;
    
    line.setAttribute('x1', playerX);
    line.setAttribute('y1', playerY);
    line.setAttribute('x2', enemyX);
    line.setAttribute('y2', enemyY);
    line.setAttribute('stroke', '#8B5CF6');
    line.setAttribute('stroke-width', '8');
    line.setAttribute('stroke-dasharray', '20,10');
    line.style.animation = 'quantumLink 1.5s ease-in-out';
    
    svg.appendChild(line);
    
    // Create MUCH BIGGER quantum particles along the link
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            const progress = i / 15;
            const x = playerX + (enemyX - playerX) * progress;
            const y = playerY + (enemyY - playerY) * progress;
            
            particle.style.cssText = `
                position: fixed;
                left: ${x}px;
                top: ${y}px;
                width: 24px;
                height: 24px;
                background: radial-gradient(circle, #EC4899, #8B5CF6);
                border-radius: 50%;
                z-index: 1000;
                pointer-events: none;
                animation: entanglePulse 0.8s ease-out;
                box-shadow: 0 0 20px #EC4899;
            `;
            document.body.appendChild(particle);
            
            setTimeout(() => {
                if (document.body.contains(particle)) {
                    document.body.removeChild(particle);
                }
            }, 800);
        }, i * 100);
    }
    
    // Clean up
    setTimeout(() => {
        if (document.body.contains(entangleEffect)) {
            document.body.removeChild(entangleEffect);
        }
        if (document.body.contains(svg)) {
            document.body.removeChild(svg);
        }
        if (document.head.contains(style)) {
            document.head.removeChild(style);
        }
    }, 1500);
}

// SWITCHEROO Animation - Based on PS's psychic moves
function triggerSwitcherooAnimation(playerSprite, enemySprite) {
    console.log('SWITCHEROO animation triggered');
    
    const playerRect = playerSprite.getBoundingClientRect();
    const enemyRect = enemySprite.getBoundingClientRect();
    
    // Create MUCH BIGGER swap effect
    const swapEffect = document.createElement('div');
    swapEffect.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(45deg, #8B5CF6, #EC4899, #8B5CF6);
        opacity: 0;
        z-index: 999;
        pointer-events: none;
        animation: swapFlash 0.8s ease-in-out;
    `;
    document.body.appendChild(swapEffect);
    
    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes swapFlash {
            0% { opacity: 0; }
            30% { opacity: 0.4; }
            70% { opacity: 0.4; }
            100% { opacity: 0; }
        }
        @keyframes swapSpin {
            0% { transform: scale(1) rotate(0deg); }
            50% { transform: scale(0.8) rotate(180deg); }
            100% { transform: scale(1) rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    // Animate sprites spinning
    playerSprite.style.animation = 'swapSpin 0.8s ease-in-out';
    enemySprite.style.animation = 'swapSpin 0.8s ease-in-out';
    
    // Create MUCH BIGGER swap arrows
    setTimeout(() => {
        const arrow1 = document.createElement('div');
        arrow1.style.cssText = `
            position: fixed;
            left: ${playerRect.left + playerRect.width / 2}px;
            top: ${playerRect.top + playerRect.height / 2}px;
            width: 80px;
            height: 40px;
            background: linear-gradient(90deg, #8B5CF6, #EC4899);
            clip-path: polygon(0 50%, 100% 0, 100% 100%);
            z-index: 1000;
            pointer-events: none;
            animation: swapFlash 0.8s ease-in-out;
        `;
        document.body.appendChild(arrow1);
        
        const arrow2 = document.createElement('div');
        arrow2.style.cssText = `
            position: fixed;
            left: ${enemyRect.left + enemyRect.width / 2 - 80}px;
            top: ${enemyRect.top + enemyRect.height / 2}px;
            width: 80px;
            height: 40px;
            background: linear-gradient(90deg, #EC4899, #8B5CF6);
            clip-path: polygon(0 0, 100% 50%, 0 100%);
            z-index: 1000;
            pointer-events: none;
            animation: swapFlash 0.8s ease-in-out;
        `;
        document.body.appendChild(arrow2);
        
        setTimeout(() => {
            if (document.body.contains(arrow1)) {
                document.body.removeChild(arrow1);
            }
            if (document.body.contains(arrow2)) {
                document.body.removeChild(arrow2);
            }
        }, 800);
    }, 200);
    
    // Reset sprite animations
    setTimeout(() => {
        playerSprite.style.animation = '';
        enemySprite.style.animation = '';
    }, 800);
    
    // Clean up
    setTimeout(() => {
        if (document.body.contains(swapEffect)) {
            document.body.removeChild(swapEffect);
        }
        if (document.head.contains(style)) {
            document.head.removeChild(style);
        }
    }, 800);
}

// Update qubit states based on the message being displayed
function updateQubitStatesFromMessage(message) {
    // Check for player DUALIZE (only when player uses it, not enemy)
    if (message.includes("put its qubit into superposition") && !message.includes("Singulon")) {
        const playerQubit = document.getElementById('player-qubit');
        if (playerQubit) {
            playerQubit.textContent = "S";
        }
    }
    
    // Check for Q-THUNDER qubit collapse (when qubit collapses from superposition)
    if (message.includes("Q-THUNDER strikes for")) {
        // Q-THUNDER collapses the qubit - update from current game state
        const playerQubit = document.getElementById('player-qubit');
        if (playerQubit && gameState && gameState.player && gameState.player.qubit_state) {
            const collapsedState = gameState.player.qubit_state;
            // Remove trailing period and convert superposition to S
            const cleanState = collapsedState.replace(/\.$/, '');
            playerQubit.textContent = cleanState === "superposition" ? "S" : cleanState;
        }
    }
    
    // Check for Q-PHOTON GEYSER qubit collapse
    if (message.includes("Q-PHOTON GEYSER") && message.includes("damage")) {
        // Q-PHOTON GEYSER collapses the qubit - update from current game state
        const playerQubit = document.getElementById('player-qubit');
        if (playerQubit && gameState && gameState.player && gameState.player.qubit_state) {
            const collapsedState = gameState.player.qubit_state;
            // Remove trailing period and convert superposition to S
            const cleanState = collapsedState.replace(/\.$/, '');
            playerQubit.textContent = cleanState === "superposition" ? "S" : cleanState;
        }
    }
    
    // Check for SWITCHEROO (swaps qubit states)
    if (message.includes("swaps qubit states")) {
        const playerQubit = document.getElementById('player-qubit');
        const enemyQubit = document.getElementById('enemy-qubit');
        if (playerQubit && enemyQubit) {
            // Temporarily store the current states
            const tempPlayerState = playerQubit.textContent;
            const tempEnemyState = enemyQubit.textContent;
            // Swap them
            playerQubit.textContent = tempEnemyState;
            enemyQubit.textContent = tempPlayerState;
        }
    }
    
    // Check for "Your qubit is" messages and update visual qubit state
    if (message.includes("Your qubit is")) {
        const playerQubit = document.getElementById('player-qubit');
        if (playerQubit) {
            // Extract the qubit state from the message
            const qubitMatch = message.match(/Your qubit is (.+)/);
            if (qubitMatch) {
                const qubitState = qubitMatch[1];
                // Remove trailing period and convert superposition to S
                const cleanState = qubitState.replace(/\.$/, '');
                playerQubit.textContent = cleanState === "superposition" ? "S" : cleanState;
            }
        }
    }
    
    // Check for entanglement messages and update visual state
    if (message.includes("creates quantum entanglement")) {
        const playerQubit = document.getElementById('player-qubit');
        const enemyQubit = document.getElementById('enemy-qubit');
        if (playerQubit && enemyQubit) {
            playerQubit.classList.add('entangled');
            enemyQubit.classList.add('entangled');
        }
    }
    
    // Check for entanglement breaking messages
    if (message.includes("Entanglement broken")) {
        const playerQubit = document.getElementById('player-qubit');
        const enemyQubit = document.getElementById('enemy-qubit');
        if (playerQubit && enemyQubit) {
            playerQubit.classList.remove('entangled');
            enemyQubit.classList.remove('entangled');
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
    
    // Check for enemy qubit state updates
    if (message.includes("Singulon's qubit is")) {
        const enemyQubit = document.getElementById('enemy-qubit');
        if (enemyQubit) {
            const qubitMatch = message.match(/Singulon's qubit is (.+)/);
            if (qubitMatch) {
                const qubitState = qubitMatch[1];
                const cleanState = qubitState.replace(/\.$/, '');
                enemyQubit.textContent = cleanState === "superposition" ? "S" : cleanState;
            }
        }
    }
    
    // Check for entanglement state updates
    if (message.includes("entanglement")) {
        const playerQubit = document.getElementById('player-qubit');
        const enemyQubit = document.getElementById('enemy-qubit');
        if (playerQubit && enemyQubit) {
            if (message.includes("entangled")) {
                playerQubit.classList.add('entangled');
                enemyQubit.classList.add('entangled');
            } else if (message.includes("not entangled")) {
                playerQubit.classList.remove('entangled');
                enemyQubit.classList.remove('entangled');
            }
        }
    }
    
    // Check for QUANTUM AFTERBURN extra damage messages
    if (message.includes("QUANTUM AFTERBURN") && message.includes("extra damage")) {
        console.log('Detected QUANTUM AFTERBURN extra damage message:', message);
        
        // Get character max HP from character data
        const charData = characterData[currentCharacter];
        const maxPlayerHp = charData ? charData.maxHp : 90;
        
        // Update enemy HP bar to reflect extra damage
        const enemyHpPercent = (gameState.enemy.hp / 400) * 100;
        
        // Enemy took extra damage - update visual display immediately
        enemyHealthFill.style.width = `${Math.max(0, enemyHpPercent)}%`;
        updateHealthBarColor(enemyHealthFill, enemyHpPercent);
        
        const enemyHp = document.getElementById('enemy-hp');
        if (enemyHp) {
            enemyHp.textContent = `${Math.max(0, gameState.enemy.hp)}/400`;
        }
        
        // Set flag to prevent double update
        window.visualEnemyHpUpdated = true;
    }
    
    // Check for any recoil damage messages (general fallback)
    if ((message.includes("recoil") && message.includes("damage")) || 
        (message.includes("reflects") && message.includes("damage") && message.includes("enemy"))) {
        console.log('Detected recoil/reflect damage message:', message);
        
        // Update enemy HP bar to reflect recoil damage
        const enemyHpPercent = (gameState.enemy.hp / 400) * 100;
        
        // Enemy took recoil damage - update visual display immediately
        enemyHealthFill.style.width = `${Math.max(0, enemyHpPercent)}%`;
        updateHealthBarColor(enemyHealthFill, enemyHpPercent);
        
        const enemyHp = document.getElementById('enemy-hp');
        if (enemyHp) {
            enemyHp.textContent = `${Math.max(0, gameState.enemy.hp)}/400`;
        }
        
        // Set flag to prevent double update
        window.visualEnemyHpUpdated = true;
    }
    
    // Check for SPECIFIC damage messages and update HP bars visually in real-time
    // Only update HP for actual damage messages, not move usage messages
    if ((message.includes("Dealt") && message.includes("damage!")) || 
        (message.includes("deals") && message.includes("damage") && (message.includes("BULLET MUONS") || message.includes("Q-PRISMATIC LASER") || message.includes("Q-PHOTON GEYSER") || message.includes("GLITCH CLAW"))) ||
        (message.includes("QUANTUM AFTERBURN") && message.includes("extra damage"))) {
        console.log('Detected damage message:', message);
        
        // Get character max HP from character data
        const charData = characterData[currentCharacter];
        const maxPlayerHp = charData ? charData.maxHp : 90;
        
        // Update HP bars to match the current backend state (damage already applied)
        const playerHpPercent = (gameState.player.hp / maxPlayerHp) * 100;
        const enemyHpPercent = (gameState.enemy.hp / 400) * 100;
        
        // Determine if it's player or enemy damage based on the message content
        const isEnemyDamage = message.includes("BULLET MUONS") || message.includes("Q-PRISMATIC LASER") || 
                             (message.includes("Dealt") && message.includes("damage!") && 
                              (gameState.log[gameState.log.length - 2] || "").includes("Singulon used"));
        
        if (isEnemyDamage) {
            // Enemy dealt damage to player - update visual display immediately
            playerHealthFill.style.width = `${Math.max(0, playerHpPercent)}%`;
            updateHealthBarColor(playerHealthFill, playerHpPercent);
            
            const playerHp = document.getElementById('player-hp');
            if (playerHp) {
                playerHp.textContent = `${Math.max(0, gameState.player.hp)}/${maxPlayerHp}`;
            }
            
            // Mark that we've updated player HP visually to prevent override
            window.visualPlayerHpUpdated = true;
        } else {
            // Player dealt damage to enemy - update visual display immediately
            enemyHealthFill.style.width = `${Math.max(0, enemyHpPercent)}%`;
            updateHealthBarColor(enemyHealthFill, enemyHpPercent);
            
            const enemyHp = document.getElementById('enemy-hp');
            if (enemyHp) {
                enemyHp.textContent = `${Math.max(0, gameState.enemy.hp)}/400`;
            }
            
            // Mark that we've updated enemy HP visually to prevent override
            window.visualEnemyHpUpdated = true;
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