/*
| --------------------------------------------------------------
|
|   Board Class
|
|   Class that set up a board game for play chess.
|
| --------------------------------------------------------------
*/

/*
|
|   Imports
|
*/

import { createNode } from "./Nodes.js";

class Board {
    /*
    |
    |   Vars
    |
    */

    #_turn;
    #_allBoardPieces;

    /*
    |
    |   Functions
    |
    */

    /**
     * Constructor for creating a new Board object.
     *
     * @param {Array} board             The initial state of the board.
     * @param {Array} blackPieces       Array of black pieces.
     * @param {Array} whitePieces       Array of white pieces.
     * @throws                          Will throw an error if blackPieces
     *                                  or whitePieces are not arrays.
     * @throws                          Will throw an error if there is
     *                                  an issue with the order of team pieces.
     */

    constructor(board, blackPieces, whitePieces) {
        if (!Array.isArray(blackPieces) || !Array.isArray(whitePieces)) {
            throw new Error("Error on expecting an array as a pieces team");
        }

        if (this.#isOrderPieceErrors(blackPieces, whitePieces)) {
            throw new Error("Error on team pieces order");
        }

        this._board = board;
        this._blackPieces = blackPieces;
        this._whitePieces = whitePieces;
        this.#_allBoardPieces = [...blackPieces, ...whitePieces];
    }

    // Getters and setters

    get board() {
        return this._board;
    }
    set board(b) {
        this._board = b;
    }
    get turn() {
        return this.#_turn;
    }
    set turn(t) {
        this.#_turn = t;
    }
    get blackPieces() {
        return this._blackPieces;
    }
    get whitePieces() {
        return this._whitePieces;
    }

    /**
     * Initializes the game board by placing all pieces on their starting positions.
     *
     * It first cleans the board, sets the turn to 1, and then iterates through all pieces,
     * creating and placing their respective HTML elements on the board.
     */

    createBoard() {
        this.#cleanBoard();
        this.turn = 1;

        for (let i = 0; i < this.#_allBoardPieces.length; i++) {
            const piece = this.#_allBoardPieces[i];
            const node = createNode(
                "img",
                "id=" + piece.id,
                "src=" + piece.img,
                "class=" + piece.color,
                "name=" + piece.isAlive
            );

            this._board.rows[piece.cell[0]].cells[piece.cell[1]].appendChild(
                node
            );
        }
    }

    /**
     * Cleans the game board by removing all pieces from their current positions.
     *
     * This private method redraws the board and then iterates through all cells,
     * removing any child nodes (pieces) they contain.
     */

    #cleanBoard() {
        this.#drawBoard();

        let thisCell, childrens;

