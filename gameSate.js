import { validateMove } from "./validate.js";
import { deepCopyBoard } from "./utils.js";

export function isSquareAttacked(board, targetRow, targetCol, color) {
    const directions = {
        rook: [
            [-1, 0], [1, 0], [0, -1], [0, 1] // up, down, left, right
        ],
        bishop: [
            [-1, -1], [-1, 1], [1, -1], [1, 1] // diagonals
        ],
        knight: [
            [-2, -1], [-2, 1], [-1, -2], [-1, 2],
            [1, -2], [1, 2], [2, -1], [2, 1]
        ],
        king: [
            [-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]
        ]
    };

    // Check pawns
    const pawnDirs = color === "white" ? [[-1, -1], [-1, 1]] : [[1, -1], [1, 1]];
    for (let [dr, dc] of pawnDirs) {
        const r = targetRow + dr, c = targetCol + dc;
        if (r >= 0 && r < 8 && c >= 0 && c < 8) {
            const piece = board[r][c];
            if (piece && piece.type === "pawn" && piece.color !== color) {
                return true;
            }
        }
    }

    // Check knights
    for (let [dr, dc] of directions.knight) {
        const r = targetRow + dr, c = targetCol + dc;
        if (r >= 0 && r < 8 && c >= 0 && c < 8) {
            const piece = board[r][c];
            if (piece && piece.type === "knight" && piece.color !== color) {
                return true;
            }
        }
    }

    // Check king (adjacent squares)
    for (let [dr, dc] of directions.king) {
        const r = targetRow + dr, c = targetCol + dc;
        if (r >= 0 && r < 8 && c >= 0 && c < 8) {
            const piece = board[r][c];
            if (piece && piece.type === "king" && piece.color !== color) {
                return true;
            }
        }
    }

    // Check sliding pieces: rook, bishop, queen
    const slidePieces = [
        { type: "rook", dirs: directions.rook },
        { type: "bishop", dirs: directions.bishop },
    ];

    for (let { type, dirs } of slidePieces) {
        for (let [dr, dc] of dirs) {
            let r = targetRow + dr, c = targetCol + dc;
            while (r >= 0 && r < 8 && c >= 0 && c < 8) {
                const piece = board[r][c];
                if (piece) {
                    if (piece.color != color) {
                        if (piece.type === type || piece.type === "queen") {
                            return true;
                        }
                    }
                    break; // blocked by any piece
                }
                r += dr;
                c += dc;
            }
        }
    }
    return false;
}

export function isKingInCheck(board, color) {
    let kingRow, kingCol;
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (board[r][c]?.type === "king" && board[r][c].color === color) {
                kingRow = r; kingCol = c;
            }
        }
    }
    return isSquareAttacked(board, kingRow, kingCol, color);
}

export function isCheckmate(board, color) {
    if (!isKingInCheck(board, color)) return false;
    return !hasLegalMoves(board, color);
}

export function isStalemate(board, color) {
    if (isKingInCheck(board, color)) return false;
    return !hasLegalMoves(board, color);
}

function hasLegalMoves(board, color) {
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = board[row][col];
            if (piece?.color === color) {
                for (let tr = 0; tr < 8; tr++) {
                    for (let tc = 0; tc < 8; tc++) {
                        if (validateMove(board, row, col, tr, tc, color)) {
                            const tempBoard = deepCopyBoard(board);
                            tempBoard[tr][tc] = tempBoard[row][col];
                            tempBoard[row][col] = null;
                            if (!isKingInCheck(tempBoard, color)) return true;
                        }
                    }
                }
            }
        }
    }
    return false;
}
