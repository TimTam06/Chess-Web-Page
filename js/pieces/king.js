import { Piece } from "./piece.js";

export class King extends Piece{
    constructor(color){
        super(color, 'king')
    }

    getPossibleMoves(game, row, col, includeCastling = true){
        let possibleMoves = []
        const board = game.board;

        const directions = [[-1, 0], [1,0], [0,-1], [0,1], [-1, -1], [-1,1], [1,1], [1,-1]]

        for (const [rowOffset, colOffset] of directions) {
            let newRow = row + rowOffset;
            let newCol = col + colOffset;

            const square = board.getSquare(newRow, newCol);

            if (square == null){
                continue;
            }

            if (square.piece?.color !== this.color){
                possibleMoves.push([newRow, newCol]);
            }

        }

        if (includeCastling){ 
            //castling kingside
            if (game.canCastleKingside(this, row, col)) {
                possibleMoves.push([row, col + 2]);
            }

            //castling queensideS
            if (game.canCastleQueenside(this, row, col)) {
                possibleMoves.push([row, col - 2]);
            }
        
        }
        

        return possibleMoves

       
    }
}