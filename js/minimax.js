import CheckerPiece from './piece.js';

class MiniMax {
    constructor(maxDepth = 4) {
        this.maxDepth = maxDepth;
    }

    getBestMove(board, isMaximizingPlayer) {
        let bestScore = -Infinity;
        let bestMove = null;
        const moves = this.getAllValidMoves(board, 'black');

        for (let move of moves) {
            const original = this.applyMove(board, move);
            const score = this.minimize(board, 1, -Infinity, Infinity);
            this.undoMove(board, move, original);

            if (score > bestScore) {
                bestScore = score;
                bestMove = move;
            }
        }

        return bestMove;
    }

    maximize(board, depth, alpha, beta) {
        if (depth === this.maxDepth) return this.evaluateBoard(board); // Base case

        let maxEval = -Infinity;
        const moves = this.getAllValidMoves(board, 'black');

        for (let move of moves) {
            const original = this.applyMove(board, move);
            const score = this.minimize(board, depth + 1, alpha, beta);
            this.undoMove(board, move, original);
            maxEval = Math.max(maxEval, score);
            alpha = Math.max(alpha, score);
            if (beta <= alpha) break; // Beta cut-off
        }

        return maxEval;
    }

    minimize(board, depth, alpha, beta) {
        if (depth === this.maxDepth) return this.evaluateBoard(board); // Base case

        let minEval = Infinity;
        const moves = this.getAllValidMoves(board, 'white');

        for (let move of moves) {
            const original = this.applyMove(board, move);
            const score = this.maximize(board, depth + 1, alpha, beta);
            this.undoMove(board, move, original);
            minEval = Math.min(minEval, score);
            beta = Math.min(beta, score);
            if (beta <= alpha) break; // Alpha cut-off
        }

        return minEval;
    }

    evaluateBoard(board) {
        let score = 0;
        for (let row of board.board) {
            for (let piece of row) {
                if (piece) {
                    const value = piece.isKing ? 3 : 1; // King is more valuable
                    score += (piece.color === 'black') ? value : -value;
                }
            }
        }
        return score;
    }

    getAllValidMoves(board, color) {
        const moves = [];
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                const piece = board.board[y][x];
                if (piece && piece.color === color) {
                    const directions = this.getDirections(piece);
                    for (let [dy, dx] of directions) {
                        // Calculate the new potential destination square by applying a direction
                        const ny = y + dy;
                        const nx = x + dx;
                        if (this.inBounds(nx, ny) && !board.board[ny][nx]) {
                            moves.push({ from: { x, y }, to: { x: nx, y: ny } });
                        } else if (
                            // If the destination is within bounds and empty, it’s a normal move — store it.
                            this.inBounds(ny + dy, nx + dx) &&
                            board.board[ny] &&
                            board.board[ny][nx] &&
                            board.board[ny][nx].color !== color &&
                            !board.board[ny + dy][nx + dx]
                        ) {
                            moves.push({ from: { x, y }, to: { x: nx + dx, y: ny + dy } });
                            /* If there's an enemy piece at (nx, ny)
                            And if the square beyond it (ny + dy, nx + dx) is empty
                            Then the player can jump over — so we record that as a capture move. */
                        }
                    }
                }
            }
        }
        return moves;
    }

    getDirections(piece) {
        const dirs = [];
        if (piece.color === 'black' || piece.isKing) dirs.push([1, -1], [1, 1]); // Downward diagonals
        if (piece.color === 'white' || piece.isKing) dirs.push([-1, -1], [-1, 1]); // Upward diagonals
        return dirs;
    }

    applyMove(board, move) {
        const piece = board.board[move.from.y][move.from.x];
        const captured = board.board[move.to.y][move.to.x];
        const dx = move.to.x - move.from.x;
        const dy = move.to.y - move.from.y;

        board.movePiece(move.from, move.to);

        let takenPiece = null;
        if (Math.abs(dx) === 2 && Math.abs(dy) === 2) {
            // If it's a capture move
            const midX = (move.from.x + move.to.x) / 2; 
            const midY = (move.from.y + move.to.y) / 2;
            takenPiece = board.board[midY][midX];
            board.board[midY][midX] = null; // Remove the captured piece
        }

        return { captured, takenPiece, midX: (move.from.x + move.to.x) / 2, midY: (move.from.y + move.to.y) / 2 };
    }

    undoMove(board, move, original) {
        const piece = board.board[move.to.y][move.to.x];
        board.board[move.from.y][move.from.x] = piece;
        board.board[move.to.y][move.to.x] = original.captured;
        piece.position = move.from;

        if (original.takenPiece) {
            board.board[original.midY][original.midX] = original.takenPiece;
        }

        if (piece.isKing && !piece.shouldBecomeKing()) {
            piece.isKing = false;
        }
    }

    // Helper: check if coordinates are within board bounds
    inBounds(x, y) {
        return x >= 0 && x < 8 && y >= 0 && y < 8;
    }
}

export default MiniMax;
