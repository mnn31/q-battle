// Game state
let currentCharacter = null;
let gameState = null;
let turnCount = 1;
let isProcessingMove = false; // Prevent multiple move processing

// Music system
let backgroundMusic = null;
let musicVolume = 0.5; // Default volume 50%
let isMusicMuted = false;

// Background system
let currentBackground = null;

// Music functions
function initializeMusic() {
    // Create audio element for Ultra Necrozma background music
    backgroundMusic = new Audio('/static/audio/ultra-necrozma-battle.mp3');
    backgroundMusic.loop = true;
    backgroundMusic.volume = musicVolume;
    
    // Add error handling for missing audio file
    backgroundMusic.addEventListener('error', function(e) {
        console.log('Music file not found. Please add ultra-necrozma-battle.mp3 to /static/audio/');
        // Hide music controls if file doesn't exist
        const musicControls = document.getElementById('music-controls');
        if (musicControls) {
            musicControls.style.display = 'none';
        }
    });
    
    // Set up music controls
    setupMusicControls();
    
    // Only show controls if audio loads successfully
    backgroundMusic.addEventListener('canplaythrough', function() {
        console.log('Music file loaded successfully');
        const musicControls = document.getElementById('music-controls');
        if (musicControls) {
            musicControls.style.display = 'block';
        }
    });
    
    console.log('Music system initialized');
}

// Background functions
async function fetchRandomBackground() {
    try {
        const response = await fetch('/random-background');
        const result = await response.json();
        
        if (result.url) {
            console.log('Fetched random background:', result.background);
            return result.url;
        } else {
            console.error('Failed to fetch random background:', result.error);
            return '/static/images/battle-bg.png'; // Fallback to default
        }
    } catch (error) {
        console.error('Error fetching random background:', error);
        return '/static/images/battle-bg.png'; // Fallback to default
    }
}

function applyBackground(backgroundUrl) {
    const battleScreen = document.querySelector('.battle-screen');
    if (battleScreen) {
        // Set all background properties explicitly to ensure proper scaling
        battleScreen.style.backgroundImage = `url('${backgroundUrl}')`;
        battleScreen.style.backgroundSize = 'cover';
        battleScreen.style.backgroundPosition = 'center';
        battleScreen.style.backgroundRepeat = 'no-repeat';
        currentBackground = backgroundUrl;
        
        // Hide the texture overlay (brown dots and green shading) when we have a background image
        const textureOverlay = battleScreen.querySelector('::before');
        if (textureOverlay) {
            textureOverlay.style.display = 'none';
        }
        
        // Alternative approach: hide the ::before pseudo-element by adding a class
        battleScreen.classList.add('has-background-image');
        
        console.log('Applied background:', backgroundUrl);
        console.log('Background properties set:', {
            backgroundImage: battleScreen.style.backgroundImage,
            backgroundSize: battleScreen.style.backgroundSize,
            backgroundPosition: battleScreen.style.backgroundPosition,
            backgroundRepeat: battleScreen.style.backgroundRepeat
        });
    }
}

