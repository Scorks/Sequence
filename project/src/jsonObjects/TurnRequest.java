package jsonObjects;
/**
 * A JSON object sent to the client to determine if it is that player's turn
 * yet. 
 */
public class TurnRequest
{
    public boolean isTurn;
    
    public TurnRequest(boolean b)
    {
        isTurn = b;
    }
}
