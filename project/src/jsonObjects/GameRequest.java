package jsonObjects;
/**
 * Class used for passing object using Json. 
 * A gameSession < 0 indicates no game is available.
 * 
 * @author Alex Brandt
 * @version 2015.3.14
 */
public class GameRequest
{
    public int gameSession;   
    
    public GameRequest(int gS)
    {
        gameSession = gS;
    }
}
