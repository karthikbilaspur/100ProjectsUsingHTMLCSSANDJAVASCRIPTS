
// Get the canvas element
const canvas = document.getElementById('tetris');
const ctx = canvas.getContext('2d');

// Set the canvas dimensions
canvas.width = 240;
canvas.height = 400;

// Define the game variables
let grid = [];
let currentPiece;
let score = 0;
let highScore = 0;
let currentTime = 0;
let startTime = new Date().getTime();
let gameOver = false;

// Define the piece shapes
const pieceShapes = [
  [[1, 1], [1, 1]], // O-Shape
  [[1, 0, 0], [1, 1, 1]], // J-Shape
  [[0, 0, 1], [1, 1, 1]], // L-Shape
  [[1, 1, 1, 1]], // I-Shape
  [[0, 1, 1], [1, 1, 0]], // S-Shape
  [[1, 1, 0], [0, 1, 1]], // Z-Shape
  [[1, 1, 1], [0, 1, 0]], // T-Shape
];

// Define the piece colors
const pieceColors = [
  '#FF69B4', // Pink
  '#33CC33', // Green
  '#6666FF', // Blue
  '#CC33CC', // Purple
  '#FFFF66', // Yellow
  '#FF9966', // Orange
  '#66CCCC', // Light Blue
];

// Initialize the game
function initGame() {
  // Create the grid
  for (let i = 0; i < 20; i++) {
    grid.push([]);
    for (let j = 0; j < 10; j++) {
      grid[i].push(0);
    }
  }

  // Spawn the first piece
  spawnPiece();

  // Draw the game board
  drawGameBoard();

  // Update the score display
  updateScoreDisplay();
  updateHighScoreDisplay();
  updateTimeTakenDisplay();

  // Add event listeners for keyboard input
  document.addEventListener('keydown', handleKeyDown);

  // Add event listeners for button clicks
  document.getElementById('left-button').addEventListener('click', () => {
    movePiece(-1, 0);
  });
  document.getElementById('right-button').addEventListener('click', () => {
    movePiece(1, 0);
  });
  document.getElementById('down-button').addEventListener('click', () => {
    movePiece(0, 1);
  });
  document.getElementById('rotate-button').addEventListener('click', () => {
    rotatePiece();
  });

  // Add event listener for restart button click
  document.getElementById('restart-button').addEventListener('click', restartGame);

  // Start the game loop to update the time taken display
  setInterval(updateTimeTakenDisplay, 1000);
}

// Spawn a new piece
function spawnPiece() {
  // Get a random piece shape and color
  const shape = pieceShapes[Math.floor(Math.random() * pieceShapes.length)];
  const color = pieceColors[Math.floor(Math.random() * pieceColors.length)];

  // Create the piece object
  currentPiece = {
    shape,
    color,
    x: 5,
    y: 0,
  };
}

// Draw the game board
function drawGameBoard() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the grid
  for (let i = 0; i < 20; i++) {
    for (let j = 0; j < 10; j++) {
      if (grid[i][j] === 1) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(j * 24, i * 20, 24, 20);
      }
    }
  }

  // Draw the current piece
  if (currentPiece) {
    for (let i = 0; i < currentPiece.shape.length; i++) {
      for (let j = 0; j < currentPiece.shape[i].length; j++) {
        if (currentPiece.shape[i][j] === 1) {
          ctx.fillStyle = currentPiece.color;
          ctx.fillRect((currentPiece.x + j) * 24, (currentPiece.y + i) * 20, 24, 20);
        }
      }
    }
  }
}

// Update the score display
function updateScoreDisplay() {
  document.getElementById('current-score').textContent = score;
}

// Update the high score display
function updateHighScoreDisplay() {
  document.getElementById('high-score').textContent = highScore;
}

