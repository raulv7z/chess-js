/*
| --------------------------------------------------------------
|
|   main.js
|
|   App start point.
|
| --------------------------------------------------------------
*/

/*
|
|   Imports
|
*/

import Board from "./modules/Board.js";
import Pawn from "./modules/Pawn.js";
import Tower from "./modules/Tower.js";
import Bishop from "./modules/Bishop.js";
import Horse from "./modules/Horse.js";
import Queen from "./modules/Queen.js";
import King from "./modules/King.js";

/*
|
|   Vars
|
*/

const CHESS_TITLE_SELECTOR = ".chess-title";
const PLAY_BUTTON_SELECTOR = ".btn-play";
const GAME_DISPLAY_SELECTOR = ".game-display";
const INFO_ELEMENT_SELECTOR = ".game-info";
const BOARD_ELEMENT_SELECTOR = ".game-board";
const TURN_LABEL_SELECTOR = ".game-info-turn-label";
const STATE_LABEL_SELECTOR = ".game-info-state-label";
const WINNER_LABEL_SELECTOR = ".game-info-winner-label";

const chessTitle = document.querySelector(CHESS_TITLE_SELECTOR);
const playButton = document.querySelector(PLAY_BUTTON_SELECTOR);
const gameDisplay = document.querySelector(GAME_DISPLAY_SELECTOR);
const infoElement = document.querySelector(INFO_ELEMENT_SELECTOR);
const boardElement = document.querySelector(BOARD_ELEMENT_SELECTOR);
const turnLabel = document.querySelector(TURN_LABEL_SELECTOR);
const stateLabel = document.querySelector(STATE_LABEL_SELECTOR);
const winnerLabel = document.querySelector(WINNER_LABEL_SELECTOR);

let blackPieces, whitePieces, boardOb;

let clickedPiece,
    clickedCell,
    cellsForMovements,
    currentTeam,
    currentTeamColor,
    firstClick = true;

/*
|
|   Functions
|
*/

const initializeApp = () => {
    playButton.addEventListener("click", handlePlayButtonClick);
};

const handlePlayButtonClick = () => {
    gameDisplay.style.display = "flex";
    chessTitle.style.display = "none";
    playButton.innerText = "RESET";
    turnLabel.innerText = "⚪";         // Must be ⚪ or ⚫
    stateLabel.innerText = "In Game";

    blackPieces = createTeam("black");
    whitePieces = createTeam("white");
    boardOb = new Board(boardElement, blackPieces, whitePieces);

    boardOb.createBoard();
    enablePieces();
};

function enablePieces() {
    currentTeam = [];

    if (boardOb.getTurn() === "white") {
        currentTeamColor = boardOb.board.getElementsByClassName("white");
        turnLabel.innerText = "⚪";
    }
    else {
        currentTeamColor = boardOb.board.getElementsByClassName("black");
        turnLabel.innerText = "⚫";
    }

    if (boardOb.isCheck()[0]) {
        let validPieces = boardOb.hasSecureMoves();

        for (let i = 1; i < validPieces.length; i++)
            currentTeam.push(document.getElementById(validPieces[i]));
    } else {
        for (let p of currentTeamColor)
            if (p.getAttribute("name") == "true") currentTeam.push(p);
    }

    for (let p = 0; p < currentTeam.length; p++) {
        currentTeam[p].addEventListener("click", handlePieceClick);
    }
}

function handlePieceClick() {
    if (!firstClick)
        for (let c = 0; c < cellsForMovements.length; c++)
            cellsForMovements[c].removeEventListener(
                "click",
                handlePieceMovementClick
            );

    clickedPiece = this;

    boardOb.setMovements(clickedPiece.id);
    enableMovements();
}

function enableMovements() {
    cellsForMovements = boardOb.board.getElementsByClassName("enabled-cell");
    firstClick = false;

    for (let c = 0; c < cellsForMovements.length; c++) {
        cellsForMovements[c].addEventListener(
            "click",
            handlePieceMovementClick
        );
    }
}

