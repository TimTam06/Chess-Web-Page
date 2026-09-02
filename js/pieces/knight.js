import { Piece } from "./piece.js";
import { Board } from "../board.js";

export class Knight extends Piece{
    constructor(color){
        super(color, 'knight')
    }

    getPossibleMoves(game, row, col, includeCastling = true) {
        let possibleMoves = []
        const board = game.board;

        const moves = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];
        for (const [rowOffset, colOffset] of moves) {
            const newRow = row + rowOffset;
            const newCol = col + colOffset;

            const square = board.getSquare(newRow, newCol)

            if (square === null){
                continue;
            }

            if(square.piece?.color !== this.color){
                possibleMoves.push([newRow, newCol]);
            }

        }
        return possibleMoves;
    }
}