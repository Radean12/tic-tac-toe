const cells = [...document.querySelectorAll('.cell')];
const statusText = document.querySelector('#status-text');
const turnSymbol = document.querySelector('#turn-symbol');
const scoreOne = document.querySelector('#score-one');
const scoreTwo = document.querySelector('#score-two');
const playerOneSymbol = document.querySelector('#player-one-symbol');
const playerTwoSymbol = document.querySelector('#player-two-symbol');
const roundCount = document.querySelector('#round-count');
const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
let board, currentPlayer, symbols, scores = {1: 0, 2: 0}, round = 1, over;

function newSetup() {
  board = Array(9).fill('');
  currentPlayer = Math.random() < 0.5 ? 1 : 2;
  symbols = Math.random() < 0.5 ? {1: 'X', 2: 'O'} : {1: 'O', 2: 'X'};
  over = false;
  playerOneSymbol.textContent = symbols[1];
  playerTwoSymbol.textContent = symbols[2];
  updateTurn();
  render();
}
function updateTurn() {
  turnSymbol.textContent = symbols[currentPlayer];
  statusText.textContent = `PLAYER ${currentPlayer}'S TURN`;
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
    statusText.textContent = `PLAYER ${currentPlayer} WINS`;
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
}
cells.forEach(cell => cell.addEventListener('click', play));
document.querySelector('#reset-round').addEventListener('click', () => { round++; newSetup(); });
document.querySelector('#new-game').addEventListener('click', () => { scores = {1: 0, 2: 0}; round = 1; newSetup(); });
newSetup();
