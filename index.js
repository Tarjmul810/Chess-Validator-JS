import { createBoard, setupInitialPosition, printBoard } from "./board.js";
import { movePiece } from "./move.js";

let board = setupInitialPosition(createBoard());
printBoard(board);

let result = movePiece(board, "e2", "e4");
board = result.board;
printBoard(board);
