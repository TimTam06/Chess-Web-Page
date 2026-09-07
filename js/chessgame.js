import { Board } from "./board.js";
import { Player } from "./player.js";
import { Move } from "./move.js";


import { Pawn } from "./pieces/pawn.js";
import { Rook } from "./pieces/rook.js";
import { Knight } from "./pieces/knight.js";
import { Bishop } from "./pieces/bishop.js";
import { Queen } from "./pieces/queen.js";
import { King } from "./pieces/king.js";

export class ChessGame {
    constructor() {
        this.board = new Board();
        this.setupBoard()


        this.white = new Player("white");
        this.black = new Player("black");

        this.currentPlayer = this.white;

        this.moveHistory = [];
        this.positionHistory = [];

        this.positionHistory.push(this.getPositionKey())

    }
    
    makeMove(fromRow, fromCol, toRow, toCol){

        const movingPiece = this.board.getSquare(fromRow, fromCol).piece
        let capturedPiece = this.board.getSquare(toRow, toCol).piece

        // Check if there's a piece
        if (movingPiece === null) {
            console.log('no piece')
            return "no piece"
        }

        //check if it's the right player
        if (movingPiece.color !== this.currentPlayer.color){
            console.log('wrong player')
            return "wrong player"
        }

        //check if move is valid
        const isLegal = this.getLegalMoves(fromRow, fromCol, this.currentPlayer.color).some(
            ([row, col]) => row === toRow && col === toCol
        )

        if (!isLegal) {
            console.log('illegal');
            return "illegal";
        }

        //check for en passant
        const isEnPassant = movingPiece instanceof Pawn && capturedPiece === null && fromCol !== toCol;

        if (isEnPassant) {
            capturedPiece = this.board.getSquare(fromRow, toCol).piece;
            this.board.getSquare(fromRow, toCol).piece = null;
        }

        //check for ambiguities in the move

        const disambiguation = this.getDisambification(this, fromRow, fromCol, toRow, toCol)
        
        //move the piece
        this.board.movePiece(fromRow, fromCol, toRow, toCol)
        
        
        //check for promotion
        const isPromotion = movingPiece instanceof Pawn &&((movingPiece.color === "white" && toRow === 0) || (movingPiece.color === "black" && toRow === 7));
        
        //check for castling
        const isCastling = movingPiece instanceof King && Math.abs(toCol - fromCol) === 2;
        
        //If its a prom replace with the queen
        if (isPromotion) {
            const square = this.board.getSquare(toRow, toCol);
            square.piece = new Queen(movingPiece.color);
        }
        
        //If its castling move the rook
        if (isCastling) {
            if (toCol > fromCol) {
                // Kingside
                this.board.movePiece(fromRow, 7, toRow, 5);
            } else {
                // Queenside
                this.board.movePiece(fromRow, 0, toRow, 3);
            }
        }
        
        //check for check
        const enemyColor = this.currentPlayer.color === "white" ? "black" : "white";
        const checkStatus = this.isInCheck(this, enemyColor)
        //check for checkmate
        const legalMoves = this.getAllLegalMoves(this, enemyColor);
        const mateStatus = (checkStatus && legalMoves.length == 0)
        console.log(mateStatus)
        console.log(legalMoves)
        this.moveHistory.push(new Move(movingPiece, fromRow, fromCol, toRow, toCol, capturedPiece, checkStatus, mateStatus, disambiguation))

        this.switchTurn()
        
        this.positionHistory.push(this.getPositionKey())

        this.checkGameEnd()
    }

