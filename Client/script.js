// This holds the data for the starting board. This variable will also hold all of
// the game data when in play.
const board = [
    null, 0, null, 1, null, 2, null, 3,
    4, null, 5, null, 6, null, 7, null,
    null, 8, null, 9, null, 10, null, 11,
    null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null,
    12, null, 13, null, 14, null, 15, null,
    null, 16, null, 17, null, 18, null, 19,
    20, null, 21, null, 22, null, 23, null
]

// Variables which are used by the game. These include storing both player's names,
// the game ID, the game state, the last move and whether the game is still happening.
let playerOneUsername = "";
let playerTwoUsername = "";
let gameID = "";
let gameState = "";
let redPlayer = true;
let lastMove = "-1";
let gameWon = false;
let gameClosed = false;
let turn = true;
let redScore = 12;
let blackScore = 12;
let playerPieces;

// Function used to get the index value of a given piece ID.
let FindPiece = function (pieceID) {
    let parsed = parseInt(pieceID);
    return board.indexOf(parsed);
};

// DOM references.
const cells = document.querySelectorAll("td");
let redsPieces = document.querySelectorAll("p");
let blacksPieces = document.querySelectorAll("span")
const redTurnText = document.querySelectorAll(".red-turn-text");
const blackTurnText = document.querySelectorAll(".black-turn-text");
const divider = document.querySelector("#divider")

// Selected Piece object.
let selectedPiece = {
    pieceID: -1,
    indexOfBoardPiece: -1,
    isKing: false,
    seventhSpace: false,
    ninthSpace: false,
    fourteenthSpace: false,
    eighteenthSpace: false,
    minusSeventhSpace: false,
    minusNinthSpace: false,
    minusFourteenthSpace: false,
    minusEighteenthSpace: false
}

// This fucntion initialises event listeners on the pieces.
function GivePiecesEventListeners() {
    if (turn) {
        for (let i = 0; i < redsPieces.length; i++) {
            redsPieces[i].addEventListener("click", GetPlayerPieces);
        }
    } else {
        for (let i = 0; i < blacksPieces.length; i++) {
            blacksPieces[i].addEventListener("click", GetPlayerPieces);
        }
    }
}

// This function holds the length of the players piece count.
function GetPlayerPieces() {
    if (turn == redPlayer) {
        if (turn) {
            playerPieces = redsPieces;
        } else {
            playerPieces = blacksPieces;
        }
    } else {
        playerPieces = null;
    }
    RemoveCellOnClick();
    ResetBorders();
}

// This function removes possible moves from old selected piece which is needed because the user might re-select a piece.
function RemoveCellOnClick() {
    for (let i = 0; i < cells.length; i++) {
        cells[i].removeAttribute("onclick");
    }
}

// This function resets borders and background images to default.
function ResetBorders() {
    for (let i = 0; i < playerPieces.length; i++) {
        playerPieces[i].style.backgroundImage = '';
    }
    ResetSelectedPieceProperties();
    GetSelectedPiece();
}

// This function resets selected piece properties.
function ResetSelectedPieceProperties() {
    selectedPiece.pieceID = -1;
    selectedPiece.pieceID = -1;
    selectedPiece.isKing = false;
    selectedPiece.seventhSpace = false;
    selectedPiece.ninthSpace = false;
    selectedPiece.fourteenthSpace = false;
    selectedPiece.eighteenthSpace = false;
    selectedPiece.minusSeventhSpace = false;
    selectedPiece.minusNinthSpace = false;
    selectedPiece.minusFourteenthSpace = false;
    selectedPiece.minusEighteenthSpace = false;
}

// gets ID and index of the board cell its on.
function GetSelectedPiece() {
    selectedPiece.pieceID = parseInt(event.target.id);
    selectedPiece.indexOfBoardPiece = FindPiece(selectedPiece.pieceID);
    IsPieceKing();
}

// This function checks if selected piece is a king.
function IsPieceKing() {
    if (document.getElementById(selectedPiece.pieceID).classList.contains("king")) {
        selectedPiece.isKing = true;
    } else {
        selectedPiece.isKing = false;
    }
    GetAvailableSpaces();
}

