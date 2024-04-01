const prompt = require("prompt-sync")({ sigint: true });

function Points(totalStones, maxPlayer) {
  //calcuate the points for each player at the end of the game
  if (totalStones == 0) {
    return 0;
  }
  if (totalStones % 2 == 0) {
    return maxPlayer ? 2 : -2;
  } else {
    return maxPlayer ? -2 : 2;
  }
}

function CalculateScore(initialStones, path) {
  //evaluation function
  let score = 0;
  let maxPlayer = true;
  let totalStones = initialStones;
  for (let i = 0; i < gamePath.length; i++) {
    //calculate points for what has already happened
    totalStones -= gamePath[i];
    score += maxPlayer ? gamePath[i] : -gamePath[i];
    if (totalStones % 2 == 0) {
      score += maxPlayer ? 2 : -2;
    } else {
      score += maxPlayer ? -2 : 2;
    }
    maxPlayer = !maxPlayer;
  }
  for (let i = 0; i < path.length; i++) {
    totalStones -= path[i];
    score += maxPlayer ? path[i] : -path[i];
    if (totalStones % 2 == 0) {
      score += maxPlayer ? 2 : -2;
    } else {
      score += maxPlayer ? -2 : 2;
    }
    maxPlayer = !maxPlayer;
  }
  return score;
}

function Minimax(totalStones, maxPlayer, path, depth) {
  if (totalStones < 2 || depth == 0) {
    return [CalculateScore(initialStones, path), path];
  }
  if (maxPlayer) {
    let bestPath = [];
    let bestScore = -Infinity;
    for (let move of [2, 3]) {
      let temp = [...path];
      if (totalStones - move >= 0) {
        temp.push(move);
        let actual = Minimax(totalStones - move, false, temp, depth - 1);
        let actualScore = actual[0];
        let actualPath = actual[1];
        if (Math.max(actualScore, bestScore) === actualScore) {
          bestScore = actualScore;
          bestPath = actualPath;
        }
      }
    }
    return [bestScore, bestPath];
  } else {
    let bestPath = [];
    let bestScore = Infinity;
    for (let move of [2, 3]) {
      let temp = [...path];
      if (totalStones - move >= 0) {
        temp.push(move);
        let actual = Minimax(totalStones - move, true, temp, depth - 1);
        let actualScore = actual[0];
        let actualPath = actual[1];
        if (Math.min(actualScore, bestScore) === actualScore) {
          bestScore = actualScore;
          bestPath = actualPath;
        }
      }
    }
    return [bestScore, bestPath];
  }
}

function findBestMove(totalStones) {
  let bestMove = 0;
  let bestPath = [];
  let bestScore = Infinity;
  for (let move of [2, 3]) {
    path = [];
    path.push(move);
    if (totalStones - move >= 0) {
      best = Minimax(totalStones - move, true, path, 20); //depth can be changed if needed here
      let actualScore = best[0];
      if (actualScore < bestScore) {
        bestScore = actualScore;
        bestMove = move;
        bestPath = best[1];
      }
    }
  }
  return [bestMove, bestScore, bestPath];
}

totalStones = prompt("Enter the number of stones: ");
let initialStones = totalStones;
let totalPlayer = 0;
let totalComputer = 0;
let score = 0;
let computerMove = 0;
let gamePath = [];
let path = [];
while (totalStones > 1) {
  move = prompt("Enter your move 2 or 3 ");
  if (move != 2 && move != 3) {
    console.log("Invalid Move");
    continue;
  }
  30;
  gamePath.push(Number(move));
  totalStones -= move;
  console.log("Remaining Stones: ", totalStones);
  totalPlayer += Points(totalStones, true) + Number(move);
  if (totalStones < 2) {
    break;
  }
  let resultComputer = findBestMove(totalStones, score);
  computerMove = resultComputer[0];
  score = resultComputer[1];
  path = resultComputer[2];
  console.log("Computer Move: ", computerMove);
  gamePath.push(Number(computerMove));
  totalStones -= computerMove;
  console.log("Remaining Stones: ", totalStones);
  totalComputer += Points(totalStones, false) + computerMove;
}
console.log("Total Player: ", totalPlayer);
console.log("Total Computer: ", totalComputer);

if (totalPlayer > totalComputer) {
  console.log("Player Wins");
} else if (totalPlayer == totalComputer) {
  console.log("It's a Draw");
} else {
  console.log("Computer Wins");
}