    setupBoard(){
        this.board.placePiece(new Rook("black"), 0, 0);
        this.board.placePiece(new Knight("black"), 0, 1);
        this.board.placePiece(new Bishop("black"), 0, 2);
        this.board.placePiece(new Queen("black"), 0, 3);
        this.board.placePiece(new King("black"), 0, 4);
        this.board.placePiece(new Bishop("black"), 0, 5);
        this.board.placePiece(new Knight("black"), 0, 6);
        this.board.placePiece(new Rook("black"), 0, 7);

        for (let col = 0; col < 8; col++) {
            this.board.placePiece(new Pawn("black"), 1, col);
        }

        this.board.placePiece(new Rook("white"), 7, 0);
        this.board.placePiece(new Knight("white"), 7, 1);
        this.board.placePiece(new Bishop("white"), 7, 2);
        this.board.placePiece(new Queen("white"), 7, 3);
        this.board.placePiece(new King("white"), 7, 4);
        this.board.placePiece(new Bishop("white"), 7, 5);
        this.board.placePiece(new Knight("white"), 7, 6);
        this.board.placePiece(new Rook("white"), 7, 7);

        for (let col = 0; col < 8; col++) {
            this.board.placePiece(new Pawn("white"), 6, col);
        }
    }

    getLegalMoves(row, col, color) {
        const square = this.board.getSquare(row, col)

        if (square?.piece === null) {
            return []
        }

        const piece = square.piece

        const possibleMoves = piece.getPossibleMoves(this, row, col)
        

        return this.filterLegalMoves(row, col, possibleMoves, color)
    }   

    filterLegalMoves(row, col, possibleMoves, color) {
        
        const legalMoves = possibleMoves.filter(([newRow, newCol]) => {
            const dummyGame = this.copy()

            dummyGame.board.movePiece(row, col, newRow, newCol)

            return !this.isInCheck(dummyGame, color)
        })
        return legalMoves
    }

    isInCheck(game, color){
        const chessBoard = game.board;
        
        const kingPos = chessBoard.findKing(color)
      
        const enemyColor = color === "white" ? "black" : "white";

        const allMoves = this.getAllPossibleMoves(game, enemyColor, false)
        for (const move of allMoves) {
            if (move[0] === kingPos[0] && move[1] === kingPos[1]) {  
                return true;
                }
        }
                
        return false;

    }

   

    switchTurn(){

        this.currentPlayer = this.currentPlayer  === this.black ? this.white : this.black
    }

    canSelectPiece(row, col) {
        const piece = this.board.getSquare(row, col).piece

        return piece !== null && piece.color === this.currentPlayer.color
    }

    checkGameEnd() {
        const color = this.currentPlayer.color;
        const legalMoves = this.getAllLegalMoves(this, color);
        console.log("in check game end", legalMoves)

        if (this.checkForRepetition()){
            this.result = "threefold repetition";
            this.winner = "draw";
            this.gameOver = true;
            console.log("THREEFOLD REPETITION");
            return true;
        }

        // Insufficient material
        if (this.isInsufficientMaterial()) {
            this.result = "insufficient material";
            this.winner = "draw";
            this.gameOver = true;

            console.log("DRAW - INSUFFICIENT MATERIAL");
            return true;
        }

        if (legalMoves.length !== 0) {
            return false;
        }

        this.gameOver = true;

        if (this.isInCheck(this, color)) {
            this.result = "checkmate";
            this.winner = color === "white" ? "black" : "white";

            console.log(`CHECKMATE! ${this.winner} wins!`);
        } else {
            this.result = "stalemate";
            this.winner = "draw";

            console.log("STALEMATE!");
        }

        return true;
    }       

