import { Square } from "./square.js";

export class Board {
    constructor() {
        this.squares = [];

        for (let row = 0; row < 8; row++) {
            this.squares[row] = [];

            for (let col = 0; col < 8; col++) {
                this.squares[row][col] = new Square(row, col);
            }
        }
        
    }

    getSquare(row, col) {
        if (row < 0 || row >= 8 || col < 0 || col >= 8) {
        return null;
    }

        return this.squares[row][col];
    }

    placePiece(piece, row, col){
        this.squares[row][col].piece = piece;
    }

    movePiece(row, col, newRow, newCol){
        const piece = this.squares[row][col].piece;
        this.squares[row][col].piece = null;
        this.squares[newRow][newCol].piece = piece;

        piece.hasMoved = true;
    }

    copy() {
    const newBoard = new Board();

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = this.squares[row][col].piece;

            if (piece !== null) {
                const newPiece = new piece.constructor(piece.color);

                newPiece.hasMoved = piece.hasMoved;

                newBoard.squares[row][col].piece = newPiece;
            }
        }
    }

    return newBoard;
}
    findKing(color){
        for (let row = 0; row < 8; row++){
            for (let col = 0; col < 8; col++){
                if (this.getSquare(row, col).piece?.type === 'king' && this.getSquare(row, col).piece?.color === color && this.getSquare(row, col).piece !== null){
                    return [row, col];
                }
            }

        }
        return null;
    }
}