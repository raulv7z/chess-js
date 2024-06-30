/*
| --------------------------------------------------------------
|
|   Tower Class
|
|   Tower specific piece class.
|
| --------------------------------------------------------------
*/

/*
|   Imports
*/

import Piece from "./Piece.js";

class Tower extends Piece {
    /*
    |
    |   Functions
    |
    */

    /**
     * Constructor function for creating a new chess tower piece object.
     *
     * @param {string} id       The identifier of the chess piece.
     * @param {string} color    The color of the chess piece ("white" or "black").
     * @param {string} cell     The initial cell position of the chess piece on the board.
     */

    constructor(id, color, cell) {
        super(id, color, cell);
        this.img =
            this.color == "black"
                ? "src/assets/images/black-tower.png"
                : "src/assets/images/white-tower.png";
    }

    getMovements(board) {
        let movements = [];
        let matrix = board.board;
        let posX = this.cell[0];
        let posY = this.cell[1];
        let mustContinue = true;

        // Upward movements
        while (posY > 0 && mustContinue) {
            posY--;

            if (this.isThereACollision(matrix, posX, posY)[0] === true) {
                if (
                    this.isThereACollision(matrix, posX, posY)[1] === this.color
                )
                    mustContinue = false;
                else {
                    movements.push([posX, posY]);
                    mustContinue = false;
                }
            }

            if (mustContinue) movements.push([posX, posY]);
        }

        // Downward movements
        posX = this.cell[0];
        posY = this.cell[1];
        mustContinue = true;

        while (posY < 7 && mustContinue) {
            posY++;

            if (this.isThereACollision(matrix, posX, posY)[0] === true) {
                if (
                    this.isThereACollision(matrix, posX, posY)[1] === this.color
                )
                    mustContinue = false;
                else {
                    movements.push([posX, posY]);
                    mustContinue = false;
                }
            }

            if (mustContinue) movements.push([posX, posY]);
        }

        // Movements to the left
        posX = this.cell[0];
        posY = this.cell[1];
        mustContinue = true;

        while (posX > 0 && mustContinue) {
            posX--;

            if (this.isThereACollision(matrix, posX, posY)[0] === true) {
                if (
                    this.isThereACollision(matrix, posX, posY)[1] === this.color
                )
                    mustContinue = false;
                else {
                    movements.push([posX, posY]);
                    mustContinue = false;
                }
            }

            if (mustContinue) movements.push([posX, posY]);
        }

        // Movements to the right
        posX = this.cell[0];
        posY = this.cell[1];
        mustContinue = true;

        while (posX < 7 && mustContinue) {
            posX++;

            if (this.isThereACollision(matrix, posX, posY)[0] === true) {
                if (
                    this.isThereACollision(matrix, posX, posY)[1] === this.color
                )
                    mustContinue = false;
                else {
                    movements.push([posX, posY]);
                    mustContinue = false;
                }
            }

            if (mustContinue) movements.push([posX, posY]);
        }

        return movements;
    }
}

export default Tower;
