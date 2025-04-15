let timerContainer = document.getElementById('timer-container');
let addTimerButton = document.getElementById('add-timer-button');
let languageSelect = document.getElementById('language-select');
let timers = [];

let translations = {
    en: {
      title: 'Timer Dashboard',
      addTimer: 'Add Timer',
    },
    fr: {
      title: 'Tableau de bord de minuterie',
      addTimer: 'Ajouter une minuterie',
    },
    es: {
      title: 'Panel de temporizador',
      addTimer: 'Añadir temporizador',
    },
  };
  
  languageSelect.addEventListener('change', updateLanguage);
  
  function updateLanguage() {
    let language = languageSelect.value;
    document.getElementById('title').innerText = translations[language].title;
    addTimerButton.innerText = translations[language].addTimer;
  }
  
addTimerButton.addEventListener('click', addTimer);

function addTimer() {
  let timerId = timers.length;
  let timerHtml = `
    <div id="timer-${timerId}" class="timer">
      <input type="text" id="timer-label-${timerId}" placeholder="Timer Label">
      <input type="number" id="timer-duration-${timerId}" placeholder="Duration in seconds">
      <button id="start-timer-${timerId}">Start</button>
      <button id="stop-timer-${timerId}" disabled>Stop</button>
      <button id="reset-timer-${timerId}" disabled>Reset</button>
      <p id="timer-display-${timerId}">00:00</p>
    </div>
  `;
  timerContainer.insertAdjacentHTML('beforeend', timerHtml);

  let startButton = document.getElementById(`start-timer-${timerId}`);
  let stopButton = document.getElementById(`stop-timer-${timerId}`);
  let resetButton = document.getElementById(`reset-timer-${timerId}`);
  let display = document.getElementById(`timer-display-${timerId}`);
  let durationInput = document.getElementById(`timer-duration-${timerId}`);

  startButton.addEventListener('click', () => startTimer(timerId));
  stopButton.addEventListener('click', () => stopTimer(timerId));
  resetButton.addEventListener('click', () => resetTimer(timerId));

  timers.push({
    id: timerId,
    duration: 0,
    intervalId: null,
    display: display,
    durationInput: durationInput,
    startButton: startButton,
    stopButton: stopButton,
    resetButton: resetButton,
  });
}

function startTimer(timerId) {
  let timer = timers.find((timer) => timer.id === timerId);
  timer.duration = parseInt(timer.durationInput.value);
  if (isNaN(timer.duration) || timer.duration <= 0) {
    alert('Please enter a valid duration');
    return;
  }
  timer.intervalId = setInterval(() => {
    timer.duration--;
    updateDisplay(timer);
    if (timer.duration <= 0) {
      clearInterval(timer.intervalId);
      alert('Countdown finished!');
      resetTimer(timerId);
    }
  }, 1000);
  timer.startButton.disabled = true;
  timer.stopButton.disabled = false;
  timer.resetButton.disabled = false;
}

function stopTimer(timerId) {
  let timer = timers.find((timer) => timer.id === timerId);
  clearInterval(timer.intervalId);
  timer.startButton.disabled = false;
  timer.stopButton.disabled = true;
}

function resetTimer(timerId) {
  let timer = timers.find((timer) => timer.id === timerId);
  clearInterval(timer.intervalId);
  timer.duration = 0;
  updateDisplay(timer);
  timer.startButton.disabled = false;
  timer.stopButton.disabled = true;
  timer.resetButton.disabled = true;
  timer.durationInput.value = '';
}

function updateDisplay(timer) {
  let minutes = Math.floor(timer.duration / 60);
  let seconds = timer.duration % 60;
  timer.display.innerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

let colors = ["#ff69b4", "#ffe6cc", "#87ceeb", "#4682b4", "#6495ed"];
let currentColorIndex = 0;

setInterval(() => {
  document.body.style.backgroundColor = colors[currentColorIndex];
  currentColorIndex = (currentColorIndex + 1) % colors.length;
}, 5000);
