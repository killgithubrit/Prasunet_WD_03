const X_CLASS = 'x';
const O_CLASS = 'o';
const CELL_ELEMENTS = document.querySelectorAll('[data-cell]');
const BOARD = document.getElementById('board');
const STATUS_TEXT = document.getElementById('statusText');
const LETS_PLAY_BUTTON = document.getElementById('letsPlayButton');
const TWO_PLAYER_BUTTON = document.getElementById('twoPlayerButton');
const AI_PLAYER_BUTTON = document.getElementById('aiPlayerButton');
const BACK_BUTTON = document.getElementById('backButton');
const BACK_HOME_BUTTON = document.getElementById('backHomeButton');
const HOME_PAGE = document.getElementById('homePage');
const MODE_SELECTION = document.getElementById('modeSelection');

let isPlayerOTurn = false;
let isVsAi = false;

LETS_PLAY_BUTTON.addEventListener('click', () => {
  HOME_PAGE.style.display = 'none';
  MODE_SELECTION.style.display = 'block';
});

TWO_PLAYER_BUTTON.addEventListener('click', () => {
  isVsAi = false;
  MODE_SELECTION.style.display = 'none';
  BOARD.style.display = 'block';
  startGame();
});

AI_PLAYER_BUTTON.addEventListener('click', () => {
  isVsAi = true;
  MODE_SELECTION.style.display = 'none';
  BOARD.style.display = 'block';
  startGame();
});

BACK_BUTTON.addEventListener('click', goBackToModeSelection);
BACK_HOME_BUTTON.addEventListener('click', goBackToHomePage);

CELL_ELEMENTS.forEach(cell => {
  cell.addEventListener('click', handleClick, { once: true });
});

function startGame() {
  isPlayerOTurn = false;
  CELL_ELEMENTS.forEach(cell => {
    cell.classList.remove(X_CLASS);
    cell.classList.remove(O_CLASS);
    cell.removeEventListener('click', handleClick);
    cell.addEventListener('click', handleClick, { once: true });
  });
  setBoardHoverClass();
  setStatusText();
}

function handleClick(e) {
  const cell = e.target;
  const currentClass = isPlayerOTurn ? O_CLASS : X_CLASS;

  if (cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS)) {
    return;
  }

  placeMark(cell, currentClass);

  if (checkWin(currentClass)) {
    endGame(false);
  } else if (isDraw()) {
    endGame(true);
  } else {
    swapTurns();
    setBoardHoverClass();
    setStatusText();
    if (isVsAi && !isPlayerOTurn) {
      setTimeout(aiMove, 500);
    }
  }
}

function placeMark(cell, currentClass) {
  cell.classList.add(currentClass);
}

function swapTurns() {
  isPlayerOTurn = !isPlayerOTurn;
}

function setBoardHoverClass() {
  BOARD.classList.remove(X_CLASS);
  BOARD.classList.remove(O_CLASS);
  if (isPlayerOTurn) {
    BOARD.classList.add(O_CLASS);
  } else {
    BOARD.classList.add(X_CLASS);
  }
}

function setStatusText() {
  STATUS_TEXT.innerText = `Player ${isPlayerOTurn ? "O" : "X"}'s Turn`;
}

function checkWin(currentClass) {
  const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  return WINNING_COMBINATIONS.some(combination => {
    return combination.every(index => {
      return CELL_ELEMENTS[index].classList.contains(currentClass);
    });
  });
}

function isDraw() {
  return [...CELL_ELEMENTS].every(cell => {
    return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS);
  });
}

function endGame(draw) {
  if (draw) {
    STATUS_TEXT.innerText = `Draw!`;
  } else {
    STATUS_TEXT.innerText = `Player ${isPlayerOTurn ? "O" : "X"} Wins!`;
    celebrate();
    playWinningSound();
  }
}

function aiMove() {
  const availableCells = [...CELL_ELEMENTS].filter(cell => {
    return !cell.classList.contains(X_CLASS) && !cell.classList.contains(O_CLASS);
  });
  const randomCell = availableCells[Math.floor(Math.random() * availableCells.length)];
  randomCell.click();
}

function celebrate() {
  const duration = 15 * 1000;
  const end = Date.now() + duration;
  (function frame() {
    confetti({
      particleCount: 7,
      angle: 60,
      spread: 55,
      origin: { x: 0 }
    });
    confetti({
      particleCount: 7,
      angle: 120,
      spread: 55,
      origin: { x: 1 }
    });
    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}

function playWinningSound() {
  const audio = new Audio('path/to/winning-sound.mp3'); // Add path to your winning sound file
  audio.play();
}

function goBackToModeSelection() {
  BOARD.style.display = 'none';
  MODE_SELECTION.style.display = 'block';
}

function goBackToHomePage() {
  BOARD.style.display = 'none';
  MODE_SELECTION.style.display = 'none';
  HOME_PAGE.style.display = 'block';
}