// This function gets the moves that the selected piece can make.
function GetAvailableSpaces() {
    if (board[selectedPiece.indexOfBoardPiece + 7] === null && 
        cells[selectedPiece.indexOfBoardPiece + 7].classList.contains("noPieceHere") !== true) {
        selectedPiece.seventhSpace = true;
    }
    if (board[selectedPiece.indexOfBoardPiece + 9] === null && 
        cells[selectedPiece.indexOfBoardPiece + 9].classList.contains("noPieceHere") !== true) {
        selectedPiece.ninthSpace = true;
    }
    if (board[selectedPiece.indexOfBoardPiece - 7] === null && 
        cells[selectedPiece.indexOfBoardPiece - 7].classList.contains("noPieceHere") !== true) {
        selectedPiece.minusSeventhSpace = true;
    }
    if (board[selectedPiece.indexOfBoardPiece - 9] === null && 
        cells[selectedPiece.indexOfBoardPiece - 9].classList.contains("noPieceHere") !== true) {
        selectedPiece.minusNinthSpace = true;
    }
    CheckAvailableJumpSpaces();
}

// This function gets the moves that the selected piece can jump.
function CheckAvailableJumpSpaces() {
    if (turn) {
        if (board[selectedPiece.indexOfBoardPiece + 14] === null 
        && cells[selectedPiece.indexOfBoardPiece + 14].classList.contains("noPieceHere") !== true
        && board[selectedPiece.indexOfBoardPiece + 7] >= 12) {
            selectedPiece.fourteenthSpace = true;
        }
        if (board[selectedPiece.indexOfBoardPiece + 18] === null 
        && cells[selectedPiece.indexOfBoardPiece + 18].classList.contains("noPieceHere") !== true
        && board[selectedPiece.indexOfBoardPiece + 9] >= 12) {
            selectedPiece.eighteenthSpace = true;
        }
        if (board[selectedPiece.indexOfBoardPiece - 14] === null 
        && cells[selectedPiece.indexOfBoardPiece - 14].classList.contains("noPieceHere") !== true
        && board[selectedPiece.indexOfBoardPiece - 7] >= 12) {
            selectedPiece.minusFourteenthSpace = true;
        }
        if (board[selectedPiece.indexOfBoardPiece - 18] === null 
        && cells[selectedPiece.indexOfBoardPiece - 18].classList.contains("noPieceHere") !== true
        && board[selectedPiece.indexOfBoardPiece - 9] >= 12) {
            selectedPiece.minusEighteenthSpace = true;
        }
    } else {
        if (board[selectedPiece.indexOfBoardPiece + 14] === null 
        && cells[selectedPiece.indexOfBoardPiece + 14].classList.contains("noPieceHere") !== true
        && board[selectedPiece.indexOfBoardPiece + 7] < 12 && board[selectedPiece.indexOfBoardPiece + 7] !== null) {
            selectedPiece.fourteenthSpace = true;
        }
        if (board[selectedPiece.indexOfBoardPiece + 18] === null 
        && cells[selectedPiece.indexOfBoardPiece + 18].classList.contains("noPieceHere") !== true
        && board[selectedPiece.indexOfBoardPiece + 9] < 12 && board[selectedPiece.indexOfBoardPiece + 9] !== null) {
            selectedPiece.eighteenthSpace = true;
        }
        if (board[selectedPiece.indexOfBoardPiece - 14] === null && cells[selectedPiece.indexOfBoardPiece - 14].classList.contains("noPieceHere") !== true
        && board[selectedPiece.indexOfBoardPiece - 7] < 12 
        && board[selectedPiece.indexOfBoardPiece - 7] !== null) {
            selectedPiece.minusFourteenthSpace = true;
        }
        if (board[selectedPiece.indexOfBoardPiece - 18] === null && cells[selectedPiece.indexOfBoardPiece - 18].classList.contains("noPieceHere") !== true
        && board[selectedPiece.indexOfBoardPiece - 9] < 12
        && board[selectedPiece.indexOfBoardPiece - 9] !== null) {
            selectedPiece.minusEighteenthSpace = true;
        }
    }
    CheckPieceConditions();
}

// This function restricts movement if the piece is a king.
function CheckPieceConditions() {
    if (selectedPiece.isKing) {
        GivePieceBorder();
    } else {
        if (turn) {
            selectedPiece.minusSeventhSpace = false;
            selectedPiece.minusNinthSpace = false;
            selectedPiece.minusFourteenthSpace = false;
            selectedPiece.minusEighteenthSpace = false;
        } else {
            selectedPiece.seventhSpace = false;
            selectedPiece.ninthSpace = false;
            selectedPiece.fourteenthSpace = false;
            selectedPiece.eighteenthSpace = false;
        }
        GivePieceBorder();
    }
}

// This function gives the piece a green highlight for the user (showing its movable).
function GivePieceBorder() {
    if (selectedPiece.seventhSpace || selectedPiece.ninthSpace || selectedPiece.fourteenthSpace || selectedPiece.eighteenthSpace
    || selectedPiece.minusSeventhSpace || selectedPiece.minusNinthSpace || selectedPiece.minusFourteenthSpace || selectedPiece.minusEighteenthSpace) {
        document.getElementById(selectedPiece.pieceID).style.backgroundImage = 'url("SelectedChecker.gif")';
        GiveCellsClick();
    } else {
        return;
    }
}

