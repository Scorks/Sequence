import com.google.gson.Gson;
import com.google.gson.JsonParseException;
import spark.ResponseTransformer;

/**
 * Used by the spark frame work to transform a java object to json object.
 */
public class JsonTransformer implements ResponseTransformer 
{
    private Gson gson = new Gson();

    @Override
    public String render(Object model) 
    {
        return gson.toJson(model);
    }
}
