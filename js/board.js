import CheckerPiece from "./piece.js";

class CheckerBoard {
    constructor() {
        this.whiteScore = 0;
        this.blackScore = 0;
        this.board = this.createBoard();
    }

    // Method to create the initial board setup
    createBoard() {
        const board = [];
        for (let row = 0; row < 8; row++) {
            const boardRow = [];
            for (let col = 0; col < 8; col++) {
                if ((row + col) % 2 === 0) {
                    if (row < 3) {
                        boardRow.push(new CheckerPiece('black', { x: col, y: row }));
                        this.blackScore += 1;
                    } else if (row > 4) {
                        boardRow.push(new CheckerPiece('white', { x: col, y: row }));
                        this.whiteScore += 1;
                    } else {
                        boardRow.push(null);
                    }
                } else {
                    boardRow.push(null);
                }
            }
            board.push(boardRow);
        }
        return board;
    }

    // Method to move a piece on the board
    movePiece(from, to) {
        const piece = this.board[from.y][from.x];
        if (piece) {
            piece.move(to);
            this.board[to.y][to.x] = piece;
            this.board[from.y][from.x] = null;
        }
    }

    // Method to take a piece from the opponent
    takePiece(y, x) {
        if (this.board[y][x].color == 'white') {
            this.whiteScore -= 1;
        } else {
            this.blackScore -= 1;
        }
        this.board[y][x] = null;
    }
}

export default CheckerBoard;