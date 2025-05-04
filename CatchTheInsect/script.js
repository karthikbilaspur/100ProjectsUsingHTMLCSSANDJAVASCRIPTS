// Get canvas element
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions
canvas.width = 800;
canvas.height = 600;

// Game variables
let score = 0;
let combo = 0;
let insects = [];
let powerUps = [];
let obstacles = [];
let gameOver = false;
let speedMultiplier = 1;
let magnetActive = false;
let timer = 60; // 1 minute

// Insect class
class Insect {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 30;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.type = type;
        this.points = type === 'fast' ? 2 : type === 'slow' ? 1 : 1.5;
    }

    draw() {
        ctx.fillStyle = this.type === 'fast' ? 'red' : this.type === 'slow' ? 'green' : 'blue';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
        this.x += this.speedX * speedMultiplier;
        this.y += this.speedY * speedMultiplier;

        // Boundary check
        if (this.x < 0 || this.x > canvas.width - this.width) {
            this.speedX *= -1;
        }
        if (this.y < 0 || this.y > canvas.height - this.height) {
            this.speedY *= -1;
        }
    }
}

// Power-up class
class PowerUp {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.type = type;
    }

    draw() {
        ctx.fillStyle = this.type === 'magnet' ? 'yellow' : 'purple';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

// Obstacle class
class Obstacle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 50;
    }

    draw() {
        ctx.fillStyle = 'black';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

// Create insects, power-ups, and obstacles
function createInsect() {
    const x = Math.random() * (canvas.width - 30);
    const y = Math.random() * (canvas.height - 30);
    const type = Math.random() < 0.3 ? 'fast' : Math.random() < 0.6 ? 'slow' : 'normal';
    const insect = new Insect(x, y, type);
    insects.push(insect);
}

function createPowerUp() {
    const x = Math.random() * (canvas.width - 20);
    const y = Math.random() * (canvas.height - 20);
    const type = Math.random() < 0.5 ? 'magnet' : 'bonus';
    const powerUp = new PowerUp(x, y, type);
    powerUps.push(powerUp);
}

function createObstacle() {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const obstacle = new Obstacle(x, y);
    obstacles.push(obstacle);
}

// Game loop
function gameLoop() {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update insects
    for (let i = insects.length - 1; i >= 0; i--) {
        insects[i].update();
        insects[i].draw();

        // Check for click
        if (insects[i].x < 0 || insects[i].x > canvas.width || insects[i].y < 0 || insects[i].y > canvas.height) {
            insects.splice(i, 1);
        }
    }

    // Update power-ups
    for (let i = powerUps.length - 1; i >= 0; i--) {
        powerUps[i].draw();

        // Check for click
        if (powerUps[i].x < 0 || powerUps[i].x > canvas.width || powerUps[i].y < 0 || powerUps[i].y > canvas.height) {
            powerUps.splice(i, 1);
        }
    }

    // Add new insect
    if (Math.random() < 0.05) {
        createInsect();
    }

    // Add new power-up
    if (Math.random() < 0.01) {
        createPowerUp();
    }

    // Draw score and timer
    ctx.font = '24px Arial';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(`Score: ${score}`, 10, 10);
    ctx.fillText(`Time: ${timer}`, 10, 40);

    // Update timer
    timer -= 1 / 60;
    if (timer <= 0) {
        gameOver = true;
        document.getElementById('final-score').innerText = `Your final score is: ${score}`;
        document.getElementById('game-over-screen').style.display = 'block';
    }

    requestAnimationFrame(gameLoop);
}

// Handle canvas click
canvas.addEventListener('click', (e) => {
    if (gameOver) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    for (let i = insects.length - 1; i >= 0; i--) {
        if (x > insects[i].x && x < insects[i].x + insects[i].width && y > insects[i].y && y < insects[i].y + insects[i].height) {
            score += insects[i].points;
            insects.splice(i, 1);
        }
    }

    for (let i = powerUps.length - 1; i >= 0; i--) {
        if (x > powerUps[i].x && x < powerUps[i].x + powerUps[i].width && y > powerUps[i].y && y < powerUps[i].y + powerUps[i].height) {
            if (powerUps[i].type === 'magnet') {
                // Implement magnet power-up
                for (let j = insects.length - 1; j >= 0; j--) {
                    if (Math.abs(insects[j].x - x) < 50 && Math.abs(insects[j].y - y) < 50) {
                        score += insects[j].points;
                        insects.splice(j, 1);
                    }
                }
            } else if (powerUps[i].type === 'bonus') {
                // Implement bonus power-up
                score += 10;
            }
            powerUps.splice(i, 1);
        }
    }
});

// Start game
document.getElementById('start-button').addEventListener('click', () => {
    document.getElementById('start-screen').style.display = 'none';
    canvas.style.display = 'block';
    gameLoop();
});

// Play again
document.getElementById('play-again-button').addEventListener('click', () => {
    score = 0;
    insects = [];
    powerUps = [];
    timer = 60;
    gameOver = false;
    document.getElementById('game-over-screen').style.display = 'none';
    gameLoop();
});

document.getElementById('toggle-mode').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    document.getElementById('start-screen').classList.toggle('dark-mode');
    document.getElementById('game-over-screen').classList.toggle('dark-mode');
});

document.getElementById('share-facebook').addEventListener('click', () => {
    const url = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(window.location.href);
    window.open(url, '_blank');
});

document.getElementById('share-twitter').addEventListener('click', () => {
    const url = 'https://twitter.com/intent/tweet?url=' + encodeURIComponent(window.location.href);
    window.open(url, '_blank');
});

document.getElementById('share-linkedin').addEventListener('click', () => {
    const url = 'https://www.linkedin.com/sharing/share?url=' + encodeURIComponent(window.location.href);
    window.open(url, '_blank');
});