
let totalStones = Math.floor(Math.random() * (70 - 50 + 1)) + 50;
let playerScore = 0;
let computerScore = 0;

const stonesContainer = document.getElementById('stones');
const resultContainer = document.getElementById('result');
const startContainer = document.getElementById('start-game');

function startGame() {
    const numStonesInput = document.getElementById('num-stones');
    totalStones = parseInt(numStonesInput.value, 10);
    playerScore = 0;
    computerScore = 0;
    updateStonesDisplay();
    document.querySelectorAll('button').forEach(btn => btn.disabled = false);
    startContainer.style.display = 'none'; // Hide the start game section
}

function updateStonesDisplay() {
  stonesContainer.innerHTML = '';
  for (let i = 0; i < totalStones; i++) {
    const stone = document.createElement('div');
    stone.className = 'stone';
    stonesContainer.appendChild(stone);
  }
}

function takeStones(number) {
  if (totalStones <= 0) return;

  totalStones -= number;
  playerScore += number + (totalStones % 2 === 0 ? 2 : -2);
  updateStonesDisplay();
  checkEndGame();

  if (totalStones > 0) {
    setTimeout(computerTurn, 1000);
  }
}

function computerTurn() {
  const computerMove = Math.random() > 0.5 ? 2 : 3;
  if (totalStones <= 0) return;

  totalStones -= computerMove;
  computerScore += computerMove + (totalStones % 2 === 0 ? 2 : -2);
  updateStonesDisplay();
  checkEndGame();
}

function checkEndGame() {
  if (totalStones <= 0) {
    playerScore += totalStones;
    let message = `Game Over. Player score: ${playerScore}, Computer score: ${computerScore}. `;
    message += playerScore === computerScore ? "It's a draw!" : (playerScore > computerScore ? "Player wins!" : "Computer wins!");
    resultContainer.textContent = message;
    document.querySelectorAll('button').forEach(btn => btn.disabled = true);
  }
}

updateStonesDisplay();