function handlePieceMovementClick() {
    clickedCell = this;

    for (let c = 0; c < cellsForMovements.length; c++)
        cellsForMovements[c].removeEventListener(
            "click",
            handlePieceMovementClick
        );
    for (let p = 0; p < currentTeamColor.length; p++)
        currentTeamColor[p].removeEventListener("click", handlePieceClick);

    boardOb.confirmMovement(clickedPiece, clickedCell);

    if (boardOb.isCheck()[0]) {
        !boardOb.isCheckMate() ? setEndGame() : enablePieces();
    } else enablePieces();
}

function setEndGame() {
    let color = boardOb.isCheck()[1] === "white" ? "black" : "white";
    console.log(`${color} team wins.`);
}

function createTeam(color) {
    const pieceDefinitions = {
        black: [
            { type: "Tower", id: "tn1", position: [0, 0] },
            { type: "Horse", id: "cn1", position: [0, 1] },
            { type: "Bishop", id: "an1", position: [0, 2] },
            { type: "King", id: "rn", position: [0, 4] },
            { type: "Queen", id: "dn", position: [0, 3] },
            { type: "Bishop", id: "an2", position: [0, 5] },
            { type: "Horse", id: "cn2", position: [0, 6] },
            { type: "Tower", id: "tn2", position: [0, 7] },
            { type: "Pawn", id: "pn1", position: [1, 0] },
            { type: "Pawn", id: "pn2", position: [1, 1] },
            { type: "Pawn", id: "pn3", position: [1, 2] },
            { type: "Pawn", id: "pn4", position: [1, 3] },
            { type: "Pawn", id: "pn5", position: [1, 4] },
            { type: "Pawn", id: "pn6", position: [1, 5] },
            { type: "Pawn", id: "pn7", position: [1, 6] },
            { type: "Pawn", id: "pn8", position: [1, 7] },
        ],
        white: [
            { type: "Tower", id: "tb1", position: [7, 0] },
            { type: "Horse", id: "cb1", position: [7, 1] },
            { type: "Bishop", id: "ab1", position: [7, 2] },
            { type: "King", id: "rb", position: [7, 4] },
            { type: "Queen", id: "db", position: [7, 3] },
            { type: "Bishop", id: "ab2", position: [7, 5] },
            { type: "Horse", id: "cb2", position: [7, 6] },
            { type: "Tower", id: "tb2", position: [7, 7] },
            { type: "Pawn", id: "pb1", position: [6, 0] },
            { type: "Pawn", id: "pb2", position: [6, 1] },
            { type: "Pawn", id: "pb3", position: [6, 2] },
            { type: "Pawn", id: "pb4", position: [6, 3] },
            { type: "Pawn", id: "pb5", position: [6, 4] },
            { type: "Pawn", id: "pb6", position: [6, 5] },
            { type: "Pawn", id: "pb7", position: [6, 6] },
            { type: "Pawn", id: "pb8", position: [6, 7] },
        ],
    };

    if (!pieceDefinitions[color]) {
        throw new Error("Not a valid color");
    }

    const team = pieceDefinitions[color].map((pieceDef) => {
        return createPiece(
            pieceDef.type,
            pieceDef.id,
            color,
            pieceDef.position
        );
    });

    return team;
}

function createPiece(type, id, color, position) {
    switch (type) {
        case "Tower":
            return new Tower(id, color, position);
        case "Horse":
            return new Horse(id, color, position);
        case "Bishop":
            return new Bishop(id, color, position);
        case "King":
            return new King(id, color, position);
        case "Queen":
            return new Queen(id, color, position);
        case "Pawn":
            return new Pawn(id, color, position);
        default:
            throw new Error("Not a valid piece");
    }
}

/*
|   DOMContentLoaded initialization call.
*/

document.addEventListener("DOMContentLoaded", initializeApp);
