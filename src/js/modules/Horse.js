/*
| --------------------------------------------------------------
|
|   Horse Class
|
|   Horse specific piece class.
|
| --------------------------------------------------------------
*/

/*
|   Imports
*/

import Piece from "./Piece.js";

class Horse extends Piece {
    /*
    |
    |   Functions
    |
    */

    /**
     * Constructor function for creating a new chess horse piece object.
     *
     * @param {string} id       The identifier of the chess piece.
     * @param {string} color    The color of the chess piece ("white" or "black").
     * @param {string} cell     The initial cell position of the chess piece on the board.
     */

    constructor(id, color, cell) {
        super(id, color, cell);
        this.img =
            this.color == "black"
                ? "assets/black-horse.png"
                : "assets/white-horse.png";
    }

    getMovements(board) {
        let positions = [];
        let movements = [];
        let matrix = board.board;
        let posX = this.cell[0];
        let posY = this.cell[1];

        positions.push([posX - 2, posY - 1]);
        positions.push([posX - 2, posY + 1]);
        positions.push([posX + 2, posY - 1]);
        positions.push([posX + 2, posY + 1]);
        positions.push([posX - 1, posY - 2]);
        positions.push([posX + 1, posY - 2]);
        positions.push([posX - 1, posY + 2]);
        positions.push([posX + 1, posY + 2]);

        for (let pos = 0; pos < positions.length; pos++) {
            if (this.isValidPosition(positions[pos])) {
                if (
                    this.isThereACollision(
                        matrix,
                        positions[pos][0],
                        positions[pos][1]
                    )[0] === true
                ) {
                    if (
                        this.isThereACollision(
                            matrix,
                            positions[pos][0],
                            positions[pos][1]
                        )[1] != this.color
                    )
                        movements.push(positions[pos]);
                } else movements.push(positions[pos]);
            }
        }

        return movements;
    }
}

export default Horse;