// This function gives the cells on the board a 'click' bassed on the possible moves.
function GiveCellsClick() {
    if (selectedPiece.seventhSpace) {
        cells[selectedPiece.indexOfBoardPiece + 7].setAttribute("onclick", "MakeMove(7)");
    }
    if (selectedPiece.ninthSpace) {
        cells[selectedPiece.indexOfBoardPiece + 9].setAttribute("onclick", "MakeMove(9)");
    }
    if (selectedPiece.fourteenthSpace) {
        cells[selectedPiece.indexOfBoardPiece + 14].setAttribute("onclick", "MakeMove(14)");
    }
    if (selectedPiece.eighteenthSpace) {
        cells[selectedPiece.indexOfBoardPiece + 18].setAttribute("onclick", "MakeMove(18)");
    }
    if (selectedPiece.minusSeventhSpace) {
        cells[selectedPiece.indexOfBoardPiece - 7].setAttribute("onclick", "MakeMove(-7)");
    }
    if (selectedPiece.minusNinthSpace) {
        cells[selectedPiece.indexOfBoardPiece - 9].setAttribute("onclick", "MakeMove(-9)");
    }
    if (selectedPiece.minusFourteenthSpace) {
        cells[selectedPiece.indexOfBoardPiece - 14].setAttribute("onclick", "MakeMove(-14)");
    }
    if (selectedPiece.minusEighteenthSpace) {
        cells[selectedPiece.indexOfBoardPiece - 18].setAttribute("onclick", "MakeMove(-18)");
    }
}

// This function makes the move selected move.
function MakeMove(number) {

    if (turn == redPlayer) {
        document.getElementById(selectedPiece.pieceID).remove();
        cells[selectedPiece.indexOfBoardPiece].innerHTML = "";
    
        if (turn) {
            if (selectedPiece.isKing) {
                cells[selectedPiece.indexOfBoardPiece + number].innerHTML = `<p class="red-piece king" id="${selectedPiece.pieceID}"></p>`;
                redsPieces = document.querySelectorAll("p");
            } else {
                cells[selectedPiece.indexOfBoardPiece + number].innerHTML = `<p class="red-piece" id="${selectedPiece.pieceID}"></p>`;
                redsPieces = document.querySelectorAll("p");
            }
        } else {
            if (selectedPiece.isKing) {
                cells[selectedPiece.indexOfBoardPiece + number].innerHTML = `<span class="black-piece king" id="${selectedPiece.pieceID}"></span>`;
                blacksPieces = document.querySelectorAll("span");
            } else {
                cells[selectedPiece.indexOfBoardPiece + number].innerHTML = `<span class="black-piece" id="${selectedPiece.pieceID}"></span>`;
                blacksPieces = document.querySelectorAll("span");
            }
        }

        let indexOfPiece = selectedPiece.indexOfBoardPiece
        if (number === 14 || number === -14 || number === 18 || number === -18) {
            ChangeData(indexOfPiece, indexOfPiece + number, indexOfPiece + number / 2, selectedPiece.pieceID);
        } else {
            ChangeData(indexOfPiece, indexOfPiece + number, "undefined", selectedPiece.pieceID);
        }
    }
    
}

// This function changes the board states data on the back end.
function ChangeData(indexOfBoardPiece, modifiedIndex, removePiece, newpieceID) {
    
    board[indexOfBoardPiece] = null;
    board[modifiedIndex] = parseInt(selectedPiece.pieceID);

    lastMove = indexOfBoardPiece + "," + modifiedIndex + "," + removePiece + "," + newpieceID;
    
    if (turn && selectedPiece.pieceID < 12 && modifiedIndex >= 57) {
        document.getElementById(selectedPiece.pieceID).classList.add("king")
    }
    if (turn === false && selectedPiece.pieceID >= 12 && modifiedIndex <= 7) {
        document.getElementById(selectedPiece.pieceID).classList.add("king");
    }
    
    doSend("/mymove?player=" + username + "&id=" + gameID + "&move=" + indexOfBoardPiece + "," + modifiedIndex + "," + removePiece + "," + newpieceID);

    if (removePiece && removePiece != "undefined") {
        board[removePiece] = null;
        if (turn && selectedPiece.pieceID < 12) {
            cells[removePiece].innerHTML = "";
            blackScore--
        }
        if (turn === false && selectedPiece.pieceID >= 12) {
            cells[removePiece].innerHTML = "";
            redScore--
        }
    }

    ResetSelectedPieceProperties();
    RemoveCellOnClick();
    RemoveEventListeners();
}

