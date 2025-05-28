// Initialize game variables
let score = 0;
let moves = 0;
let highScore = localStorage.getItem('highScore') || 0;
let timer = 0;
let scoreMultiplier = 1;
let cards = [
    { value: 1, flipped: false },
    { value: 1, flipped: false },
    { value: 2, flipped: false },
    { value: 2, flipped: false },
    { value: 3, flipped: false },
    { value: 3, flipped: false },
    { value: 4, flipped: false },
    { value: 4, flipped: false },
    { value: 5, flipped: false },
    { value: 5, flipped: false },
    { value: 6, flipped: false },
    { value: 6, flipped: false },
];
let shuffledCards = shuffle(cards);
let flippedCards = [];
let gameBoard = document.getElementById('game-board');
let gameStarted = false;
let lowScore = localStorage.getItem("lowScore") || "N/A";
let $lowScoreOutput = document.querySelector(".low-score");
let $gameClicks = document.querySelector(".click-count");
let $winScreen = document.getElementById("win-screen");

// Shuffle function
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Create card elements
function createCard(card, index) {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    cardElement.innerHTML = `
        <div class="card-body front">${card.value}</div>
        <div class="card-body back">?</div>
    `;
    cardElement.addEventListener('click', () => flipCard(cardElement, card, index));
    gameBoard.appendChild(cardElement);
}

// Flip card function
function flipCard(cardElement, card, index) {
    if (flippedCards.length < 2 && !card.flipped) {
        cardElement.classList.add('flipped');
        flippedCards.push({ cardElement, card, index });
        moves++;
        document.getElementById('moves').textContent = `Moves: ${moves}`;
        if (flippedCards.length === 2) {
            setTimeout(checkMatch, 500);
        }
    }
}

// Check match function
function checkMatch() {
    const card1 = flippedCards[0].card;
    const card2 = flippedCards[1].card;
    if (card1.value === card2.value) {
        score += 10 * scoreMultiplier;
        scoreMultiplier++;
        card1.flipped = true;
        card2.flipped = true;
        flippedCards = [];
        checkWin();
    } else {
        flippedCards[0].cardElement.classList.remove('flipped');
        flippedCards[1].cardElement.classList.remove('flipped');
        flippedCards = [];
        scoreMultiplier = 1;
    }
    updateScore();
}

// Update score function
function updateScore() {
    document.getElementById('score').textContent = `Score: ${score}`;
    document.getElementById('score-multiplier').textContent = `Score Multiplier: ${scoreMultiplier}x`;
    $gameClicks.textContent = `Total Clicks: ${moves}`;
}

// Check win function
function checkWin() {
    const flippedCards = cards.filter(card => card.flipped);
    if (flippedCards.length === cards.length) {
        clearInterval(timerInterval);
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('highScore', highScore);
        }
        $winScreen.classList.add("visible");
        checkForLowScore(moves, $lowScoreOutput);
    }
}

// Check for low score function
function checkForLowScore(score, $lowScoreOutput) {
    if (lowScore === "N/A") {
        lowScore = Infinity;
    }
    if (score < lowScore) {
        localStorage.setItem("lowScore", score);
        lowScore = localStorage.getItem("lowScore");
        $lowScoreOutput.textContent = `Low Score: ${lowScore}`;
    }
}

// Start game function
function startGame() {
    shuffledCards.forEach(createCard);
    timerInterval = setInterval(() => {
        timer++;
        document.getElementById('timer').textContent = `Time: ${timer}s`;
    }, 1000);
    gameStarted = true;
    assignLowScore($lowScoreOutput);
}

// Restart game function
function restartGame() {
    gameBoard.innerHTML = '';
    shuffledCards = shuffle(cards);
    score = 0;
    moves = 0;
    timer = 0;
    scoreMultiplier = 1;
    flippedCards = [];
    document.getElementById('score').textContent = `Score: ${score}`;
    document.getElementById('moves').textContent = `Moves: ${moves}`;
    document.getElementById('timer').textContent = `Time: ${timer}s`;
    document.getElementById('score-multiplier').textContent = `Score Multiplier: ${scoreMultiplier}x`;
    $gameClicks.textContent = `Total Clicks: ${moves}`;
    $winScreen.classList.remove("visible");
    clearInterval(timerInterval);
    startGame();
}

// Assign low score function
function assignLowScore($lowScoreOutput) {
    $lowScoreOutput.textContent = `Low Score: ${lowScore}`;
}

// Initialize game
document.getElementById('new-game-button').addEventListener('click', () => {
    document.getElementById('game-container').classList.remove('hidden');
});

document.getElementById('restart-button').addEventListener('click', restartGame);
document.getElementById('replay-button').addEventListener('click', restartGame);

startGame();