// initialize event listeners
function init() {
    document.getElementById("playNewGame").addEventListener("click", getNewGame);
    document.getElementById("endGame").addEventListener("click", endGame);
    document.getElementById("endGame").disabled = true;
}

// return img element to be added to table cell when token is placed on board
function getTokenImg(thisPlayer) {
    var playerToken = document.getElementById("playerToken");
    var token = document.createElement("img");
    if(thisPlayer) {
        if(playerToken.className == "YT") {
            token.setAttribute("src", "cardImg/YT_transparent.png");
        } else { // className == "TT"
            token.setAttribute("src", "cardImg/TT_transparent.png");
        }
    } else {
        if(playerToken.className == "YT") {
            token.setAttribute("src", "cardImg/TT_transparent.png");
        } else { // className == "TT"
            token.setAttribute("src", "cardImg/YT_transparent.png");
        }
    }
    token.className = "tokenImg";
    // add event listener for remove
    token.addEventListener("click", removeToken);
    return token;
}

// the "glass pane" is shown when we are waiting on an opponent
function insertGlassPane() {
    var overlay = document.getElementById("overlay");
    var content = document.getElementById("overlayContent");
    content.innerHTML = "Waiting for opponent...";
    overlay.style.setProperty("z-index", "10000");
    overlay.style.setProperty("display", "table");
}

function removeGlassPane() {
    var overlay = document.getElementById("overlay");
    var content = document.getElementById("overlayContent");
    content.innerHTML = "";
    overlay.style.setProperty("z-index", "0");
    overlay.style.setProperty("display", "none");
}

// insert a different glass pane when the game has ended
function insertEndPane() {
    var ol = document.getElementById("overlay");
    var content = document.getElementById("overlayContent");
    content.innerHTML = "Game Over!";
    ol.style.setProperty("z-index", "10000");
    ol.style.setProperty("display", "table");
}

// inserts playerID given as an argument to the div element beside the board
// that shows the player number 
function showPlayerNumber(playerID) {
    var playerNoBox = document.getElementById("playerNo");
    playerNoBox.innerHTML = "Player " + playerID;
}

// sets the disabled status of the specified button
// buttonID: playNewGame or endGame
// status: 1 = enabled, 0 = disabled 
function setButton(buttonID, status) {
    var button = document.getElementById(buttonID);
    if(button != null) {
        if(status == 1)
            button.disabled = false;
        else if(status == 0)
            button.disabled = true;
    }
}

var gameSessionID = -1;
var playerID = -1;
var hasTurn = false;
var firstTurn = true;
var board = null;

