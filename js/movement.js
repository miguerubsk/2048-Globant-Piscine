

/* ------------------------------------------ */
/*               MOVIMIENTO                   */
/* ------------------------------------------ */

document.addEventListener("keydown", function (event) {
  if (gameOver || gameWon) return;
  let moved = false;

  if (event.key === "ArrowLeft" || event.key === "a") {
    console.log("Movimiento: izquierda");
    moved = moveLeft();
  } else if (event.key === "ArrowRight" || event.key === "d") {
    console.log("Movimiento: derecha");
    moved = moveRight();
  } else if (event.key === "ArrowUp" || event.key === "w") {
    console.log("Movimiento: arriba");
    moved = moveUp();
  } else if (event.key === "ArrowDown" || event.key === "s") {
    console.log("Movimiento: abajo");
    moved = moveDown();
  }

  if (moved) {
    const newTilePos = addRandomTile();
    renderTiles(newTilePos);

    updateScore();
    checkGameState();
    checkGameOver();
  }
});

/* ------------------------------------------ */
/*  MOVIMIENTO HACIA ARRIBA                   */
/* ------------------------------------------ */

function moveUp() {
  let moved = false;

  for (let col = 0; col < 4; col++) {
    const oldColumn = getColumn(grid, col);
    const oldTileColumn = getTileColumn(col);
    
    let newColumn = compressRow(oldColumn);
    let newTileColumn = compressTileRow(oldTileColumn);
    
    newColumn = mergeRow(newColumn, newTileColumn);
    newColumn = compressRow(newColumn);
    newTileColumn = compressTileRow(newTileColumn);
    
    setColumn(grid, col, newColumn);
    setTileColumn(col, newTileColumn);
    
    for (let row = 0; row < 4; row++) {
      if (oldColumn[row] !== newColumn[row]) {
        moved = true;
        break;
      }
    }
  }
  if (moved) recordMove('U');
  return moved;
}

/* ------------------------------------------ */
/*        MOVIMIENTO HACIA ABAJO              */
/* ------------------------------------------ */

function moveDown() {
  let moved = false;

  for (let col = 0; col < 4; col++) {
    const oldColumn = getColumn(grid, col);
    const oldTileColumn = getTileColumn(col);
    
    let newColumn = reverseRow(oldColumn);
    let newTileColumn = reverseTileRow(oldTileColumn);
    
    newColumn = compressRow(newColumn);
    newTileColumn = compressTileRow(newTileColumn);
    
    newColumn = mergeRow(newColumn, newTileColumn);
    newColumn = compressRow(newColumn);
    newTileColumn = compressTileRow(newTileColumn);
    
    newColumn = reverseRow(newColumn);
    newTileColumn = reverseTileRow(newTileColumn);
    
    setColumn(grid, col, newColumn);
    setTileColumn(col, newTileColumn);

    for (let row = 0; row < 4; row++) {
      if (oldColumn[row] !== newColumn[row]) {
        moved = true;
        break;
      }
    }
  }

  if (moved) recordMove('D');
  return moved;
}

/* ------------------------------------------ */
/*     MOVIMIENTO HACIA LA DERECHA            */
/* ------------------------------------------ */

function moveRight() {
  let moved = false;

  for (let row = 0; row < 4; row++) {
    const oldRow = [...grid[row]];
    const oldTileRow = [...tileGrid[row]];
    
    let newRow = reverseRow(grid[row]);
    let newTileRow = reverseTileRow(tileGrid[row]);
    
    newRow = compressRow(newRow);
    newTileRow = compressTileRow(newTileRow);
    
    newRow = mergeRow(newRow, newTileRow);
    newRow = compressRow(newRow);
    newTileRow = compressTileRow(newTileRow);
    
    newRow = reverseRow(newRow);
    newTileRow = reverseTileRow(newTileRow);
    
    grid[row] = newRow;
    tileGrid[row] = newTileRow;
    
    for (let col = 0; col < 4; col++) {
      if (oldRow[col] !== newRow[col]) {
        moved = true;
        break;
      }
    }
  }

  if (moved) recordMove('R');
  return moved;
}

/* ------------------------------------------ */
/*     MOVIMIENTO HACIA LA IZQUIERDA          */
/* ------------------------------------------ */

function moveLeft() {
  let moved = false;

  for (let row = 0; row < 4; row++) {
    const oldRow = [...grid[row]];
    const oldTileRow = [...tileGrid[row]];
    
    let newRow = compressRow(grid[row]);
    let newTileRow = compressTileRow(tileGrid[row]);
    
    newRow = mergeRow(newRow, newTileRow);
    newRow = compressRow(newRow);
    newTileRow = compressTileRow(newTileRow);
    
    grid[row] = newRow;
    tileGrid[row] = newTileRow;
    
    for (let col = 0; col < 4; col++) {
      if (oldRow[col] !== newRow[col]) {
        moved = true;
        break;
      }
    }
  }
  if (moved) recordMove('L');
  return moved;
}

/* ------------------------------------------ */
/*               AUXILIARES                   */
/* ------------------------------------------ */

function reverseRow(row) {
  return [...row].reverse();
}

function reverseTileRow(row) {
  return [...row].reverse();
}

function compressRow(row) {
  const filtered = row.filter((value) => value !== 0);
  while (filtered.length < 4) {
    filtered.push(0);
  }
  return filtered;
}

function compressTileRow(row) {
  const filtered = row.filter((value) => value !== null);
  while (filtered.length < 4) {
    filtered.push(null);
  }
  return filtered;
}

function mergeRow(row, tileRow) {
  for (let i = 0; i < 3; i++) {
    if (row[i] !== 0 && row[i] === row[i + 1]) {
      row[i] = row[i] * 2;
      row[i + 1] = 0;
      // Mantener el ID de la primera ficha, eliminar el de la segunda
      tileRow[i + 1] = null;
      score += row[i];
    }
  }
  return row;
}