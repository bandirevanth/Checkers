import CheckerBoard from "./board.js";
import MiniMax from "./minimax.js";

// Create a new CheckerBoard instance
const board = new CheckerBoard();

// Set up the game board UI
function drawBoard() {
    const boardElement = document.getElementById('board');

    // Clear the board
    boardElement.innerHTML = '';

    // Draw each piece on the board
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const square = document.createElement('div');
            square.className = (row + col) % 2 === 0 ? 'square light' : 'square dark';

            const piece = board.board[row][col];
            if (piece) {
                const pieceElement = document.createElement('div');
                pieceElement.className = `piece ${piece.color}`;
                pieceElement.textContent = piece.isKing ? 'K' : '';

                // Add a click event listener to each piece
                pieceElement.addEventListener('click', () => {
                    selectPiece(piece, row, col);
                });

                square.appendChild(pieceElement);
            }

            boardElement.appendChild(square);
        }
    }
}

// Checker if a row and column is in bound on the game board
function inBound(row, col) {
    let rowInBound = (0 <= row && row < 8);
    let colInBound = (0 <= col && col < 8);

    return rowInBound && colInBound;
}

// Generate the next places to move to for selected pieces
function generateNextPlaces(piece, row, col) {
    let nextCells = [];
    if (piece) {
        if (piece.color == 'white' || piece.isKing) {
            if (inBound(row - 1, col - 1)) {
                let otherPiece = board.board[row - 1][col - 1];

                if (otherPiece) {
                    if (piece.color != otherPiece.color) {
                        if (inBound(row - 2, col - 2) && !board.board[row - 2][col - 2])
                            nextCells.push([row - 2, col - 2]);
                    }
                } else {
                    nextCells.push([row - 1, col - 1]);
                }
            }
            if (inBound(row - 1, col + 1)) {
                let otherPiece = board.board[row - 1][col + 1];

                if (otherPiece) {
                    if (piece.color != otherPiece.color) {
                        if (inBound(row - 2, col + 2) && !board.board[row - 2][col + 2])
                            nextCells.push([row - 2, col + 2]);
                    }
                } else {
                    nextCells.push([row - 1, col + 1]);
                }
            }
        }
        if (piece.color == 'black' || piece.isKing) {
            if (inBound(row + 1, col - 1)) {
                let otherPiece = board.board[row + 1][col - 1];

                if (otherPiece) {
                    if (piece.color != otherPiece.color) {
                        if (inBound(row + 2, col - 2) && !board.board[row + 2][col - 2])
                            nextCells.push([row + 2, col - 2]);
                    }
                } else
                    nextCells.push([row + 1, col - 1]);
            }
            if (inBound(row + 1, col + 1)) {
                let otherPiece = board.board[row + 1][col + 1];

                if (otherPiece) {
                    if (piece.color != otherPiece.color) {
                        if (inBound(row + 2, col + 2) && !board.board[row + 2][col + 2])
                            nextCells.push([row + 2, col + 2]);
                    }
                } else
                    nextCells.push([row + 1, col + 1]);
            }
        }
    }

    return nextCells;
}

// Select a piece to move
function selectPiece(piece, row, col) {
    const errorElement = document.getElementById('error');
    if (piece && piece.color == turn) {
        let nextCells = generateNextPlaces(piece, row, col);
        const squares = document.getElementsByClassName('square');
        
        for (let i = 0; i < 64; i++) {
            squares[i].classList.remove('green');
        }

        for (let i = 0; i < nextCells.length; i++) {
            let location = (nextCells[i][0] * 8) + nextCells[i][1];
            
            squares[location].classList.toggle('green');
            squares[location].addEventListener('click', () => {
                movePiece({x: col, y: row}, {x: nextCells[i][1], y: nextCells[i][0]});
            });
        }

        errorElement.innerHTML = '';
    } else {
        errorElement.innerHTML = 'Not your move';
    }
}

// Move a piece
function movePiece(from, to) {
    let distance = Math.abs(from.x - to.x);
    if (distance > 1) {
        board.takePiece((from.y + to.y) / 2, (from.x + to.x) / 2)
    }
    board.movePiece(from, to);
    drawBoard();

    turn = (turn == 'white') ? 'black' : 'white';

    console.log(humanScoreElement)
    humanScoreElement.innerHTML = 12 - board.blackScore;
    computerScoreElement.innerHTML = 12 - board.whiteScore;
}

// Draw the initial game board
let turn = 'white';
const humanScoreElement = document.getElementById('humanScore');
const computerScoreElement = document.getElementById('computerScore');

const ai = new MiniMax(4);
const bestMove = ai.getBestMove(board);
if (bestMove) movePiece(bestMove.from, bestMove.to);
window.onload = drawBoard;
