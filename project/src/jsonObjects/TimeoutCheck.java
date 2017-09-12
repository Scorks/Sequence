package jsonObjects;
/**
 * Used during development as a JSON object to determine if a game has timed
 * out. Now it is implemented only on the clientside.
 */
public class TimeoutCheck
{
    public boolean timedOut;
    
    public TimeoutCheck(boolean b)
    {
        timedOut = b;
    }

}
