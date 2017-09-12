import users.User;
import cards.Card;
import java.util.ArrayList;

/**
 * A representation of a Game instance on the server between two players.
 */
public class BoardGame
{
    private final User player1; //first player
    private final User player2; //second player
    private final int gameSession; //unique game session identifier

    /**
     * The representation of the game board in this game instance. Integers
     * represent where chips are placed on the point. 0 is no chip, 1 is player 1,
     * 2 is plyaer 2, -1 is a locked in player 1 chip, -2 likewise for player 2.
     * 99 represents the free tiles on the corners. 
     */
    private int[][] board; 

   private int[][] coords; // coordinates of the latest completed sequence
    private User playerWithTurn; //player with current turn
    private int winner; //the winner. 0 if none, 1 if player1, 2 if player 2

    // to help with placing tokens on board, so that all of them won't need to
    // be updated after every turn
    private int latestPlacedI;
    private int latestPlacedJ;

    //a card deck for the game instance
    private CardDeck deck;
    private ArrayList<Card> hand1; // player 1's hand
    private ArrayList<Card> hand2; // player 2's hand

    //Unique game session identifier
    private static int sessionID = 1;

    //Create a new BoardGame using two users.
    public BoardGame(User p1, User p2)
    {
        player1 = p1;
        player2 = p2;
        player1.resetSeqs(); //make the user internal seq variable 0
        player2.resetSeqs();
        board = new int[10][10];
        //set corners to 99 since they are free spaces
        board[0][0] = 99; //instantiate board contents
        board[0][9] = 99;
        board[9][0] = 99;
        board[9][9] = 99;
        winner = 0;
        if(sessionID >= Integer.MAX_VALUE)
            sessionID = 1;
        gameSession = sessionID++;
        deck = new CardDeck(); //get a new deck 
        hand1 = new ArrayList<Card>();
        hand2 = new ArrayList<Card>();
        // deal a starting hand for both players
        for(int i = 0; i < 7; i++) {
            hand1.add(deck.drawCard());
            hand2.add(deck.drawCard());
            /* hand1.add(deck.getWildcard()); */ //for quick game debugging
            /* hand2.add(deck.getWildcard()); */
        }

        // no tokens placed yet
        latestPlacedI = -100;
        latestPlacedJ = -100;

        System.out.println("Player with turn: " + player1.toString());

        playerWithTurn = player1; //player 1 starts the turn always

        coords = new int[5][2];
        // initialize with negative values
        for(int i = 0; i < 5; i++)
            for(int j = 0; j < 2; j++)
                coords[i][j] = -666;
    }

    //get the board game's unique ID
    public int getSession()
    {
        return gameSession;
    }

    //add or remove a tile from the board
    public void addRemoveTile(int i, int j, int player)
    {
        if(board[i][j] == 0) { 
            board[i][j] = player;
            latestPlacedI = i;
            latestPlacedJ = j;
        }
        else {//if a tile is already on it 
            board[i][j] = 0;
            latestPlacedI = -1 * i;
            latestPlacedJ = -1 * j;
        }
    }

    // these are not needed anymore. Saving for later maybe 
    /* public void removeCard(int handIndex, int player) */
    /* { */
    /*     if(player == 1) */
    /*         if(handIndex < 7 && handIndex >=0)  */
    /*             hand1.remove(handIndex); */
    /*     else if(player == 2) */
    /*         if(handIndex < 7 && handIndex >= 0) */
    /*             hand2.remove(handIndex); */
    /* } */
    /*  */
    /* public void drawCard(int player) */
    /* { */
    /*     if(player == 1) */
    /*         hand1.add(deck.drawCard()); */
    /*     if(player == 2) */
    /*         hand2.add(deck.drawCard()); */
    /* } */

    //Draws a new card from the deck for the specified player
    public void drawNewCard(int handIndex, int player) {
        Card c = deck.drawCard();
        /* Card c = deck.getWildcard(); */
        if(player == 1) {
            if(handIndex < 7 && handIndex >=0) { 
                hand1.set(handIndex, c);
            }
        }
        else if(player == 2) {
            if(handIndex < 7 && handIndex >= 0) {
                hand2.set(handIndex, c);
            }
        }
    }

    //get the board object with all current tile placements
    public int[][] getBoard()
    { 
        return board; 
    } 

    //determine if a User object belongs to this game instance.
    public boolean hasPlayer(User u)
    {
        String hasName = u.getUserName();
        if(hasName.equals(player1.getUserName()) ||
           hasName.equals(player2.getUserName()))
            return true;
        else
            return false;
    }

    //determine the player with the turn
    public User getPlayerWithTurn()
    {
        return playerWithTurn;
    }

    //Based on a User object get the User's player number
    public int getPlayerNumber(User u) {
        String username = u.getUserName();
        if(username.equals(player1.getUserName()))
            return 1;
        else if(username.equals(player2.getUserName()))
            return 2;
        else
            return 0; // not in game
    }

