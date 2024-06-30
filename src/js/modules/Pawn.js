/*
| --------------------------------------------------------------
|
|   Pawn Class
|
|   Pawn specific piece class.
|
| --------------------------------------------------------------
*/

/*
|   Imports
*/

import Piece from "./Piece.js";

class Pawn extends Piece {
    /*
    |
    |   Functions
    |
    */

    /**
     * Constructor function for creating a new chess pawn piece object.
     *
     * @param {string} id       The identifier of the chess piece.
     * @param {string} color    The color of the chess piece ("white" or "black").
     * @param {string} cell     The initial cell position of the chess piece on the board.
     */

    constructor(id, color, cell) {
        super(id, color, cell);
        this.img =
            this.color == "black"
                ? "src/assets/images/black-pawn.png"
                : "src/assets/images/white-pawn.png";
    }

    getMovements(board) {
        let straightLines = [];
        let diagonals = [];
        let movements = [];
        let matrix = board.board;
        let posX = this.cell[0];
        let posY = this.cell[1];
        let mustContinue = true;

        if (this.color === "white") {
            straightLines.unshift([posX - 1, posY]);
            straightLines.push([posX - 2, posY]);
            diagonals.push([posX - 1, posY - 1]);
            diagonals.push([posX - 1, posY + 1]);
        } else {
            straightLines.unshift([posX + 1, posY]);
            straightLines.push([posX + 2, posY]);
            diagonals.push([posX + 1, posY - 1]);
            diagonals.push([posX + 1, posY + 1]);
        }

        let pos = 0;
        while (pos < straightLines.length && mustContinue) {
            if (this.isValidPosition(straightLines[pos])) {
                if (
                    this.isThereACollision(
                        matrix,
                        straightLines[pos][0],
                        straightLines[pos][1]
                    )[0] === false
                ) {
                    if (
                        straightLines[pos][0] == posX - 2 ||
                        straightLines[pos][0] == posX + 2
                    ) {
                        if (this.color === "white" && posX === 6) {
                            movements.push(straightLines[pos]);
                        } else if (this.color === "black" && posX === 1) {
                            movements.push(straightLines[pos]);
                        }
                    } else {
                        movements.push(straightLines[pos]);
                    }
                } else mustContinue = false;
            }

            pos++;
        }

        pos = 0;
        while (pos < diagonals.length) {
            if (this.isValidPosition(diagonals[pos]))
                if (
                    this.isThereACollision(
                        matrix,
                        diagonals[pos][0],
                        diagonals[pos][1]
                    )[0] === true
                )
                    if (
                        this.isThereACollision(
                            matrix,
                            diagonals[pos][0],
                            diagonals[pos][1]
                        )[1] != this.color
                    )
                        movements.push(diagonals[pos]);

            pos++;
        }

        return movements;
    }
}

export default Pawn;
