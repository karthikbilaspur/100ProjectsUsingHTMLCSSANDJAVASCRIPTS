const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gameOverScreen = document.getElementById('gameOver');
const difficultySelect = document.getElementById('difficultySelect');
const playAgainBtn = document.getElementById('playAgain');
const easyBtn = document.getElementById('easyBtn');
const mediumBtn = document.getElementById('mediumBtn');
const hardBtn = document.getElementById('hardBtn');
const finalScore = document.getElementById('finalScore');
const sliceSound = document.getElementById('sliceSound');
const powerUpSound = document.getElementById('powerUpSound');

let score = 0;
let combo = 0;
let timer = 60;
let difficulty = '';
let fruits = [];
let powerUps = [];
let gameInterval;

// Difficulty settings
const difficultySettings = {
    easy: {
        fruitSpeed: 2,
        fruitSize: 30,
        fruitSpawnRate: 1000
    },
    medium: {
        fruitSpeed: 3,
        fruitSize: 25,
        fruitSpawnRate: 800
    },
    hard: {
        fruitSpeed: 4,
        fruitSize: 20,
        fruitSpawnRate: 600
    }
};

// Fruit object
class Fruit {
    constructor(x, y, size, speed, type) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.speed = speed;
        this.type = type;
    }

    update() {
        this.x += this.speed;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.type === 'apple' ? 'red' : this.type === 'banana' ? 'yellow' : 'orange';
        ctx.fill();
    }
}

// Power-up object
class PowerUp {
    constructor(x, y, size, speed, type) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.speed = speed;
        this.type = type;
    }

    update() {
        this.x += this.speed;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.type === 'doublePoints' ? 'blue' : 'green';
        ctx.fill();
    }
}

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw fruits
    for (let i = 0; i < fruits.length; i++) {
        fruits[i].update();
        fruits[i].draw();

        // Check if fruit is off-screen
        if (fruits[i].x > canvas.width) {
            fruits.splice(i, 1);
            i--;
            combo = 0;
        }
    }

    // Update and draw power-ups
    for (let i = 0; i < powerUps.length; i++) {
        powerUps[i].update();
        powerUps[i].draw();

        // Check if power-up is off-screen
        if (powerUps[i].x > canvas.width) {
            powerUps.splice(i, 1);
            i--;
        }
    }

    // Spawn new fruits
    if (Math.random() < 0.1) {
        const fruitType = Math.random() < 0.5 ? 'apple' : Math.random() < 0.8 ? 'banana' : 'orange';
        const fruit = new Fruit(0, Math.random() * canvas.height, difficultySettings[difficulty].fruitSize, difficultySettings[difficulty].fruitSpeed, fruitType);
        fruits.push(fruit);
    }

    // Spawn new power-ups
    if (Math.random() < 0.05) {
        const powerUpType = Math.random() < 0.5 ? 'doublePoints' : 'extraLife';
        const powerUp = new PowerUp(0, Math.random() * canvas.height, 20, 2, powerUpType);
        powerUps.push(powerUp);
    }

    // Update score and timer
    ctx.font = '24px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText(`Score: ${score}`, 10, 30);
    ctx.fillText(`Combo: ${combo}`, 10, 60);
    ctx.fillText(`Time: ${timer}`, 10, 90);

    // Check for game over
    if (timer <= 0) {
        gameOver();
    } else {
        timer -= 1 / 60;
    }

    // Collision detection using Separating Axis Theorem
    for (let i = 0; i < fruits.length; i++) {
        const fruit = fruits[i];
        const dx = fruit.x - canvas.width / 2;
        const dy = fruit.y - canvas.height / 2;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < fruit.size) {
            score += fruit.type === 'apple' ? 10 : fruit.type === 'banana' ? 20 : 30;
            combo++;
            fruits.splice(i, 1);
            i--;
            sliceSound.play();
        }
    }

    for (let i = 0; i < powerUps.length; i++) {
        const powerUp = powerUps[i];
        const dx = powerUp.x - canvas.width / 2;
        const dy = powerUp.y - canvas.height / 2;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < powerUp.size) {
            if (powerUp.type === 'doublePoints') {
                score *= 2;
            } else if (powerUp.type === 'extraLife') {
                // Add extra life logic here
            }
            powerUps.splice(i, 1);
            i--;
            powerUpSound.play();
        }
    }

    requestAnimationFrame(gameLoop);
}