    getAllPossibleMoves(game, color, includeCastling = true){
        const allMoves = []
        const chessBoard = game.board;

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
            const square = chessBoard.getSquare(row, col);

                if (square.piece !== null && square.piece.color === color) {
                    const moves = square.piece.getPossibleMoves(game, row, col, includeCastling);
                    allMoves.push(...moves);
                }
            }
        }
        return allMoves;
    }

    getAllLegalMoves(game, color) {
        console.log(game)
        const allLegalMoves = [];
        const chessBoard = game.board;
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = chessBoard.getSquare(row, col);

                if (square.piece !== null && square.piece.color === color) {

                    const possibleMoves = square.piece.getPossibleMoves(game, row, col);

                    const legalMoves = this.filterLegalMoves(row, col, possibleMoves, color);

                    allLegalMoves.push(...legalMoves);
                }
            }
        }   

        return allLegalMoves;
    }
    
    getLastMove(){
        if (this.moveHistory.length === 0) {
            return null
        }
        return this.moveHistory[this.moveHistory.length - 1];
    }

    copy() {
        const newGame = Object.create(Object.getPrototypeOf(this));

        newGame.board = this.board.copy();

        newGame.white = this.white;
        newGame.black = this.black;

        newGame.currentPlayer =
            this.currentPlayer.color === "white"
                ? newGame.white
                : newGame.black;

        newGame.moveHistory = this.moveHistory.map(move => {
            return new Move(
                move.piece,
                move.from[0],
                move.from[1],
                move.to[0],
                move.to[1],
                move.capturedPiece
            );
        
            newGame.positionHistory = this.positionHistory
        });
        
        return newGame;
    }

    canCastleKingside(king, row, col) {
    
        if (king.hasMoved) {
            return false;
        }

        const rook = this.board.getSquare(row, 7).piece;

        if (!(rook instanceof Rook) || rook.color !== king.color) {
            return false;
        }

        if (rook.hasMoved) {
            return false;
        }

        if (this.board.getSquare(row, 5).piece !== null || this.board.getSquare(row, 6).piece !== null) {
            return false;
        }

        if (this.isInCheck(this, king.color)) {
            return false;
        }

        const testGame = this.copy();

        testGame.board.movePiece(row, col, row, col + 1);

        if (this.isInCheck(testGame, king.color)) {
            return false;
        }

        const testGame2 = this.copy();

        testGame2.board.movePiece(row, col, row, col + 2);

        if (this.isInCheck(testGame2, king.color)) {
            return false;
        }

        return true;
    }

    canCastleQueenside(king, row, col) {
        if (king.hasMoved) {
            return false;
        }

        const rook = this.board.getSquare(row, 0).piece;

        if (!(rook instanceof Rook) || rook.color !== king.color) {
            return false;
        }

        if (rook.hasMoved) {
            return false;
        }

        if (this.board.getSquare(row, 1).piece !== null || this.board.getSquare(row, 2).piece !== null || this.board.getSquare(row, 3).piece !== null) {
        return false;
        }

        if (this.isInCheck(this, king.color)) {
            return false;
        }

        const testGame = this.copy();

        testGame.board.movePiece(row, col, row, col - 1);

        if (this.isInCheck(testGame, king.color)) {
            return false;
        }

        const testGame2 = this.copy();

        testGame2.board.movePiece(row, col, row, col - 2);

        if (this.isInCheck(testGame2, king.color)) {
            return false;
        }

        return true;
    }

    getPositionKey() {
        let key = "";

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board.getSquare(row, col).piece;

                if (piece === null) {
                    key += "empty,";
                } else {
                    key += `${piece.constructor.name}-${piece.color},`;
                }
            }
        }

        // Whose turn is it?
        key += `|turn:${this.currentPlayer.color}`;
        key += `|castle:${this.getCastlingRights()}`;
        key += `|ep:${this.getEnPassantTarget()}`;

        return key;
    }

    checkForRepetition() {
        const currentPosition = this.getPositionKey();

        let count = 0;

        for (const position of this.positionHistory) {
            if (position === currentPosition) {
                count++;
            }
        }

        if (count >= 3) {
            return true;
        }

        return false;
    }

    getCastlingRights() {
        let rights = "";

        // White
        const whiteKing = this.board.getSquare(7, 4).piece;
        const whiteKingsideRook = this.board.getSquare(7, 7).piece;
        const whiteQueensideRook = this.board.getSquare(7, 0).piece;

        if (whiteKing instanceof King && !whiteKing.hasMoved && whiteKingsideRook instanceof Rook && !whiteKingsideRook.hasMoved) {
            rights += "K";
        }

        if (whiteKing instanceof King && !whiteKing.hasMoved && whiteQueensideRook instanceof Rook && !whiteQueensideRook.hasMoved) {
            rights += "Q";
        }

        // Black
        const blackKing = this.board.getSquare(0, 4).piece;
        const blackKingsideRook = this.board.getSquare(0, 7).piece;
        const blackQueensideRook = this.board.getSquare(0, 0).piece;

        if (blackKing instanceof King && !blackKing.hasMoved && blackKingsideRook instanceof Rook && !blackKingsideRook.hasMoved) {
            rights += "k";
        }

        if (blackKing instanceof King && blackKing.hasMoved && blackQueensideRook instanceof Rook && !blackQueensideRook.hasMoved) {
            rights += "q";
        }

        return rights || "-";
    }

    getEnPassantTarget() {
        const move = this.getLastMove();

        if (!move) {
            return "-";
        }

        if (!(move.piece instanceof Pawn)) {
            return "-";
        }

        if (Math.abs(move.from[0] - move.to[0]) !== 2) {
            return "-";
        }

        const pawnRow = move.to[0];
        const pawnCol = move.to[1];

        const enemyColor = move.piece.color === "white" ? "black" : "white";

        const left = this.board.getSquare(pawnRow, pawnCol - 1);

        const right = this.board.getSquare(pawnRow, pawnCol + 1);

        if (left?.piece instanceof Pawn && left.piece.color === enemyColor) {
            return `${(move.from[0] + move.to[0]) / 2},${pawnCol}`;
        }

        if (right?.piece instanceof Pawn && right.piece.color === enemyColor) {
            return `${(move.from[0] + move.to[0]) / 2},${pawnCol}`;
        }

        return "-";
    }

    isInsufficientMaterial() {
        const pieces = [];

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board.getSquare(row, col).piece;

                if (piece !== null) {
                    pieces.push({piece, row, col});
                }
            }
        }

        // Remove kings
        const nonKings = pieces.filter(({ piece }) => !(piece instanceof King));

        // King vs King
        if (nonKings.length === 0) {
            return true;
        }

        
        if (
            nonKings.some(({ piece }) =>
                piece instanceof Pawn ||
                piece instanceof Rook ||
                piece instanceof Queen
            )
        ) {
            return false;
        }

        // King + Bishop vs King
        // King + Knight vs King
        if (nonKings.length === 1) {
            return (
                nonKings[0].piece instanceof Bishop ||
                nonKings[0].piece instanceof Knight
            );
        }

        // King + Bishop vs King + Bishop
        if (
            nonKings.length === 2 &&
            nonKings.every(({ piece }) => piece instanceof Bishop)
        ) {
            return true;
        }

        return false;
    }
    
    getDisambification(game, fromRow, fromCol, toRow, toCol){
        const piece = game.board.getSquare(fromRow, fromCol).piece;
        const candidate = []

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const otherPiece = game.board.getSquare(row, col).piece;
                
                if (otherPiece !== null && otherPiece.type === piece.type && otherPiece.color === piece.color && (row != fromRow || col != fromCol)){
                    const legalMovesOfOtherPiece = this.getLegalMoves(row, col, otherPiece.color);
                    
                    const canReach = legalMovesOfOtherPiece.some(([r, c]) => r === toRow && c === toCol)

                    if (canReach){
                        candidate.push([row, col]);

                    }
                }
            }
        }

        if (candidate.length === 0){
            return ""
        }

        const sameFile = candidate.some(([row, col]) => col === fromCol)
        const sameRank = candidate.some(([row, col]) => row === fromRow)

        const fromFile = String.fromCharCode(97 + fromCol)
        const fromRank = String(8 - fromRow)

        if (!sameFile) {
            return fromFile
        }

        if (!sameRank) {
            return fromRank
        }

        return fromFile + fromRank

    }
}