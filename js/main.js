import { ChessGame } from "./chessgame.js";
import { pieceImages } from "./pieceImages.js";

const boardElement = document.getElementById('board');
const newGameButton = document.getElementById("new-game-button")
newGameButton.addEventListener("click", newGame)
let game = new ChessGame();

let clickedSquare = null;


//create the squares
for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
        const squareElement = document.createElement("div");
        squareElement.classList.add("square");

        if ((row + col) % 2 === 0) {
            squareElement.classList.add("light");
        } else {
            squareElement.classList.add("dark");
        }
        
        squareElement.dataset.row = row;
        squareElement.dataset.col = col;
        
        squareElement.addEventListener('click', handleSquareClick);
        boardElement.appendChild(squareElement);
    }
}

renderBoard()
renderMoveHistory()
// handle clicks

function handleSquareClick(event) {
    const squareElement = event.currentTarget;

    const row = Number(squareElement.dataset.row);
    const col = Number(squareElement.dataset.col);


     if (clickedSquare === null) {
        if (game.canSelectPiece(row, col)){
            clickedSquare = [row, col]

            console.log("Selected:", row, col)
            renderLegalMoves()
            renderSelectedSquare()
        }
        else {console.log("No piece", row, col)}
        return
    }

    
    
    const [fromRow, fromCol] = clickedSquare
    
    if (game.board.getSquare(fromRow, fromCol).piece.color === game.board.getSquare(row, col).piece?.color){
        clickedSquare = [row, col]
        renderLegalMoves()
        renderSelectedSquare()
        console.log("Selected:", row, col)
        return
    }

    game.makeMove(fromRow, fromCol, row, col)

    clickedSquare = null

    renderBoard()
    renderMoveHistory()
    renderTurn()
    renderSelectedSquare()
    renderLegalMoves()

    if (game.gameOver == true){
        renderGameEnd()
    }
}


function renderBoard(){

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            
            const squareElement = getSquareElement(row, col)
            const square = game.board.getSquare(row, col)

            
            squareElement.innerHTML = ""

            if (square.piece === null) {
                continue
            }

            const pieceElement = document.createElement("img")

            pieceElement.classList.add("piece")

            pieceElement.src =
                pieceImages[square.piece.color][square.piece.type]

            squareElement.appendChild(pieceElement)
            
            


        }
    }
}

function getSquareElement(row, col) {
    return document.querySelector(
        `[data-row="${row}"][data-col="${col}"]`
    )
}

function newGame() {
    game = new ChessGame()
    clickedSquare = null
    renderBoard()
    renderMoveHistory()
    renderTurn()
    renderSelectedSquare()
    renderLegalMoves()
}

function renderMoveHistory() {
    const moveHistory = game.moveHistory;
    const moveHistoryElement = document.getElementById("move-history");
    const numberOfRows = Math.max(16, Math.ceil(game.moveHistory.length / 2))
    moveHistoryElement.innerHTML= ""

    for (let i = 0; i < numberOfRows; i++) {
        const row = document.createElement("div")
        row.classList.add("move-row")

        const moveNumber = document.createElement("div")
        moveNumber.textContent ="#" +  (i + 1)

        const whiteMove = document.createElement("div")
        whiteMove.textContent = game.moveHistory[i*2]?.moveNotation() ?? ""

        const blackMove = document.createElement("div")
        blackMove.textContent = game.moveHistory[i*2 + 1]?.moveNotation() ?? ""

        row.appendChild(moveNumber)
        row.appendChild(whiteMove)
        row.appendChild(blackMove)

        moveHistoryElement.appendChild(row)
    }

    moveHistoryElement.scrollTo({top: moveHistoryElement.scrollHeight, behavior: "smooth"})
}

function renderTurn(){
    const turnElement = document.querySelector(".current-turn")

    turnElement.style.backgroundColor = game.currentPlayer.color;
}

function renderLegalMoves() {
    const legalMoves = document.querySelectorAll(".legal-moves")

    for (const move of legalMoves) {
        move.classList.remove("legal-moves")
    }

    const attackedMoves = document.querySelectorAll(".attacked")

    for (const move of attackedMoves) {
        move.classList.remove("attacked")
    }

    if (clickedSquare !== null){

        for (const move of game.getLegalMoves(clickedSquare[0], clickedSquare[1])){
            const squareElement = getSquareElement(move[0], move[1])
            if (game.board.getSquare(move[0], move[1]).piece !== null) {
                squareElement.classList.add("attacked")
            } else {
                squareElement.classList.add("legal-moves")
            }
        }
    }

}

function renderSelectedSquare() {
    const selectedSquares = document.querySelectorAll(".selected")

    for (const square of selectedSquares) {
        square.classList.remove("selected")
    }
    if (clickedSquare !== null){
        const squareClickedElement = getSquareElement(clickedSquare[0], clickedSquare[1])
        squareClickedElement.classList.add('selected')
    }
}

function renderGameEnd(){
    const board = document.getElementById("board");

    const gameEndScreen = document.createElement("div")
    gameEndScreen.classList.add("game-end-screen")

    board.appendChild(gameEndScreen)
}