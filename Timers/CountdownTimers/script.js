let duration = 0;
let intervalId = null;
let display = document.getElementById('timer-display');
let startButton = document.getElementById('start-button');
let stopButton = document.getElementById('stop-button');
let resetButton = document.getElementById('reset-button');
let durationInput = document.getElementById('duration-input');
let languageSelect = document.getElementById('language-select');
let lapButton = document.getElementById('lap-button');
let lapList = document.getElementById('lap-list');
let lapCount = 0;

startButton.addEventListener('click', startCountdown);
stopButton.addEventListener('click', stopCountdown);
resetButton.addEventListener('click', resetCountdown);
lapButton.addEventListener('click', lap);

function startCountdown() {
  duration = parseInt(durationInput.value);
  if (isNaN(duration) || duration <= 0) {
    alert('Please enter a valid duration');
    return;
  }
  intervalId = setInterval(() => {
    duration--;
    updateDisplay(duration);
    if (duration <= 0) {
      clearInterval(intervalId);
      alert(getAlertText());
      resetCountdown();
    }
  }, 1000);
  startButton.disabled = true;
  stopButton.disabled = false;
  resetButton.disabled = false;
}

function stopCountdown() {
  clearInterval(intervalId);
  startButton.disabled = false;
  stopButton.disabled = true;
}

function resetCountdown() {
  clearInterval(intervalId);
  duration = 0;
  updateDisplay(duration);
  startButton.disabled = false;
  stopButton.disabled = true;
  resetButton.disabled = true;
  durationInput.value = '';
  lapList.innerHTML = '';
  lapCount = 0;
}

function lap() {
  lapCount++;
  let lapTime = getLapText();
  let lapListItem = document.createElement('li');
  lapListItem.textContent = lapTime;
  lapList.appendChild(lapListItem);
}

function updateDisplay(timeLeft) {
  let minutes = Math.floor(timeLeft / 60);
  let seconds = timeLeft % 60;
  let timeText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  let language = languageSelect.value;
  switch (language) {
    case 'fr':
      timeText = `${minutes.toString().padStart(2, '0')} minutes et ${seconds.toString().padStart(2, '0')} secondes`;
      break;
    case 'es':
      timeText = `${minutes.toString().padStart(2, '0')} minutos y ${seconds.toString().padStart(2, '0')} segundos`;
      break;
    default:
      timeText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  display.innerText = timeText;
}

function getLapText() {
    let language = languageSelect.value;
    let minutes = Math.floor(duration / 60);
    let seconds = duration % 60;
    let lapTime = `Lap ${lapCount}: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    switch (language) {
      case 'fr':
        lapTime = `Tour ${lapCount}: ${minutes.toString().padStart(2, '0')} minutes et ${seconds.toString().padStart(2, '0')} secondes`;
        break;
      case 'es':
        lapTime = `Vuelta ${lapCount}: ${minutes.toString().padStart(2, '0')} minutos y ${seconds.toString().padStart(2, '0')} segundos`;
        break;
      default:
        lapTime = `Lap ${lapCount}: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return lapTime;
  }
  
  function getAlertText() {
    let language = languageSelect.value;
    let alertText = 'Countdown finished!';
    switch (language) {
      case 'fr':
        alertText = 'Compte à rebours terminé!';
        break;
      case 'es':
        alertText = 'Cuenta atrás terminada!';
        break;
      default:
        alertText = 'Countdown finished!';
    }
    return alertText;
  }