// Update the time taken display
function updateTimeTakenDisplay() {
  const currentTime = new Date().getTime();
  const timeTaken = Math.floor((currentTime - startTime) / 1000);
  const minutes = Math.floor(timeTaken / 60);
  const seconds = timeTaken % 60;
  document.getElementById('time-taken').textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Handle keyboard input
function handleKeyDown(event) {
  switch (event.key) {
    case 'ArrowLeft':
      movePiece(-1, 0);
      break;
    case 'ArrowRight':
      movePiece(1, 0);
      break;
    case 'ArrowDown':
      movePiece(0, 1);
      break;
    case 'ArrowUp':
      rotatePiece();
      break;
  }
}

// Move the piece
function movePiece(dx, dy) {
  // Check if the piece can move
  if (canMove(currentPiece.x + dx, currentPiece.y + dy)) {
    currentPiece.x += dx;
    currentPiece.y += dy;
    drawGameBoard();
  } else if (dy === 1) {
    // Place the piece on the grid
    placePiece();
    // Check for line clears
    checkForLineClears();
    // Spawn a new piece
    spawnPiece();
    drawGameBoard();
  }
}

// Check if the piece can move
function canMove(x, y) {
  for (let i = 0; i < currentPiece.shape.length; i++) {
    for (let j = 0; j < currentPiece.shape[i].length; j++) {
      if (currentPiece.shape[i][j] === 1) {
        const gridX = x + j;
        const gridY = y + i;
        if (gridX < 0 || gridX >= 10 || gridY >= 20) {
          return false;
        }
        if (gridY >= 0 && grid[gridY][gridX] === 1) {
          return false;
        }
      }
    }
  }
  return true;
}

// Place the piece on the grid
function placePiece() {
  for (let i = 0; i < currentPiece.shape.length; i++) {
    for (let j = 0; j < currentPiece.shape[i].length; j++) {
      if (currentPiece.shape[i][j] === 1) {
        const gridX = currentPiece.x + j;
        const gridY = currentPiece.y + i;
        if (gridY >= 0) {
          grid[gridY][gridX] = 1;
        }
      }
    }
  }
}

// Check for line clears
function checkForLineClears() {
  for (let i = 0; i < 20; i++) {
    let lineClear = true;
    for (let j = 0; j < 10; j++) {
      if (grid[i][j] === 0) {
        lineClear = false;
        break;
      }
    }
    if (lineClear) {
      // Clear the line
      grid.splice(i, 1);
      grid.unshift([]);
      for (let j = 0; j < 10; j++) {
        grid[0].push(0);
      }
      // Increase the score
      score += 100;
      if (score > highScore) {
        highScore = score;
        updateHighScoreDisplay();
      }
      updateScoreDisplay();
    }
  }
}

// Rotate the piece
function rotatePiece() {
  // Rotate the piece shape
  currentPiece.shape = rotateShape(currentPiece.shape);
  // Check if the piece can move
  if (!canMove(currentPiece.x, currentPiece.y)) {
    // Revert the rotation
    currentPiece.shape = rotateShape(currentPiece.shape);
  }
  drawGameBoard();
}

// Rotate a shape
function rotateShape(shape) {
  return shape[0].map((val, index) => shape.map(row => row[index]).reverse());
}

// Restart the game
function restartGame() {
  // Reset the game variables
  grid = [];
  currentPiece = null;
  score = 0;
  startTime = new Date().getTime();
  // Initialize the game
  initGame();
}

// Social sharing
document.getElementById('facebook-share-button').addEventListener('click', () => {
  const url = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(window.location.href);
  window.open(url, '_blank');
});


document.getElementById('twitter-share-button').addEventListener('click', () => {
  const url = 'https://twitter.com/intent/tweet?url=' + encodeURIComponent(window.location.href) + '&text=' + encodeURIComponent('Check out this Tetris game!');
  window.open(url, '_blank');
});

document.getElementById('linkedin-share-button').addEventListener('click', () => {
  const url = 'https://www.linkedin.com/sharing/share?url=' + encodeURIComponent(window.location.href);
  window.open(url, '_blank');
});

// Start the game
initGame();