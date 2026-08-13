window.addEventListener('DOMContentLoaded', () => {
const cells = [...document.querySelectorAll('.cell')];
const statusText = document.querySelector('#status-text');
const turnSymbol = document.querySelector('#turn-symbol');
const scoreOne = document.querySelector('#score-one');
const scoreTwo = document.querySelector('#score-two');
const playerOneSymbol = document.querySelector('#player-one-symbol');
const playerTwoSymbol = document.querySelector('#player-two-symbol');
const scoreNames = document.querySelectorAll('.score-name');
const roundCount = document.querySelector('#round-count');
const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
const startScreen = document.querySelector('#start-screen');
const coin = document.querySelector('#coin');
const coinResult = document.querySelector('#coin-result');
const playerNames = {1: 'PLAYER ONE', 2: 'PLAYER TWO'};
let board, currentPlayer, symbols, scores = {1: 0, 2: 0}, round = 1, over, gameMode = 'local';
const modeSelect = document.createElement('select');
modeSelect.id = 'game-mode';
modeSelect.innerHTML = '<option value="local">TWO PLAYERS</option><option value="computer">VS COMPUTER</option>';
document.querySelector('.name-fields').after(modeSelect);

function newSetup(firstPlayer) {
  board = Array(9).fill('');
  currentPlayer = gameMode === 'computer' ? 1 : (firstPlayer || (Math.random() < 0.5 ? 1 : 2));
  symbols = gameMode === 'computer' ? {1: 'X', 2: 'O'} : (Math.random() < 0.5 ? {1: 'X', 2: 'O'} : {1: 'O', 2: 'X'});
  over = false;
  playerOneSymbol.textContent = symbols[1];
  playerTwoSymbol.textContent = symbols[2];
  scoreNames[0].textContent = playerNames[1];
  scoreNames[1].textContent = playerNames[2];
  updateTurn();
  render();
}
function updateTurn() {
  turnSymbol.textContent = symbols[currentPlayer];
  statusText.textContent = `${playerNames[currentPlayer]}'S TURN`;
}
function render() {
  cells.forEach((cell, i) => {
    cell.textContent = board[i];
    cell.className = `cell${board[i] ? ` ${board[i].toLowerCase()}` : ''}`;
  });
  scoreOne.textContent = scores[1]; scoreTwo.textContent = scores[2];
  roundCount.textContent = `ROUND ${String(round).padStart(2, '0')}`;
}
function play(event) {
  const index = +event.currentTarget.dataset.index;
  if (over || board[index]) return;
  const mark = symbols[currentPlayer]; board[index] = mark;
  const line = wins.find(row => row.every(i => board[i] === mark));
  if (line) {
    over = true; scores[currentPlayer]++;
    statusText.textContent = `${playerNames[currentPlayer]} WINS`;
    render(); line.forEach(i => cells[i].classList.add('winner')); return;
  }
  if (board.every(Boolean)) {
    over = true;
    statusText.textContent = 'DRAW';
    turnSymbol.textContent = '—';
    render();
    setTimeout(() => { round++; newSetup(); }, 3000);
    return;
  }
  currentPlayer = currentPlayer === 1 ? 2 : 1; updateTurn(); render();
  if (gameMode === 'computer' && currentPlayer === 2) setTimeout(computerMove, 450);
}
function computerMove() {
  if (over || currentPlayer !== 2) return;
  const move = bestMove(); board[move] = 'O';
  const line = wins.find(row => row.every(i => board[i] === 'O'));
  if (line) { over = true; scores[2]++; statusText.textContent = `${playerNames[2]} WINS`; render(); line.forEach(i => cells[i].classList.add('winner')); return; }
  if (board.every(Boolean)) { over = true; statusText.textContent = 'DRAW'; turnSymbol.textContent = '—'; render(); setTimeout(() => { round++; newSetup(); }, 3000); return; }
  currentPlayer = 1; updateTurn(); render();
}
function bestMove() {
  let best = -Infinity, move = 0;
  board.forEach((value, i) => { if (!value) { board[i] = 'O'; const score = minimax(false, 1); board[i] = ''; if (score > best) { best = score; move = i; } } });
  return move;
}
function minimax(maximizing, depth) {
  if (wins.some(row => row.every(i => board[i] === 'O'))) return 10 - depth;
  if (wins.some(row => row.every(i => board[i] === 'X'))) return depth - 10;
  if (board.every(Boolean)) return 0;
  const scores = [];
  board.forEach((value, i) => { if (!value) { board[i] = maximizing ? 'O' : 'X'; scores.push(minimax(!maximizing, depth + 1)); board[i] = ''; } });
  return maximizing ? Math.max(...scores) : Math.min(...scores);
}
cells.forEach(cell => cell.addEventListener('click', play));
const startButton = document.querySelector('#start-game');
startButton.textContent = 'START GAME';
startButton.addEventListener('click', () => {
  playerNames[1] = document.querySelector('#player-one-name').value.trim().toUpperCase() || 'PLAYER ONE';
  playerNames[2] = document.querySelector('#player-two-name').value.trim().toUpperCase() || 'PLAYER TWO';
  gameMode = modeSelect.value;
  if (gameMode === 'computer') playerNames[2] = 'COMPUTER';
  const winner = gameMode === 'computer' ? 1 : (Math.random() < 0.5 ? 1 : 2);
  startScreen.classList.add('hidden');
  newSetup(winner);
});
document.querySelector('#reset-round').addEventListener('click', () => { round++; newSetup(); });
document.querySelector('#new-game').addEventListener('click', () => { scores = {1: 0, 2: 0}; round = 1; newSetup(); });
});
