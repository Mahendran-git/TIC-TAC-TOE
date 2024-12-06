const landingPage = document.getElementById('landing-page');
const gamePage = document.getElementById('game-page');
const startGameButton = document.getElementById('start-game');

const cells = document.querySelectorAll('.cell');
const gameStatus = document.getElementById('game-status');
const popup = document.getElementById('popup');
const winnerText = document.getElementById('winner');
const closePopup = document.getElementById('close-popup');
const resetButton = document.getElementById('reset');

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;

const winConditions = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6]            // Diagonals
];

// Navigation
startGameButton.addEventListener('click', () => {
  landingPage.style.display = 'none';
  gamePage.style.display = 'block';
});

// Game Logic
function handleCellClick(e) {
  const cell = e.target;
  const index = cell.getAttribute('data-index');

  if (board[index] !== '' || !gameActive) return; // Skip if cell is taken or game is over

  board[index] = currentPlayer; // Update board state
  cell.textContent = currentPlayer; // Update UI
  cell.classList.add('taken');

  // Check for a winner
  if (checkWinner()) {
    gameActive = false;

    if (currentPlayer === 'X') {
      showWinner('player'); // Player wins
    } else {
      showWinner('AI'); // AI wins
    }
    return;
  }

  // Check for a draw
  if (!board.includes('')) {
    showWinner('draw'); // Game is a draw
    return;
  }

  // Switch turns
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

  // Update status message
  gameStatus.textContent = `${currentPlayer === 'X' ? 'Your Turn (X)' : "Computer's Turn (O)"}`;

  // If it's the computer's turn, trigger its move
  if (currentPlayer === 'O') {
    setTimeout(computerMove, 500); // Slight delay for realism
  }
}

function computerMove() {
  const emptyCells = board.map((value, index) => value === '' ? index : null).filter(value => value !== null);
  const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];

  board[randomIndex] = 'O';
  cells[randomIndex].textContent = 'O';
  cells[randomIndex].classList.add('taken');

  if (checkWinner()) {
    gameActive = false;
    showWinner('AI'); // AI wins
    return;
  }

  // Switch back to player
  currentPlayer = 'X';
  gameStatus.textContent = 'Your Turn (X)';
}

function checkWinner() {
  return winConditions.some(condition => {
    return condition.every(index => board[index] === currentPlayer);
  });
}

function showWinner(result) {
  // Display messages based on result
  if (result === 'player') {
    winnerText.textContent = "You're the Winner!";
  } else if (result === 'AI') {
    winnerText.textContent = 'AI Wins!';
  } else if (result === 'draw') {
    winnerText.textContent = 'Match Drawn!';
  }

  popup.style.display = 'flex'; // Display the pop-up
}

function resetGame() {
  board = ['', '', '', '', '', '', '', '', ''];
  gameActive = true;
  currentPlayer = 'X';
  gameStatus.textContent = 'Your Turn (X)';
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('taken');
  });
  popup.style.display = 'none'; // Hide the pop-up
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);
closePopup.addEventListener('click', resetGame);