let grid = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0]
];

let score = 0;
let tileIdCounter = 0;
let tileGrid = []; // Grid paralelo que guarda IDs de fichas

// Partida verificable: el servidor da la semilla y repite los movimientos
let rng = Math.random;
let moveLog = '';

// PRNG determinista (mulberry32). Debe coincidir exactamente con el del servidor
function createSeededRandom(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function recordMove(direction) {
  moveLog += direction;
}

function initTileGrid() {
  tileGrid = [];
  for (let i = 0; i < 4; i++) {
    tileGrid[i] = [];
    for (let j = 0; j < 4; j++) {
      tileGrid[i][j] = null;
    }
  }
}

function addRandomTile() {
  let emptyCells = [];

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid[i][j] === 0) {
        emptyCells.push({ x: i, y: j });
      }
    }
  }

  if (emptyCells.length === 0) return;

  const randomIndex = Math.floor(rng() * emptyCells.length);
  const { x, y } = emptyCells[randomIndex];

  grid[x][y] = rng() < 0.9 ? 2 : 4;
  tileGrid[x][y] = tileIdCounter++;
  
  return { x, y };
}

function getColumn(grid, colIndex) {
  const column = [];
  for (let row = 0; row < 4; row++) {
    column.push(grid[row][colIndex]);
  }
  return column;
}

function getTileColumn(colIndex) {
  const column = [];
  for (let row = 0; row < 4; row++) {
    column.push(tileGrid[row][colIndex]);
  }
  return column;
}

function setColumn(grid, colIndex, column) {
  for (let row = 0; row < 4; row++) {
    grid[row][colIndex] = column[row];
  }
}

function setTileColumn(colIndex, column) {
  for (let row = 0; row < 4; row++) {
    tileGrid[row][colIndex] = column[row];
  }
}