/*
	@author - Christine Russell 201351079
*/

function genInstruct( c, id ) {
	var body = '';

	switch (c) {
		case 0:
			body += 
				"<h2>What is Sequence?</h2>\n" +
				"<p>Sequence is a board game played with a deck of cards and colored chips, " +
				"one color for each player.</p>\n" +
				"<p>\n" +
				"Players take turns playing a card from their " +
				"hand (face up) and then placing one of their chips onto the matching, " +
				"unoccupied card on the board. Once a chip has been played it cannot be removed, " +
				"except by a wild card (see Wild Cards).</p>\n" +
				"<p>\n" +
				"The goal is to have five of your chips " +
				"connected in a straight line, either horizontally, vertically, or diagonally. " +
				"This is called a Sequence.</p>\n" +
				"<p>\n" +
				"The first player to make two Sequences wins.<p>\n";
			break;
		case 1:
			body += 
				"<h2>How to Play</h2>\n" +
				"<p>There are four suits in the deck - red, green, blue, and purple; each suit " +
				"has 12 cards (A, 2, 3, 4, 5, 6, 7, 8, 9, 10, Q, & K).  There are no Jacks.  " +
				"Each card is in the deck twice and each card is located on the game board twice.</p>\n" +
				"<div id='sample'>\n" +
					"<p style='margin-bottom : 0em;'><i>Sample Cards</i></p>\n" +
					"<img src='cardImg/rK.png' alt='red king' height='150' width='150' align='middle'>\n" +
					"<img src='cardImg/g9.png' alt='green nine' height='150' width='150' align='middle'>\n" +
					"<img src='cardImg/b2.png' alt='blue two' height='150' width='150' align='middle'>\n" +
					"<img src='cardImg/pA.png' alt='purple ace' height='150' width='150' align='middle'>\n" +
				"</div>\n" +
				"<p>Each player is dealt 7 cards at the beginning of the game.  Player 1 starts by " +
				"clicking a tile on the board that corresponds to one of the cards in their  " +
				"hand.  This places one of their tokens on that spot.  The corresponding card is " +
				"automatically discarded from Player 1's hand and replaced with a new card from the " +
				"deck, ending their turn.</p>\n" +
				"<p>The game continues back and forth between both players until one player has made two SEQUENCES</p>\n" +
				"<p>See Wild Cards to learn about how to use wild cards during gameplay</p>\n";
			break;
		case 2:
			body +=
			"<h2>Making a Sequence</h2>\n" +
				"<p>A player makes a SEQUENCE by connecting five of their chips in a straight line " +
				"on the board, either horizontally, vertically, or diagonally.</p>\n" +
				"<p>A player can use one chip from one SEQUENCE to make help make another SEQUENCE.  " +
				"That is, two SEQUENCES can intersect and both use the same chip to make a SEQUENCE.  " +
				"However, a player can not use more than one chip from an existing SEQUENCE to make " +
				"another SEQUENCE.  So a player cannot add an additional chip to the end of one " +
				"SEQUENCE to create a second SEQUENCE using 4 of the chips from the first one.<p>\n" +
				"<p>There are 4 FREE SPACES on the board, one in each of the 4 corners.  No chips " +
				"can be placed here, but any player can use a corner space to make part of their " +
				"SEQUENCE.  Two players can use the same corner spot to make two different SEQUENCES.</p>\n";
			break;
		case 3:
			body += 
				"<h2>Wild Cards</h2>\n" +
				"<table id='cards'>\n" +
					"<tr>\n" +
						"<td style='align:center'>\n" +
							"<figure>\n" +
								"<img src='cardImg/wild.png' alt='wild card' height='150' width='150' align='middle'>\n" +
								"<figcaption>Wild Card</figcaption>\n" +
							"</figure>\n" +
						"</td>\n" +
						"<td>\n" +
							"<figure>\n" +
								"<img src='cardImg/remove.png' alt='remove card' height='150' width='150' align='middle'>\n" +
								"<figcaption>Remove Card</figcaption>\n" +
							"</figure>\n" +
						"</td>\n" +
					"</tr>\n" +
				"</table>\n" +
				"<br>There are 4 WILD cards and 4 REMOVE cards in the deck.\n" +
				"<p>Playing a WILD card allows you to put one of your chips " +
				"on any unoccupied space on the board.</p>\n" +
				"<p>Playing a REMOVE card allows you to remove one of your opponent's chips from " +
				"the board <u><i>unless</i></u> the chip is part of a SEQUENCE. Once a SEQUENCE " +
				"has been made, none of the five chips in the SEQUENCE can be removed.</p>\n" +
				"<p>To play either a WILD or REMOVE card, click on the card in your hand that you " +
				"want to play and then click on the tile on the board where you want to either place " +
				"a tile (if playing a WILD card) or the tile with the opponent's token that you want " +
				"to remove (if playing a REMOVE card).</p>\n" +
				"<p>Playing either wild card completes your turn. You can play either wild card " +
				"during your turn at any point in the game.  Upon playing either wild card, the " +
				"used card will be replaced with a new card from the deck.</p>";
			break;
/*	Dead Cards have not been implemented in the game yet
		case 4:
			body += 
				"<h2>Dead Cards</h2>\n" +
				"<p>If a player has a card in their hand that cannot be played because both " +
				"corresponding spaces are occupied on the board this is what is known as a DEAD card.</p>\n" +
				"<p>This can occur if wild cards have been used to occupy spaces on the board.  " +
				"If a player has a DEAD card in their hand, when it is that player's turn the " +
				"player can discard the card and draw another one before completing their turn.  " +
				"Discarding a DEAD card does not count as a turn.</p>\n" +
				"<p>To remove a DEAD card from your hand, select the card and then click on the dead " +
				"card button.  The DEAD card will be removed from your hand and replaced with a new " +
				"one from the draw pile.</p>\n";
			break;
*/
		default:
			body +=
				"...uh oh...something went wrong...\n\n case = " + c; // This should never happen
			break;
	}

	var elem = document.getElementById( id );
    elem.innerHTML = body;
}




