package jsonObjects;
/**
 * A class used for JSON transformation to send the current state of a game
 * instance back to the client to repopulate the board. 
 */
public class GameRefresh
{
    public int gameSession; //unique ID
    public int playerID; //the User's player number
    public int[][] board; //all the tiles 
    public boolean hasTurn; //boolean for it is their turn or not

    public GameRefresh(int i, int p, int[][] aa, boolean t)
    {
        playerID = p;
        gameSession = i;
        board = aa;
        hasTurn = t;
    }
}
