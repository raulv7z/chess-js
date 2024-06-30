/*
| --------------------------------------------------------------
|
|   Piece Class
|
|   A generic piece class used for inheritance.
|
| --------------------------------------------------------------
*/

class Piece {
    /*
    |
    |   Vars
    |
    */

    #_id;
    #_isAlive;
    #_cell;
    #_color;
    #_img;

    /*
    |
    |   Functions
    |
    */

    /**
     * Constructor function for creating a new chess piece object.
     *
     * @param {string} id       The identifier of the chess piece.
     * @param {string} color    The color of the chess piece ("white" or "black").
     * @param {string} cell     The initial cell position of the chess piece on the board.
     */

    constructor(id, color, cell) {
        this.#_id = id;
        this.#_color = color;
        this.#_cell = cell;
        this.#_isAlive = true;
    }

    // Getters and setters
    
    get id() {
        return this.#_id;
    }
    get cell() {
        return this.#_cell;
    }
    get isAlive() {
        return this.#_isAlive;
    }
    get color() {
        return this.#_color;
    }
    get img() {
        return this.#_img;
    }

    set cell(cel) {
        this.#_cell = cel;
    }
    set isAlive(isAlive) {
        this.#_isAlive = isAlive;
    }
    set img(i) {
        this.#_img = i;
    }

    /**
     * Returns the possible movements of a chess piece on the board.
     *
     * @param {Array} board     The chessboard.
     * @returns {Array}         An array containing all possible movements (coordinates) of the piece.
     */

    getMovements(board) {}

    /**
     * Checks if there is a collision with another piece.
     *
     * @param {*} matrix    The game matrix representing the board.
     * @param {*} posX      The X-coordinate of the piece to check.
     * @param {*} posY      The Y-coordinate of the piece to check.
     * @returns             An array where:
     *          - array[0] is true if a collision exists, false otherwise.
     *          - array[1] is the color ("white" or "black") of the colliding piece if a collision exists.
     */

    isThereACollision(matrix, posX, posY) {
        let response = [];
        response[0] = true;

        if (matrix.rows[posX].cells[posY].hasChildNodes()) {
            matrix.rows[posX].cells[posY].children[0].getAttribute("class") ===
            "white"
                ? response.push("white")
                : response.push("black");
        } else response[0] = false;

        return response;
    }

    /**
     * Checks if a given position is valid on the chessboard, considering board boundaries.
     *
     * @param {Array} pos   The position to validate, represented as [row, column].
     * @returns {boolean}   True if the position is valid within the board boundaries, false otherwise.
     */

    isValidPosition(pos) {
        return pos[0] < 0 || pos[0] > 7 || pos[1] < 0 || pos[1] > 7
            ? false
            : true;
    }
}

export default Piece;
