const stonesContainer = document.getElementById("stones");
const stonesCounter = document.getElementById("stones-counter");
const resultContainer = document.getElementById("result");
const startContainer = document.getElementById("start-game");
const algorithmSelect = document.getElementById("algorithm-select");
const startsWithSelect = document.getElementById("who-starts");
const stonesNumberInput = document.getElementById("num-stones");

const ALGORITHMS = {
  MINIMAX: "minimax",
  ALPHA_BETA: "alpha-beta",
};
const PARTICIPANTS = {
  PLAYER: "player",
  COMPUTER: "computer",
};
const MAX_STONES = 70;
const MIN_STONES = 50;

let totalStones = MIN_STONES;
let playerScore = 0;
let computerScore = 0;

stonesNumberInput.addEventListener("input", () => {
  setInitialStones(parseInt(stonesNumberInput.value, 10));

  updateStonesDisplay();
});

async function startGame() {
  const numOfStones = parseInt(stonesNumberInput.value, 10);

  setInitialStones(numOfStones);
  playerScore = 0;
  computerScore = 0;

  const startsWith = startsWithSelect.value;
  updateStonesDisplay();
  hideStartGameSection();
  await setStartsWith(startsWith);
}

async function setStartsWith(startsWith) {
  if (startsWith === PARTICIPANTS.PLAYER) {
    setUserTakeBtnsDisabled(false);
    return;
  }

  await computerTurn();
}

function setUserTakeBtnsDisabled(disabled = false) {
  Array.from(document.getElementsByClassName("player-take-btn")).forEach(
    (btn) => (btn.disabled = disabled),
  );
}

function hideStartGameSection() {
  startContainer.style.display = "none";
}

function setInitialStones(userSetStones) {
  if (userSetStones < 50) {
    return (totalStones = 50);
  }

  if (userSetStones > 70) {
    return (totalStones = 70);
  }

  totalStones = userSetStones;
}

function updateStonesDisplay() {
  stonesCounter.textContent = (totalStones < 0 ? 0 : totalStones) || 0;

  stonesContainer.innerHTML = "";
  for (let i = 0; i < totalStones; i++) {
    const stone = document.createElement("div");
    stone.className = "stone";
    stonesContainer.appendChild(stone);
  }
}

async function takeStones(stonesTaken) {
  if (totalStones <= 0) return;

  subtractStonesFromTotal(stonesTaken);

  playerScore += stonesTaken + totalStonesBonus(totalStones);
  updateStonesDisplay();
  checkEndGame();

  if (totalStones > 0) {
    await computerTurn();
  }
}

function sleep(ms = 1000) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function totalStonesBonus(totalStones) {
  return totalStones % 2 === 0 ? 2 : -2;
}

async function computerTurn() {
  if (totalStones <= 0) return;
  setUserTakeBtnsDisabled(true);
  await sleep(200);

  let computerMove = 0;
  switch (algorithmSelect.value) {
    case ALGORITHMS.MINIMAX:
      computerMove = minimaxImplementation();
      break;
    case ALGORITHMS.ALPHA_BETA:
      computerMove = alphaBetaImplementation();
      break;
    default:
      break;
  }

  subtractStonesFromTotal(computerMove);
  computerScore += computerMove + totalStonesBonus(totalStones);
  updateStonesDisplay();
  checkEndGame();
  setUserTakeBtnsDisabled(false);
}

function subtractStonesFromTotal(number) {
  totalStones -= number;

  if (totalStones < 0) {
    totalStones = 0;
  }
}

function alphaBetaImplementation() {
  return Math.random() > 0.5 ? 3 : 2;
}

function minimaxImplementation() {
  return Math.random() > 0.5 ? 3 : 2;
}

function checkEndGame() {
  if (totalStones > 0) {
    return;
  }

  playerScore += totalStones;
  let message = `Game Over. Player score: ${playerScore}, Computer score: ${computerScore}. `;
  message +=
    playerScore === computerScore
      ? "It's a draw!"
      : playerScore > computerScore
        ? "Player wins!"
        : "Computer wins!";
  resultContainer.textContent = message;

  setUserTakeBtnsDisabled(true);
}

updateStonesDisplay();
