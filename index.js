const stonesContainer = document.getElementById("stones");
const stonesCounter = document.getElementById("stones-counter");
const resultContainer = document.getElementById("result");
const startContainer = document.getElementById("start-game");
const scoreboardContainer = document.getElementById("scoreboard-container");
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
const RESULTS_LS_KEY = "results";

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
  hideScoreboardSection();
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

function hideScoreboardSection() {
  scoreboardContainer.style.display = "none";
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

function updateScoreboard() {
  const scoreboard = getScoreboard();

  const tbody = document.getElementById("scoreboard-body");
  tbody.innerHTML = "";

  scoreboard.forEach((result) => {
    const row = document.createElement("tr");
    const dateCell = document.createElement("td");
    dateCell.textContent = result.date;
    row.appendChild(dateCell);

    const computerScoreCell = document.createElement("td");
    computerScoreCell.textContent = result.computerScore;
    row.appendChild(computerScoreCell);

    const playerScoreCell = document.createElement("td");
    playerScoreCell.textContent = result.playerScore;
    row.appendChild(playerScoreCell);

    const algorithmCell = document.createElement("td");
    switch (result.algorithm) {
      case ALGORITHMS.MINIMAX:
        algorithmCell.textContent = "Minimax";
      case ALGORITHMS.ALPHA_BETA:
        algorithmCell.textContent = "Alpha-Beta";
      default:
        break;
    }
    row.appendChild(algorithmCell);

    tbody.appendChild(row);
  });
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
      computerMove = minimaxImplementation(totalStones);
      break;
    case ALGORITHMS.ALPHA_BETA:
      computerMove = alphaBetaImplementation(totalStones);
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

function CalculateScore(totalStones, path) {
  // Evaluation function
  let score = 0;
  let maxPlayer = true;

  for (let i = 0; i < path.length; i++) {
    // Calculate points for the current path
    totalStones -= path[i];
    score += maxPlayer ? path[i] : -path[i];
    if (totalStones % 2 === 0) {
      score += maxPlayer ? 2 : -2;
    } else {
      score += maxPlayer ? -2 : 2;
    }
    maxPlayer = !maxPlayer;
  }

  return score;
}

function Minimax(totalStones, maxPlayer, path, depth, alpha, beta) {
  if (totalStones < 2 || depth === 0) {
    return [CalculateScore(totalStones, path), path];
  }

  let bestPath = [];
  let bestScore = maxPlayer ? -Infinity : Infinity;

  for (let move of [2, 3]) {
    let tempPath = [...path, move];
    if (totalStones - move >= 0) {
      let actual = Minimax(
        totalStones - move,
        !maxPlayer,
        tempPath,
        depth - 1,
        alpha,
        beta,
      );
      let actualScore = actual[0];
      if (maxPlayer) {
        if (actualScore > bestScore) {
          bestScore = actualScore;
          bestPath = tempPath;
        }
        alpha = Math.max(alpha, bestScore);
        if (beta <= alpha) break;
      } else {
        if (actualScore < bestScore) {
          bestScore = actualScore;
          bestPath = tempPath;
        }
        beta = Math.min(beta, bestScore);
        if (beta <= alpha) break;
      }
    }
  }

  return [bestScore, bestPath];
}

function minimaxImplementation(totalStones) {
  let result = Minimax(totalStones, true, [], 20, -Infinity, Infinity);
  return result[1];
}

function alphaBetaImplementation(totalStones) {
  let bestMove = 0;
  let bestScore = -Infinity;
  let alpha = -Infinity;
  let beta = Infinity;

  for (let move of [2, 3]) {
    if (totalStones - move >= 0) {
      let score = Minimax(
        totalStones - move,
        false,
        [move],
        20,
        alpha,
        beta,
      )[0];
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
      alpha = Math.max(alpha, bestScore);
      if (beta <= alpha) break;
    }
  }

  return bestMove;
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

  const scoreboard = getScoreboard();

  scoreboard.unshift({
    date: new Date().toLocaleDateString("en-GB", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
    playerScore,
    computerScore,
    algorithm: algorithmSelect.value,
  });

  setScoreboard(scoreboard);

  setUserTakeBtnsDisabled(true);
}

function getScoreboard() {
  return JSON.parse(localStorage.getItem(RESULTS_LS_KEY)) || [];
}

function setScoreboard(scoreboard) {
  localStorage.setItem(RESULTS_LS_KEY, JSON.stringify(scoreboard));
}

function clearScoreboard() {
  localStorage.removeItem(RESULTS_LS_KEY);
  updateScoreboard();
}

updateStonesDisplay();
updateScoreboard();
