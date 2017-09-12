package jsonObjects;
/**
 * A class used as a JSON object to send information to the client at the end of 
 * each player's turn. Determines if a winner occured, if a sequence occured, 
 * and if the game has ended while the player was making a turn. Possibly by timeout
 * or the opponent ending the game.
 */
public class MoveResponse {
    int winner; // player number
    int[][] coords; // coordinates of a possible new sequence
    boolean gameEnded;

    public MoveResponse(int w, int[][] c, boolean b) {
        winner = w;
        coords = c;
        gameEnded = b;
    }

    public int getWinner() {
        return winner;
    }

    public int[][] getCoords() {
        return coords;
    }
}
