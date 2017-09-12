package jsonObjects;
/**
 * A JSON object sent from the client at the end of a player's turn to determine
 * where a tile has been placed/removed.
 */
public class TurnPlay
{
    public int sessionID;
    public int i;
    public int j;
    public int handIndex;
    public boolean remove; // true if a remove card was played
}
