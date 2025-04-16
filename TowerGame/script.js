// Game variables
let blockCount = 0;
let blockWidth = 100;
let towerHeight = 0;
let lastBlockLeft = 150;
let score = 0;
let level = 1;
let highScore = 0;
let gameOver = false;
let timeAttack = false;
let blockType = 'normal';
let powerUp = false;
let obstacle = false;

// Get HTML elements
let gameContainer = document.querySelector('.game-container');
let tower = document.querySelector('.tower');
let scoreElement = document.querySelector('#score');
let levelElement = document.querySelector('#level');
let highScoreElement = document.querySelector('#high-score');
let tutorialElement = document.querySelector('#tutorial');
let customizationOptions = document.querySelector('#customization-options');
let blockColorInput = document.querySelector('#block-color');
let towerDesignSelect = document.querySelector('#tower-design');
let backgroundMusic = document.querySelector('#background-music');

// Set up event listeners
document.querySelector('#add-block').addEventListener('click', addBlock);
document.querySelector('#restart-game').addEventListener('click', restartGame);
blockColorInput.addEventListener('input', updateBlockColor);
towerDesignSelect.addEventListener('change', updateTowerDesign);

// Game loop
function addBlock() {
    // Create new block
    let newBlock = document.createElement('div');
    newBlock.classList.add('block');
    newBlock.style.width = blockWidth + 'px';
    newBlock.style.bottom = towerHeight + 'px';
    newBlock.style.left = Math.random() * (gameContainer.offsetWidth - blockWidth) + 'px';
    newBlock.style.background = blockColorInput.value;

// Check if block is aligned with tower
if (blockCount === 0 || Math.abs(parseInt(newBlock.style.left) - lastBlockLeft) < blockWidth / 2) {
    newBlock.style.left = lastBlockLeft + 'px';
    tower.appendChild(newBlock);
    blockWidth *= 0.9; // decrease block width
    towerHeight += 20; // increase tower height
    lastBlockLeft = parseInt(newBlock.style.left);
    score++;
    scoreElement.textContent = `Score: ${score}`;
    if (score % 10 === 0) {
        level++;
        levelElement.textContent = `Level: ${level}`;
        blockWidth = 100 / level;
    }
    if (score > highScore) {
        highScore = score;
        highScoreElement.textContent = `High Score: ${highScore}`;
    }
} else {
    newBlock.classList.add('fall');
    gameContainer.appendChild(newBlock);
    setTimeout(() => {
        newBlock.remove();
        gameOver = true;
        document.querySelector('#restart-game').style.display = 'block';
        document.querySelector('#add-block').style.display = 'none';
    }, 2000);
}
blockCount++;

// Power-up logic
if (powerUp) {
    // Apply power-up effect
    newBlock.style.width = blockWidth * 1.5 + 'px';
    powerUp = false;
}

// Obstacle logic
if (obstacle) {
    // Apply obstacle effect
    newBlock.style.left = Math.random() * (gameContainer.offsetWidth - blockWidth) + 'px';
    obstacle = false;
}
}

// Update block color
function updateBlockColor() {
let blocks = document.querySelectorAll('.block');
blocks.forEach(block => {
    block.style.background = blockColorInput.value;
});
}

// Update tower design
function updateTowerDesign() {
tower.style.background = towerDesignSelect.value === 'default' ? '' : towerDesignSelect.value;
}

// Restart game
function restartGame() {
gameOver = false;
blockCount = 0;
blockWidth = 100;
towerHeight = 0;
lastBlockLeft = 150;
score = 0;
level = 1;
scoreElement.textContent = `Score: ${score}`;
levelElement.textContent = `Level: ${level}`;
tower.innerHTML = '';
document.querySelector('#add-block').style.display = 'block';
document.querySelector('#restart-game').style.display = 'none';
}

// Initialize game
function initGame() {
tutorialElement.style.display = 'block';
setTimeout(() => {
    tutorialElement.style.display = 'none';
}, 5000);
backgroundMusic.play();
}

initGame()