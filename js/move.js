export class Move {
    constructor(piece, fromRow, fromCol, toRow, toCol, capturedPiece = null, isCheck = false, isCheckmate = false, disambiguation) {
        this.piece = piece
        this.from = [fromRow, fromCol]
        this.to = [toRow, toCol]
        this.capturedPiece = capturedPiece
        this.isCheck = isCheck
        this.isCheckmate = isCheckmate
        this.disambiguation = disambiguation
    }

    moveNotation(){
        const pieceLetters = {
            king: "K",
            queen: "Q",
            rook: "R",
            bishop: "B",
            knight: "N",
            pawn: ""
        }

        const fromFile = String.fromCharCode(97 + this.from[1]);
        const fromRank = 8 - this.from[0];

        const toFile = String.fromCharCode(97 + this.to[1]);
        const toRank = String(8 - this.to[0]);
        
        const pieceLetter = pieceLetters[this.piece.type];

        const capture = this.capturedPiece !== null ? "x" : "";

        
        //handle regular moves
        let finalMove = pieceLetter + this.disambiguation + capture + toFile + toRank;

        
        //handle pawn capture
        if (this.piece.type === "pawn" && capture === "x") {
            finalMove = fromFile + capture + toFile + toRank;
        }

        //handle pawn promotions
        if (this.piece.type === "pawn" && (toRank === "8" || toRank === "1")){
            finalMove += "=Q"
        }


        //handle castling
        if (this.piece.type === "king" && Math.abs(this.from[1] - this.to[1]) === 2){
            if (toFile === "g"){
                finalMove = "O-O"
            } else {
                finalMove = "O-O-O"
            }
        }

        //handle checks and checkmate
        if (this.isCheckmate) {
            finalMove += "#"
        } else if (this.isCheck) {
            finalMove += "+"
        }

        return finalMove
    }
}