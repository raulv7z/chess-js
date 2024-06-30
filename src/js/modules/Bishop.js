/*
| --------------------------------------------------------------
|
|   Bishop Class
|
|   Bishop specific piece class.
|
| --------------------------------------------------------------
*/

/*
|   Imports
*/

import Piece from "./Piece.js";

class Bishop extends Piece {
    /*
    |
    |   Functions
    |
    */

    /**
     * Constructor function for creating a new chess bishop piece object.
     *
     * @param {string} id       The identifier of the chess piece.
     * @param {string} color    The color of the chess piece ("white" or "black").
     * @param {string} cell     The initial cell position of the chess piece on the board.
     */

    constructor(id, color, cell) {
        super(id, color, cell);
        this.img =
            this.color == "black"
                ? "assets/black-bishop.png"
                : "assets/white-bishop.png";
    }

    getMovements(board) {
        let movements = [];
        let matrix = board.board;
        let posX = this.cell[0];
        let posY = this.cell[1];
        let mustContinue = true;

        while (posY < 7 && posX > 0 && mustContinue) {
            posY++;
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

        posX = this.cell[0];
        posY = this.cell[1];
        mustContinue = true;

        while (posY > 0 && posX > 0 && mustContinue) {
            posY--;
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

        posX = this.cell[0];
        posY = this.cell[1];
        mustContinue = true;

        while (posY < 7 && posX < 7 && mustContinue) {
            posY++;
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

        posX = this.cell[0];
        posY = this.cell[1];
        mustContinue = true;

        while (posY > 0 && posX < 7 && mustContinue) {
            posY--;
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

export default Bishop;