// Game over function
function gameOver() {
    cancelAnimationFrame(gameInterval);
    gameOverScreen.style.display = 'block';
    finalScore.textContent = score;
}

// Play again function
playAgainBtn.addEventListener('click', () => {
    score = 0;
    combo = 0;
    timer = 60;
    fruits = [];
    powerUps = [];
    gameOverScreen.style.display = 'none';
    gameLoop();
    gameInterval = requestAnimationFrame(gameLoop);
});

// Difficulty selection
easyBtn.addEventListener('click', () => {
    difficulty = 'easy';
    difficultySelect.style.display = 'none';
    gameInterval = requestAnimationFrame(gameLoop);
});

mediumBtn.addEventListener('click', () => {
    difficulty = 'medium';
    difficultySelect.style.display = 'none';
    gameInterval = requestAnimationFrame(gameLoop);
});

hardBtn.addEventListener('click', () => {
    difficulty = 'hard';
    difficultySelect.style.display = 'none';
    gameInterval = requestAnimationFrame(gameLoop);
});

// Click event listener
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if fruit or power-up is clicked
    for (let i = 0; i < fruits.length; i++) {
        const fruit = fruits[i];
        const dx = fruit.x - x;
        const dy = fruit.y - y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < fruit.size) {
            score += fruit.type === 'apple' ? 10 : fruit.type === 'banana' ? 20 : 30;
            combo++;
            fruits.splice(i, 1);
            i--;
            sliceSound.play();
        }
    }

    for (let i = 0; i < powerUps.length; i++) {
        const powerUp = powerUps[i];
        const dx = powerUp.x - x;
        const dy = powerUp.y - y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < powerUp.size) {
            if (powerUp.type === 'doublePoints') {
                score *= 2;
            } else if (powerUp.type === 'extraLife') {
                // Add extra life logic here
            }
            powerUps.splice(i, 1);
            i--;
            powerUpSound.play();
        }
    }
});


// Get the share button and menu elements
const shareBtn = document.getElementById('shareBtn');
const shareMenu = document.getElementById('shareMenu');
const shareNearby = document.getElementById('shareNearby');
const shareEmail = document.getElementById('shareEmail');
const shareFacebook = document.getElementById('shareFacebook');
const shareTwitter = document.getElementById('shareTwitter');
const shareWhatsApp = document.getElementById('shareWhatsApp');

// Add event listener to share button
shareBtn.addEventListener('click', () => {
    shareMenu.style.display = 'block';
});

// Add event listeners to share options
shareNearby.addEventListener('click', () => {
    // Use the Web Share API to share via nearby devices
    if (navigator.share) {
        navigator.share({
            title: 'Fruit Silencer Game',
            text: `I scored ${score} points in Fruit Silencer!`,
            url: window.location.href
        })
        .then(() => console.log('Shared successfully'))
        .catch((error) => console.error('Error sharing:', error));
    } else {
        alert('Web Share API not supported');
    }
});

shareEmail.addEventListener('click', () => {
    // Use mailto to share via email
    const subject = 'Fruit Silencer Game Score';
    const body = `I scored ${score} points in Fruit Silencer!`;
    const mailto = `mailto:?subject=${subject}&body=${body}`;
    window.location.href = mailto;
});

shareFacebook.addEventListener('click', () => {
    // Use Facebook's share dialog
    const url = `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`;
    window.open(url, '_blank');
});

shareTwitter.addEventListener('click', () => {
    // Use Twitter's share intent
    const text = `I scored ${score} points in Fruit Silencer!`;
    const url = `https://twitter.com/intent/tweet?text=${text}&url=${window.location.href}`;
    window.open(url, '_blank');
});

shareWhatsApp.addEventListener('click', () => {
    // Use WhatsApp's share intent
    const text = `I scored ${score} points in Fruit Silencer!`;
    const url = `https://api.whatsapp.com/send?text=${text} ${window.location.href}`;
    window.open(url, '_blank');
});