export function createBoard() {
    const board = [];
    for (let row = 0; row < 8; row++) {
        board[row] = Array(8).fill(null);
    }
    return board;
}

export function setupInitialPosition(board) {
    const addPiece = (row, col, type, color) =>
        board[row][col] = { type, color, hasMoved: false };

    // Pawns
    for (let col = 0; col < 8; col++) {
        addPiece(6, col, "pawn", "white");
        addPiece(1, col, "pawn", "black");
    }

    // Rooks
    addPiece(7, 0, "rook", "white"); addPiece(7, 7, "rook", "white");
    addPiece(0, 0, "rook", "black"); addPiece(0, 7, "rook", "black");

    // Knights
    addPiece(7, 1, "knight", "white"); addPiece(7, 6, "knight", "white");
    addPiece(0, 1, "knight", "black"); addPiece(0, 6, "knight", "black");

    // Bishops
    addPiece(7, 2, "bishop", "white"); addPiece(7, 5, "bishop", "white");
    addPiece(0, 2, "bishop", "black"); addPiece(0, 5, "bishop", "black");

    // Queens
    addPiece(7, 3, "queen", "white");
    addPiece(0, 3, "queen", "black");

    // Kings
    addPiece(7, 4, "king", "white");
    addPiece(0, 4, "king", "black");

    return board;
}

export function printBoard(board) {
    for (let row = 0; row < 8; row++) {
        let line = "";
        for (let col = 0; col < 8; col++) {
            const piece = board[row][col];
            line += piece ? `${piece.color[0]}${piece.type[0]} ` : " . ";
        }
        console.log(line);
    }
}
