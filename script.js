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
    showWinner(currentPlayer === 'X' ? 'player' : 'AI');
    return;
  }

  // Check for a draw
  if (!board.includes('')) {
    gameActive = false; // Ensure game stops after draw
    showWinner('draw');
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

// AI Move Logic to make it unpredictable
function aiMove() {
  let move;
  
  // Try winning moves first (in a random order)
  for (let i = 0; i < winConditions.length; i++) {
    const [a, b, c] = winConditions[i];
    if (board[a] === board[b] && board[a] === 'O' && board[c] === '') {
      move = c;
      break;
    } else if (board[a] === board[c] && board[a] === 'O' && board[b] === '') {
      move = b;
      break;
    } else if (board[b] === board[c] && board[b] === 'O' && board[a] === '') {
      move = a;
      break;
    }
  }

  // Block opponent winning move
  if (!move) {
    for (let i = 0; i < winConditions.length; i++) {
      const [a, b, c] = winConditions[i];
      if (board[a] === board[b] && board[a] === 'X' && board[c] === '') {
        move = c;
        break;
      } else if (board[a] === board[c] && board[a] === 'X' && board[b] === '') {
        move = b;
        break;
      } else if (board[b] === board[c] && board[b] === 'X' && board[a] === '') {
        move = a;
        break;
      }
    }
  }

  // Randomly pick one of the available spaces if no immediate winning/blocking moves
  if (!move) {
    const availableMoves = [];
    for (let i = 0; i < board.length; i++) {
      if (board[i] === '') availableMoves.push(i);
    }
    move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }

  return move;
}

function computerMove() {
  const move = aiMove(); // Get a move that AI decides randomly or strategically

  board[move] = 'O';
  cells[move].textContent = 'O';
  cells[move].classList.add('taken');

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
