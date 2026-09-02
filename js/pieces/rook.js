import { Piece } from "./piece.js";
import { Board } from "../board.js";

export class Rook extends Piece{
    constructor(color){
        super(color, 'rook')
    }

    getPossibleMoves(game, row, col, includeCastling = true){
        let possibleMoves = []
        const board = game.board;


        const directions = [[-1, 0], [1,0], [0,-1], [0,1]]
        
        for (const [rowOffset, colOffset] of directions) {
            let newRow = row + rowOffset;
            let newCol = col + colOffset;

            while (true) {
                const square = board.getSquare(newRow, newCol);

                if (square === null) {
                    break;
                }

                if (square.piece === null) {
                    possibleMoves.push([newRow, newCol]);
                }

                else {

                    if (square.piece.color !== this.color) {
                        possibleMoves.push([newRow, newCol]);
                    }

                    break;
                }

                newRow += rowOffset;
                newCol += colOffset;
            }
        }

        return possibleMoves;
    }
}