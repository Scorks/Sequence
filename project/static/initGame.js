// creates the game board HTML + event listeners. gets called when two players
// are matched for a game
function makeBoard() {

    var board = document.getElementById("board");
    board.innerHTML = ""; // clear board first

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

    for(i = 0; i < 10; i++) {
        var tr = document.createElement("tr");
        for(j = 0; j < 10; j++) {
            // set CSS class based on the number and suit of the card
            var td = document.createElement("td");
            td.className = arr[i][j];
            td.setAttribute("id", "" + i + j);
            // add event listeners to board tiles
            td.addEventListener("click", placeToken);
            // add custom property to indicate if this tile has a token that is
            // part of a sequence
            td.inSequence = false;
            tr.appendChild(td);
        }
        board.appendChild(tr);
    }
}

// create a table where the cards in the player's hand are shown. gets called
// when players are matched for a game
function showHand(player) {
    var hand = document.getElementById("hand");
    hand.innerHTML = ""; // clear hand first
    // get the cards in this player's hand from the server with AJAX
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "play/getHand", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function() {
        if ( xhr.readyState != 4) return;
        if ( xhr.status == 200 || xhr.status == 400) {
            // server responds with a Hand object
            var jsonObj = JSON.parse(xhr.responseText);
            var cardsArr = jsonObj.cards;
            var tr = document.createElement("tr");
            // put images of all 7 cards into table
            for(var i = 0; i < 7; i++) {
                var cardObj = cardsArr[i];
                var td = document.createElement("td");
                var cssClass = cardObj.color + "_" + cardObj.number;
                td.className = cssClass;
                td.setAttribute("id", "h" + i);
                if(cardObj.number == "JACK") {
                    if(cardObj.color == "RED" || cardObj.color == "PURPLE") { // wild
                        td.addEventListener("click", playWildCard);
                    }
                    else { // remove
                        td.addEventListener("click", playRemoveCard);
                    }
                }
                tr.appendChild(td);
            }
            // an empty td to separate
            td = document.createElement("td");
            td.className = "separator";
            tr.appendChild(td);
            // put an image of the player's token into table
            td = document.createElement("td");
            td.setAttribute("id", "playerToken");
            if(player == 1)
                td.className = "TT";
            else // player == 2
                td.className = "YT";
            tr.appendChild(td);
            hand.appendChild(tr);
        } else {
            console.log("ERROR in showHand!");
        }
    }
    
    var sessionObj = {sessionID : gameSessionID};
    var session = JSON.stringify(sessionObj);
    xhr.send(session);
}