// This function changes the board states data on the back end.
function NetworkChangeData(indexOfBoardPiece, modifiedIndex, removePiece, newpieceID) {
    board[indexOfBoardPiece] = null;
    board[modifiedIndex] = parseInt(newpieceID);
    
    cells[indexOfBoardPiece].innerHTML = "";

    if (redPlayer == false) {
        cells[modifiedIndex].innerHTML = `<p class="red-piece" id="${newpieceID}"></p>`;
        redsPieces = document.querySelectorAll("p");
    } else {
        cells[modifiedIndex].innerHTML = `<span class="black-piece" id="${newpieceID}"></span>`;
        blacksPieces = document.querySelectorAll("span");
    }

    if (removePiece && removePiece != "undefined") {
        board[removePiece] = null;
        if (turn && newpieceID < 12) {
            cells[removePiece].innerHTML = "";
            blackScore--
        }
        if (turn === false && newpieceID >= 12) {
            cells[removePiece].innerHTML = "";
            redScore--
        }
    }

    ResetSelectedPieceProperties();
    RemoveCellOnClick();
    RemoveEventListeners();
}

// This function removes the 'onClick' event listeners for pieces.
function RemoveEventListeners() {
    if (turn) {
        for (let i = 0; i < redsPieces.length; i++) {
            redsPieces[i].removeEventListener("click", GetPlayerPieces);
        }
    } else {
        for (let i = 0; i < blacksPieces.length; i++) {
            blacksPieces[i].removeEventListener("click", GetPlayerPieces);
        }
    }
    CheckForWin();
}

// This function checks if the player has won, unfortunately it isn't finished.
function CheckForWin() {
    ChangePlayer();
}

// This function switches players turn.
function ChangePlayer() {
    if (turn) {
        turn = false;
        for (let i = 0; i < redTurnText.length; i++) {
            redTurnText[i].style.color = "#eb315a";
            blackTurnText[i].style.color = "#fbff00";
        }
    } else {
        turn = true;
        for (let i = 0; i < blackTurnText.length; i++) {
            redTurnText[i].style.color = "#fbff00";
            blackTurnText[i].style.color = "#4b4b4b";
        }
    }
    GivePiecesEventListeners();
}

// 
var wsUri = "ws://127.0.0.1:8080", websocket = new WebSocket(wsUri);
websocket.onopen = function (e) {
    doSend("/register");
};

// This function is called when the server disconnects from this client.
websocket.onclose = function (e) {
    gameClosed = true;
};

// This function checks the game state every second.
setInterval(function(){ 
    if (username != "" && gameWon == false && gameClosed == false) {
        doSend("/pairme?player=" + username);
        doSend("/theirmove?player=" + username + "&id=" + gameID);
    }
}, 1000);

// This function prints any errors to the console.
websocket.onerror = function (e) {
    console.log(e.data);
};

// This function helps send a message to the server.
function doSend(message) {
    websocket.send(message);
}

// This function receives the encoded message from the server and decides how to process it.
websocket.onmessage = function (e) {
    if (e.data.includes("/register?")) {
        username = e.data.replace("/register?", "");
    }
    if (e.data.includes("/pairme?player=")) {
        var array = e.data.replace("/pairme?player=(", "").replace(")", "").split(", ");
        playerOneUsername = array[0];
        playerTwoUsername = array[1];
        gameID = array[2];
        gameState = array[3];

        if (playerOneUsername == username) {
            redPlayer = true;
            redTurnText[0].textContent = "RED PLAYER: YOU, NAME: " + playerOneUsername;
            blackTurnText[0].textContent = "BLACK PLAYER: THEM, NAME: " + playerTwoUsername;
        } else if (playerTwoUsername == username) {
            redPlayer = false;
            redTurnText[0].textContent = "RED PLAYER: THEM, NAME: " + playerOneUsername;
            blackTurnText[0].textContent = "BLACK PLAYER: YOU, NAME: " + playerTwoUsername;
        }

        if (playerOneUsername != "" && playerTwoUsername != "") {
            GivePiecesEventListeners();
        }
    }
    if (e.data.includes("/lastmove?")) {
        newLastMove = e.data.replace("/lastmove?", "");
        if (newLastMove != lastMove) {
            let newArray = newLastMove.split(",")
            NetworkChangeData(newArray[0], newArray[1], newArray[2], newArray[3]);
        }
        lastMove = newLastMove;
    }
};