    //Based on a player number get the User object associated
    public User getPlayerByNumber(int n) {
        if (n==1){ return player1; }
        else if (n==2){ return player2; }
        else{ return player1; }
    }

    //Get a player's hand by player number
    public ArrayList<Card> getHandByNumber(int n) {
        if(n == 1)
            return hand1;
        else if(n == 2)
            return hand2;
        else
            return null;
    }
    
    //get the winner of the game instance
    public int getWinner()
    {
        return winner;
    }

    public int getLatestPlacedI() {
        return latestPlacedI;
    }

    public int getLatestPlacedJ() {
        return latestPlacedJ;
    }

    //switch player with current turn
    public void nextPlayerGetsTurn() {
        if(playerWithTurn.equals(player1))
            playerWithTurn = player2;
        else
            playerWithTurn = player1;
    }

    public int[][] getCoords() {
        return coords;
    }


    /* Check to see if game is over: use checkWinner. 
     * Returns player number 1 or 2, or 0 if no winner. 
     * Calls isSquence
     */
    public int checkWinner(){
        isSequence(); // coordinates of possible new sequence
        if (player1.getSeqs() == 2) {
            winner = 1;
            return 1;
        }
        if (player2.getSeqs() == 2) {
            winner = 2;
            return 2;
        }
        return 0; 
    }

    /**
     * A larger method for traversing across a board instance looking for sequence
     * made for each player.
     */

