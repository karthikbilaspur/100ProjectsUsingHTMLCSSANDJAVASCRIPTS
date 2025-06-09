const wordElement = document.getElementById("word");
const textElement = document.getElementById("text");
const scoreElement = document.getElementById("score");
const accuracyElement = document.getElementById("accuracy");
const wpmElement = document.getElementById("wpm");
const errorsElement = document.getElementById("errors");
const timeElement = document.getElementById("time");
const endGameElement = document.getElementById("end-game-container");
const settingsButton = document.getElementById("settings-btn");
const settingsElement = document.getElementById("settings");
const difficultySelect = document.getElementById("difficulty");
const gameModeSelect = document.getElementById("game-mode");
const languageSelect = document.getElementById("language");
const startButton = document.getElementById("start-button");
const tutorialElement = document.getElementById("tutorial");
const gameElement = document.getElementById("game");
const highScoreElement = document.getElementById("high-score");
const highScoresButton = document.getElementById("high-scores-button");
const exitButton = document.getElementById("exit-button");
const highScoresElement = document.getElementById("high-scores");
const closeHighScoresButton = document.getElementById("close-high-scores");
const highScoreList = document.getElementById("high-score-list");

let randomWord;
let score = 0;
let accuracy = 0;
let wpm = 0;
let errors = 0;
let time = 60;
let difficulty = "medium";
let gameMode = "time-attack";
let language = "english";
let highScore = localStorage.getItem("highScore") || 0;
let currentLanguageIndex = 0;
const languages = ["english", "spanish", "french"];

const words = {
  english: [
    "sigh",
    "tense",
    "airplane",
    "ball",
    "pies",
    "juice",
    "warlike",
    "bad",
    "north",
    "dependent",
    "steer",
    "silver",
    "highfalutin",
    "superficial",
    "quince",
    "eight",
    "feeble",
    "admit",
    "drag",
    "loving",
  ],
  spanish: [
    "hola",
    "adiós",
    "gracias",
    "por favor",
    "lo siento",
    "¿cómo estás?",
    "estoy bien",
    "¿dónde está...?",
    "¿cuánto cuesta?",
    "me gusta",
  ],
  french: [
    "bonjour",
    "au revoir",
    "merci",
    "s'il vous plaît",
    "excusez-moi",
    "comment ça va?",
    "je vais bien",
    "où est...?",
    "combien ça coûte?",
    "j'aime",
  ],
};

function getWords() {
  if (currentLanguageIndex >= languages.length) {
    currentLanguageIndex = 0;
  }
  const lang = languages[currentLanguageIndex];
  const wordsList = words[lang];
  if (wordsList.length === 0) {
    currentLanguageIndex++;
    return getWords();
  }
  return wordsList;
}

function addWordToDom() {
  const wordsList = words[language];
  randomWord = wordsList[Math.floor(Math.random() * wordsList.length)];
  wordElement.innerText = randomWord;
}

function initGame() {
  difficulty = difficultySelect.value;
  gameMode = gameModeSelect.value;
  language = languageSelect.value;
  score = 0;
  accuracy = 0;
  wpm = 0;
  errors = 0;
  time = 60;
  updateScore();
  updateAccuracy();
  updateWPM();
  updateErrors();
  updateTime();
  addWordToDom();
  textElement.focus();
}

function updateScore() {
  scoreElement.innerText = score;
}

function updateAccuracy() {
  accuracyElement.innerText = `${accuracy}%`;
}

function updateWPM() {
  wpmElement.innerText = wpm;
}

function updateErrors() {
  errorsElement.innerText = errors;
}

function updateTime() {
  timeElement.innerText = `${time}s`;
}

function gameOver() {
  endGameElement.innerHTML = `
    <h1>Game Over!</h1>
    <p>Your final score is ${score}</p>
    <p>Accuracy: ${accuracy}%</p>
    <p>WPM: ${wpm}</p>
    <p>Errors: ${errors}</p>
  `;
  endGameElement.style.display = "flex";
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
    highScoreElement.innerText = highScore;
    const highScores = JSON.parse(localStorage.getItem("highScores")) || [];
    highScores.push(highScore);
    highScores.sort((a, b) => b - a);
    localStorage.setItem("highScores", JSON.stringify(highScores.slice(0, 10)));
  }
}

highScoresButton.addEventListener("click", () => {
  highScoresElement.style.display = "block";
  const highScores = JSON.parse(localStorage.getItem("highScores")) || [];
  highScoreList.innerHTML = "";
  highScores.forEach((score, index) => {
    const li = document.createElement("li");
    li.textContent = `${index + 1}. ${score}`;
    highScoreList.appendChild(li);
  });
});

closeHighScoresButton.addEventListener("click", () => {
  highScoresElement.style.display = "none";
});

exitButton.addEventListener("click", () => {
  window.close();
});

startButton.addEventListener("click", () => {
  tutorialElement.style.display = "none";
  gameElement.style.display = "block";
  initGame();
});

textElement.addEventListener("input", (e) => {
  const insertedText = e.target.value;
  if (insertedText === randomWord) {
    e.target.value = "";
    score++;
    accuracy = (score / (score + errors)) * 100;
    wpm = Math.round(score / (time / 60));
    updateScore();
    updateAccuracy();
    updateWPM();
    addWordToDom();
  } else if (insertedText !== randomWord && insertedText.length === randomWord.length) {
    errors++;
    accuracy = (score / (score + errors)) * 100;
    updateAccuracy();
    updateErrors();
  }
});

settingsButton.addEventListener("click", () => {
  settingsElement.classList.toggle("hide");
});

setInterval(() => {
  time--;
  updateTime();
  if (time === 0) {
    gameOver();
  }
}, 1000);

highScoreElement.innerText = highScore;
difficultySelect.addEventListener("change", initGame);
gameModeSelect.addEventListener("change", initGame);
languageSelect.addEventListener("change", initGame);