// gets called when player clicks on the "play new game" button
function getNewGame(evt) {
    insertGlassPane(); // show "waiting for opponent" until opponent is matched
    // disable "new game" button
    setButton("playNewGame");
    // reset last card played indicators
    var card = document.getElementById("latestCard");
    var cardText = document.getElementById("lcText");
    card.className = "";
    cardText.innerHTML = "";
    evt.preventDefault();

    // make an AJAX request
    var xhr = new XMLHttpRequest();
    xhr.open('GET', "/play/newGame", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function() {
        if ( xhr.readyState != 4) return;
        if ( xhr.status == 200 || xhr.status == 400) 
        {
            // server responds with a GameRequest object 
            var jsonObj = JSON.parse(xhr.responseText);
            if(jsonObj.gameSession == -404)
            {
                alert("You are already in a game!");
                makeBoard();

                // show board again if the player was already in a game but
                // navigated away from the page. check if player is in a game
                // with another AJAX request
                xhr.open('GET', "play/gameRefresh", true);
                xhr.onreadystatechange = function() {
                    if( xhr.readyState != 4) return;
                    if( xhr.status == 200 || xhr.status == 400)
                    {
                        // server responds with a GameRefresh object
                        var jsonObj = JSON.parse(xhr.responseText);
                        if(jsonObj.gameSession > 0) //we have a game
                        {
                            gameSessionID = jsonObj.gameSession;
                            playerID = jsonObj.playerID; //get player id
                            board = jsonObj.board;
                            // restore board, hand, and player number
                            makeBoard();
                            showHand(playerID); 
                            showPlayerNumber(playerID);
                            // disable new game button
                            setButton("playNewGame", 0);
                            if(jsonObj.hasTurn == true) { // my turn
                                hasTurn = true;
                                removeGlassPane();
                                // enable "end game" button
                                setButton("endGame", 1);
                            } else { // other player's turn
                                hasTurn = false;
                                // disable "end game" button
                                setButton("endGame", 0);
                            }
                            window.setTimeout(refreshBoard, 500);
                        }
                        else setTimeout(waitForGame, 1000);
                    }
                    else
                    {
                        console.log("ERROR in gameRefresh AJAX request!");
                    }
                }
                xhr.send(null);
                return;
            }
            if(jsonObj.gameSession == -405)
            {
                alert("You are already waiting to be matched with a player!");
                insertGlassPane();
                waitForGame();
                return;
            }
            if(jsonObj.gameSession < 0) waitForGame();
            else
            {
                gameSessionID = jsonObj.gameSession;
                makeBoard();
                playerID = 2; // second player will be player #2  
                showHand(2); 
                waitForTurn();
                // disable both buttons
                setButton("playNewGame", 0);
                setButton("endGame", 0);
                showPlayerNumber(playerID);
                // var playerNoBox = document.getElementById("playerNo");
                // playerNoBox.innerHTML = "Player " + playerID;
                insertGlassPane();
            }
        }
        else 
        {
            console.log("ERROR in newGame AJAX request!");
        }
    }
    xhr.send(null);
}

// gets called when the player refreshes the page (as a result of navigating
// away from it earlier) while they're still in a game. restores the status of
// the game board.
function refreshBoard()
{
    var oppID = 0;
    if(playerID == 1)
       oppID = 2;
    else
        oppID = 1;
    for(var i = 0; i < 10; i++)
    {
        for(var j = 0; j < 10; j++)
        {
            var id = "";
            id += i;
            id += j;
            var square = document.getElementById(id);
            if(board[i][j] != 0)
            {
                if(board[i][j] == playerID && !square.firstChild)
                {
                    square.appendChild(getTokenImg(true));
                }
                else if(board[i][j] == -playerID && !square.firstChild)
                {
                    square.appendChild(getTokenImg(true));
                    square.inSequence = true; 
                }
                else if(board[i][j] == oppID && !square.firstChild)
                {
                    square.appendChild(getTokenImg(false));
                }
                else if(board[i][j] == -oppID && !square.firstChild)
                {
                    square.appendChild(getTokenImg(false));
                    square.inSequence = true; 
                }
            }
        }
    }
    waitForTurn();
}

var waitCounter = 0;
var waitTimeout = 300; // number of seconds after which waiting times out
// gets called from getNewGame when no other players are waiting yet
function waitForGame()
{
    // make an AJAX request to announce that we are waiting for an opponent
    var xhr = new XMLHttpRequest();
    xhr.open('GET', "play/hasOpponent", true);
    insertGlassPane();
    xhr.onreadystatechange = function() {
        if( xhr.readyState != 4) return;
        if( xhr.status == 200 || xhr.status == 400)
        {
            // server responds with a GameRequest object 
            var jsonObj = JSON.parse(xhr.responseText);
            if(jsonObj.gameSession > 0) //we have a game
            {
                waitCounter = 0; // reset counter
                gameSessionID = jsonObj.gameSession;
                makeBoard();
                playerID = 1; // first player will be player #1
                showHand(1); 
                playTurn();
                showPlayerNumber(playerID);
                // enable end game button
                setButton("endGame", 1);
                // disable new game button
                setButton("playNewGame", 0);
                removeGlassPane();
            }
            else {
                if(waitCounter < waitTimeout) {
                    waitCounter++;
                    setTimeout(waitForGame, 1000);   
                }
                else { 
                    // we have waited for waitTimeout seconds and no opponent
                    // has been found
                    var xhrCancel = new XMLHttpRequest();
                    xhrCancel.open("POST", "play/cancelNewGame", true);
                    xhrCancel.onreadystatechange = function() {
                        if(xhrCancel.readyState != 4) return;
                        if(xhrCancel.status == 200 || xhrCancel.status == 400) {
                            waitCounter = 0; // reset counter
                            // server responds with "OK" or "ERROR"
                            if(xhrCancel.responseText == "OK") {
                                alert("No opponents were found! Please try again later.");
                                removeGlassPane();
                                // re-enable new game button
                                setButton("playNewGame", 1);
                            } else {
                                console.log("ERROR 1 in cancelNewGame!");
                            }
                        } else { // cancelling game request failed
                            waitCounter = 0; // reset counter
                            console.log("ERROR 2 in cancelNewGame!");
                        }
                    }
                    xhrCancel.send(null);
                }
            }
        }
        else
        {
            console.log("ERROR in waitForGame!");
        }
    }//statechange function
    xhr.send(null);
}

// is called once per second while the player is waiting for the other player's
// turn to end 
var counter = 0;
function waitForTurn() {
    insertGlassPane();
    // remove text about this player's turn
    var turnBox = document.getElementById("turn");
    turnBox.innerHTML = "&nbsp;";
    insertGlassPane();
    hasTurn = false;
    // check with an AJAX request if it's my turn now
    var xhr = new XMLHttpRequest();
    xhr.open('POST', "play/isMyTurn", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function() {
        if(xhr.readyState != 4) return;
        if(xhr.status == 200 || xhr.status == 400) {
            // server responds with a TurnRequest object
            var jsonObj = JSON.parse(xhr.responseText);
            if(jsonObj.isTurn == true) {
                removeGlassPane();
                counter = 0;
                playTurn(); // other player has finished their turn
                firstTurn = false;
            }
            else if(counter > 9000) // number of seconds until timeout 
            {
                setTimeout(timeout, 3000);
            }
            else
            {
                setTimeout(waitForTurn, 1000); // not my turn yet
                counter++;
            }
        } else {
            console.log("ERROR in waitForTurn!");
        }
    }

    var objToSend = { sessionID : gameSessionID };
    var session = JSON.stringify(objToSend);
    xhr.send(session);
}

// manually end game without using timeout().
function endGame() {
    // make an AJAX request to end game
    var xhr = new XMLHttpRequest();
    xhr.open('POST', "/play/endGame", true);
    xhr.setRequestHeader("Content-Type", "text/plain");
    xhr.onreadystatechange = function() 
    {
        if(xhr.readyState != 4) return;
        if(xhr.status == 200 || xhr.status == 400) 
        {
            // server responds with an empty string if ending game succeeded
            // show "game over" pane
            insertEndPane();
            // enable starting new game
            setButton("playNewGame", 1);
            // disable end game button
            setButton("endGame", 0);
        } 
        else 
        {
            console.log("ERROR in endGame!");
        }
    }
    var objToSend = { sessionID : gameSessionID };
    var session = JSON.stringify(objToSend);
    xhr.send(session);

}

// gets called when the game times out
function timeout() 
{
    // make an AJAX request to time out
    var xhr = new XMLHttpRequest();
    xhr.open('POST', "/play/timeout", true);
    xhr.setRequestHeader("Content-Type", "text/plain");
    xhr.onreadystatechange = function() 
    {
        if(xhr.readyState != 4) return;
        if(xhr.status == 200 || xhr.status == 400) 
        {
            // server responds with an empty string if ending game succeeded
            alert("Your game has timed out!");
            // enable starting new game
            setButton("playNewGame", 1);
        } 
        else 
        {
            console.log("ERROR in timeout!");
        }
    }
    var objToSend = { sessionID : gameSessionID };
    var session = JSON.stringify(objToSend);
    xhr.send(session);

}

// gets called at the start of a player's turn
function playTurn() {
    // enable manually ending game during player's turn
    setButton("endGame", 1);
    // insert text about this player's turn
    var turnBox = document.getElementById("turn");
    turnBox.innerHTML = "It's your turn.";

    // manually create array of where each card is on the board
    var arr = [
        ["C", "GREEN_ACE", "GREEN_KING", "GREEN_QUEEN", "GREEN_TEN", "GREEN_NINE", "GREEN_EIGHT", "GREEN_SEVEN", "GREEN_SIX", "C"],
        ["BLUE_ACE", "PURPLE_SEVEN", "PURPLE_EIGHT", "PURPLE_NINE", "PURPLE_TEN", "PURPLE_QUEEN", "PURPLE_KING", "PURPLE_ACE", "GREEN_FIVE", "PURPLE_TWO"],
        ["BLUE_KING", "PURPLE_SIX", "GREEN_TEN", "GREEN_NINE", "GREEN_EIGHT", "GREEN_SEVEN", "GREEN_SIX", "BLUE_TWO", "GREEN_FOUR", "PURPLE_THREE"],
        ["BLUE_QUEEN", "PURPLE_FIVE", "GREEN_QUEEN", "RED_EIGHT", "RED_SEVEN", "RED_SIX", "GREEN_FIVE", "BLUE_THREE", "GREEN_THREE", "PURPLE_FOUR"],
        ["BLUE_TEN", "PURPLE_FOUR", "GREEN_KING", "RED_NINE", "RED_TWO", "RED_FIVE", "GREEN_FOUR", "BLUE_FOUR", "GREEN_TWO", "PURPLE_FIVE"],
        ["BLUE_NINE", "PURPLE_THREE", "GREEN_ACE", "RED_TEN", "RED_THREE", "RED_FOUR", "GREEN_THREE", "BLUE_FIVE", "RED_ACE", "PURPLE_SIX"],
        ["BLUE_EIGHT", "PURPLE_TWO", "BLUE_ACE", "RED_QUEEN", "RED_KING", "RED_ACE", "GREEN_TWO", "BLUE_SIX", "RED_KING", "PURPLE_SEVEN"],
        ["BLUE_SEVEN", "RED_TWO", "BLUE_KING", "BLUE_QUEEN", "BLUE_TEN", "BLUE_NINE", "BLUE_EIGHT", "BLUE_SEVEN", "RED_QUEEN", "PURPLE_EIGHT"],
        ["BLUE_SIX", "RED_THREE", "RED_FOUR", "RED_FIVE", "RED_SIX", "RED_SEVEN", "RED_EIGHT", "RED_NINE", "RED_TEN", "PURPLE_NINE"],
        ["C", "BLUE_FIVE", "BLUE_FOUR", "BLUE_THREE", "BLUE_TWO", "PURPLE_ACE", "PURPLE_KING", "PURPLE_QUEEN", "PURPLE_TEN", "C"]];

    hasTurn = true;
    // make an AJAX request to get previous move
    var xhr = new XMLHttpRequest();
    xhr.open('POST', "play/getBoardChange", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    var cardText = document.getElementById("lcText");
    xhr.onreadystatechange = function() {
        if(xhr.readyState != 4) return;
        if(xhr.status == 200 || xhr.status == 400) 
        {
            // server responds with a BoardObject object 
            var jsonObj = JSON.parse(xhr.responseText);
            var i = jsonObj.latestPlacedI;
            var j = jsonObj.latestPlacedJ;
			if (!firstTurn) { cardText.innerHTML = "Last card played:"; }
            var card = document.getElementById("latestCard");
            var opponentSequencesBox = document.getElementById("opponentSequences");
            opponentSequencesBox.innerHTML = "";
            if(i > -100 && j > -100) {
                if(i >= 0 && j >= 0) {
                    card.className = arr[i][j];
                    var tile = document.getElementById("" + i + j);
                    // update board with other player's token
                    if(!tile.firstChild) tile.appendChild(getTokenImg(false));
                    // mark tiles to be part of a sequence if needed
                    if(jsonObj.coords[0][0] >= 0) {
                        for(var tileIdx = 0; tileIdx < 5; tileIdx++) {
                            var iCoord = jsonObj.coords[tileIdx][0]; // sorry Apple 
                            var jCoord = jsonObj.coords[tileIdx][1];
                            var seqTile = document.getElementById("" + iCoord + jCoord);
                            seqTile.inSequence = true; 
                            opponentSequencesBox.innerHTML = "Opponent made a Sequence!"; 
                        }
                    }
                } else {
                    // remove this player's token (other player used remove
                    // card)
                    i *= -1;
                    j *= -1;
                    cardText.innerHTML = "REMOVE card played.<br>Chip removed from:";
                    card.className = arr[i][j];
                    var tile = document.getElementById("" + i  + j);
                    // the token is the tile's only child node
                    tile.removeChild(tile.firstChild);  
                }
            }
            if(jsonObj.opponentEndedGame) { // opponent clicked on "end game"
                alert("Your opponent ended the game!");
                // show "game over" pane
                insertEndPane();
                // enable starting new game
                setButton("playNewGame", 1);
                setButton("endGame", 0);
            }
            else if(jsonObj.opponentWon) {
                alert("Sorry, you lost!");
                // show "game over" pane
                insertEndPane();
                // enable starting new game
                setButton("playNewGame", 1);
                setButton("endGame", 0);
            }
        } 
        else 
        {
            console.log("ERROR in playTurn!");
        }
    }
    var objToSend = { sessionID : gameSessionID };
    var session = JSON.stringify(objToSend);
    xhr.send(session);

}

// event listener for wildcards
var wildcardPlayed = false;
function playWildCard(evt) {
    var card = evt.target;
    if(card != null) { 
        if(card.chosen != true) { // set as chosen
            card.style.border = "2px solid red";
            // custom property to mark the card as chosen
            card.chosen = true;
            wildcardPlayed = true;
        } else { // set as unchosen
            card.style.border = "2px solid transparent";
            card.chosen = false;
            wildcardPlayed = false;
        }
    }
}

// event listener for remove cards
var removecardPlayed = false;
function playRemoveCard(evt) {
    var card = evt.target;
    if(card != null) {
        if(card.chosen != true) { // set as chosen
            card.style.border = "2px solid red";
            // custom property to mark the card as chosen
            card.chosen = true;
            removecardPlayed = true;
        } else { // set as unchosen
            card.style.border = "2px solid transparent";
            card.chosen = false;
            removecardPlayed = false;
        }
    }
}

// gets called when player attempts to remove the chosen token with
// their remove card
function removeToken(evt) {
    if(removecardPlayed) { // only do something if remove card was chosen

        var token = evt.target;
        var tile = evt.target.parentNode;
        var ii = tile.id.charAt(0);
        var jj  = tile.id.charAt(1);

        var i = 0;
        // find index of the remove card that was chosen
        for(i; i < 7; i++) {
            var card = document.getElementById("h" + i);
            if(card.chosen == true) {
                break;
            }
        }

        // remove card was found in hand, the tile had a token, and that token
        // was not already part of a sequence
        if(i < 7 && hasTurn && !tile.inSequence) { 
            // send move to server as an AJAX request
            var xhrMove = new XMLHttpRequest();
            xhrMove.open('POST', "play/endTurn", true);
            xhrMove.setRequestHeader("Content-Type", "application/json");
            xhrMove.onreadystatechange = function() {
                if(xhrMove.readyState != 4) return;
                if(xhrMove.status == 200 || xhrMove.status == 400) 
                {
                    // replace the card that was just played with a new card
                    replaceCard(i); 
                    // server responds with a MoveResponse object 
                    var jsonObjMove = JSON.parse(xhrMove.responseText);
                    if(jsonObjMove.gameEnded) //game has ended
                    {
                        alert("The game has timed out.");
                        setButton("playNewGame", 1);
                        return;
                    }
                    // remove token node
                    tile.removeChild(token); 
                    // disable end game button
                    setButton("endGame", 0);
                    // pass turn to other player and wait for next turn
                    waitForTurn(); 
                } 
                else 
                {
                    console.log("ERROR in removeToken!");
                }
            }
            // send object to server to end turn
            var objToSendMove = { sessionID : gameSessionID, i : ii, j : jj, handIndex : i, remove : removecardPlayed }; 
            var sessionMove = JSON.stringify(objToSendMove);
            xhrMove.send(sessionMove);

            // reset remove card variable
            removecardPlayed = false;
        }
    }
}

// gets called when player clicks on a tile, that is, attempts to place their
// token onto the tile. tileID is the value of the id attribute of the
// corresponding td element.
function placeToken(evt) {
    var tile = evt.target;
    var ii = tile.id.charAt(0);
    var jj  = tile.id.charAt(1);
    var hasToken = false;
    // corner tiles always have all tokens
    if(tile.className == "C")
        hasToken = true;

    // check if tile already has a token
    if(tile.childNodes.length > 0)
        hasToken = true; 

    var i = 0;
    // check if player has corresponding card, or find index of the wildcard 
    // that was chosen
    for(i; i < 7; i++) {
        var card = document.getElementById("h" + i);
        if(wildcardPlayed && card.chosen == true) {
            break;
        }
        if(card.className == tile.className) { // player has card
            break;
        }
    }

    // player had the corresponding card or a wildcard was played, continue processing turn
    if(i < 7 && !hasToken && hasTurn) { 
        // send move to server as an AJAX request
        var xhrMove = new XMLHttpRequest();
        xhrMove.open('POST', "play/endTurn", true);
        xhrMove.setRequestHeader("Content-Type", "application/json");
        xhrMove.onreadystatechange = function() {
            if(xhrMove.readyState != 4) return;
            if(xhrMove.status == 200 || xhrMove.status == 400) 
            {
                // replace the card that was just played with a new card
                replaceCard(i); 
                // server responds with a MoveResponse object 
                var jsonObjMove = JSON.parse(xhrMove.responseText);
                if(jsonObjMove.gameEnded) //game has ended
                {
                    alert("The game has timed out!");
                    setButton("playNewGame", 1);
                    insertEndPane();
                    return;
                }
                var mySequencesBox = document.getElementById("mySequences");
                mySequencesBox.innerHTML = "";
                // if any of the values in jsonObjMove.coords is negative,
                // the move didn't result in a sequence
                if(jsonObjMove.coords[0][0] >= 0) {
                    // mark tiles in the new sequence
                    for(var tileIdx = 0; tileIdx < 5; tileIdx++) {
                        var iCoord = jsonObjMove.coords[tileIdx][0]; // sorry Apple 
                        var jCoord = jsonObjMove.coords[tileIdx][1];
                        var seqTile = document.getElementById("" + iCoord + jCoord);
                        seqTile.inSequence = true; 
                        mySequencesBox.innerHTML = "You made a Sequence!";
                        // animate sequence for player
                        // don't animate corner tiles
                        if(!((iCoord == 0 && jCoord == 0) || (iCoord == 0 && jCoord == 9) || (iCoord == 9 && jCoord == 0) || (iCoord == 9 && jCoord == 9))) {
                            var seqToken = seqTile.firstChild;
                            seqToken.classList.remove("seqAnimation");
                            // the next line enables restarting the animation
                            // for some strange reason
                            seqToken.offsetWidth = seqToken.offsetWidth;
                            seqToken.classList.add("seqAnimation");
                        }
                    }
                }
                if(jsonObjMove.winner == playerID) {
                    alert("CONGRATULATIONS! You won!");
                    // insert "game over" pane
                    insertEndPane();
                    // enable starting new game
                    setButton("playNewGame", 1);
                    setButton("endGame", 0);
                } else {
                    // disable end game button
                    setButton("endGame", 0);
                    // pass turn to other player and wait for next turn
                    waitForTurn(); 
                }
            } 
            else 
            {
                console.log("ERROR in placeToken!");
            }
        }
        // send object to server to end turn
        var objToSendMove = { sessionID : gameSessionID, i : ii, j : jj, handIndex : i, remove : removecardPlayed }; 
        var sessionMove = JSON.stringify(objToSendMove);
        xhrMove.send(sessionMove);

        // place token on player's own board
        var token = tile.appendChild(getTokenImg(true));

        // reset wildcard variable
        wildcardPlayed = false;
    }
}

// replaces the image of the card that was just played with the new card dealt
// by the server
function replaceCard(handIndex) {
    // send index of the card to be replaced as an AJAX object
    var xhrCard = new XMLHttpRequest();
    var cardToReplace = document.getElementById("h" + handIndex);
    xhrCard.open("POST", "play/getHand", true);
    xhrCard.setRequestHeader("Content-Type", "application/json");
    xhrCard.onreadystatechange = function() {
        if(xhrCard.readyState != 4) return;
        if(xhrCard.status == 200 || xhrCard.status == 400) {
            // server responds with a Hand object 
            //Game has ended, there is no new card
            if(JSON.parse(xhrCard.responseText) == null) return; 
            // replace card at index handIndex in player's hand with the newly drawn
            // card, which is at the same index in the cards[] array
            var jsonObjCard = JSON.parse(xhrCard.responseText).cards[handIndex];
            var newCSSClass = jsonObjCard.color + "_" + jsonObjCard.number;
            cardToReplace.className = newCSSClass;
            // reset border to transparent
            cardToReplace.style.border = "2px solid transparent";
            // reset as unchosen
            cardToReplace.chosen = false;
            // remove previous event listeners
            cardToReplace.removeEventListener("click", playWildCard);
            cardToReplace.removeEventListener("click", playRemoveCard);
            // if the card is a wildcard or remove card, add event listener
            if(jsonObjCard.number == "JACK") {
                if(jsonObjCard.color == "RED" || jsonObjCard.color == "PURPLE") { // wild
                    cardToReplace.addEventListener("click", playWildCard);
                }
                else { // remove
                    cardToReplace.addEventListener("click", playRemoveCard);
                }
            }
        }
    }
    var objToSendCard = { sessionID : gameSessionID };
    var sessionCard = JSON.stringify(objToSendCard);
    xhrCard.send(sessionCard);
}

