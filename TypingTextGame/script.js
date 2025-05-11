
const textToTypeElement = document.getElementById('text-to-type');
const typingArea = document.getElementById('typing-area');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const practiceBtn = document.getElementById('practice-btn');
const shareBtn = document.getElementById('share-btn');
const languageSelect = document.getElementById('language-select');
const difficultySelect = document.getElementById('difficulty-select');
const virtualKeyboard = document.getElementById('virtual-keyboard');
const timerElement = document.getElementById('timer');
const wpmElement = document.getElementById('wpm');
const accuracyElement = document.getElementById('accuracy');
const highScoreElement = document.getElementById('high-score');
const progressBar = document.getElementById('progress-bar');

let textToType = '';
let timer = 60;
let wpm = 0;
let accuracy = 0;
let highScore = 0;
let startTime = 0;
let intervalId = null;
let language = 'en';
let practiceMode = false;

const texts = {
  easy: {
    en: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      'The quick brown fox jumps over the lazy dog.',
      'Jackdaws love my big sphinx of quartz.',
    ],
    es: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      'El rápido zorro marrón salta sobre el perro perezoso.',
      'Los jackdaws aman mi gran esfinge de cuarzo.',
    ],
    fr: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      'Le renard brun rapide saute par-dessus le chien paresseux.',
      'Les jackdaws adorent mon grand sphinx de quartz.',
    ],
  },
  medium: {
    en: [
      'How vexingly quick witted zebras jump!',
      'Pack my box with five dozen liquor jugs.',
      'The five boxing wizards jump quickly at dawn.',
    ],
    es: [
      '¡Cómo saltan las cebras con rapidez!',
      'Empaca mi caja con cinco docenas de jarras de licor.',
      'Los cinco magos del boxeo saltan rápidamente al amanecer.',
    ],
    fr: [
      'Comment les zèbres sautent avec rapidité!',
      'Empaquetez ma boîte avec cinq douzaines de pots de liqueur.',
      'Les cinq magiciens de la boxe sautent rapidement à l\'aube.',
    ],
  },
  hard: {
    en: [
      'The quick brown fox jumps over the lazy dog. The sun is shining brightly.',
      'The five boxing wizards jump quickly at dawn. The birds are singing sweet melodies.',
      'Pack my box with five dozen liquor jugs. The cat is sleeping peacefully.',
    ],
    es: [
      'El rápido zorro marrón salta sobre el perro perezoso. El sol brilla intensamente.',
      'Los cinco magos del boxeo saltan rápidamente al amanecer. Los pájaros cantan melodías dulces.',
      'Empaca mi caja con cinco docenas de jarras de licor. El gato duerme pacíficamente.',
    ],
    fr: [
      'Le renard brun rapide saute par-dessus le chien paresseux. Le soleil brille intensément.',
      'Les cinq magiciens de la boxe sautent rapidement à l\'aube. Les oiseaux chantent des mélodies douces.',
      'Empaquetez ma boîte avec cinq douzaines de pots de liqueur. Le chat dort paisiblement.',
    ],
  },
};

const keyboardLayout = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
];

function startGame() {
  language = languageSelect.value;
  const difficulty = difficultySelect.value;
  textToType = texts[difficulty][language][Math.floor(Math.random() * texts[difficulty][language].length)];
  textToTypeElement.textContent = textToType;
  typingArea.value = '';
  timer = 60;
  wpm = 0;
  accuracy = 0;
  startTime = new Date().getTime();
  intervalId = setInterval(updateTimer, 1000);
  startBtn.disabled = true;
  resetBtn.disabled = false;
  typingArea.focus();
  practiceMode = false;
  createVirtualKeyboard();
}

function updateTimer() {
  timer--;
  timerElement.textContent = `Time: ${timer}s`;
  if (timer === 0) {
    clearInterval(intervalId);
    calculateWpmAndAccuracy();
    if (!practiceMode) {
      updateHighScore();
    }
    startBtn.disabled = false;
    resetBtn.disabled = true;
  }
}

function calculateWpmAndAccuracy() {
  const typedText = typingArea.value.trim();
  const elapsedTime = (new Date().getTime() - startTime) / 60000;
  wpm = Math.round(typedText.length / 5 / elapsedTime);
  accuracy = calculateAccuracy(textToType, typedText);
  wpmElement.textContent = `WPM: ${wpm}`;
  accuracyElement.textContent = `Accuracy: ${accuracy}%`;
  updateProgressBar();
}

function calculateAccuracy(originalText, typedText) {
  let correctChars = 0;
  for (let i = 0; i < originalText.length; i++) {
    if (originalText[i] === typedText[i]) {
      correctChars++;
    }
  }
  return Math.round(correctChars / originalText.length * 100);
}

function updateHighScore() {
  if (wpm > highScore) {
    highScore = wpm;
    highScoreElement.textContent = `High Score: ${highScore}`;
    localStorage.setItem('highScore', highScore);
  }
}

function updateProgressBar() {
  const progress = (typingArea.value.length / textToType.length) * 100;
  progressBar.style.width = `${progress}%`;
}

function createVirtualKeyboard() {
  virtualKeyboard.innerHTML = '';
  keyboardLayout.forEach((row) => {
    row.forEach((key) => {
      const keyElement = document.createElement('div');
      keyElement.classList.add('key');
      keyElement.textContent = key;
      keyElement.addEventListener('click', () => {
        typingArea.value += key;
      });
      virtualKeyboard.appendChild(keyElement);
    });
    virtualKeyboard.appendChild(document.createElement('br'));
  });
}

function shareResult() {
  const shareText = `I achieved ${wpm} WPM with ${accuracy}% accuracy in the typing game!`;
  const shareUrl = 'https://example.com/typing-game';
  const shareTitle = 'Typing Game Results';
  if (navigator.share) {
    navigator.share({
      title: shareTitle,
      text: shareText,
      url: shareUrl,
    });
  } else {
    alert('Share not supported');
  }
}

startBtn.addEventListener('click', startGame);
resetBtn.addEventListener('click', () => {
  clearInterval(intervalId);
  startBtn.disabled = false;
  resetBtn.disabled = true;
  timerElement.textContent = 'Time: 60s';
  wpmElement.textContent = 'WPM: 0';
  accuracyElement.textContent = 'Accuracy: 0%';
  textToTypeElement.textContent = '';
  typingArea.value = '';
  progressBar.style.width = '0%';
});
practiceBtn.addEventListener('click', () => {
  practiceMode = true;
  startGame();
});
shareBtn.addEventListener('click', shareResult)