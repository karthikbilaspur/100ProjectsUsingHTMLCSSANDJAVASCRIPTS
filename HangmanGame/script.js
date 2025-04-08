const gameContainer = document.getElementById('game-container');
const hangmanCanvas = document.getElementById('hangman-canvas');
const guessInput = document.getElementById('guess-input');
const guessButton = document.getElementById('guess-button');
const scoreDisplay = document.getElementById('score');
const incorrectGuessesDisplay = document.getElementById('incorrect-guesses');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let score = 0;
let incorrectGuesses = 0;
let word = '';
let guessedLetters = [];
let gameMode = 'timed';
let accessibilityFeatures = [];
let timer = null;

// Function to get a random word
function getRandomWord() {
  fetch('https://random-word-api.herokuapp.com/word?number=1')
    .then(response => response.json())
    .then(data => {
      word = data[0].toLowerCase();
      guessedLetters = Array(word.length).fill('_');
      incorrectGuesses = 0;
      drawWord();
    });
}

// Function to check the user's guess
function checkGuess() {
  const guess = guessInput.value.toLowerCase();
  if (guess.length !== 1) {
    alert('Please enter a single letter!');
    return;
  }

  if (guessedLetters.includes(guess)) {
    alert('You already guessed this letter!');
    return;
  }

  guessedLetters.push(guess);

  if (word.includes(guess)) {
    score += 10;
    scoreDisplay.textContent = `Score: ${score}`;
    revealLetter(guess);
  } else {
    incorrectGuesses += 1;
    incorrectGuessesDisplay.textContent = `Incorrect Guesses: ${incorrectGuesses}`;
    drawHangman();
  }

  guessInput.value = '';
  checkWin();
}

// Function to reveal a letter
function revealLetter(letter) {
  const ctx = hangmanCanvas.getContext('2d');
  ctx.font = '24px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'black';
  for (let i = 0; i < word.length; i++) {
    if (word[i] === letter) {
      ctx.fillText(letter, 20 + i * 20, 100);
    }
  }
}

// Function to draw the word
function drawWord() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = '24px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (let i = 0; i < word.length; i++) {
    ctx.fillText(guessedLetters[i], 50 + i * 50, 100);
  }
  ctx.font = '18px Arial';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(`Incorrect Guesses: ${incorrectGuesses}`, 10, 10);
  drawHangman();
}

// Function to draw the hangman
function drawHangman() {
  const ctx = hangmanCanvas.getContext('2d');
  ctx.beginPath();
  ctx.moveTo(100, 150);
  ctx.lineTo(100, 50);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(100, 50);
  ctx.lineTo(150, 50);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(150, 50);
  ctx.lineTo(150, 70);
  ctx.stroke();
  if (incorrectGuesses >= 2) {
    ctx.beginPath();
    ctx.arc(150, 80, 10, 0, 2 * Math.PI);
    ctx.stroke();
  }
  if (incorrectGuesses >= 3) {
    ctx.beginPath();
    ctx.moveTo(150, 90);
    ctx.lineTo(150, 120);
    ctx.stroke();
  }
  if (incorrectGuesses >= 4) {
    ctx.beginPath();
    ctx.moveTo(150, 100);
    ctx.lineTo(120, 110);
    ctx.stroke();
  }
  if (incorrectGuesses >= 5) {
    ctx.beginPath();
    ctx.moveTo(150, 100);
    ctx.lineTo(180, 110);
    ctx.stroke();
  }
  if (incorrectGuesses >= 6) {
    ctx.beginPath();
    ctx.moveTo(150, 120);
    ctx.lineTo(120, 130);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(150, 120);
    ctx.lineTo(180, 130);
    ctx.stroke();
  }
}

// Function to start the game
function startGame() {
    word = getRandomWord();
    guessedLetters = [];
    score = 0;
    incorrectGuesses = 0;
    scoreDisplay.textContent = `Score: ${score}`;
    incorrectGuessesDisplay.textContent = `Incorrect Guesses: ${incorrectGuesses}`;
    const ctx = hangmanCanvas.getContext('2d');
    ctx.clearRect(0, 0, hangmanCanvas.width, hangmanCanvas.height);
    for (let i = 0; i < word.length; i++) {
      ctx.font = '24px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'black';
      ctx.fillText('_', 20 + i * 20, 100);
    }
  }
  
  // Function to check for a win
  function checkWin() {
    if (!guessedLetters.includes('_')) {
      alert('You win!');
      startGame();
    } else if (incorrectGuesses >= 6) {
      alert('You lose!');
      startGame();
    }
  }
  
  // Event listeners
  guessButton.addEventListener('click', checkGuess);
  guessInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      checkGuess();
    }
  });
  
  // Start the game
  startGame();
  
  // Accessibility features
  function enableAccessibilityFeatures() {
    accessibilityFeatures = ['textToSpeech', 'fontSizeAdjustment'];
    if (accessibilityFeatures.includes('textToSpeech')) {
      const textToSpeech = new SpeechSynthesisUtterance();
      textToSpeech.text = 'Welcome to Hangman!';
      speechSynthesis.speak(textToSpeech);
    }
    if (accessibilityFeatures.includes('fontSizeAdjustment')) {
      const fontSize = 24;
      ctx.font = `${fontSize}px Arial`;
    }
  }
  
  // Enable accessibility features
  enableAccessibilityFeatures();
  
  // Timed game mode
  function enableTimedGameMode() {
    gameMode = 'timed';
    timer = setInterval(() => {
      if (incorrectGuesses >= 6) {
        alert('Time\'s up!');
        startGame();
      }
    }, 60000);
  }
  
  // Enable timed game mode
  enableTimedGameMode();
  
  // Multiple words game mode
  function enableMultipleWordsGameMode() {
    gameMode = 'multipleWords';
    const words = ['apple', 'banana', 'cherry', 'date', 'elderberry'];
    word = words[Math.floor(Math.random() * words.length)];
  }
  
  // Enable multiple words game mode
  // enableMultipleWordsGameMode();