function setupMusicControls() {
    // Create music control panel
    const musicPanel = document.createElement('div');
    musicPanel.id = 'music-controls';
    musicPanel.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 15px;
        border-radius: 10px;
        z-index: 1000;
        font-family: 'Arial', sans-serif;
        font-size: 14px;
        backdrop-filter: blur(10px);
        border: 2px solid #7C3AED;
        box-shadow: 0 0 20px rgba(124, 58, 237, 0.5);
    `;
    
    musicPanel.innerHTML = `
        <div style="margin-bottom: 10px; font-weight: bold; color: #C084FC;">🎵 Ultra Necrozma Battle Music</div>
        <div style="margin-bottom: 10px;">
            <label style="display: block; margin-bottom: 5px;">Volume:</label>
            <input type="range" id="music-volume" min="0" max="100" value="${musicVolume * 100}" style="width: 100%;">
        </div>
        <div>
            <button id="music-toggle" style="
                background: ${isMusicMuted ? '#EF4444' : '#10B981'};
                color: white;
                border: none;
                padding: 8px 12px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 12px;
                width: 100%;
            ">${isMusicMuted ? '🔇 Unmute' : '🔊 Mute'}</button>
        </div>
    `;
    
    document.body.appendChild(musicPanel);
    
    // Start with controls hidden until audio loads
    musicPanel.style.display = 'none';
    
    // Add event listeners
    document.getElementById('music-volume').addEventListener('input', function(e) {
        musicVolume = e.target.value / 100;
        if (backgroundMusic) {
            backgroundMusic.volume = musicVolume;
        }
    });
    
    document.getElementById('music-toggle').addEventListener('click', function() {
        isMusicMuted = !isMusicMuted;
        if (isMusicMuted) {
            pauseMusic();
        } else {
            playMusic();
        }
        updateMusicControls();
    });
}

function updateMusicControls() {
    const toggleBtn = document.getElementById('music-toggle');
    if (toggleBtn) {
        toggleBtn.style.background = isMusicMuted ? '#EF4444' : '#10B981';
        toggleBtn.textContent = isMusicMuted ? '🔇 Unmute' : '🔊 Mute';
    }
}

function playMusic() {
    if (backgroundMusic && !isMusicMuted) {
        backgroundMusic.play().catch(e => {
            console.log('Music autoplay blocked:', e);
        });
    }
}

function pauseMusic() {
    if (backgroundMusic) {
        backgroundMusic.pause();
    }
}

function stopMusic() {
    if (backgroundMusic) {
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
    }
}

// Character data with speed stats
const characterData = {
    "Bitzy": {
        sprite: "/static/sprites/blitzle.gif",
        speed: 85, // Speed stat for turn order
        moves: [
            { name: "Q-THUNDER", desc: "Bitzy's Q-Move. If the qubit is in a state of SUPERPOSITION, this move deals massive damage and collapses the qubit randomly. Else, fails. (DMG: 172)" },
            { name: "SHOCK", desc: "Deals damage. Additional damage is dealt if the qubit and the enemy's qubit are in different states. (DMG: 34 + 20)" },
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
        hp: 95,
        defense: 100,
        moves: [
            { name: "Q-METRONOME", desc: "Resona's Q-Move. Requires superposition state. Collapses the qubit. If it collapses to |1⟩, deals 100% of max HP as damage. If it collapses to |0⟩, deals base damage (10). Gains a waveform stack. Each waveform stack adds +15 damage." },
            { name: "WAVE CRASH", desc: "Deals damage and deals additional damage if the qubit and/or the enemy's qubit is in a state of SUPERPOSITION. Collapses the qubit. (DMG: 15 + 20)" },
            { name: "METAL NOISE", desc: "Prevents the enemy from using moves that change their qubit state for the next turn. If the enemy's qubit is in a state of 1, they may not use a Q-Move. If it is in a state of 0, deal damage. (DMG: 20)" },
            { name: "SHIFT GEAR", desc: "Puts the qubit in a state of SUPERPOSITION. For the next turn, increase the probability of the qubit collapsing to 1 by 25%." }
        ],
        maxHp: 95
    },
    "Higscrozma": {
        sprite: "/static/sprites/higscrozma.gif",
        speed: 60, // Speed stat for turn order
        moves: [
                    { name: "Q-VOID RIFT", desc: "Higscrozma's Q-Move. Deals 64 damage and additional damage equal to 10% of Defense stat. Heals the user 10% max HP per barrier behind the user, and then shatters all front barriers. (DMG: 64)" },
        { name: "PRISMATIC LASER", desc: "Deals damage and shatters one random barrier. Places the qubit in a state of SUPERPOSITION. (DMG: 96)" },
        { name: "SHADOW FORCE", desc: "If the qubit is not in SUPERPOSITION, this move fails. Collapses the qubit. If 0, deals 80 damage. If 1, deals 120 damage. Moves up one barrier. (DMG 0: 80, DMG 1: 120)" },
            { name: "BARRIER", desc: "Increases the defense stat by 10 if the maximum number of barriers are active. Creates a new barrier in front of the user's current position if not. Puts the qubit in a state of SUPERPOSITION." }
        ],
        maxHp: 110
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
    // Initialize music system
    initializeMusic();
    
    // Initialize barrier system
    initializeBarrierSystem();
    
    const characterOptions = document.querySelectorAll('.character-option');
    
    characterOptions.forEach(option => {
        option.addEventListener('click', function() {
            const character = this.getAttribute('data-character');
            selectCharacter(character);
        });
    });
});

// Higscrozma Barrier System
let barrierState = {
    barriersInFront: 3,
    barriersBehind: 0,
    isActive: false
};

function initializeBarrierSystem() {
    const barrierContainer = document.getElementById('barrier-container');
    if (barrierContainer) {
        barrierContainer.style.display = 'none';
        updateBarrierDisplay();
    }
}

function updateBarrierDisplay() {
    console.log('updateBarrierDisplay called with barrierState:', barrierState);
    console.log('barriersInFront:', barrierState.barriersInFront, 'barriersBehind:', barrierState.barriersBehind);
    
    const barrierContainer = document.getElementById('barrier-container');
    const barrierFront1 = document.getElementById('barrier-front-1');
    const barrierFront2 = document.getElementById('barrier-front-2');
    const barrierFront3 = document.getElementById('barrier-front-3');
    const backBarriersCounter = document.getElementById('back-barriers-counter');
    const pinkCrystal = document.getElementById('pink-crystal');
    const barrierCount = document.getElementById('barrier-count');
    
    if (!barrierContainer || !barrierFront1 || !barrierFront2 || !barrierFront3 || 
        !backBarriersCounter || !pinkCrystal || !barrierCount) return;
    
    // Show barrier system only for Higscrozma
    if (currentCharacter === "Higscrozma" && barrierState.isActive) {
        barrierContainer.style.display = 'block';
        
        // Show front barriers (between Higscrozma and Singulon) - positioned on the right
        console.log('Setting front barriers - barriersInFront:', barrierState.barriersInFront);
        if (barrierState.barriersInFront >= 1) {
            barrierFront1.style.display = 'block';
            console.log('Showing barrierFront1');
        } else {
            barrierFront1.style.display = 'none';
            console.log('Hiding barrierFront1');
        }
        
        if (barrierState.barriersInFront >= 2) {
            barrierFront2.style.display = 'block';
            console.log('Showing barrierFront2');
        } else {
            barrierFront2.style.display = 'none';
            console.log('Hiding barrierFront2');
        }
        
        if (barrierState.barriersInFront >= 3) {
            barrierFront3.style.display = 'block';
            console.log('Showing barrierFront3');
        } else {
            barrierFront3.style.display = 'none';
            console.log('Hiding barrierFront3');
        }
        
        // Show back barriers counter (behind Higscrozma) - positioned on the far left
        console.log('Setting back barriers - barriersBehind:', barrierState.barriersBehind);
        if (barrierState.barriersBehind > 0) {
            backBarriersCounter.style.display = 'flex';
            pinkCrystal.style.display = 'block';
            barrierCount.textContent = barrierState.barriersBehind;
            console.log('Showing back barriers counter with count:', barrierState.barriersBehind);
        } else {
            backBarriersCounter.style.display = 'none';
            pinkCrystal.style.display = 'none';
            barrierCount.textContent = '0';
            console.log('Hiding back barriers counter');
        }
        
        // Update Higscrozma's position based on barriers behind
        updateHigscrozmaPosition();
    } else {
        barrierContainer.style.display = 'none';
    }
}

function updateHigscrozmaPosition() {
    const playerSprite = document.getElementById('player-sprite');
    if (!playerSprite || currentCharacter !== "Higscrozma") return;
    
    // Calculate position based on barriers behind
    const barriersBehind = barrierState.barriersBehind;
    let positionClass = '';
    
    if (barriersBehind === 0) {
        positionClass = 'higscrozma-position-0';
    } else if (barriersBehind === 1) {
        positionClass = 'higscrozma-position-1';
    } else if (barriersBehind === 2) {
        positionClass = 'higscrozma-position-2';
    } else if (barriersBehind === 3) {
        positionClass = 'higscrozma-position-3';
    }
    
    // Remove all position classes
    playerSprite.classList.remove('higscrozma-position-0', 'higscrozma-position-1', 'higscrozma-position-2', 'higscrozma-position-3');
    
    // Add new position class
    if (positionClass) {
        playerSprite.classList.add(positionClass);
    }
}

function shatterBarrier(barrierType) {
    let barrierElement;
    
    if (barrierType === 'front-1') {
        barrierElement = document.getElementById('barrier-front-1');
    } else if (barrierType === 'front-2') {
        barrierElement = document.getElementById('barrier-front-2');
    } else if (barrierType === 'front-3') {
        barrierElement = document.getElementById('barrier-front-3');
    } else if (barrierType === 'all-front') {
        // Shatter all front barriers
        const frontBarriers = ['barrier-front-1', 'barrier-front-2', 'barrier-front-3'];
        frontBarriers.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.classList.add('barrier-shatter');
                setTimeout(() => {
                    element.classList.remove('barrier-shatter');
                }, 500);
            }
        });
        setTimeout(() => {
            updateBarrierDisplay();
        }, 500);
        return;
    }
    
    if (barrierElement) {
        barrierElement.classList.add('barrier-shatter');
        setTimeout(() => {
            barrierElement.classList.remove('barrier-shatter');
            updateBarrierDisplay();
        }, 500);
    }
}

function moveBarrier() {
    console.log('moveBarrier called - before update:', barrierState);
    // Update barrier state: move one barrier from front to back
    if (barrierState.barriersInFront > 0) {
        barrierState.barriersInFront -= 1;
        barrierState.barriersBehind += 1;
        console.log('Updated barrier state:', barrierState);
        updateBarrierDisplay();
    }
    
    // Animate barrier movement with teleportation
    const barrierContainer = document.getElementById('barrier-container');
    const playerSprite = document.getElementById('player-sprite');
    
    if (barrierContainer) {
        barrierContainer.style.transition = 'all 0.5s ease-in-out';
        setTimeout(() => {
            barrierContainer.style.transition = '';
        }, 500);
    }
    
    // Add teleportation effect when barriers move
    if (playerSprite && currentCharacter === "Higscrozma") {
        playerSprite.classList.add('higscrozma-teleport');
        setTimeout(() => {
            playerSprite.classList.remove('higscrozma-teleport');
        }, 600);
    }
}

// Character selection handler
function selectCharacter(character) {
    currentCharacter = character;
    const charData = characterData[character];
    
    // Clear any existing waveform balls when switching characters
    const existingBalls = document.querySelectorAll('.waveform-ball');
    existingBalls.forEach(ball => ball.remove());
    
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
            
            // Fetch and apply random background
            const backgroundUrl = await fetchRandomBackground();
            applyBackground(backgroundUrl);
            
            // Initialize barrier system for Higscrozma
            if (character === "Higscrozma") {
                barrierState.isActive = true;
                // Sync barrier state with backend game state
                if (result.state.player && result.state.player.barriers_in_front !== undefined) {
                    barrierState.barriersInFront = result.state.player.barriers_in_front;
                    barrierState.barriersBehind = result.state.player.barriers_behind || 0;
                } else {
                    // Fallback to initial state if backend doesn't have barrier info
                    barrierState.barriersInFront = 3;
                    barrierState.barriersBehind = 0;
                }
                console.log('Initialized barrier state from backend:', barrierState);
                updateBarrierDisplay();
            }
            
            // Start background music when battle begins
            playMusic();
            
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

    // Update waveform display for Resona
    const waveformDisplay = document.getElementById('waveform-display');
    const waveformStacks = document.getElementById('waveform-stacks');
    if (waveformDisplay && waveformStacks && gameState) {
        if (currentCharacter === "Resona") {
            waveformDisplay.style.display = 'flex';
            const stacks = gameState.player.waveform_stacks || 0;
            waveformStacks.textContent = stacks;
        } else {
            waveformDisplay.style.display = 'none';
        }
    }

    // Update Metal Noise indicator for Resona
    const metalNoiseIndicator = document.getElementById('metal-noise-indicator');
    const metalNoiseText = document.getElementById('metal-noise-text');
    if (metalNoiseIndicator && metalNoiseText && gameState) {
        if (currentCharacter === "Resona" && gameState.metal_noise_active) {
            metalNoiseIndicator.style.display = 'flex';
            const blockType = gameState.metal_noise_block_type;
            if (blockType === "q_moves") {
                metalNoiseText.textContent = "Q-Moves";
            } else if (blockType === "state_changes") {
                metalNoiseText.textContent = "States";
            } else {
                metalNoiseText.textContent = "Active";
            }
        } else {
            metalNoiseIndicator.style.display = 'none';
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
        "Higscrozma": "QUANTUM BULWARK: Front barriers reduce damage taken by 10% each, back barriers increase damage dealt by 10% each"
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
    
    // Stop background music when battle ends
    stopMusic();
    
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
    
    // Trigger character-specific animations
    if (currentCharacter === "Bitzy") {
        triggerBitzyAnimation(moveName);
    } else if (currentCharacter === "Neutrinette") {
        triggerNeutrinetteAnimation(moveName);
    } else if (currentCharacter === "Resona") {
        triggerResonaAnimation(moveName);
    } else if (currentCharacter === "Higscrozma") {
        triggerHigscrozmaAnimation(moveName);
    }
    
    // Wait for animations to complete before processing response
    setTimeout(async () => {
    
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
                
                // Sync barrier state with backend for Higscrozma
                if (currentCharacter === "Higscrozma" && gameState.player) {
                    if (gameState.player.barriers_in_front !== undefined) {
                        barrierState.barriersInFront = gameState.player.barriers_in_front;
                        barrierState.barriersBehind = gameState.player.barriers_behind || 0;
                        console.log('Synced barrier state from backend:', barrierState);
                        updateBarrierDisplay();
                    }
                }
                
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
    }, 1000); // Wait for animations to complete
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

// Higscrozma Animation System
function triggerHigscrozmaAnimation(moveName) {
    console.log('Triggering Higscrozma animation for:', moveName);
    
    const playerSprite = document.getElementById('player-sprite');
    const enemySprite = document.querySelector('.enemy-sprite img');
    
    if (!playerSprite || !enemySprite) {
        console.log('Animation elements not found:', { playerSprite, enemySprite });
        return;
    }
    
    // Add teleportation effect for all Higscrozma moves
    playerSprite.classList.add('higscrozma-teleport');
    setTimeout(() => {
        playerSprite.classList.remove('higscrozma-teleport');
    }, 600);
    
    switch (moveName) {
        case 'Q-VOID RIFT':
            triggerQVoidRiftAnimation(playerSprite, enemySprite);
            break;
        case 'PRISMATIC LASER':
            triggerPrismaticLaserAnimation(playerSprite, enemySprite);
            break;
        case 'SHADOW FORCE':
            triggerShadowForceAnimation(playerSprite, enemySprite);
            break;
        case 'BARRIER':
            triggerBarrierAnimation(playerSprite);
            break;
        default:
            console.log('No animation for move:', moveName);
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

// Trigger Resona animations
function triggerResonaAnimation(moveName) {
    const playerSprite = document.getElementById('player-sprite');
    const enemySprite = document.querySelector('.enemy-sprite img');
    
    if (!playerSprite || !enemySprite) return;
    
    switch (moveName) {
        case "Q-METRONOME":
            triggerQMetronomeAnimation(playerSprite, enemySprite);
            break;
        case "WAVE CRASH":
            triggerWaveCrashAnimation(playerSprite, enemySprite);
            break;
        case "METAL NOISE":
            triggerMetalNoiseAnimation(playerSprite, enemySprite);
            break;
        case "SHIFT GEAR":
            triggerShiftGearAnimation(playerSprite);
            break;
    }
}

function triggerQMetronomeAnimation(playerSprite, enemySprite) {
    // Create intense wagging finger animation with massive effects above Resona's head
    const finger = document.createElement('img');
    finger.src = '/static/images/wagging-finger.png';
    
    // Position above Resona's head
    const resonaRect = playerSprite.getBoundingClientRect();
    const fingerX = resonaRect.left + resonaRect.width / 2;
    const fingerY = resonaRect.top - 50; // 50px above Resona's head
    
    finger.style.cssText = `
        position: absolute;
        top: ${fingerY}px;
        left: ${fingerX}px;
        transform: translate(-50%, -50%);
        width: 150px;
        height: 150px;
        pointer-events: none;
        z-index: 1000;
        animation: waggingFingerIntense 2s ease-out;
        filter: brightness(1.5) contrast(1.2) drop-shadow(0 0 20px #FFD700);
    `;
    
    // Add intense wagging finger animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes waggingFingerIntense {
            0% { 
                transform: translate(-50%, -50%) scale(0) rotate(-20deg); 
                opacity: 1; 
                filter: brightness(2.0) contrast(1.5) drop-shadow(0 0 30px #FFD700);
            }
            10% { 
                transform: translate(-50%, -50%) scale(1.2) rotate(-20deg); 
                opacity: 1; 
                filter: brightness(1.8) contrast(1.3) drop-shadow(0 0 25px #FFD700);
            }
            20% { 
                transform: translate(-50%, -50%) scale(1) rotate(20deg); 
                opacity: 1; 
                filter: brightness(1.6) contrast(1.2) drop-shadow(0 0 20px #FFD700);
            }
            30% { 
                transform: translate(-50%, -50%) scale(1.1) rotate(-20deg); 
                opacity: 1; 
                filter: brightness(1.7) contrast(1.3) drop-shadow(0 0 22px #FFD700);
            }
            40% { 
                transform: translate(-50%, -50%) scale(1) rotate(20deg); 
                opacity: 1; 
                filter: brightness(1.5) contrast(1.2) drop-shadow(0 0 20px #FFD700);
            }
            50% { 
                transform: translate(-50%, -50%) scale(1.1) rotate(-20deg); 
                opacity: 1; 
                filter: brightness(1.6) contrast(1.3) drop-shadow(0 0 22px #FFD700);
            }
            60% { 
                transform: translate(-50%, -50%) scale(1) rotate(20deg); 
                opacity: 1; 
                filter: brightness(1.5) contrast(1.2) drop-shadow(0 0 20px #FFD700);
            }
            70% { 
                transform: translate(-50%, -50%) scale(1.1) rotate(-20deg); 
                opacity: 1; 
                filter: brightness(1.6) contrast(1.3) drop-shadow(0 0 22px #FFD700);
            }
            80% { 
                transform: translate(-50%, -50%) scale(1) rotate(20deg); 
                opacity: 1; 
                filter: brightness(1.5) contrast(1.2) drop-shadow(0 0 20px #FFD700);
            }
            90% { 
                transform: translate(-50%, -50%) scale(1.1) rotate(-20deg); 
                opacity: 0.8; 
                filter: brightness(1.4) contrast(1.1) drop-shadow(0 0 15px #FFD700);
            }
            100% { 
                transform: translate(-50%, -50%) scale(0) rotate(0deg); 
                opacity: 0; 
                filter: brightness(1.0) contrast(1.0) drop-shadow(0 0 0px #FFD700);
            }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(finger);
    
    // Create massive amounts of quantum sparkles (80 sparkles - 10x more)
    for (let i = 0; i < 80; i++) {
        setTimeout(() => {
            const sparkle = document.createElement('div');
            const size = 15 + Math.random() * 25; // Random sizes
            const colors = ['#FFD700', '#FFA500', '#FF6B35', '#FF4500', '#FFD700', '#FFFF00'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            sparkle.style.cssText = `
                position: absolute;
                top: ${fingerY}px;
                left: ${fingerX}px;
                width: ${size}px;
                height: ${size}px;
                background: radial-gradient(circle, ${color}, ${color}80);
                border-radius: 50%;
                pointer-events: none;
                z-index: 1001;
                animation: sparkleFloatIntense 1.5s ease-out;
                box-shadow: 0 0 ${size/2}px ${color};
            `;
            
            document.body.appendChild(sparkle);
            
            setTimeout(() => {
                if (document.body.contains(sparkle)) {
                    document.body.removeChild(sparkle);
                }
            }, 1500);
        }, i * 20); // Much faster spawning
    }
    
    // Add intense sparkle animation
    const sparkleStyle = document.createElement('style');
    sparkleStyle.textContent = `
        @keyframes sparkleFloatIntense {
            0% { 
                transform: translate(-50%, -50%) scale(0) rotate(0deg); 
                opacity: 1; 
                filter: brightness(2.0) contrast(1.5);
            }
            20% { 
                transform: translate(-50%, -50%) scale(1.2) rotate(90deg) translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px); 
                opacity: 0.9; 
                filter: brightness(1.8) contrast(1.3);
            }
            40% { 
                transform: translate(-50%, -50%) scale(1.5) rotate(180deg) translate(${Math.random() * 300 - 150}px, ${Math.random() * 300 - 150}px); 
                opacity: 0.8; 
                filter: brightness(1.6) contrast(1.2);
            }
            60% { 
                transform: translate(-50%, -50%) scale(1.3) rotate(270deg) translate(${Math.random() * 400 - 200}px, ${Math.random() * 400 - 200}px); 
                opacity: 0.6; 
                filter: brightness(1.4) contrast(1.1);
            }
            80% { 
                transform: translate(-50%, -50%) scale(1.1) rotate(360deg) translate(${Math.random() * 500 - 250}px, ${Math.random() * 500 - 250}px); 
                opacity: 0.3; 
                filter: brightness(1.2) contrast(1.0);
            }
            100% { 
                transform: translate(-50%, -50%) scale(0) rotate(720deg) translate(${Math.random() * 600 - 300}px, ${Math.random() * 600 - 300}px); 
                opacity: 0; 
                filter: brightness(1.0) contrast(1.0);
            }
        }
    `;
    
    document.head.appendChild(sparkleStyle);
    
    // Create additional energy waves (20 waves)
    for (let i = 0; i < 20; i++) {
    setTimeout(() => {
            const wave = document.createElement('div');
            wave.style.cssText = `
                position: absolute;
                top: ${fingerY}px;
                left: ${fingerX}px;
                width: 100px;
                height: 100px;
                border: 3px solid #FFD700;
                border-radius: 50%;
                pointer-events: none;
                z-index: 1002;
                animation: energyWaveExpand 1.5s ease-out;
                opacity: 0.8;
            `;
            
            document.body.appendChild(wave);
            
            setTimeout(() => {
                if (document.body.contains(wave)) {
                    document.body.removeChild(wave);
                }
            }, 1500);
        }, i * 75);
    }
    
    // Add energy wave animation
    const waveStyle = document.createElement('style');
    waveStyle.textContent = `
        @keyframes energyWaveExpand {
            0% { 
                transform: translate(-50%, -50%) scale(0); 
                opacity: 0.8; 
                border-color: #FFD700;
                filter: brightness(1.5) contrast(1.2);
            }
            50% { 
                transform: translate(-50%, -50%) scale(2); 
                opacity: 0.6; 
                border-color: #FFA500;
                filter: brightness(1.3) contrast(1.1);
            }
            100% { 
                transform: translate(-50%, -50%) scale(4); 
                opacity: 0; 
                border-color: #FF4500;
                filter: brightness(1.0) contrast(1.0);
            }
        }
    `;
    
    document.head.appendChild(waveStyle);
    
    // Clean up
    setTimeout(() => {
        if (document.body.contains(finger)) {
            document.body.removeChild(finger);
        }
        if (document.head.contains(style)) {
            document.head.removeChild(style);
        }
        if (document.head.contains(sparkleStyle)) {
            document.head.removeChild(sparkleStyle);
        }
        if (document.head.contains(waveStyle)) {
            document.head.removeChild(waveStyle);
        }
    }, 2500);
}

function triggerWaveCrashAnimation(playerSprite, enemySprite) {
    // Get positions for the animation
    const resonaRect = playerSprite.getBoundingClientRect();
    const enemyRect = enemySprite.getBoundingClientRect();
    
    const resonaX = resonaRect.left + resonaRect.width / 2;
    const resonaY = resonaRect.top + resonaRect.height / 2;
    const enemyX = enemyRect.left + enemyRect.width / 2;
    const enemyY = enemyRect.top + enemyRect.height / 2;
    
    // Phase 1: Resona becomes cloaked in water
    const waterCloak = document.createElement('div');
    waterCloak.style.cssText = `
        position: absolute;
        top: ${resonaY}px;
        left: ${resonaX}px;
        width: 120px;
        height: 120px;
        background: radial-gradient(circle, rgba(0, 150, 255, 0.8), rgba(0, 100, 200, 0.6));
        border-radius: 50%;
        pointer-events: none;
        z-index: 1000;
        animation: waterCloakForm 0.8s ease-out;
        box-shadow: 0 0 30px rgba(0, 150, 255, 0.6);
    `;
    
    document.body.appendChild(waterCloak);
    
    // Add water cloak formation animation
    const cloakStyle = document.createElement('style');
    cloakStyle.textContent = `
        @keyframes waterCloakForm {
            0% { 
                transform: translate(-50%, -50%) scale(0); 
                opacity: 0; 
                filter: brightness(1.0) blur(0px);
            }
            50% { 
                transform: translate(-50%, -50%) scale(1.2); 
                opacity: 0.8; 
                filter: brightness(1.3) blur(2px);
            }
            100% { 
                transform: translate(-50%, -50%) scale(1); 
                opacity: 1; 
                filter: brightness(1.5) blur(1px);
            }
        }
    `;
    
    document.head.appendChild(cloakStyle);
    
    // Phase 2: Resona charges forward cloaked in water
    setTimeout(() => {
        waterCloak.style.animation = 'waterCloakCharge 1.2s ease-in-out';
        
        // Add charging animation
        const chargeStyle = document.createElement('style');
        chargeStyle.textContent = `
            @keyframes waterCloakCharge {
                0% { 
                    transform: translate(-50%, -50%) scale(1) translateX(0px); 
                    opacity: 1; 
                    filter: brightness(1.5) blur(1px);
                }
                25% { 
                    transform: translate(-50%, -50%) scale(1.1) translateX(${(enemyX - resonaX) * 0.25}px); 
                    opacity: 1; 
                    filter: brightness(1.8) blur(0px);
                }
                50% { 
                    transform: translate(-50%, -50%) scale(1.2) translateX(${(enemyX - resonaX) * 0.5}px); 
                    opacity: 1; 
                    filter: brightness(2.0) blur(0px);
                }
                75% { 
                    transform: translate(-50%, -50%) scale(1.1) translateX(${(enemyX - resonaX) * 0.75}px); 
                    opacity: 0.9; 
                    filter: brightness(1.8) blur(0px);
                }
                100% { 
                    transform: translate(-50%, -50%) scale(1) translateX(${enemyX - resonaX}px); 
                    opacity: 0.8; 
                    filter: brightness(1.5) blur(0px);
                }
            }
        `;
        
        document.head.appendChild(chargeStyle);
        
        // Create water trail effect during charge
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                const waterTrail = document.createElement('div');
                const trailX = resonaX + (enemyX - resonaX) * (i / 8);
                waterTrail.style.cssText = `
                    position: absolute;
                    top: ${resonaY}px;
                    left: ${trailX}px;
                    width: 60px;
                    height: 60px;
                    background: radial-gradient(circle, rgba(0, 150, 255, 0.4), transparent);
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 999;
                    animation: waterTrailFade 0.8s ease-out;
                `;
                
                document.body.appendChild(waterTrail);
                
                setTimeout(() => {
                    if (document.body.contains(waterTrail)) {
                        document.body.removeChild(waterTrail);
                    }
                }, 800);
            }, i * 150);
        }
        
        // Add water trail fade animation
        const trailStyle = document.createElement('style');
        trailStyle.textContent = `
            @keyframes waterTrailFade {
                0% { 
                    transform: translate(-50%, -50%) scale(0.5); 
                    opacity: 0.6; 
                }
                50% { 
                    transform: translate(-50%, -50%) scale(1); 
                    opacity: 0.4; 
                }
                100% { 
                    transform: translate(-50%, -50%) scale(0.5); 
                    opacity: 0; 
                }
            }
        `;
        
        document.head.appendChild(trailStyle);
        
        // Phase 3: Impact explosion when hitting the enemy
        setTimeout(() => {
            waterCloak.style.animation = 'waterCloakImpact 0.6s ease-out';
            
            // Add impact animation
            const impactStyle = document.createElement('style');
            impactStyle.textContent = `
                @keyframes waterCloakImpact {
                    0% { 
                        transform: translate(-50%, -50%) scale(1) translateX(${enemyX - resonaX}px); 
                        opacity: 0.8; 
                        filter: brightness(1.5) blur(0px);
                    }
                    50% { 
                        transform: translate(-50%, -50%) scale(2) translateX(${enemyX - resonaX}px); 
                        opacity: 1; 
                        filter: brightness(2.5) blur(3px);
                    }
                    100% { 
                        transform: translate(-50%, -50%) scale(0) translateX(${enemyX - resonaX}px); 
                        opacity: 0; 
                        filter: brightness(1.0) blur(0px);
                    }
                }
            `;
            
            document.head.appendChild(impactStyle);
            
            // Create impact water explosion
            for (let i = 0; i < 12; i++) {
                setTimeout(() => {
                    const waterExplosion = document.createElement('div');
                    const angle = (i * 30) * (Math.PI / 180);
                    const distance = 80 + Math.random() * 40;
                    const explosionX = enemyX + Math.cos(angle) * distance;
                    const explosionY = enemyY + Math.sin(angle) * distance;
                    
                    waterExplosion.style.cssText = `
                        position: absolute;
                        top: ${explosionY}px;
                        left: ${explosionX}px;
                        width: 40px;
                        height: 40px;
                        background: radial-gradient(circle, rgba(0, 200, 255, 0.8), rgba(0, 150, 255, 0.4));
                        border-radius: 50%;
                        pointer-events: none;
                        z-index: 1001;
                        animation: waterExplosionParticle 0.8s ease-out;
                        box-shadow: 0 0 20px rgba(0, 200, 255, 0.6);
                    `;
                    
                    document.body.appendChild(waterExplosion);
                    
                    setTimeout(() => {
                        if (document.body.contains(waterExplosion)) {
                            document.body.removeChild(waterExplosion);
                        }
                    }, 800);
                }, i * 50);
            }
            
            // Add water explosion particle animation
            const explosionStyle = document.createElement('style');
            explosionStyle.textContent = `
                @keyframes waterExplosionParticle {
                    0% { 
                        transform: translate(-50%, -50%) scale(0); 
                        opacity: 1; 
                        filter: brightness(1.5) contrast(1.2);
                    }
                    50% { 
                        transform: translate(-50%, -50%) scale(1.2); 
                        opacity: 0.8; 
                        filter: brightness(1.3) contrast(1.1);
                    }
                    100% { 
                        transform: translate(-50%, -50%) scale(0); 
                        opacity: 0; 
                        filter: brightness(1.0) contrast(1.0);
                    }
                }
            `;
            
            document.head.appendChild(explosionStyle);
            
            // Create screen shake effect
            document.body.style.animation = 'screenShake 0.3s ease-out';
            
            const shakeStyle = document.createElement('style');
            shakeStyle.textContent = `
                @keyframes screenShake {
                    0% { transform: translateX(0px) translateY(0px); }
                    25% { transform: translateX(-5px) translateY(-3px); }
                    50% { transform: translateX(5px) translateY(3px); }
                    75% { transform: translateX(-3px) translateY(-2px); }
                    100% { transform: translateX(0px) translateY(0px); }
                }
            `;
            
            document.head.appendChild(shakeStyle);
            
            // Clean up screen shake
            setTimeout(() => {
                document.body.style.animation = '';
                if (document.head.contains(shakeStyle)) {
                    document.head.removeChild(shakeStyle);
                }
            }, 300);
            
        }, 1200); // After charge completes
        
    }, 800); // After cloak forms
    
    // Clean up all elements
    setTimeout(() => {
        if (document.body.contains(waterCloak)) {
            document.body.removeChild(waterCloak);
        }
        if (document.head.contains(cloakStyle)) {
            document.head.removeChild(cloakStyle);
        }
        if (document.head.contains(chargeStyle)) {
            document.head.removeChild(chargeStyle);
        }
        if (document.head.contains(trailStyle)) {
            document.head.removeChild(trailStyle);
        }
        if (document.head.contains(impactStyle)) {
            document.head.removeChild(impactStyle);
        }
        if (document.head.contains(explosionStyle)) {
            document.head.removeChild(explosionStyle);
        }
    }, 3000);
}

// BOSS HAZE Animation - MASSIVE & VIVID VERSION
function triggerBossHazeAnimation(enemySprite) {
    console.log('BOSS HAZE MASSIVE animation triggered');
    console.log('Enemy sprite:', enemySprite);
    
    const enemyRect = enemySprite.getBoundingClientRect();
    const enemyX = enemyRect.left + enemyRect.width / 2;
    const enemyY = enemyRect.top + enemyRect.height / 2;
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes massiveHazeBackground {
            0% { opacity: 0; background: #000000; }
            25% { opacity: 0.7; background: linear-gradient(45deg, #000000, #1F2937, #374151, #000000); }
            50% { opacity: 0.9; background: linear-gradient(45deg, #000000, #4B5563, #6B7280, #9CA3AF, #000000); }
            75% { opacity: 0.7; background: linear-gradient(45deg, #000000, #D1D5DB, #E5E7EB, #000000); }
            100% { opacity: 0; background: #000000; }
        }
        @keyframes massiveHazeWisp {
            0% { transform: translate(0, 0) scale(0) rotate(0deg); opacity: 0; }
            25% { transform: translate(0, 0) scale(3) rotate(90deg); opacity: 1; }
            50% { transform: translate(0, 0) scale(6) rotate(180deg); opacity: 0.9; }
            75% { transform: translate(0, 0) scale(9) rotate(270deg); opacity: 0.7; }
            100% { transform: translate(0, 0) scale(12) rotate(360deg); opacity: 0; }
        }
        @keyframes massiveHazeScreenShake {
            0%, 100% { transform: translate(0, 0); }
            10% { transform: translate(-8px, -4px); }
            20% { transform: translate(8px, -4px); }
            30% { transform: translate(-8px, 4px); }
            40% { transform: translate(8px, 4px); }
            50% { transform: translate(-4px, -8px); }
            60% { transform: translate(4px, -8px); }
            70% { transform: translate(-4px, 8px); }
            80% { transform: translate(4px, 8px); }
            90% { transform: translate(0, 0); }
        }
        @keyframes massiveHazePulse {
            0% { transform: scale(0) rotate(0deg); opacity: 0; }
            50% { transform: scale(1) rotate(180deg); opacity: 1; }
            100% { transform: scale(2) rotate(360deg); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    // Phase 1: MASSIVE Background effect with gray cycling
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
        animation: massiveHazeBackground 2s ease-in-out;
    `;
    document.body.appendChild(backgroundEffect);
    
    // Phase 2: MASSIVE Haze wisps (based on Pokemon Showdown's haze animation)
    const wispPositions = [
        { x: enemyX + 120, y: enemyY },
        { x: enemyX - 120, y: enemyY },
        { x: enemyX, y: enemyY + 120 },
        { x: enemyX, y: enemyY - 120 },
        { x: enemyX + 113, y: enemyY + 97 },
        { x: enemyX - 113, y: enemyY - 97 },
        { x: enemyX + 97, y: enemyY - 113 },
        { x: enemyX - 97, y: enemyY + 113 }
    ];
    
    wispPositions.forEach((pos, index) => {
        const wisp = document.createElement('div');
        wisp.style.cssText = `
            position: absolute;
            top: ${pos.y}px;
            left: ${pos.x}px;
            width: 80px;
            height: 80px;
            background: radial-gradient(circle, #1F2937, #374151, #4B5563, #6B7280, #9CA3AF);
            border-radius: 50%;
            box-shadow: 0 0 40px #1F2937, 0 0 80px #374151, 0 0 120px #4B5563;
            z-index: 999;
            pointer-events: none;
            animation: massiveHazeWisp ${0.6 + index * 0.1}s ease-out;
        `;
        document.body.appendChild(wisp);
        
        setTimeout(() => {
            wisp.remove();
        }, (0.6 + index * 0.1) * 1000);
    });
    
    // Phase 3: Screen shake effect
    document.body.style.animation = 'massiveHazeScreenShake 2s ease-in-out';
    
    // Phase 4: Pulse effects around enemy
    for (let i = 0; i < 6; i++) {
        const pulse = document.createElement('div');
        const angle = (i * 60) * (Math.PI / 180);
        const distance = 100;
        const px = enemyX + Math.cos(angle) * distance;
        const py = enemyY + Math.sin(angle) * distance;
        
        pulse.style.cssText = `
            position: absolute;
            top: ${py}px;
            left: ${px}px;
            width: 50px;
            height: 50px;
            background: radial-gradient(circle, #9CA3AF, #D1D5DB, #E5E7EB);
            border-radius: 50%;
            box-shadow: 0 0 25px #9CA3AF, 0 0 50px #D1D5DB;
            z-index: 999;
            pointer-events: none;
            animation: massiveHazePulse ${1 + i * 0.2}s ease-out;
        `;
        document.body.appendChild(pulse);
        
        setTimeout(() => {
            pulse.remove();
        }, (1 + i * 0.2) * 1000);
    }
    
    // Cleanup
    setTimeout(() => {
        backgroundEffect.remove();
        document.body.style.animation = '';
        style.remove();
    }, 2500);
}

