import { pathClear } from "./utils.js";
import { isSquareAttacked } from "./gameState.js";

export function validateMove(board, fromRow, fromCol, toRow, toCol, color, lastMove) {
    const piece = board[fromRow][fromCol];
    if (!piece || piece.color !== color) return false;

    switch (piece.type) {
        case "pawn":   return validatePawnMove(board, fromRow, fromCol, toRow, toCol, color, lastMove);
        case "rook":   return validateRookMove(board, fromRow, fromCol, toRow, toCol, color);
        case "knight": return validateKnightMove(board, fromRow, fromCol, toRow, toCol, color);
        case "bishop": return validateBishopMove(board, fromRow, fromCol, toRow, toCol, color);
        case "queen":  return validateQueenMove(board, fromRow, fromCol, toRow, toCol, color);
        case "king":   return validateKingMove(board, fromRow, fromCol, toRow, toCol, color);
        default:       return false;
    }
}

// ---------------- Pawn ----------------
function validatePawnMove(board, fromRow, fromCol, toRow, toCol, color, lastMove) {
    const dir = (color === "white") ? -1 : 1;

    // Normal
    if (toRow === fromRow + dir && toCol === fromCol && board[toRow][toCol] === null)
        return true;

    // Double
    if (toRow === fromRow + 2*dir && toCol === fromCol &&
        board[fromRow + dir][fromCol] === null && board[toRow][toCol] === null &&
        ((color === "white" && fromRow === 6) || (color === "black" && fromRow === 1)))
        return true;

    // Capture
    if (Math.abs(toCol - fromCol) === 1 && toRow === fromRow + dir &&
        board[toRow][toCol]?.color !== color)
        return true;

    // En passant
    if (lastMove?.type === "pawn" && lastMove.color !== color &&
        lastMove.toRow === fromRow && lastMove.toCol === toCol &&
        Math.abs(lastMove.fromRow - lastMove.toRow) === 2)
        return true;

    return false;
}

// ---------------- Rook ----------------
function validateRookMove(board, fromRow, fromCol, toRow, toCol, color) {
    if (fromRow !== toRow && fromCol !== toCol) return false;
    if (!pathClear(board, fromRow, fromCol, toRow, toCol)) return false;
    return board[toRow][toCol] === null || board[toRow][toCol].color !== color;
}

// ---------------- Knight ----------------
function validateKnightMove(board, fromRow, fromCol, toRow, toCol, color) {
    if (board[toRow][toCol]?.color === color) return false;
    const r = Math.abs(toRow - fromRow), c = Math.abs(toCol - fromCol);
    return (r === 2 && c === 1) || (r === 1 && c === 2);
}

// ---------------- Bishop ----------------
function validateBishopMove(board, fromRow, fromCol, toRow, toCol, color) {
    if (Math.abs(toRow - fromRow) !== Math.abs(toCol - fromCol)) return false;
    if (!pathClear(board, fromRow, fromCol, toRow, toCol)) return false;
    return board[toRow][toCol] === null || board[toRow][toCol].color !== color;
}

// ---------------- Queen ----------------
function validateQueenMove(board, fromRow, fromCol, toRow, toCol, color) {
    return validateRookMove(board, fromRow, fromCol, toRow, toCol, color) ||
           validateBishopMove(board, fromRow, fromCol, toRow, toCol, color);
}

// ---------------- King ----------------
function validateKingMove(board, fromRow, fromCol, toRow, toCol, color) {
    const r = Math.abs(toRow - fromRow), c = Math.abs(toCol - fromCol);
    if (r <= 1 && c <= 1) return true;
    if (r === 0 && c === 2) return validateCastling(board, fromRow, fromCol, toRow, toCol, color);
    return false;
}

function validateCastling(board, fromRow, fromCol, toRow, toCol, color) {
    const king = board[fromRow][fromCol];
    if (king.hasMoved) return false;
    const rookCol = toCol > fromCol ? 7 : 0;
    const rook = board[fromRow][rookCol];
    if (!rook || rook.type !== "rook" || rook.color !== color || rook.hasMoved) return false;

    for (let col = Math.min(fromCol, rookCol) + 1; col < Math.max(fromCol, rookCol); col++) {
        if (board[fromRow][col]) return false;
    }

    if (isSquareAttacked(board, fromRow, fromCol, color)) return false;
    return true;
}
