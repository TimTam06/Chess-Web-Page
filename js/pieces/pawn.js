import { Piece } from "./piece.js";
import { Board } from "../board.js";

export class Pawn extends Piece{
    constructor(color){
        super(color, 'pawn')
    }

    getPossibleMoves(game, row, col, includeCastling = true){
        let possibleMoves = []
        const board = game.board;

        if (this.color === "black") {

            const forward = board.getSquare(row + 1, col);

            if (forward?.piece === null) {
                possibleMoves.push([row + 1, col]);

                const doubleForward = board.getSquare(row + 2, col);

                if (row === 1 && doubleForward?.piece === null) {
                    possibleMoves.push([row + 2, col]);
                }
            }

            const right = board.getSquare(row + 1, col + 1);

            if (right?.piece && right.piece.color !== this.color) {
                possibleMoves.push([row + 1, col + 1]);
            }

            const left = board.getSquare(row + 1, col - 1);

            if (left?.piece && left.piece.color !== this.color) {
                possibleMoves.push([row + 1, col - 1]);
            }
        
            const lastMove = game.getLastMove();

            if (lastMove) {
                const enemyPiece = lastMove.piece;

                if (enemyPiece instanceof Pawn && enemyPiece.color !== this.color && Math.abs(lastMove.from[0] - lastMove.to[0]) === 2) {
                    if (lastMove.to[0] === row && Math.abs(lastMove.to[1] - col) === 1) {
                        const target = board.getSquare(row + 1, lastMove.to[1]);

                        if (target?.piece === null) {
                            possibleMoves.push([row + 1, lastMove.to[1]]);
                        }
                    }
                }
            }
        
            return possibleMoves;
        }

        if (this.color === "white") {

            const forward = board.getSquare(row - 1, col);

            if (forward?.piece === null) {
                possibleMoves.push([row - 1, col]);

                const doubleForward = board.getSquare(row - 2, col);

                if (row === 6 && doubleForward?.piece === null) {
                    possibleMoves.push([row - 2, col]);
                }
            }

            const right = board.getSquare(row - 1, col + 1);

            if (right?.piece && right.piece.color !== this.color) {
                possibleMoves.push([row - 1, col + 1]);
            }

            const left = board.getSquare(row - 1, col - 1);

            if (left?.piece && left.piece.color !== this.color) {
                possibleMoves.push([row - 1, col - 1]);
            }
        
            const lastMove = game.getLastMove();
            

            if (lastMove) {
                
                const enemyPiece = lastMove.piece;
                
                if (enemyPiece instanceof Pawn && enemyPiece.color !== this.color && Math.abs(lastMove.from[0] - lastMove.to[0]) === 2) {                    
                    if (lastMove.to[0] === row && Math.abs(lastMove.to[1] - col) === 1) {                       
                        const target = board.getSquare(row - 1, lastMove.to[1]);
                        if (target?.piece === null) {
                            possibleMoves.push([row - 1, lastMove.to[1]]);
                        }
                    }
                }
            }
        
            return possibleMoves;
        }

    }
}