// BOSS DUALIZE Animation - MASSIVE & VIVID VERSION
function triggerBossDualizeAnimation(enemySprite) {
    console.log('BOSS DUALIZE MASSIVE animation triggered');
    
    const enemyRect = enemySprite.getBoundingClientRect();
    const enemyX = enemyRect.left + enemyRect.width / 2;
    const enemyY = enemyRect.top + enemyRect.height / 2;
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes massiveDualizeBackground {
            0% { opacity: 0; background: #000000; }
            25% { opacity: 0.6; background: linear-gradient(45deg, #000000, #7C3AED, #A855F7, #000000); }
            50% { opacity: 0.8; background: linear-gradient(45deg, #000000, #C084FC, #E879F9, #F0ABFC, #000000); }
            75% { opacity: 0.6; background: linear-gradient(45deg, #000000, #F3E8FF, #000000); }
            100% { opacity: 0; background: #000000; }
        }
        @keyframes massiveDualizeSuperposition {
            0% { transform: scale(0) rotate(0deg); opacity: 0; }
            25% { transform: scale(4) rotate(90deg); opacity: 1; }
            50% { transform: scale(8) rotate(180deg); opacity: 0.9; }
            75% { transform: scale(12) rotate(270deg); opacity: 0.7; }
            100% { transform: scale(16) rotate(360deg); opacity: 0; }
        }
        @keyframes massiveDualizeScreenShake {
            0%, 100% { transform: translate(0, 0); }
            10% { transform: translate(-6px, -3px); }
            20% { transform: translate(6px, -3px); }
            30% { transform: translate(-6px, 3px); }
            40% { transform: translate(6px, 3px); }
            50% { transform: translate(-3px, -6px); }
            60% { transform: translate(3px, -6px); }
            70% { transform: translate(-3px, 6px); }
            80% { transform: translate(3px, 6px); }
            90% { transform: translate(0, 0); }
        }
        @keyframes massiveDualizeOrbital {
            0% { transform: rotate(0deg) translateX(0) scale(0); opacity: 0; }
            50% { transform: rotate(180deg) translateX(80px) scale(1); opacity: 1; }
            100% { transform: rotate(360deg) translateX(0) scale(0); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    // Phase 1: MASSIVE Background effect with purple cycling
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
        animation: massiveDualizeBackground 2s ease-in-out;
    `;
    document.body.appendChild(backgroundEffect);
    
    // Phase 2: MASSIVE Superposition wave effect
    const superpositionWave = document.createElement('div');
    superpositionWave.style.cssText = `
        position: absolute;
        top: ${enemyY - 100}px;
        left: ${enemyX - 100}px;
        width: 200px;
        height: 200px;
        background: radial-gradient(circle, rgba(124, 58, 237, 0.9), rgba(168, 85, 247, 0.7), rgba(192, 132, 252, 0.5), rgba(232, 121, 249, 0.3));
        border-radius: 50%;
        box-shadow: 0 0 60px rgba(124, 58, 237, 0.8), 0 0 120px rgba(168, 85, 247, 0.6), 0 0 180px rgba(192, 132, 252, 0.4);
        z-index: 999;
        pointer-events: none;
        animation: massiveDualizeSuperposition 2s ease-in-out;
    `;
    document.body.appendChild(superpositionWave);
    
    // Phase 3: Screen shake effect
    document.body.style.animation = 'massiveDualizeScreenShake 2s ease-in-out';
    
    // Phase 4: Orbital effects around enemy
    for (let i = 0; i < 8; i++) {
        const orbital = document.createElement('div');
        orbital.style.cssText = `
            position: absolute;
            top: ${enemyY}px;
            left: ${enemyX}px;
            width: 30px;
            height: 30px;
            background: radial-gradient(circle, #E879F9, #F0ABFC, #7C3AED);
            border-radius: 50%;
            box-shadow: 0 0 15px #E879F9, 0 0 30px #F0ABFC;
            z-index: 999;
            pointer-events: none;
            animation: massiveDualizeOrbital ${1.5 + i * 0.15}s ease-out;
        `;
        document.body.appendChild(orbital);
        
        setTimeout(() => {
            orbital.remove();
        }, (1.5 + i * 0.15) * 1000);
    }
    
    // Cleanup
    setTimeout(() => {
        backgroundEffect.remove();
        superpositionWave.remove();
        document.body.style.animation = '';
        style.remove();
    }, 2500);
}

function triggerMetalNoiseAnimation(playerSprite, enemySprite) {
    // Create massive amounts of metal grey triangles radiating out with intense wavy effects
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    // Create primary triangles (24 large triangles) - 3x more
    for (let i = 0; i < 24; i++) {
        setTimeout(() => {
            const triangle = document.createElement('div');
            const angle = (i * 15) * (Math.PI / 180); // 24 triangles in a circle
            const distance = 120 + (i * 25); // Increasing distance for each triangle
            
            triangle.style.cssText = `
                position: absolute;
                top: ${centerY}px;
                left: ${centerX}px;
                width: 0;
                height: 0;
                border-left: 20px solid transparent;
                border-right: 20px solid transparent;
                border-bottom: 35px solid #808080;
                transform: translate(-50%, -50%) rotate(${angle}rad);
                pointer-events: none;
            z-index: 1000;
                animation: metalTriangleRadiateIntense 2s ease-out;
            `;
            
            document.body.appendChild(triangle);
            
            // Add intense triangle animation with wavy effects
            const triangleStyle = document.createElement('style');
            triangleStyle.textContent = `
                @keyframes metalTriangleRadiateIntense {
                    0% { 
                        transform: translate(-50%, -50%) rotate(${angle}rad) scale(0) translateX(0px) translateY(0px); 
                        opacity: 1; 
                        border-bottom-color: #E0E0E0;
                        filter: brightness(1.5) contrast(1.2);
                    }
                    10% { 
                        transform: translate(-50%, -50%) rotate(${angle}rad) scale(0.8) translateX(${distance * 0.1}px) translateY(${Math.sin(angle) * 20}px); 
                        opacity: 0.95; 
                        border-bottom-color: #C0C0C0;
                        filter: brightness(1.3) contrast(1.1);
                    }
                    25% { 
                        transform: translate(-50%, -50%) rotate(${angle}rad) scale(1.2) translateX(${distance * 0.3}px) translateY(${Math.sin(angle * 2) * 30}px); 
                        opacity: 0.9; 
                        border-bottom-color: #A0A0A0;
                        filter: brightness(1.1) contrast(1.0);
                    }
                    40% { 
                        transform: translate(-50%, -50%) rotate(${angle}rad) scale(1.5) translateX(${distance * 0.5}px) translateY(${Math.sin(angle * 3) * 25}px); 
                        opacity: 0.8; 
                        border-bottom-color: #808080;
                        filter: brightness(1.0) contrast(1.0);
                    }
                    60% { 
                        transform: translate(-50%, -50%) rotate(${angle}rad) scale(1.3) translateX(${distance * 0.7}px) translateY(${Math.sin(angle * 4) * 20}px); 
                        opacity: 0.6; 
                        border-bottom-color: #606060;
                        filter: brightness(0.9) contrast(1.1);
                    }
                    80% { 
                        transform: translate(-50%, -50%) rotate(${angle}rad) scale(1.1) translateX(${distance * 0.9}px) translateY(${Math.sin(angle * 5) * 15}px); 
                        opacity: 0.3; 
                        border-bottom-color: #404040;
                        filter: brightness(0.8) contrast(1.2);
                    }
                    100% { 
                        transform: translate(-50%, -50%) rotate(${angle}rad) scale(0) translateX(${distance}px) translateY(${Math.sin(angle * 6) * 10}px); 
                        opacity: 0; 
                        border-bottom-color: #202020;
                        filter: brightness(0.7) contrast(1.3);
                    }
                }
            `;
            
            document.head.appendChild(triangleStyle);
            
            // Clean up individual triangle
            setTimeout(() => {
                if (document.body.contains(triangle)) {
                    document.body.removeChild(triangle);
                }
                if (document.head.contains(triangleStyle)) {
                    document.head.removeChild(triangleStyle);
                }
            }, 2000);
        }, i * 50); // Faster staggering
    }
    
    // Create secondary triangles (36 medium triangles) - 3x more
    for (let i = 0; i < 36; i++) {
        setTimeout(() => {
            const mediumTriangle = document.createElement('div');
            const angle = (i * 10) * (Math.PI / 180); // 36 triangles
            const distance = 100 + (i * 20);
            
            mediumTriangle.style.cssText = `
                position: absolute;
                top: ${centerY}px;
                left: ${centerX}px;
                width: 0;
                height: 0;
                border-left: 12px solid transparent;
                border-right: 12px solid transparent;
                border-bottom: 22px solid #A0A0A0;
                transform: translate(-50%, -50%) rotate(${angle}rad);
            pointer-events: none;
                z-index: 1001;
                animation: mediumMetalTriangleRadiate 1.8s ease-out;
            `;
            
            document.body.appendChild(mediumTriangle);
            
            // Add medium triangle animation with wavy effects
            const mediumTriangleStyle = document.createElement('style');
            mediumTriangleStyle.textContent = `
                @keyframes mediumMetalTriangleRadiate {
                    0% { 
                        transform: translate(-50%, -50%) rotate(${angle}rad) scale(0) translateX(0px) translateY(0px); 
                        opacity: 1; 
                        border-bottom-color: #D0D0D0;
                        filter: brightness(1.4) contrast(1.1);
                    }
                    15% { 
                        transform: translate(-50%, -50%) rotate(${angle}rad) scale(0.9) translateX(${distance * 0.15}px) translateY(${Math.cos(angle) * 25}px); 
                        opacity: 0.9; 
                        border-bottom-color: #B0B0B0;
                        filter: brightness(1.2) contrast(1.0);
                    }
                    35% { 
                        transform: translate(-50%, -50%) rotate(${angle}rad) scale(1.3) translateX(${distance * 0.4}px) translateY(${Math.cos(angle * 2) * 35}px); 
                        opacity: 0.8; 
                        border-bottom-color: #909090;
                        filter: brightness(1.0) contrast(1.0);
                    }
                    55% { 
                        transform: translate(-50%, -50%) rotate(${angle}rad) scale(1.4) translateX(${distance * 0.65}px) translateY(${Math.cos(angle * 3) * 30}px); 
                        opacity: 0.6; 
                        border-bottom-color: #707070;
                        filter: brightness(0.9) contrast(1.1);
                    }
                    75% { 
                        transform: translate(-50%, -50%) rotate(${angle}rad) scale(1.2) translateX(${distance * 0.85}px) translateY(${Math.cos(angle * 4) * 20}px); 
                        opacity: 0.4; 
                        border-bottom-color: #505050;
                        filter: brightness(0.8) contrast(1.2);
                    }
                    100% { 
                        transform: translate(-50%, -50%) rotate(${angle}rad) scale(0) translateX(${distance}px) translateY(${Math.cos(angle * 5) * 15}px); 
            opacity: 0;
                        border-bottom-color: #303030;
                        filter: brightness(0.7) contrast(1.3);
                    }
                }
        `;
        
            document.head.appendChild(mediumTriangleStyle);
            
            // Clean up medium triangle
        setTimeout(() => {
                if (document.body.contains(mediumTriangle)) {
                    document.body.removeChild(mediumTriangle);
                }
                if (document.head.contains(mediumTriangleStyle)) {
                    document.head.removeChild(mediumTriangleStyle);
                }
            }, 1800);
        }, i * 40 + 100); // Faster staggering with delay
    }
    
    // Create tertiary triangles (48 small triangles) - 4x more
    for (let i = 0; i < 48; i++) {
            setTimeout(() => {
            const smallTriangle = document.createElement('div');
            const angle = (i * 7.5) * (Math.PI / 180); // 48 triangles
            const distance = 80 + (i * 15);
            
            smallTriangle.style.cssText = `
                position: absolute;
                top: ${centerY}px;
                left: ${centerX}px;
                width: 0;
                height: 0;
                border-left: 8px solid transparent;
                border-right: 8px solid transparent;
                border-bottom: 15px solid #B0B0B0;
                transform: translate(-50%, -50%) rotate(${angle}rad);
                pointer-events: none;
                z-index: 1002;
                animation: smallMetalTriangleRadiateIntense 1.5s ease-out;
            `;
            
            document.body.appendChild(smallTriangle);
            
            // Add small triangle animation with intense wavy effects
            const smallTriangleStyle = document.createElement('style');
            smallTriangleStyle.textContent = `
                @keyframes smallMetalTriangleRadiateIntense {
                    0% { 
                        transform: translate(-50%, -50%) rotate(${angle}rad) scale(0) translateX(0px) translateY(0px); 
                        opacity: 1; 
                        border-bottom-color: #E0E0E0;
                        filter: brightness(1.6) contrast(1.2);
                    }
                    20% { 
                        transform: translate(-50%, -50%) rotate(${angle}rad) scale(1.1) translateX(${distance * 0.2}px) translateY(${Math.sin(angle * 1.5) * 30}px); 
                        opacity: 0.95; 
                        border-bottom-color: #C0C0C0;
                        filter: brightness(1.4) contrast(1.1);
                    }
                    40% { 
                        transform: translate(-50%, -50%) rotate(${angle}rad) scale(1.4) translateX(${distance * 0.45}px) translateY(${Math.sin(angle * 2.5) * 40}px); 
                        opacity: 0.8; 
                        border-bottom-color: #A0A0A0;
                        filter: brightness(1.2) contrast(1.0);
                    }
                    60% { 
                        transform: translate(-50%, -50%) rotate(${angle}rad) scale(1.3) translateX(${distance * 0.7}px) translateY(${Math.sin(angle * 3.5) * 35}px); 
                        opacity: 0.6; 
                        border-bottom-color: #808080;
                        filter: brightness(1.0) contrast(1.0);
                    }
                    80% { 
                        transform: translate(-50%, -50%) rotate(${angle}rad) scale(1.1) translateX(${distance * 0.9}px) translateY(${Math.sin(angle * 4.5) * 25}px); 
                        opacity: 0.3; 
                        border-bottom-color: #606060;
                        filter: brightness(0.8) contrast(1.2);
                    }
                    100% { 
                        transform: translate(-50%, -50%) rotate(${angle}rad) scale(0) translateX(${distance}px) translateY(${Math.sin(angle * 5.5) * 20}px); 
                        opacity: 0; 
                        border-bottom-color: #404040;
                        filter: brightness(0.7) contrast(1.3);
                    }
                }
            `;
            
            document.head.appendChild(smallTriangleStyle);
            
            // Clean up small triangle
                setTimeout(() => {
                if (document.body.contains(smallTriangle)) {
                    document.body.removeChild(smallTriangle);
                }
                if (document.head.contains(smallTriangleStyle)) {
                    document.head.removeChild(smallTriangleStyle);
                }
            }, 1500);
        }, i * 30 + 200); // Even faster staggering
    }
    
    // Create micro triangles (60 tiny triangles) - 5x more
    for (let i = 0; i < 60; i++) {
        setTimeout(() => {
            const microTriangle = document.createElement('div');
            const angle = (i * 6) * (Math.PI / 180); // 60 triangles
            const distance = 60 + (i * 12);
            
            microTriangle.style.cssText = `
                position: absolute;
                top: ${centerY}px;
                left: ${centerX}px;
                width: 0;
                height: 0;
                border-left: 5px solid transparent;
                border-right: 5px solid transparent;
                border-bottom: 10px solid #C0C0C0;
                transform: translate(-50%, -50%) rotate(${angle}rad);
                pointer-events: none;
                z-index: 1003;
                animation: microMetalTriangleRadiate 1.2s ease-out;
            `;
            
            document.body.appendChild(microTriangle);
            
            // Add micro triangle animation
            const microTriangleStyle = document.createElement('style');
            microTriangleStyle.textContent = `
                @keyframes microMetalTriangleRadiate {
                    0% { 
                        transform: translate(-50%, -50%) rotate(${angle}rad) scale(0) translateX(0px) translateY(0px); 
                        opacity: 1; 
                        border-bottom-color: #F0F0F0;
                        filter: brightness(1.8) contrast(1.3);
                    }
                    25% { 
                        transform: translate(-50%, -50%) rotate(${angle}rad) scale(1.2) translateX(${distance * 0.25}px) translateY(${Math.cos(angle * 2) * 25}px); 
                        opacity: 0.9; 
                        border-bottom-color: #D0D0D0;
                        filter: brightness(1.5) contrast(1.1);
                    }
                    50% { 
                        transform: translate(-50%, -50%) rotate(${angle}rad) scale(1.5) translateX(${distance * 0.5}px) translateY(${Math.cos(angle * 3) * 35}px); 
                        opacity: 0.7; 
                        border-bottom-color: #B0B0B0;
                        filter: brightness(1.2) contrast(1.0);
                    }
                    75% { 
                        transform: translate(-50%, -50%) rotate(${angle}rad) scale(1.3) translateX(${distance * 0.75}px) translateY(${Math.cos(angle * 4) * 30}px); 
                        opacity: 0.4; 
                        border-bottom-color: #909090;
                        filter: brightness(0.9) contrast(1.1);
                    }
                    100% { 
                        transform: translate(-50%, -50%) rotate(${angle}rad) scale(0) translateX(${distance}px) translateY(${Math.cos(angle * 5) * 20}px); 
                        opacity: 0; 
                        border-bottom-color: #707070;
                        filter: brightness(0.7) contrast(1.3);
                    }
                }
            `;
            
            document.head.appendChild(microTriangleStyle);
            
            // Clean up micro triangle
            setTimeout(() => {
                if (document.body.contains(microTriangle)) {
                    document.body.removeChild(microTriangle);
                }
                if (document.head.contains(microTriangleStyle)) {
                    document.head.removeChild(microTriangleStyle);
                }
            }, 1200);
        }, i * 25 + 300); // Very fast staggering
    }
}

function triggerShiftGearAnimation(playerSprite) {
    // Get player sprite position to place gear on top of Resona
    const playerRect = playerSprite.getBoundingClientRect();
    const playerCenterX = playerRect.left + playerRect.width / 2;
    const playerTop = playerRect.top;
    
    // Create gear rotation effect using actual gear.png, positioned on top of Resona
    const gear = document.createElement('img');
    gear.src = '/static/images/gear.png';
    gear.style.cssText = `
        position: fixed;
        top: ${playerTop - 50}px;
        left: ${playerCenterX}px;
        transform: translate(-50%, -50%);
        width: 150px;
        height: 150px;
        pointer-events: none;
        z-index: 1000;
        animation: gearRotateOnResona 1.5s ease-out;
    `;
    
    // Add gear rotation animation on top of Resona
    const style = document.createElement('style');
    style.textContent = `
        @keyframes gearRotateOnResona {
            0% { transform: translate(-50%, -50%) scale(0) rotate(0deg); opacity: 1; }
            50% { transform: translate(-50%, -50%) scale(1) rotate(180deg); opacity: 0.8; }
            100% { transform: translate(-50%, -50%) scale(0) rotate(360deg); opacity: 0; }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(gear);
    
    // Create quantum particles around the gear on top of Resona
    for (let i = 0; i < 12; i++) {
    setTimeout(() => {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
                top: ${playerTop - 50}px;
                left: ${playerCenterX}px;
                width: 30px;
                height: 30px;
                background: radial-gradient(circle, #4a90e2, #357abd);
            border-radius: 50%;
            pointer-events: none;
                z-index: 1001;
                animation: quantumParticleOnResona 1.2s ease-out;
        `;
            
        document.body.appendChild(particle);
        
        setTimeout(() => {
                if (document.body.contains(particle)) {
                    document.body.removeChild(particle);
                }
            }, 1200);
        }, i * 100);
    }
    
    // Add particle animation for particles around Resona
    const particleStyle = document.createElement('style');
    particleStyle.textContent = `
        @keyframes quantumParticleOnResona {
            0% { 
                transform: translate(-50%, -50%) scale(0); 
                opacity: 1; 
            }
            50% { 
                transform: translate(-50%, -50%) scale(1) translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px); 
                opacity: 0.8; 
            }
            100% { 
                transform: translate(-50%, -50%) scale(0) translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px); 
                opacity: 0; 
            }
        }
    `;
    
    document.head.appendChild(particleStyle);
    
    // Clean up
            setTimeout(() => {
        if (document.body.contains(gear)) {
            document.body.removeChild(gear);
        }
        if (document.head.contains(style)) {
            document.head.removeChild(style);
        }
        if (document.head.contains(particleStyle)) {
            document.head.removeChild(particleStyle);
        }
    }, 2000);
}

// Update qubit states based on the message being displayed
function updateQubitStatesFromMessage(message) {
    // Check for waveform stack updates for Resona
    if (currentCharacter === "Resona" && (message.includes("gained waveform stack") || message.includes("waveform"))) {
        console.log('Detected waveform stack update:', message);
        
        // Update waveform display immediately
        const waveformDisplay = document.getElementById('waveform-display');
        const waveformStacks = document.getElementById('waveform-stacks');
        if (waveformDisplay && waveformStacks && gameState) {
            const stacks = gameState.player.waveform_stacks || 0;
            waveformStacks.textContent = stacks;
            console.log('Updated waveform stacks to:', stacks);
            
            // Create light blue balls for waveform stacks
            createWaveformBalls(stacks);
        }
    }
    
    // Check for turn start glow for Resona
    if (currentCharacter === "Resona" && message.includes("Your qubit is")) {
        // Add yellow glow aura for turn start (bigger)
        const playerSprite = document.getElementById('player-sprite');
        if (playerSprite) {
            playerSprite.style.filter = 'drop-shadow(0 0 40px yellow) brightness(1.4)';
                setTimeout(() => {
                playerSprite.style.filter = '';
            }, 2000); // Glow for 2 seconds
        }
    }
    
    // Check for Metal Noise activation/deactivation
    if (currentCharacter === "Resona" && message.includes("METAL NOISE")) {
        console.log('Detected Metal Noise message:', message);
        
        // Update Metal Noise indicator immediately
        const metalNoiseIndicator = document.getElementById('metal-noise-indicator');
        const metalNoiseText = document.getElementById('metal-noise-text');
        if (metalNoiseIndicator && metalNoiseText && gameState) {
            if (message.includes("blocks enemy Q-Moves")) {
                metalNoiseIndicator.style.display = 'flex';
                metalNoiseText.textContent = "Q-Moves";
            } else if (message.includes("blocks enemy state changes")) {
                metalNoiseIndicator.style.display = 'flex';
                metalNoiseText.textContent = "States";
            } else if (message.includes("deals") && message.includes("damage")) {
                metalNoiseIndicator.style.display = 'flex';
                metalNoiseText.textContent = "Active";
            }
        }
    }
    
    // Check for Metal Noise blocking enemy moves
    if (message.includes("But it failed!") && message.includes("blocked by METAL NOISE")) {
        console.log('Detected Metal Noise blocking:', message);
        
        // Hide Metal Noise indicator after blocking
        const metalNoiseIndicator = document.getElementById('metal-noise-indicator');
        if (metalNoiseIndicator) {
    setTimeout(() => {
                metalNoiseIndicator.style.display = 'none';
            }, 3000); // Hide after 3 seconds
        }
    }
    
    // Higscrozma Barrier System Integration
    if (currentCharacter === "Higscrozma" && message.includes("Barriers:")) {
        console.log('Detected barrier update:', message);
        
        // Parse barrier information from message
        const barrierMatch = message.match(/Barriers: (\d+) front, (\d+) back/);
        if (barrierMatch) {
            const frontBarriers = parseInt(barrierMatch[1]);
            const backBarriers = parseInt(barrierMatch[2]);
            
            console.log('Parsed barriers - Front:', frontBarriers, 'Back:', backBarriers);
            
            barrierState.barriersInFront = frontBarriers;
            barrierState.barriersBehind = backBarriers;
            
            console.log('Updated barrier state:', barrierState);
            updateBarrierDisplay();
        } else {
            console.log('Failed to parse barrier information from message:', message);
        }
    }
    
    // Check for barrier shattering
    if (currentCharacter === "Higscrozma" && message.includes("Shatters")) {
        console.log('Detected barrier shatter:', message);
        
        if (message.includes("front barrier")) {
            shatterBarrier('front');
        } else if (message.includes("back barrier")) {
            shatterBarrier('back-left');
        } else if (message.includes("barriers")) {
            // Multiple barriers shattered - shatter all front barriers
            shatterBarrier('front');
            shatterBarrier('middle');
            shatterBarrier('back');
        }
    }
    
    // Check for barrier movement - REMOVED: Backend already handles barrier state updates
    if (currentCharacter === "Higscrozma" && message.includes("Moved up one barrier")) {
        console.log('Detected barrier movement message:', message);
        console.log('Backend will handle barrier state update - no frontend action needed');
    }
    
    // Real-time qubit state updates based on specific messages
    if (message.includes("put its qubit into superposition") && !message.includes("Singulon")) {
        // Player used DUALIZE
        const playerQubit = document.getElementById('player-qubit');
        if (playerQubit) {
            playerQubit.textContent = "S";
        }
    } else if (currentCharacter === "Higscrozma" && (message.includes("puts its qubit into superposition") || message.includes("Qubit in superposition"))) {
        // Higscrozma specific qubit state updates
        const playerQubit = document.getElementById('player-qubit');
        if (playerQubit) {
            playerQubit.textContent = "S";
        }
    } else if (currentCharacter === "Neutrinette" && message.includes("creates quantum entanglement")) {
        // Neutrinette ENTANGLE - update both qubits immediately
        const playerQubit = document.getElementById('player-qubit');
        const enemyQubit = document.getElementById('enemy-qubit');
        if (playerQubit && enemyQubit) {
            playerQubit.classList.add('entangled');
            enemyQubit.classList.add('entangled');
        }
    } else if (message.includes("flipped Singulon's qubit to")) {
        // Player used BIT-FLIP
        const enemyQubit = document.getElementById('enemy-qubit');
        if (enemyQubit) {
            if (message.includes("to |1⟩")) {
                enemyQubit.textContent = "|1⟩";
            } else if (message.includes("to |0⟩")) {
                enemyQubit.textContent = "|0⟩";
            }
        }
    } else if (message.includes("swaps qubit states")) {
        // Player used SWITCHEROO
        const playerQubit = document.getElementById('player-qubit');
        const enemyQubit = document.getElementById('enemy-qubit');
        if (playerQubit && enemyQubit) {
            const tempPlayerState = playerQubit.textContent;
            const tempEnemyState = enemyQubit.textContent;
            playerQubit.textContent = tempEnemyState;
            enemyQubit.textContent = tempPlayerState;
        }
    } else if (message.includes("creates quantum entanglement")) {
        // Player used ENTANGLE
        const playerQubit = document.getElementById('player-qubit');
        const enemyQubit = document.getElementById('enemy-qubit');
        if (playerQubit && enemyQubit) {
            playerQubit.classList.add('entangled');
            enemyQubit.classList.add('entangled');
        }
    } else if (message.includes("Q-THUNDER strikes for") || message.includes("Q-PHOTON GEYSER") || message.includes("Q-METRONOME") || message.includes("WAVE CRASH")) {
        // Q-moves that collapse qubits - update from current game state
        const playerQubit = document.getElementById('player-qubit');
        if (playerQubit && gameState && gameState.player && gameState.player.qubit_state) {
            const collapsedState = gameState.player.qubit_state;
            const cleanState = collapsedState.replace(/\.$/, '');
            playerQubit.textContent = cleanState === "superposition" ? "S" : cleanState;
        }
    } else if (currentCharacter === "Higscrozma" && (message.includes("Q-VOID RIFT") || message.includes("PRISMATIC LASER") || message.includes("SHADOW FORCE"))) {
        // Higscrozma moves that collapse qubits - update from current game state
        const playerQubit = document.getElementById('player-qubit');
        if (playerQubit && gameState && gameState.player && gameState.player.qubit_state) {
            const collapsedState = gameState.player.qubit_state;
            const cleanState = collapsedState.replace(/\.$/, '');
            playerQubit.textContent = cleanState === "superposition" ? "S" : cleanState;
        }
    } else if (message.includes("Singulon put its qubit into superposition")) {
        // Enemy used DUALIZE
        const enemyQubit = document.getElementById('enemy-qubit');
        if (enemyQubit) {
            enemyQubit.textContent = "S";
        }
        
        // Trigger boss DUALIZE animation
        const enemySprite = document.querySelector('.enemy-sprite img');
        if (enemySprite) {
            triggerBossDualizeAnimation(enemySprite);
        }
    } else if (currentCharacter === "Neutrinette" && message.includes("Singulon used") && (message.includes("DUALIZE") || message.includes("BIT-FLIP") || message.includes("HAZE"))) {
        // Neutrinette vs Singulon - immediate enemy qubit state updates
        const enemyQubit = document.getElementById('enemy-qubit');
        if (enemyQubit) {
            if (message.includes("DUALIZE")) {
                enemyQubit.textContent = "S";
            } else if (message.includes("BIT-FLIP")) {
                // BIT-FLIP flips the qubit state
                const currentState = enemyQubit.textContent;
                enemyQubit.textContent = currentState === "|0⟩" ? "|1⟩" : "|0⟩";
            } else if (message.includes("HAZE")) {
                enemyQubit.textContent = "|0⟩";
            }
        }
    } else if (message.includes("Both quantumon's qubits are now |0⟩")) {
        // Enemy used HAZE
        console.log('HAZE detected! Triggering animation...');
        const enemyQubit = document.getElementById('enemy-qubit');
        if (enemyQubit) {
            enemyQubit.textContent = "|0⟩";
        }
        
        // Reset player qubit to |0⟩ for HAZE
        const playerQubit = document.getElementById('player-qubit');
        if (playerQubit) {
            playerQubit.textContent = "|0⟩";
        }
        
        // Trigger boss HAZE animation
        const enemySprite = document.querySelector('.enemy-sprite img');
        if (enemySprite) {
            console.log('Enemy sprite found, triggering HAZE animation');
            triggerBossHazeAnimation(enemySprite);
        } else {
            console.log('Enemy sprite not found for HAZE animation');
        }
    } else if (message.includes("Your qubit is")) {
        // End of turn qubit state update
        const playerQubit = document.getElementById('player-qubit');
        if (playerQubit) {
            const qubitMatch = message.match(/Your qubit is (.+)/);
            if (qubitMatch) {
                const qubitState = qubitMatch[1];
                const cleanState = qubitState.replace(/\.$/, '');
                playerQubit.textContent = cleanState === "superposition" ? "S" : cleanState;
            }
        }
    } else if (message.includes("Singulon's qubit is")) {
        // End of turn enemy qubit state update
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
        console.log('Updated enemy HP bar for QUANTUM AFTERBURN extra damage');
    }
    
    // Check for QUANTUM AFTERBURN reflects damage messages (defending)
    if (message.includes("QUANTUM AFTERBURN") && message.includes("reflects") && message.includes("damage back to the enemy")) {
        console.log('Detected QUANTUM AFTERBURN reflects damage message:', message);
        
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
        console.log('Updated enemy HP bar for QUANTUM AFTERBURN reflects damage');
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
    
    // Check for boss move usage messages (for animations)
    // Note: Q-PRISMATIC LASER animation is handled in the damage section below
    if (message.includes("Singulon used")) {
        // Other boss move animations can be added here
    }
    
    // Check for SPECIFIC damage messages and healing messages and update HP bars visually in real-time
    // Only update HP for actual damage/healing messages, not move usage messages
    if ((message.includes("Dealt") && message.includes("damage!")) || 
        (message.includes("deals") && message.includes("damage") && (message.includes("BULLET MUONS") || message.includes("Q-PRISMATIC LASER") || message.includes("Q-PHOTON GEYSER") || message.includes("GLITCH CLAW") || message.includes("Q-METRONOME") || message.includes("WAVE CRASH") || message.includes("METAL NOISE") || message.includes("Q-VOID RIFT") || message.includes("PRISMATIC LASER") || message.includes("SHADOW FORCE"))) ||
        (message.includes("QUANTUM AFTERBURN") && message.includes("extra damage")) ||
        (message.includes("heals") && message.includes("HP"))) {
        console.log('Detected damage/healing message:', message);
        
        // Check if this is a healing message
        if (message.includes("heals") && message.includes("HP")) {
            console.log('Detected healing message:', message);
            
            // Get character max HP from character data
            const charData = characterData[currentCharacter];
            const maxPlayerHp = charData ? charData.maxHp : 90;
            
            // Update HP bars to match the current backend state (healing already applied)
            const playerHpPercent = (gameState.player.hp / maxPlayerHp) * 100;
            
            // Player was healed - update visual display immediately
            playerHealthFill.style.width = `${Math.max(0, playerHpPercent)}%`;
            updateHealthBarColor(playerHealthFill, playerHpPercent);
            
            const playerHp = document.getElementById('player-hp');
            if (playerHp) {
                playerHp.textContent = `${Math.max(0, gameState.player.hp)}/${maxPlayerHp}`;
            }
            
            // Mark that we've updated player HP visually to prevent override
            window.visualPlayerHpUpdated = true;
            return; // Exit early since we handled healing
        }
        
        // Trigger boss animations for enemy moves
        if (message.includes("BULLET MUONS") && message.includes("deals")) {
            const enemySprite = document.querySelector('.enemy-sprite img');
            const playerSprite = document.getElementById('player-sprite');
            if (enemySprite && playerSprite) {
                triggerBossBulletMuonsAnimation(enemySprite, playerSprite);
            }
        } else if (message.includes("Q-PRISMATIC LASER") && message.includes("deals")) {
            const enemySprite = document.querySelector('.enemy-sprite img');
            const playerSprite = document.getElementById('player-sprite');
            if (enemySprite && playerSprite) {
                triggerBossQPrismaticLaserAnimation(enemySprite, playerSprite);
            }
        }
        
        // Trigger Higscrozma animations for player moves
        if (currentCharacter === "Higscrozma") {
            if ((message.includes("Q-VOID RIFT") && message.includes("deals")) || (message.includes("Higscrozma used Q-VOID RIFT"))) {
                const playerSprite = document.getElementById('player-sprite');
                const enemySprite = document.querySelector('.enemy-sprite img');
                if (playerSprite && enemySprite) {
                    triggerQVoidRiftAnimation(playerSprite, enemySprite);
                }
            } else if ((message.includes("PRISMATIC LASER") && message.includes("deals")) || (message.includes("Higscrozma used PRISMATIC LASER"))) {
                const playerSprite = document.getElementById('player-sprite');
                const enemySprite = document.querySelector('.enemy-sprite img');
                if (playerSprite && enemySprite) {
                    triggerPrismaticLaserAnimation(playerSprite, enemySprite);
                }
            } else if ((message.includes("SHADOW FORCE") && message.includes("deals")) || (message.includes("Higscrozma used SHADOW FORCE"))) {
                const playerSprite = document.getElementById('player-sprite');
                const enemySprite = document.querySelector('.enemy-sprite img');
                if (playerSprite && enemySprite) {
                    triggerShadowForceAnimation(playerSprite, enemySprite);
                }
            } else if ((message.includes("BARRIER") && (message.includes("increases Defense") || message.includes("creates new barrier"))) || (message.includes("Higscrozma used BARRIER"))) {
                const playerSprite = document.getElementById('player-sprite');
                if (playerSprite) {
                    triggerBarrierAnimation(playerSprite);
                }
            }
        }
        
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

// Boss Animation Functions

// Q-PRISMATIC LASER Animation - MASSIVE & VIVID VERSION
function triggerBossQPrismaticLaserAnimation(enemySprite, playerSprite) {
    console.log('Q-PRISMATIC LASER MASSIVE animation triggered');
    
    const enemyRect = enemySprite.getBoundingClientRect();
    const playerRect = playerSprite.getBoundingClientRect();
    
    const enemyX = enemyRect.left + enemyRect.width / 2;
    const enemyY = enemyRect.top + enemyRect.height / 2;
    const playerX = playerRect.left + playerRect.width / 2;
    const playerY = playerRect.top + playerRect.height / 2;
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes massiveSpacialRendBackground {
            0% { opacity: 0; background: #000000; }
            25% { opacity: 0.8; background: linear-gradient(45deg, #000000, #4C1D95, #000000); }
            50% { opacity: 0.9; background: linear-gradient(45deg, #000000, #7C3AED, #A855F7, #000000); }
            75% { opacity: 0.8; background: linear-gradient(45deg, #000000, #C084FC, #000000); }
            100% { opacity: 0; background: #000000; }
        }
        @keyframes massiveSpacialRendMistball {
            0% { transform: scale(0) rotate(0deg); opacity: 0; }
            20% { transform: scale(3) rotate(90deg); opacity: 1; }
            50% { transform: scale(8) rotate(180deg); opacity: 0.9; }
            80% { transform: scale(12) rotate(270deg); opacity: 0.7; }
            100% { transform: scale(15) rotate(360deg); opacity: 0; }
        }
        @keyframes massiveSpacialRendSlash {
            0% { transform: scale(0) rotate(0deg); opacity: 0; }
            25% { transform: scale(5) rotate(45deg); opacity: 1; }
            50% { transform: scale(10) rotate(90deg); opacity: 0.9; }
            75% { transform: scale(15) rotate(135deg); opacity: 0.7; }
            100% { transform: scale(20) rotate(180deg); opacity: 0; }
        }
        @keyframes massiveSpacialRendDefender {
            0% { transform: translate(0, 0) scale(1) rotate(0deg); }
            25% { transform: translate(-20px, -20px) scale(0.8) rotate(5deg); }
            50% { transform: translate(-40px, -40px) scale(0.6) rotate(10deg); }
            75% { transform: translate(-30px, -30px) scale(0.7) rotate(5deg); }
            100% { transform: translate(0, 0) scale(1) rotate(0deg); }
        }
        @keyframes massiveSpacialRendScreenShake {
            0%, 100% { transform: translate(0, 0); }
            10% { transform: translate(-10px, -5px); }
            20% { transform: translate(10px, -5px); }
            30% { transform: translate(-10px, 5px); }
            40% { transform: translate(10px, 5px); }
            50% { transform: translate(-5px, -10px); }
            60% { transform: translate(5px, -10px); }
            70% { transform: translate(-5px, 10px); }
            80% { transform: translate(5px, 10px); }
            90% { transform: translate(0, 0); }
        }
        @keyframes massiveSpacialRendLightning {
            0% { transform: scale(0) rotate(0deg); opacity: 0; }
            50% { transform: scale(1) rotate(180deg); opacity: 1; }
            100% { transform: scale(2) rotate(360deg); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    // Phase 1: MASSIVE Background effect with color cycling
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
        animation: massiveSpacialRendBackground 1.5s ease-in-out;
    `;
    document.body.appendChild(backgroundEffect);
    
    // Phase 2: MASSIVE Multiple mistball effects (20x bigger!)
    const mistballPositions = [
        { x: playerX + 50, y: playerY + 50 },
        { x: playerX - 50, y: playerY - 50 },
        { x: playerX + 100, y: playerY + 25 },
        { x: playerX - 100, y: playerY - 25 },
        { x: playerX + 25, y: playerY + 100 },
        { x: playerX - 25, y: playerY - 100 },
        { x: playerX + 75, y: playerY + 75 },
        { x: playerX - 75, y: playerY - 75 }
    ];
    
    mistballPositions.forEach((pos, index) => {
        const mistball = document.createElement('div');
        mistball.style.cssText = `
            position: absolute;
            top: ${pos.y}px;
            left: ${pos.x}px;
            width: 80px;
            height: 80px;
            background: radial-gradient(circle, #8B5CF6, #A855F7, #C084FC, #F59E0B, #EF4444);
            border-radius: 50%;
            box-shadow: 0 0 50px #8B5CF6, 0 0 100px #A855F7, 0 0 150px #C084FC;
            z-index: 999;
            pointer-events: none;
            animation: massiveSpacialRendMistball ${0.5 + index * 0.2}s ease-out;
        `;
        document.body.appendChild(mistball);
        
        setTimeout(() => {
            mistball.remove();
        }, (0.5 + index * 0.2) * 1000);
    });
    
    // Phase 3: MASSIVE Slash effect (10x bigger!)
    const slashEffect = document.createElement('div');
    slashEffect.style.cssText = `
        position: absolute;
        top: ${playerY - 50}px;
        left: ${playerX - 50}px;
        width: 300px;
        height: 300px;
        background: linear-gradient(45deg, transparent 20%, #8B5CF6 40%, #A855F7 50%, #C084FC 60%, #F59E0B 70%, transparent 80%);
        clip-path: polygon(0 50%, 100% 0, 100% 100%);
        box-shadow: 0 0 100px #8B5CF6, 0 0 200px #A855F7;
        z-index: 999;
        pointer-events: none;
        animation: massiveSpacialRendSlash 1s ease-out;
    `;
    document.body.appendChild(slashEffect);
    
    // Phase 4: Screen shake effect
    document.body.style.animation = 'massiveSpacialRendScreenShake 1.5s ease-in-out';
    
    // Phase 5: Lightning effects around player
    for (let i = 0; i < 8; i++) {
        const lightning = document.createElement('div');
        const angle = (i * 45) * (Math.PI / 180);
        const distance = 150;
        const lx = playerX + Math.cos(angle) * distance;
        const ly = playerY + Math.sin(angle) * distance;
        
        lightning.style.cssText = `
            position: absolute;
            top: ${ly}px;
            left: ${lx}px;
            width: 60px;
            height: 60px;
            background: radial-gradient(circle, #F59E0B, #EF4444, #8B5CF6);
            border-radius: 50%;
            box-shadow: 0 0 30px #F59E0B, 0 0 60px #EF4444;
            z-index: 999;
            pointer-events: none;
            animation: massiveSpacialRendLightning ${0.8 + i * 0.1}s ease-out;
        `;
        document.body.appendChild(lightning);
        
        setTimeout(() => {
            lightning.remove();
        }, (0.8 + i * 0.1) * 1000);
    }
    
    // Phase 6: Player sprite effect (more dramatic)
    playerSprite.style.animation = 'massiveSpacialRendDefender 1.5s ease-out';
    
    // Cleanup
    setTimeout(() => {
        backgroundEffect.remove();
        slashEffect.remove();
        document.body.style.animation = '';
        playerSprite.style.animation = '';
        style.remove();
    }, 2000);
}

// BULLET MUONS Animation - MASSIVE & VIVID VERSION
function triggerBossBulletMuonsAnimation(enemySprite, playerSprite) {
    console.log('BULLET MUONS MASSIVE animation triggered');
    
    const enemyRect = enemySprite.getBoundingClientRect();
    const playerRect = playerSprite.getBoundingClientRect();
    
    const enemyX = enemyRect.left + enemyRect.width / 2;
    const enemyY = enemyRect.top + enemyRect.height / 2;
    const playerX = playerRect.left + playerRect.width / 2;
    const playerY = playerRect.top + playerRect.height / 2;
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes massiveShadowBallBackground {
            0% { opacity: 0; background: #000000; }
            25% { opacity: 0.6; background: linear-gradient(45deg, #000000, #4C1D95, #000000); }
            50% { opacity: 0.8; background: linear-gradient(45deg, #000000, #7C3AED, #A855F7, #000000); }
            75% { opacity: 0.6; background: linear-gradient(45deg, #000000, #C084FC, #000000); }
            100% { opacity: 0; background: #000000; }
        }
        @keyframes massiveShadowBallWisp {
            0% { transform: translate(0, 0) scale(0); opacity: 0; }
            25% { transform: translate(0, 0) scale(2); opacity: 1; }
            50% { transform: translate(0, 0) scale(4); opacity: 0.9; }
            75% { transform: translate(0, 0) scale(6); opacity: 0.7; }
            100% { transform: translate(0, 0) scale(8); opacity: 0; }
        }
        @keyframes massiveShadowBallProjectile {
            0% { transform: scale(0) translate(0, 0); opacity: 0; }
            25% { transform: scale(2) translate(0, 0); opacity: 0.8; }
            50% { transform: scale(4) translate(${(playerX - enemyX) / 2}px, ${(playerY - enemyY) / 2}px); opacity: 1; }
            75% { transform: scale(6) translate(${(playerX - enemyX) * 0.75}px, ${(playerY - enemyY) * 0.75}px); opacity: 0.9; }
            100% { transform: scale(8) translate(${playerX - enemyX}px, ${playerY - enemyY}px); opacity: 0.8; }
        }
        @keyframes massiveShadowBallExplode {
            0% { transform: scale(0); opacity: 0; }
            25% { transform: scale(5); opacity: 1; }
            50% { transform: scale(10); opacity: 0.9; }
            75% { transform: scale(15); opacity: 0.7; }
            100% { transform: scale(20); opacity: 0; }
        }
        @keyframes massiveShadowBallDefender {
            0% { transform: translateZ(0) scale(1) rotate(0deg); }
            25% { transform: translateZ(20px) scale(0.8) rotate(5deg); }
            50% { transform: translateZ(40px) scale(0.6) rotate(10deg); }
            75% { transform: translateZ(20px) scale(0.8) rotate(5deg); }
            100% { transform: translateZ(0) scale(1) rotate(0deg); }
        }
        @keyframes massiveShadowBallScreenShake {
            0%, 100% { transform: translate(0, 0); }
            10% { transform: translate(-15px, -8px); }
            20% { transform: translate(15px, -8px); }
            30% { transform: translate(-15px, 8px); }
            40% { transform: translate(15px, 8px); }
            50% { transform: translate(-8px, -15px); }
            60% { transform: translate(8px, -15px); }
            70% { transform: translate(-8px, 15px); }
            80% { transform: translate(8px, 15px); }
            90% { transform: translate(0, 0); }
        }
        @keyframes massiveShadowBallOrbital {
            0% { transform: rotate(0deg) translateX(0) scale(0); opacity: 0; }
            50% { transform: rotate(180deg) translateX(100px) scale(1); opacity: 1; }
            100% { transform: rotate(360deg) translateX(0) scale(0); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    // Phase 1: MASSIVE Background effect with color cycling
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
        animation: massiveShadowBallBackground 2s ease-in-out;
    `;
    document.body.appendChild(backgroundEffect);
    
    // Phase 2: MASSIVE Poison wisp gathering effects (20x bigger!)
    const wispPositions = [
        { x: enemyX, y: enemyY + 150 },
        { x: enemyX - 100, y: enemyY - 120 },
        { x: enemyX + 100, y: enemyY - 120 },
        { x: enemyX - 150, y: enemyY + 60 },
        { x: enemyX + 150, y: enemyY + 60 },
        { x: enemyX - 80, y: enemyY + 200 },
        { x: enemyX + 80, y: enemyY + 200 },
        { x: enemyX - 120, y: enemyY - 60 },
        { x: enemyX + 120, y: enemyY - 60 },
        { x: enemyX, y: enemyY - 200 }
    ];
    
    wispPositions.forEach((pos, index) => {
        const wisp = document.createElement('div');
        wisp.style.cssText = `
            position: absolute;
            top: ${pos.y}px;
            left: ${pos.x}px;
            width: 100px;
            height: 100px;
            background: radial-gradient(circle, #4C1D95, #7C3AED, #A855F7, #C084FC, #F59E0B);
            border-radius: 50%;
            box-shadow: 0 0 60px #4C1D95, 0 0 120px #7C3AED, 0 0 180px #A855F7;
            z-index: 999;
            pointer-events: none;
            animation: massiveShadowBallWisp ${0.4 + index * 0.15}s ease-out;
        `;
        document.body.appendChild(wisp);
        
        setTimeout(() => {
            wisp.remove();
        }, (0.4 + index * 0.15) * 1000);
    });
    
    // Phase 3: MASSIVE Shadow ball projectile (10x bigger!)
    const shadowBall = document.createElement('div');
    shadowBall.style.cssText = `
        position: absolute;
        top: ${enemyY}px;
        left: ${enemyX}px;
        width: 120px;
        height: 120px;
        background: radial-gradient(circle, #4C1D95, #7C3AED, #A855F7, #C084FC, #F59E0B, #EF4444);
        border-radius: 50%;
        box-shadow: 0 0 80px #4C1D95, 0 0 160px #7C3AED, 0 0 240px #A855F7;
        z-index: 999;
        pointer-events: none;
        animation: massiveShadowBallProjectile 1.5s ease-out;
    `;
    document.body.appendChild(shadowBall);
    
    // Phase 4: Orbital effects around enemy
    for (let i = 0; i < 6; i++) {
        const orbital = document.createElement('div');
        orbital.style.cssText = `
            position: absolute;
            top: ${enemyY}px;
            left: ${enemyX}px;
            width: 40px;
            height: 40px;
            background: radial-gradient(circle, #F59E0B, #EF4444, #4C1D95);
            border-radius: 50%;
            box-shadow: 0 0 20px #F59E0B, 0 0 40px #EF4444;
            z-index: 999;
            pointer-events: none;
            animation: massiveShadowBallOrbital ${1 + i * 0.2}s ease-out;
        `;
        document.body.appendChild(orbital);
        
        setTimeout(() => {
            orbital.remove();
        }, (1 + i * 0.2) * 1000);
    }
    
    // Phase 5: Screen shake effect
    document.body.style.animation = 'massiveShadowBallScreenShake 2s ease-in-out';
    
    // Phase 6: MASSIVE Explosion effect at player
            setTimeout(() => {
        const explosion = document.createElement('div');
        explosion.style.cssText = `
            position: absolute;
            top: ${playerY}px;
            left: ${playerX}px;
            width: 120px;
            height: 120px;
            background: radial-gradient(circle, #4C1D95, #7C3AED, #A855F7, #C084FC, #F59E0B, #EF4444);
            border-radius: 50%;
            box-shadow: 0 0 100px #4C1D95, 0 0 200px #7C3AED, 0 0 300px #A855F7;
            z-index: 999;
            pointer-events: none;
            animation: massiveShadowBallExplode 0.8s ease-out;
        `;
        document.body.appendChild(explosion);
        
        // Player sprite effect (more dramatic)
        playerSprite.style.animation = 'massiveShadowBallDefender 0.8s ease-out';
        
                setTimeout(() => {
            explosion.remove();
            playerSprite.style.animation = '';
        }, 800);
    }, 1500);
    
    // Cleanup
    setTimeout(() => {
        backgroundEffect.remove();
        shadowBall.remove();
        document.body.style.animation = '';
        style.remove();
    }, 3000);
}

// Higscrozma Animation Functions
function triggerQVoidRiftAnimation(playerSprite, enemySprite) {
    console.log('Q-VOID RIFT animation triggered');
    
    const playerRect = playerSprite.getBoundingClientRect();
    const enemyRect = enemySprite.getBoundingClientRect();
    const playerX = playerRect.left + playerRect.width / 2;
    const playerY = playerRect.top + playerRect.height / 2;
    const enemyX = enemyRect.left + enemyRect.width / 2;
    const enemyY = enemyRect.top + enemyRect.height / 2;
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes voidRiftBackground {
            0% { opacity: 0; background: #000000; }
            25% { opacity: 0.8; background: linear-gradient(45deg, #000000, #1F2937, #374151, #000000); }
            50% { opacity: 1; background: linear-gradient(45deg, #000000, #4B5563, #6B7280, #9CA3AF, #000000); }
            75% { opacity: 0.8; background: linear-gradient(45deg, #000000, #D1D5DB, #E5E7EB, #000000); }
            100% { opacity: 0; background: #000000; }
        }
        @keyframes voidRiftBeam {
            0% { transform: scaleX(0) scaleY(0); opacity: 1; }
            50% { transform: scaleX(1) scaleY(1); opacity: 1; }
            100% { transform: scaleX(1) scaleY(1); opacity: 0; }
        }
        @keyframes voidRiftOrb {
            0% { transform: scale(0) rotate(0deg); opacity: 1; }
            50% { transform: scale(1.5) rotate(180deg); opacity: 0.8; }
            100% { transform: scale(0) rotate(360deg); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    // Phase 1: Dark background effect
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
        animation: voidRiftBackground 2s ease-in-out;
    `;
    document.body.appendChild(backgroundEffect);
    
    // Phase 2: Void rift beam
    const voidBeam = document.createElement('div');
    voidBeam.style.cssText = `
        position: fixed;
        left: ${playerX}px;
        top: ${playerY}px;
        width: 20px;
        height: ${Math.sqrt(Math.pow(enemyX - playerX, 2) + Math.pow(enemyY - playerY, 2))}px;
        background: linear-gradient(90deg, #8B5CF6, #EC4899, #8B5CF6);
        transform-origin: top;
        transform: rotate(${Math.atan2(enemyY - playerY, enemyX - playerX) * 180 / Math.PI}deg);
        z-index: 1000;
        pointer-events: none;
        animation: voidRiftBeam 1.5s ease-out;
    `;
    document.body.appendChild(voidBeam);
    
    // Phase 3: Orbital effects
    for (let i = 0; i < 8; i++) {
    setTimeout(() => {
            const orb = document.createElement('div');
            orb.style.cssText = `
            position: fixed;
                left: ${enemyX + (Math.random() - 0.5) * 100}px;
                top: ${enemyY + (Math.random() - 0.5) * 100}px;
            width: 30px;
            height: 30px;
                background: radial-gradient(circle, #8B5CF6, #EC4899, #8B5CF6);
            border-radius: 50%;
                box-shadow: 0 0 20px #8B5CF6;
            z-index: 1000;
            pointer-events: none;
                animation: voidRiftOrb 1s ease-out;
            `;
            document.body.appendChild(orb);
            
            setTimeout(() => {
                orb.remove();
            }, 1000);
        }, i * 200);
    }
    
    // Cleanup
    setTimeout(() => {
        backgroundEffect.remove();
        voidBeam.remove();
        style.remove();
    }, 2500);
}

function triggerPrismaticLaserAnimation(playerSprite, enemySprite) {
    console.log('PRISMATIC LASER animation triggered');
    
    const playerRect = playerSprite.getBoundingClientRect();
    const enemyRect = enemySprite.getBoundingClientRect();
    const playerX = playerRect.left + playerRect.width / 2;
    const playerY = playerRect.top + playerRect.height / 2;
    const enemyX = enemyRect.left + enemyRect.width / 2;
    const enemyY = enemyRect.top + enemyRect.height / 2;
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes prismaticLaserBackground {
            0% { opacity: 0; background: #000000; }
            25% { opacity: 0.6; background: linear-gradient(45deg, #FF0000, #FF7F00, #FFFF00, #00FF00, #0000FF, #4B0082, #9400D3); }
            50% { opacity: 0.8; background: linear-gradient(45deg, #FF0000, #FF7F00, #FFFF00, #00FF00, #0000FF, #4B0082, #9400D3); }
            75% { opacity: 0.6; background: linear-gradient(45deg, #FF0000, #FF7F00, #FFFF00, #00FF00, #0000FF, #4B0082, #9400D3); }
            100% { opacity: 0; background: #000000; }
        }
        @keyframes prismaticLaserBeam {
            0% { transform: scaleX(0) scaleY(0); opacity: 1; }
            50% { transform: scaleX(1) scaleY(1); opacity: 1; }
            100% { transform: scaleX(1) scaleY(1); opacity: 0; }
        }
        @keyframes prismaticLaserOrb {
            0% { transform: scale(0) rotate(0deg); opacity: 1; }
            50% { transform: scale(1.5) rotate(180deg); opacity: 0.9; }
            100% { transform: scale(0) rotate(360deg); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    // Phase 1: Prismatic background effect
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
        animation: prismaticLaserBackground 2s ease-in-out;
    `;
    document.body.appendChild(backgroundEffect);
    
    // Phase 2: Prismatic laser beam
    const laserBeam = document.createElement('div');
    laserBeam.style.cssText = `
        position: fixed;
        left: ${playerX}px;
        top: ${playerY}px;
        width: 20px;
        height: ${Math.sqrt(Math.pow(enemyX - playerX, 2) + Math.pow(enemyY - playerY, 2))}px;
        background: linear-gradient(90deg, #FF0000, #FF7F00, #FFFF00, #00FF00, #0000FF, #4B0082, #9400D3);
        transform-origin: top;
        transform: rotate(${Math.atan2(enemyY - playerY, enemyX - playerX) * 180 / Math.PI}deg);
        z-index: 1000;
        pointer-events: none;
        animation: prismaticLaserBeam 1.5s ease-out;
        box-shadow: 0 0 30px #FF0000;
    `;
    document.body.appendChild(laserBeam);
    
    // Phase 3: Prismatic orbs
    for (let i = 0; i < 8; i++) {
        setTimeout(() => {
            const orb = document.createElement('div');
            orb.style.cssText = `
                position: fixed;
                left: ${enemyX + (Math.random() - 0.5) * 100}px;
                top: ${enemyY + (Math.random() - 0.5) * 100}px;
                width: 35px;
                height: 35px;
                background: radial-gradient(circle, #FF0000, #FF7F00, #FFFF00, #00FF00, #0000FF, #4B0082, #9400D3);
                border-radius: 50%;
                box-shadow: 0 0 25px #FF0000;
                z-index: 1000;
                pointer-events: none;
                animation: prismaticLaserOrb 1s ease-out;
            `;
            document.body.appendChild(orb);
            
            setTimeout(() => {
                orb.remove();
            }, 1000);
        }, i * 200);
    }
    
    // Cleanup
                setTimeout(() => {
        backgroundEffect.remove();
        laserBeam.remove();
        style.remove();
    }, 2500);
}

function triggerShadowForceAnimation(playerSprite, enemySprite) {
    console.log('SHADOW FORCE animation triggered');
    
    const playerRect = playerSprite.getBoundingClientRect();
    const enemyRect = enemySprite.getBoundingClientRect();
    const playerX = playerRect.left + playerRect.width / 2;
    const playerY = playerRect.top + playerRect.height / 2;
    const enemyX = enemyRect.left + enemyRect.width / 2;
    const enemyY = enemyRect.top + enemyRect.height / 2;
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shadowForceBackground {
            0% { opacity: 0; background: #000000; }
            25% { opacity: 0.6; background: linear-gradient(45deg, #000000, #1F2937, #374151, #000000); }
            50% { opacity: 0.8; background: linear-gradient(45deg, #000000, #4B5563, #6B7280, #9CA3AF, #000000); }
            75% { opacity: 0.6; background: linear-gradient(45deg, #000000, #D1D5DB, #E5E7EB, #000000); }
            100% { opacity: 0; background: #000000; }
        }
        @keyframes shadowForceStrike {
            0% { transform: scale(0) rotate(0deg); opacity: 1; }
            50% { transform: scale(1.5) rotate(180deg); opacity: 0.8; }
            100% { transform: scale(0) rotate(360deg); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    // Phase 1: Dark background effect
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
        animation: shadowForceBackground 1.5s ease-in-out;
    `;
    document.body.appendChild(backgroundEffect);
    
    // Phase 2: Shadow force strikes
    for (let i = 0; i < 5; i++) {
    setTimeout(() => {
            const strike = document.createElement('div');
            strike.style.cssText = `
            position: fixed;
                left: ${enemyX + (Math.random() - 0.5) * 120}px;
                top: ${enemyY + (Math.random() - 0.5) * 120}px;
                width: 40px;
                height: 40px;
                background: radial-gradient(circle, #4C1D95, #7C3AED, #A855F7);
            border-radius: 50%;
                box-shadow: 0 0 25px #4C1D95;
            z-index: 1000;
            pointer-events: none;
                animation: shadowForceStrike 0.8s ease-out;
        `;
            document.body.appendChild(strike);
        
        setTimeout(() => {
                strike.remove();
            }, 800);
        }, i * 300);
    }
    
    // Cleanup
            setTimeout(() => {
        backgroundEffect.remove();
        style.remove();
    }, 2000);
}

// Create light blue balls for Resona's waveform stacks
function createWaveformBalls(stacks) {
    console.log('Creating waveform balls for', stacks, 'stacks');
    
    // Clear existing balls
    const existingBalls = document.querySelectorAll('.waveform-ball');
    existingBalls.forEach(ball => ball.remove());
    
    if (stacks <= 0) return;
    
    const playerSprite = document.getElementById('player-sprite');
    if (!playerSprite) return;
    
    const playerRect = playerSprite.getBoundingClientRect();
    const centerX = playerRect.left + playerRect.width / 2;
    const topY = playerRect.top - 20; // Above the sprite
    
    // Create balls in an arc formation
    for (let i = 0; i < stacks; i++) {
        const ball = document.createElement('div');
        ball.className = 'waveform-ball';
        
        // Calculate position in arc
        const angle = (i - (stacks - 1) / 2) * 30; // Spread balls in 30-degree arc
        const radius = 40; // Distance from center
        const x = centerX + Math.sin(angle * Math.PI / 180) * radius;
        const y = topY - Math.cos(angle * Math.PI / 180) * radius;
        
        ball.style.cssText = `
            position: absolute;
            width: 12px;
            height: 12px;
            background: linear-gradient(45deg, #87CEEB, #00BFFF);
            border-radius: 50%;
            z-index: 1000;
            pointer-events: none;
            left: ${x}px;
            top: ${y}px;
            animation: waveformBallFloat 3s ease-in-out infinite;
            animation-delay: ${i * 0.2}s;
            box-shadow: 0 0 10px #87CEEB;
        `;
        
        document.body.appendChild(ball);
    }
}

function triggerBarrierAnimation(playerSprite) {
    console.log('BARRIER animation triggered');
    
    const playerRect = playerSprite.getBoundingClientRect();
    const playerX = playerRect.left + playerRect.width / 2;
    const playerY = playerRect.top + playerRect.height / 2;
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes barrierCreate {
            0% { transform: scale(0) rotate(0deg); opacity: 0; }
            50% { transform: scale(1.2) rotate(180deg); opacity: 1; }
            100% { transform: scale(1) rotate(360deg); opacity: 0.8; }
        }
    `;
    document.head.appendChild(style);
    
    // Create barrier effect
    const barrierEffect = document.createElement('div');
    barrierEffect.style.cssText = `
        position: fixed;
        left: ${playerX - 50}px;
        top: ${playerY - 50}px;
        width: 100px;
        height: 100px;
        background: linear-gradient(45deg, 
            rgba(255, 192, 203, 0.8) 0%, 
            rgba(255, 182, 193, 0.9) 25%, 
            rgba(255, 20, 147, 0.8) 50%, 
            rgba(255, 105, 180, 0.9) 75%, 
            rgba(255, 192, 203, 0.8) 100%);
        border: 3px solid rgba(255, 20, 147, 0.8);
        border-radius: 10px;
        backdrop-filter: blur(3px);
        box-shadow: 0 0 30px rgba(255, 20, 147, 0.6);
        z-index: 1000;
        pointer-events: none;
        animation: barrierCreate 1s ease-out;
    `;
    document.body.appendChild(barrierEffect);
    
    // Update barrier display
    setTimeout(() => {
        updateBarrierDisplay();
    }, 1000);
    
    // Cleanup
    setTimeout(() => {
        barrierEffect.remove();
        style.remove();
    }, 1500);
}