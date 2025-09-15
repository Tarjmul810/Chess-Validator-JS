export function deepCopyBoard(board) {
    return board.map(row => row.map(cell => cell ? { ...cell } : null));
}

export function notationToCoordinates(square) {
    const col = square.charCodeAt(0) - "a".charCodeAt(0);
    const row = 8 - parseInt(square[1]);
    return [row, col];
}

export function coordinatesToNotation(row, col) {
    return String.fromCharCode("a".charCodeAt(0) + col) + (8 - row);
}

export function pathClear(board, fromRow, fromCol, toRow, toCol) {
    const rowStep = toRow > fromRow ? 1 : (toRow < fromRow ? -1 : 0);
    const colStep = toCol > fromCol ? 1 : (toCol < fromCol ? -1 : 0);
    let row = fromRow + rowStep, col = fromCol + colStep;

    while (row !== toRow || col !== toCol) {
        if (board[row][col] !== null) return false;
        row += rowStep;
        col += colStep;
    }
    return true;
}