        for (let x = 0; x < this.board.rows.length; x++) {
            for (let y = 0; y < this.board.rows[x].cells.length; y++) {
                thisCell = this.board.rows[x].cells[y];

                if (thisCell.hasChildNodes()) {
                    childrens = thisCell.childNodes;

                    for (let node = 0; node < childrens.length; node++)
                        thisCell.removeChild(childrens[node]);
                }
            }
        }
    }

    /**
     * Checks for errors in the order of the pieces in the given arrays.
     *
     * This private method verifies that the first 16 pieces in the blackPieces and whitePieces
     * arrays are correctly labeled with their respective colors.
     *
     * @param {Array} blackPieces   Array of black pieces.
     * @param {Array} whitePieces   Array of white pieces.
     * @returns {boolean}           True if there is an error in the order of pieces, false otherwise.
     */

    #isOrderPieceErrors(blackPieces, whitePieces) {
        let cont = 0;

        while (cont < 16) {
            if (
                blackPieces[cont].color != "black" ||
                whitePieces[cont].color != "white"
            ) {
                return true;
            }

            cont++;
        }
    }

    /**
     * Highlights the possible movements for a selected piece on the board.
     *
     * This method is invoked when a piece is clicked. It first redraws the board and clears
     * any previous attributes. It then finds the piece by its ID and gets its possible movements.
     * These movements are then validated and highlighted on the board. If the piece is in check,
     * only valid movements that resolve the check will be highlighted.
     *
     * @param {string} id   The ID of the piece for which to set the movements.
     */

    setMovements(id) {
        this.#drawBoard();
        this.#cleanAttributes();

        const piece = this.#findPieceByID(id);
        const movements = piece.getMovements(this);

        let pieceCell = this._board.rows[piece.cell[0]].cells[piece.cell[1]];
        pieceCell.style = "box-shadow: inset 0 0 0.7em 0.07em #2f873c;";

        // If the piece has possible movements and isn't nailed
        if (!this.isCheck()[0] && this.#isNailedPiece(piece)) {
            pieceCell.style = "box-shadow: inset 0 0 0.7em 0.07em red;";
        }

        // If has not movements
        else if (movements.length == 0) {
            pieceCell.style = "box-shadow: inset 0 0 0.7em 0.07em red;";
        }

        // If has movements
        else {
            for (let mov = 0; mov < movements.length; mov++) {
                const validity = this.#isValidMovement(piece, movements[mov]);

                if (validity) {
                    let possibleCell =
                        this._board.rows[movements[mov][0]].cells[
                            movements[mov][1]
                        ];
                    possibleCell.setAttribute("class", "enabled-cell");
                    possibleCell.style =
                        "background-color: #5dbb6b; box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.4);";
                }
            }
        }

        let idKing = this.#findPieceByID(id).color === "white" ? "rb" : "rn";
        if (this.isCheck()[0] && id != idKing) this.#checkStyles();
    }

    /**
     * Confirms and executes a movement for a piece on the board.
     *
     * This method redraws the board, highlights the cell where the piece is moved,
     * handles capturing of any piece in the target cell, and increments the turn counter.
     * It also checks if the move results in a check and applies the corresponding styles.
     *
     * @param {HTMLElement} piece           The HTML element representing the piece to move.
     * @param {HTMLElement} clickedCell     The target cell where the piece is moved.
     */

    confirmMovement(piece, clickedCell) {
        this.#drawBoard();
        clickedCell.classList.add("confirmed-movement");

        if (clickedCell.hasChildNodes()) {
            this.eatPiece(clickedCell);
        }

        clickedCell.appendChild(piece);
        this.#cleanAttributes(piece);

        if (this.isCheck()[0]) {
            this.#checkStyles();
        }

        this.turn++;
    }

    /**
     * Captures and removes a piece from the board.
     *
     * This method is called when a piece movements to a cell occupied by an opponent's piece.
     * It marks the captured piece as dead and removes it from the target cell.
     *
     * @param {HTMLElement} thisCell    The cell containing the piece to be captured.
     */

    eatPiece(thisCell) {
        let node = thisCell.childNodes[0];
        let deadPiece = this.#findPieceByID(node.getAttribute("id"));
        deadPiece.isAlive = false;
        node.setAttribute("name", "false");
        thisCell.removeChild(node);
    }

    /**
     * Applies styles to indicate that a king is in check.
     *
     * This private method finds the king that is in check and changes the background color
     * of the cell containing the king to red or a danger color.
     */

    #checkStyles() {
        let king, kingCell;

        king =
            this.isCheck()[1] === "white"
                ? this.#findPieceByID("rb")
                : this.#findPieceByID("rn");
        kingCell = document.getElementById(king.id).parentElement;
        kingCell.style = "background-color: #cf2b1f;";
    }

    /**
     * Cleans specific attributes from the cells on the board.
     *
     * This private method serves as a utility to avoid code repetition. It has two main functions:
     * 1. If no parameters are passed, it removes the "enabled-cell" class from all table cells.
     * 2. If a piece parameter is passed, it also removes the "confirmed-movement" class and updates the cell of the given piece.
     *
     * @param {Object} [piece] Optional parameter representing a piece object.
     */

    #cleanAttributes(piece) {
        let thisCell;

        for (let x = 0; x < this.board.rows.length; x++) {
            for (let y = 0; y < this.board.rows[x].cells.length; y++) {
                thisCell = this.board.rows[x].cells[y];

                if (arguments.length > 0) {
                    if (thisCell.classList.contains("confirmed-movement")) {
                        this.#findPieceByID(piece.id).cell = [x, y];
                        thisCell.classList.remove("confirmed-movement");
                    }
                } else if (thisCell.getAttribute("class") === "enabled-cell")
                    thisCell.removeAttribute("class");
            }
        }
    }

    /**
     * Finds a piece object by its ID.
     *
     * This private method searches for a piece in the array of all board pieces
     * based on its ID.
     *
     * @param {*} id                The ID of the piece to find.
     * @returns {Object|null}       The found Piece object, or null if no piece was found.
     */

    #findPieceByID(id) {
        for (let piece of this.#_allBoardPieces) {
            if (id == piece.id) {
                return piece;
            }
        }

        return null;
    }

    /**
     * Draws the initial board layout with alternating beige and brown cells.
     *
     * This private method styles the cells of the board to create a checkerboard pattern
     * with beige and brown colors.
     */

    #drawBoard() {
        let brownCells = document.querySelectorAll("table tr, table tr td");
        let beigeCells = document.querySelectorAll(
            "tr:nth-child(odd) td:nth-child(even), tr:nth-child(even) td:nth-child(odd)"
        );

        brownCells.forEach(
            (c) => (c.style = "background-color: rgb(77, 62, 43);")
        );
        beigeCells.forEach(
            (c) => (c.style = "background-color: rgb(208, 181, 146);")
        );
    }

    /**
     * Returns the current turn color.
     *
     * This method determines and returns the color ("white" or "black") of the current turn based on the turn count.
     * Odd turns represent "white" and even turns represent "black".
     *
     * @returns {string}    The color of the current turn, either "white" or "black".
     */

    getTurn() {
        return this.turn % 2 !== 0 ? "white" : "black";
    }

    /**
     * Checks if there is a check condition (check) on the board.
     *
     * This method evaluates whether there is a check condition present on the board.
     * If there is no check, it returns an array with "false" at position 0.
     * If there is a check, it returns an array with "true" at position 0,
     * and the color ("white" or "black") of the king in check at position 1.
     *
     * @returns {Array}     An array where response[0] is true|false and response[1] is "white"|"black".
     */

    isCheck() {
        let response = [],
            king,
            pieceMovements;

        response[0] = false;

        for (let piece of this.#_allBoardPieces) {
            if (piece.isAlive == true) {
                king =
                    piece.color === "white"
                        ? this.#findPieceByID("rn")
                        : this.#findPieceByID("rb");
                pieceMovements = piece.getMovements(this);

                for (let mov = 0; mov < pieceMovements.length; mov++) {
                    if (
                        pieceMovements[mov][0] == king.cell[0] &&
                        pieceMovements[mov][1] == king.cell[1]
                    ) {
                        response[0] = true;
                        response.push(king.color);
                    }
                }
            }
        }

        return response;
    }

    /**
     * Checks if there is a checkmate condition on the board.
     *
     * This method evaluates whether there is a checkmate condition present on the board.
     * It returns true if the current player has no secure movements to get out of check, otherwise false.
     *
     * @returns {boolean}   True if there is a checkmate condition, false otherwise.
     */

    isCheckMate() {
        return this.hasSecureMoves()[0] ? true : false;
    }

    /**
     * Checks if there are secure movements available on the board.
     *
     * This method examines whether there are secure movements available for any pieces on the board.
     * It iterates through all pieces of the team with the king in check,
     * checking each piece's movements to determine if they can resolve the check.
     *
     * @returns {Array}     An array where response[0] is true|false, and subsequent elements are
     *                      the IDs of pieces with secure movements.
     */

    hasSecureMoves() {
        let response = [],
            movements = [],
            kingInCheck,
            team;

        response[0] = false;

        kingInCheck =
            this.isCheck()[1] == "black"
                ? this.#findPieceByID("rn")
                : this.#findPieceByID("rb");
        team =
            kingInCheck.color == "black" ? this.blackPieces : this.whitePieces;

        for (let piece of team) {
            if (piece.isAlive == true) {
                movements = piece.getMovements(this);

                for (let mov = 0; mov < movements.length; mov++) {
                    if (this.#isValidMovement(piece, movements[mov])) {
                        response[0] = true;
                        response.push(piece.id);
                    }
                }
            }
        }

        return response;
    }

    /**
     * Checks if a specific movement made by a particular piece results in a safe position,
     * where the piece is not in check, making it a valid and secure movement.
     *
     * @param {*} piece         The piece object making the movement.
     * @param {*} mov           The destination position [row, column] on the board.
     * @returns {boolean}       True if the movement is valid and secure, false otherwise.
     */

    #isValidMovement(piece, mov) {
        let thisCell = this.board.rows[mov[0]].cells[mov[1]];
        let lastCell = piece.cell;
        let validity = false,
            eaten = false;
        let copyFirstNode = document.getElementById(piece.id);
        let copySecondNode = thisCell.childNodes[0];

        // Move the piece to the destination cell in an imaginary board state.
        this.#findPieceByID(piece.id).cell = mov;

        // Check if the destination cell has a piece (capture scenario).
        if (thisCell.hasChildNodes()) {
            this.eatPiece(thisCell);
            eaten = true;
        }

        thisCell.appendChild(copyFirstNode);

        // Check if there is no check, or if there is a check from the opponent's team.
        if (!this.isCheck()[0] || this.isCheck()[1] != piece.color)
            validity = true;

        // Check if there was a previous check on the piece's team, invalidating the movement.
        if (this.isCheck()[0] && this.isCheck()[2] == piece.color)
            validity = false;

        // Restore the board to its original state before the movement.
        this.board.rows[lastCell[0]].cells[lastCell[1]].appendChild(
            copyFirstNode
        );
        this.#findPieceByID(piece.id).cell = lastCell;

        // Restore any captured piece back to the board in the imaginary state.
        if (eaten) {
            thisCell.appendChild(copySecondNode);
            this.#findPieceByID(
                copySecondNode.getAttribute("id")
            ).isAlive = true;
            copySecondNode.setAttribute("name", "true");
        }

        return validity; // Return whether the movement is valid and secure.
    }

    /**
     * Checks if a piece is pinned (nailed) and returns true or false based on whether it can move.
     *
     * @param {*} piece         The piece to check.
     * @returns {boolean}       True if the piece is pinned and cannot move, false otherwise.
     */

    #isNailedPiece(piece) {
        let isNailed = false;
        let movements = piece.getMovements(this);
        let cont = 0;

        if (movements.length > 0) {
            for (let mov = 0; mov < movements.length; mov++) {
                if (!this.#isValidMovement(piece, movements[mov])) cont++;
            }

            isNailed = cont == movements.length ? true : false;
        }

        return isNailed;
    }
}

export default Board;