    // checks for sequences on the board, and saves the coordinates of the
    // newly completed sequence in the instance variable coords
    private void isSequence(){
        int count=0;
        int player=0;

        // look for overlap with an existing sequence
        boolean foundSeq = false;

        // initialize coords to negative values - they will be replaced by
        // positive ones if a new sequence has been completed since the last
        // check
        for(int i = 0; i < 5; i++)
            for(int j = 0; j < 2; j++)
                coords[i][j] = -666;
                
    // check horizontal:
        for (int i=0;i<10;i++){
            for (int j=0;j<10;j++){
            		// check for corners
                if (board[i][j]==99){ count++; }
                // check for matching current player
                else if (board[i][j]==player){ count++; }
                // check for intersect with existing sequence
				else if (board[i][j] < 0) {
					if (board[i][j]==(-1)*player) {
						// if it found the beginning of an existing sequence
						if (!foundSeq) {
                				count++;
                				foundSeq = true;
                			}
                			// if it is not at the beginning of an existing sequence
                			// (can only overlap on token of an existing sequence)
                			else {
                				count=1;
                			}
                		}
                		else {
                			player = (-1)*board[i][j];
                			count = 1;
                			foundSeq = true;
                		}	
				}
				// change to other player (or 0)
                else { player = board[i][j]; count = (j>0 && board[i][j-1]==99) ? 2 : 1; foundSeq=false; }
                if (player>0 && count >=5){ 
                    lockSeq(i, j, 1, player); 
                    count=0;
                }
            }
            count=0; player=0; foundSeq=false;
        }

    // check vertical:
        for (int j=0;j<10;j++){
            for (int i=0;i<10;i++){
            		// check for corners
                if (board[i][j]==99){ count++; }
                //check for matching current player
                else if (board[i][j]==player){ count++; }
                // check for intersect with existing sequence
                else if (board[i][j] < 0) {
					if (board[i][j]==(-1)*player) {
						// if it found the beginning of an existing sequence
						if (!foundSeq) {
                				count++;
                				foundSeq = true;
                			}
                			// if it is not at the beginning of an existing sequence
                			// (can only overlap on token of an existing sequence)
                			else {
                				count=1;
                			}
                		}
                		else {
                			player = (-1)*board[i][j];
                			count = 1;
                			foundSeq = true;
                		}	
				}
				// change to other player (or 0)
                else { player = board[i][j]; count = (i>0 && board[i-1][j]==99) ? 2 : 1; foundSeq=false; }
                if (player>0 && count >=5){ 
                    lockSeq(i, j, 2, player);
                    count=0;
                }
            }
            count=0; player=0; foundSeq=false;
        }

    // check diagonal:
    // top-left to bottom-right:
        for (int j=0;j<10;j++){
            for (int i=0;i<10;i++){
                if (i+j >=10) break;
                // check for corners
                if (board[i][j+i]==99){ count++; }
                //check for matching current player
                else if (board[i][j+i]==player){ count++; }
				// check for intersect with existing sequence
                else if (board[i][j+i] < 0) {
					if (board[i][j+i]==(-1)*player) {
						// if it found the beginning of an existing sequence
						if (!foundSeq) {
                				count++;
                				foundSeq = true;
                			}
                			// if it is not at the beginning of an existing sequence
                			// (can only overlap on token of an existing sequence)
                			else {
                				count=1;
                			}
                		}
                		else {
                			player = (-1)*board[i][j+i];
                			count = 1;
                			foundSeq = true;
                		}	
				}
				// change to other player (or 0)
                else { player = board[i][j+i]; count = (i>0 && j+i>0 && board[i-1][j+i-1]==99) ? 2 : 1; foundSeq=false;}
                if (player>0 && count >=5){ 
                    lockSeq(i, j+i, 3, player); 
                    count=0; 
                }
            }
            count=0; player=0; foundSeq=false;
        }
        for (int i=0;i<10;i++){
            for (int j=0;j<10;j++){
                if (i+j >=10) break;
                // check for corners
                if (board[i+j][j]==99){ count++; }
                //check for matching current player
                else if (board[i+j][j]==player){ count++; }
				// check for intersect with existing sequence
                else if (board[i+j][j] < 0) {
					if (board[i+j][j]==(-1)*player) {
						// if it found the beginning of an existing sequence
						if (!foundSeq) {
                				count++;
                				foundSeq = true;
                			}
                			// if it is not at the beginning of an existing sequence
                			// (can only overlap on token of an existing sequence)
                			else {
                				count=1;
                			}
                		}
                		else {
                			player = (-1)*board[i+j][j];
                			count = 1;
                			foundSeq = true;
                		}	
				}
				// change to other player (or 0)
                else { player = board[i+j][j]; count = (j>0 && j+i>0 && board[i+j-1][j-1]==99) ? 2 : 1; foundSeq=false; }
                if (player>0 && count >=5){ 
                    lockSeq(i+j, j, 3, player); 
                    count=0; 
                }
            }
            count=0; player=0; foundSeq=false;
        }

    //top-right to bottom-left:
        for (int j=0;j<10;j++){
            for (int i=0;i<10;i++){
                if (j-i < 0 ) break;
                // check for corners
                if (board[i][j-i]==99){ count++; }
                //check for matching current player
                else if (board[i][j-i]==player){ count++; }
				// check for intersect with existing sequence
                else if (board[i][j-i] < 0) {
					if (board[i][j-i]==(-1)*player) {
						// if it found the beginning of an existing sequence
						if (!foundSeq) {
                				count++;
                				foundSeq = true;
                			}
                			// if it is not at the beginning of an existing sequence
                			// (can only overlap on token of an existing sequence)
                			else {
                				count=1;
                			}
                		}
                		else {
                			player = (-1)*board[i][j-i];
                			count = 1;
                			foundSeq = true;
                		}	
				}
				// change to other player (or 0)
                else { player = board[i][j-i]; count = (i>0 && j-i<9 && board[i-1][j-i+1]==99) ? 2 : 1; foundSeq=false; }
                if (player>0 && count >=5){ 
                    lockSeq(i, j-i, 4, player); 
                    count=0; 
                }
            }
            count=0; player=0; foundSeq=false;
        }
        for (int i=0;i<10;i++){
            for (int j=9;j>=0;j--){
                if (i+9-j >= 10) break;
                // check for corners
                if (board[i+9-j][j]==99){ count++; }
                //check for matching current player
                else if (board[i+9-j][j]==player){ count++; }
				// check for intersect with existing sequence
                else if (board[i+9-j][j] < 0) {
					if (board[i+9-j][j]==(-1)*player) {
						// if it found the beginning of an existing sequence
						if (!foundSeq) {
                				count++;
                				foundSeq = true;
                			}
                			// if it is not at the beginning of an existing sequence
                			// (can only overlap on token of an existing sequence)
                			else {
                				count=1;
                			}
                		}
                		else {
                			player = (-1)*board[i+9-j][j];
                			count = 1;
                			foundSeq = true;
                		}	
				}
				// change to other player (or 0)
                else { player = board[i+9-j][j]; count = (i-j+9>0 && j>0 && board[i-j+8][j-1]==99) ? 2 : 1; foundSeq=false; }
                if (player>0 && count >=5){ 
                    lockSeq(i+9-j, j, 4, player); 
                    count=0; 
                }
            }
            count=0; player=0; foundSeq=false;
        }
    }

    // marks a sequence on the board and saves the coordinates of the sequence
    // in the coords instance variable
    private void lockSeq(int i, int j, int dir, int player){
        // dir=1: horizontal, dir=2: verical, dir=3: topleft-bottomright diag, dir=4: opp diag.
        int ichg = -1000;
        int jchg = -1000; 
        switch(dir){
            case(1): ichg=0; jchg=-1; break;
            case(2): ichg=-1; jchg=0; break;
            case(3): ichg=-1; jchg=-1; break;
            case(4): ichg=-1; jchg=1; break;
            default:
        }
        for (int x=0;x<5;x++){
            if (board[i+x*ichg][j+x*jchg]!=99){ 
                board[i+x*ichg][j+x*jchg] = player * -1; 
            }
            coords[x][0] = i + x*ichg; // row index (i)
            coords[x][1] = j + x*jchg; // column index (j)
        }

        // increases the sequence count of the player that made a sequence
        switch(player) {
            case(1) : player1.addSeqs(); break;
            case(2) : player2.addSeqs(); break;
            default : break;
        }
    }

}

