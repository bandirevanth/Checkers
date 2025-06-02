class CheckerPiece {
    constructor(color, position) {
        this.color = color;
        this.position = position;
        this.isKing = false;
    }

    // Method to move the piece
    move(to) {
        this.position = to;
        if (this.shouldBecomeKing()) {
            this.makeKing();
        }
    }

    // Method to check if the piece should become a king
    shouldBecomeKing() {
        return (this.color === 'white' && this.position.y === 0) ||
            (this.color === 'black' && this.position.y === 7);
    }

    // Method to make the piece a king
    makeKing() {
        this.isKing = true;
    }
}

export default CheckerPiece;