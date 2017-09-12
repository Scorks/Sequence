package jsonObjects;
/**
 * Class to be returned as a JSON object to client. Used at the beginning 
 * of each turn to get the opponent's move.
 */
public class BoardObject
{
    public boolean opponentWon;
    public boolean opponentEndedGame;
    public int latestPlacedI;
    public int latestPlacedJ;
    public int[][] coords; // coordinates of latest sequence

    public BoardObject(int i, int j, boolean won, boolean ended, int[][] c)
    {
        /* board = b; */
        latestPlacedI = i;
        latestPlacedJ = j;
        opponentWon = won;
        opponentEndedGame = ended;
        coords = c;
    }
}
