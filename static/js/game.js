// Game state
let gameState = {
    playerHP: 100,
    enemyHP: 200,
    playerQubit: "|0⟩",
    enemyQubit: "|1⟩",
    turn: 1,
    selectedCharacter: "Resona"
};

// Character sprite mapping
const characterSprites = {
    "bitzy": "static/sprites/blitzle.gif",
    "neutrinette": "static/sprites/neutrinette.gif", 
    "resona": "static/sprites/resona.gif",
    "higscrozma": "static/sprites/higscrozma.gif"
};

// Initialize game
document.addEventListener('DOMContentLoaded', function() {
    console.log('Q-Battle Frontend Loaded!');
    
    // Add character selection handlers
    const characterOptions = document.querySelectorAll('.character-option');
    characterOptions.forEach(option => {
        option.addEventListener('click', function() {
            const character = this.getAttribute('data-character');
            selectCharacter(character);
        });
    });
    
    // Add click handlers to move buttons (only after character selection)
    function addMoveHandlers() {
        const moveButtons = document.querySelectorAll('.move-button');
        moveButtons.forEach(button => {
            button.addEventListener('click', function() {
                const moveNumber = this.getAttribute('data-move');
                handleMoveClick(moveNumber);
            });
        });
        
        // Add hover effects
        moveButtons.forEach(button => {
            button.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px) scale(1.02)';
            });
            
            button.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0px) scale(1)';
            });
        });
    }
    
    // Store the function globally so it can be called after character selection
    window.addMoveHandlers = addMoveHandlers;
});

// Handle character selection
function selectCharacter(character) {
    console.log(`Selected character: ${character}`);
    
    // Update game state
    gameState.selectedCharacter = character.charAt(0).toUpperCase() + character.slice(1);
    
    // Update player sprite
    const playerSprite = document.getElementById('player-sprite');
    const playerName = document.getElementById('player-name');
    
    if (characterSprites[character]) {
        playerSprite.src = characterSprites[character];
        playerName.textContent = gameState.selectedCharacter;
    }
    
    // Hide character selection and show battle screen
    document.getElementById('character-selection').style.display = 'none';
    document.getElementById('battle-screen').style.display = 'flex';
    
    // Add move handlers after character selection
    if (window.addMoveHandlers) {
        window.addMoveHandlers();
    }
    
    console.log(`Battle started with ${gameState.selectedCharacter}!`);
}

// Handle move button clicks
function handleMoveClick(moveNumber) {
    console.log(`Move ${moveNumber} clicked!`);
    
    // Visual feedback
    const button = document.querySelector(`[data-move="${moveNumber}"]`);
    button.style.background = 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)';
    
    // Reset button color after animation
    setTimeout(() => {
        button.style.background = 'linear-gradient(135deg, #4a90e2 0%, #357abd 100%)';
    }, 200);
    
    // Simulate move execution (will be replaced with API calls)
    simulateMove(moveNumber);
}

// Simulate move execution
function simulateMove(moveNumber) {
    const moves = {
        1: "Q-THUNDER",
        2: "SHOCK", 
        3: "DUALIZE",
        4: "BIT-FLIP"
    };
    
    const moveName = moves[moveNumber];
    console.log(`Executing ${moveName}...`);
    
    // Simulate damage
    const damage = Math.floor(Math.random() * 30) + 10;
    gameState.enemyHP = Math.max(0, gameState.enemyHP - damage);
    
    // Update display
    updateHealthBars();
    updateTurn();
    
    // Show move message
    showMoveMessage(`${moveName} deals ${damage} damage!`);
}

// Update health bars
function updateHealthBars() {
    const playerHealthFill = document.querySelector('.player-side .health-fill');
    const enemyHealthFill = document.querySelector('.enemy-side .health-fill');
    const playerHPText = document.querySelector('.player-hp');
    const enemyHPText = document.querySelector('.enemy-hp');
    
    // Calculate percentages
    const playerPercent = (gameState.playerHP / 100) * 100;
    const enemyPercent = (gameState.enemyHP / 200) * 100;
    
    // Update health bars
    playerHealthFill.style.width = `${playerPercent}%`;
    enemyHealthFill.style.width = `${enemyPercent}%`;
    
    // Update HP text
    playerHPText.textContent = `HP: ${gameState.playerHP}/100`;
    enemyHPText.textContent = `HP: ${gameState.enemyHP}/200`;
}

// Update turn counter
function updateTurn() {
    gameState.turn++;
    const turnNumber = document.querySelector('.turn-number');
    turnNumber.textContent = gameState.turn;
}

// Show move message
function showMoveMessage(message) {
    // Create temporary message element
    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 20px;
        border-radius: 10px;
        font-size: 18px;
        font-weight: bold;
        z-index: 1000;
        animation: fadeInOut 2s ease-in-out;
    `;
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInOut {
            0%, 100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
            50% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(messageDiv);
    
    // Remove message after animation
    setTimeout(() => {
        document.body.removeChild(messageDiv);
    }, 2000);
}

// Add sprite click effects
document.addEventListener('DOMContentLoaded', function() {
    const sprites = document.querySelectorAll('.sprite');
    
    sprites.forEach(sprite => {
        sprite.addEventListener('click', function() {
            // Add click animation
            this.style.transform = 'scale(1.2)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        });
    });
}); 