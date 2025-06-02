import CheckerBoard from "./board.js";
import CheckerPiece from "./piece.js";

class MiniMax {
    constructor(depth = 4) {
        this.depth = depth;
    }

    evaluate(board) {
        return board.blackScore - board.whiteScore;
    }

    getBestMove(originalBoard) {
        const board = this.cloneBoard(originalBoard);
        const moves = this.generateAllMoves(board, 'black');
        let bestEval = -Infinity;
        let bestMove = null;

        for (let move of moves) {
            const newBoard = this.simulateMove(board, move);
            let evaluation = this.minimize(newBoard, this.depth - 1, -Infinity, Infinity);
            if (evaluation > bestEval) {
                bestEval = evaluation;
                bestMove = move;
            }
        }

        return bestMove;
    }

    maximize(board, depth, alpha, beta) {
        if (depth === 0) return this.evaluate(board);

        const moves = this.generateAllMoves(board, 'black');
        let maxEval = -Infinity;

        for (let move of moves) {
            const newBoard = this.simulateMove(board, move);
            let eval = this.minimize(newBoard, depth - 1, alpha, beta);
            maxEval = Math.max(maxEval, eval);
            alpha = Math.max(alpha, eval);
            if (beta <= alpha) break;
        }

        return maxEval;
    }

    minimize(board, depth, alpha, beta) {
        if (depth === 0) return this.evaluate(board);

        const moves = this.generateAllMoves(board, 'white');
        let minEval = Infinity;

        for (let move of moves) {
            const newBoard = this.simulateMove(board, move);
            let eval = this.maximize(newBoard, depth - 1, alpha, beta);
            minEval = Math.min(minEval, eval);
            beta = Math.min(beta, eval);
            if (beta <= alpha) break;
        }

        return minEval;
    }

    generateAllMoves(board, player) {
        const moves = [];

        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                const piece = board.board[y][x];
                if (piece && piece.color === player) {
                    const nextPlaces = this.generateNextPlaces(board, piece, y, x);
                    for (const [ny, nx] of nextPlaces) {
                        moves.push({ from: { x, y }, to: { x: nx, y: ny } });
                    }
                }
            }
        }

        return moves;
    }

    generateNextPlaces(board, piece, row, col) {
        const directions = [];
        if (piece.color === 'white' || piece.isKing) {
            directions.push([-1, -1], [-1, 1]);
        }
        if (piece.color === 'black' || piece.isKing) {
            directions.push([1, -1], [1, 1]);
        }

        const nextMoves = [];
        for (let [dy, dx] of directions) {
            const [ny, nx] = [row + dy, col + dx];
            if (this.inBounds(ny, nx)) {
                const target = board.board[ny][nx];
                if (!target) {
                    nextMoves.push([ny, nx]);
                } else if (target.color !== piece.color) {
                    const [jy, jx] = [ny + dy, nx + dx];
                    if (this.inBounds(jy, jx) && !board.board[jy][jx]) {
                        nextMoves.push([jy, jx]);
                    }
                }
            }
        }

        return nextMoves;
    }

    simulateMove(board, move) {
        const newBoard = this.cloneBoard(board);
        const { from, to } = move;
        const distance = Math.abs(from.x - to.x);

        if (distance === 2) {
            const midY = (from.y + to.y) / 2;
            const midX = (from.x + to.x) / 2;
            newBoard.takePiece(midY, midX);
        }

        newBoard.movePiece(from, to);
        return newBoard;
    }

    cloneBoard(original) {
        const clone = new CheckerBoard();
        clone.whiteScore = original.whiteScore;
        clone.blackScore = original.blackScore;
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                const piece = original.board[y][x];
                if (piece) {
                    const newPiece = new CheckerPiece(piece.color, { x, y });
                    newPiece.isKing = piece.isKing;
                    clone.board[y][x] = newPiece;
                } else {
                    clone.board[y][x] = null;
                }
            }
        }
        return clone;
    }

    inBounds(y, x) {
        return y >= 0 && y < 8 && x >= 0 && x < 8;
    }
}

export default MiniMax;
