export class Piece {
    constructor(color, type) {
        this.color = color;
        this.type = type;
        this.hasMoved = false;
    }

    //will be overridden by every piece
    getPossibleMoves(game, row, col, includeCastling = true) {
        return [];
    }
}