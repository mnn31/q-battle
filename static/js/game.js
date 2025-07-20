// Q-Battle Game JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const characterSelection = document.getElementById('character-selection');
    const battleScreen = document.getElementById('battle-screen');
    const characterOptions = document.querySelectorAll('.character-option');
    const moveButtons = document.querySelectorAll('.move-button');
    const playerSprite = document.getElementById('player-sprite');
    const playerName = document.getElementById('player-name');

    // Character selection
    characterOptions.forEach(option => {
        option.addEventListener('click', function() {
            const character = this.getAttribute('data-character');
            const characterName = this.querySelector('.character-name').textContent;
            const spriteSrc = this.querySelector('img').src;
            
            // Update player sprite and name
            playerSprite.src = spriteSrc;
            playerName.textContent = characterName;
            
            // Hide character selection and show battle screen
            characterSelection.style.display = 'none';
            battleScreen.style.display = 'flex';
            
            console.log(`Selected character: ${character}`);
        });
    });

    // Move button functionality
    moveButtons.forEach(button => {
        button.addEventListener('click', function() {
            const move = this.getAttribute('data-move');
            console.log(`Selected move: ${move}`);
            
            // Here you would typically make an API call to the backend
            // For now, just log the move selection
            alert(`Used ${move}!`);
        });
    });

    // Add some visual feedback for character selection
    characterOptions.forEach(option => {
        option.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        
        option.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // Add visual feedback for move buttons
    moveButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0px)';
        });
    });
}); 