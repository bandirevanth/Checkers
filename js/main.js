import CheckerBoard from "./board.js";
import MiniMax from "./minimax.js";

// Create a new CheckerBoard instance
const board = new CheckerBoard();
const ai = new MiniMax(3); // Depth of Minimax

// Set up the game board UI
function drawBoard() {
    const boardElement = document.getElementById('board');
    boardElement.innerHTML = '';

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const square = document.createElement('div');
            square.className = (row + col) % 2 === 0 ? 'square light' : 'square dark';

            const piece = board.board[row][col];
            if (piece) {
                const pieceElement = document.createElement('div');
                pieceElement.className = `piece ${piece.color}`;
                pieceElement.textContent = piece.isKing ? 'K' : '';

                if (piece.color === 'white') {
                    pieceElement.addEventListener('click', () => {
                        selectPiece(piece, row, col);
                    });
                }

                square.appendChild(pieceElement);
            }

            boardElement.appendChild(square);
        }
    }
}

function inBound(row, col) {
    return (0 <= row && row < 8) && (0 <= col && col < 8);
}

function generateNextPlaces(piece, row, col) {
    const nextCells = [];
    const directions = [];

    if (piece.color === 'white' || piece.isKing) {
        directions.push([-1, -1], [-1, 1]);
    }
    if (piece.color === 'black' || piece.isKing) {
        directions.push([1, -1], [1, 1]);
    }

    for (let [dy, dx] of directions) {
        const ny = row + dy;
        const nx = col + dx;

        if (inBound(ny, nx)) {
            const target = board.board[ny][nx];

            if (!target) {
                nextCells.push([ny, nx]);
            } else if (target.color !== piece.color) {
                const jumpY = ny + dy;
                const jumpX = nx + dx;

                if (inBound(jumpY, jumpX) && !board.board[jumpY][jumpX]) {
                    nextCells.push([jumpY, jumpX]);
                }
            }
        }
    }

    return nextCells;
}

function selectPiece(piece, row, col) {
    const errorElement = document.getElementById('error');
    if (piece && piece.color === turn) {
        const nextCells = generateNextPlaces(piece, row, col);
        const squares = document.getElementsByClassName('square');

        for (let i = 0; i < 64; i++) {
            squares[i].classList.remove('green');
        }

        for (let i = 0; i < nextCells.length; i++) {
            const [r, c] = nextCells[i];
            const location = (r * 8) + c;

            squares[location].classList.add('green');
            squares[location].addEventListener('click', () => {
                movePiece({ x: col, y: row }, { x: c, y: r });
            }, { once: true });
        }

        errorElement.innerHTML = '';
    } else {
        errorElement.innerHTML = 'Not your move';
    }
}

function movePiece(from, to) {
    let distance = Math.abs(from.x - to.x);
    if (distance > 1) {
        board.takePiece((from.y + to.y) / 2, (from.x + to.x) / 2);
    }

    board.movePiece(from, to);
    drawBoard();

    turn = (turn === 'white') ? 'black' : 'white';

    humanScoreElement.innerHTML = 12 - board.blackScore;
    computerScoreElement.innerHTML = 12 - board.whiteScore;

    if (turn === 'black') {
        setTimeout(aiMove, 200);
    }
}

function aiMove() {
    const move = ai.getBestMove(board, true);
    if (move) {
        movePiece(move.from, move.to); // triggers next turn (and human's move)
    } else {
        alert("Computer has no moves. You win!");
    }
}


// Init
drawBoard();
let turn = 'white'; // Human always starts
const humanScoreElement = document.getElementById('humanScore');
const computerScoreElement = document.getElementById('computerScore');
