import { deepCopyBoard, notationToCoordinates } from "./utils.js";
import { validateMove } from "./validate.js";
import { isCheckmate, isStalemate, isKingInCheck } from "./gameState.js";

export let lastMove = null;

export function movePiece(board, fromSquare, toSquare) {
    const newBoard = deepCopyBoard(board);
    const [fromRow, fromCol] = notationToCoordinates(fromSquare);
    const [toRow, toCol] = notationToCoordinates(toSquare);

    const piece = newBoard[fromRow][fromCol];
    if (!piece) return { error: "No piece at the selected square", board };

    if (!validateMove(newBoard, fromRow, fromCol, toRow, toCol, piece.color, lastMove)) {
        return { error: "Validation Error", board: newBoard };
    }

    // --- Apply move ---
    switch (piece.type) {
        case "pawn": handlePawnMove(newBoard, piece, fromRow, fromCol, toRow, toCol); break;
        case "king": handleKingMove(newBoard, piece, fromRow, fromCol, toRow, toCol); break;
        default:
            newBoard[toRow][toCol] = piece;
            newBoard[fromRow][fromCol] = null;
            piece.hasMoved = true;
    }

    lastMove = { type: piece.type, color: piece.color, fromRow, fromCol, toRow, toCol };

    return {
        board: newBoard,
        error: null,
        check: isKingInCheck(newBoard, piece.color),
        checkmate: isCheckmate(newBoard, piece.color),
        stalemate: isStalemate(newBoard, piece.color),
    };
}

// ---------------- Pawn ----------------
function handlePawnMove(board, piece, fromRow, fromCol, toRow, toCol) {
    const dir = piece.color === "white" ? -1 : 1;

    // En passant
    if (Math.abs(fromCol - toCol) === 1 && !board[toRow][toCol] &&
        lastMove?.type === "pawn" && lastMove.color !== piece.color &&
        lastMove.toRow === fromRow && lastMove.toCol === toCol &&
        Math.abs(lastMove.fromRow - lastMove.toRow) === 2) {
        const capturedRow = piece.color === "white" ? toRow + 1 : toRow - 1;
        board[capturedRow][toCol] = null;
    }

    board[toRow][toCol] = piece;
    board[fromRow][fromCol] = null;

    // Promotion
    if (toRow === 0 || toRow === 7) {
        board[toRow][toCol] = { type: "queen", color: piece.color, hasMoved: true };
    }

    piece.hasMoved = true;
}

// ---------------- King ----------------
function handleKingMove(board, piece, fromRow, fromCol, toRow, toCol) {
    if (Math.abs(toCol - fromCol) === 2) {
        const rookFromCol = toCol > fromCol ? 7 : 0;
        const rookToCol = toCol > fromCol ? 5 : 3;
        const rook = board[fromRow][rookFromCol];
        board[fromRow][rookToCol] = rook;
        board[fromRow][rookFromCol] = null;
        rook.hasMoved = true;
    }

    board[toRow][toCol] = piece;
    board[fromRow][fromCol] = null;
    piece.hasMoved = true;
}
