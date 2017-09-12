import java.sql.SQLException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import java.sql.PreparedStatement;
import users.User;
import java.util.Collection;
import java.util.ArrayList;

/*
* The UserAuthDBManager class from the COMP 3715 class notes, used to manage
* the database for user authentication.
*/

public class UserAuthDBManager {

    // try loading sqlite
    static {
        try {
            Class.forName("org.sqlite.JDBC");
        }
        catch( Exception ex ) {
            System.err.println( ex.getMessage() );
            System.exit( 0 );
        }
    }

    // create the users table, each user name must be unique
    private static String createUserTable = 
        "CREATE TABLE IF NOT EXISTS Users " +
        "(name TEXT UNIQUE PRIMARY KEY, " +
        "pw TEXT, role TEXT, gamesPlayed INTEGER, wins INTEGER, " +
        "losses INTEGER)";

    // find a particular user
    private static String selectByUser = 
        "SELECT * FROM Users WHERE name = ?";
    
    // get all users
    private static String selectAll = 
        "SELECT * FROM Users";

    // add a new user
    private static String insertIntoUser = 
        "INSERT INTO Users (name, pw, role, gamesPlayed, wins, losses) VALUES(?, ?, ?, ?, ?, ?)";

    // change a user's password
    private static String updatePassword = 
        "UPDATE Users set pw=? where name=?";

    // change a user's role
    private static String updateRole = 
        "UPDATE Users set role=? where name=?";

    // change the number of games played
    private static String updateGamesPlayed =
        "UPDATE Users set gamesPlayed=? where name=?";

    // change the number of wins
    private static String updateWins =
        "UPDATE Users set wins=? where name=?";

    // change the number of losses
    private static String updateLosses =
        "UPDATE Users set losses=? where name=?";

    // delete a user
    private static String deleteUser = 
        "DELETE FROM Users where name=?";

    private String dbURL;
    private int timeout;

    public UserAuthDBManager( String dbPath, int timeout ) throws SQLException {
        this.dbURL = "jdbc:sqlite:" + dbPath;
        this.timeout = timeout;
        try (
                Connection conn = DriverManager.getConnection( dbURL );
                PreparedStatement stmt = conn.prepareStatement( createUserTable );
            ) {
            stmt.setQueryTimeout(timeout);
            stmt.executeUpdate();
            }
    }

    public User getUserById( String name ) throws SQLException {
        try (
                Connection conn = DriverManager.getConnection(dbURL);
                PreparedStatement stmt = conn.prepareStatement(selectByUser);
            ) {
            stmt.setQueryTimeout(timeout);
            stmt.setString(1, name);
            ResultSet rs = stmt.executeQuery();
            if ( rs.next() ) {
                String uName = rs.getString("name");
                String pw = rs.getString("pw");
                String role = rs.getString("role");
                int gamesPlayed = Integer.parseInt(rs.getString("gamesPlayed"));
                int wins = Integer.parseInt(rs.getString("wins"));
                int losses = Integer.parseInt(rs.getString("losses"));
                return new User(uName, pw, role, gamesPlayed, wins, losses );
            }
            }
        return null;
    }

    public Collection<User> getAllUsers() throws SQLException {
        try (
                Connection conn = DriverManager.getConnection(dbURL);
                PreparedStatement stmt = conn.prepareStatement(selectAll);
            ) {
                stmt.setQueryTimeout(timeout);
                ResultSet rs = stmt.executeQuery();
                Collection<User> coll = new ArrayList<User>();
                while (rs.next()) {
                    String uName = rs.getString("name");
                    String pw = rs.getString("pw");
                    String role = rs.getString("role");
                    int gamesPlayed = Integer.parseInt(rs.getString("gamesPlayed"));
                    int wins = Integer.parseInt(rs.getString("wins"));
                    int losses = Integer.parseInt(rs.getString("losses"));
                    coll.add(new User(uName, pw, role, gamesPlayed, wins, losses));
                }
                return coll;
            }
    }

    public void addUser(String name, String password, String role)
        throws SQLException
    {
        try (
                Connection conn = DriverManager.getConnection( dbURL );
                PreparedStatement stmt = conn.prepareStatement( insertIntoUser );
            ) {
            stmt.setQueryTimeout(timeout);
            stmt.setString(1, name);
            stmt.setString(2, password);
            stmt.setString(3, role);
            stmt.setString(4, "0");
            stmt.setString(5, "0");
            stmt.setString(6, "0");
            stmt.executeUpdate();
            }
    }

    public void changePassword( String name, String password )
        throws SQLException
    {
        try (
                Connection conn = DriverManager.getConnection( dbURL );
                PreparedStatement stmt = conn.prepareStatement( updatePassword );
            ) {
            stmt.setQueryTimeout(timeout);
            stmt.setString(1, password);
            stmt.setString(2, name);
            stmt.executeUpdate();
            }
    }

    public void changeRole( String name, String role ) throws SQLException {
        try (
                Connection conn = DriverManager.getConnection( dbURL );
                PreparedStatement stmt = conn.prepareStatement( updateRole );
        ) {
            stmt.setQueryTimeout(timeout);
            stmt.setString(1, role);
            stmt.setString(2, name);
            stmt.executeUpdate();
        }
    }

    public void changeGamesPlayed(String name, int gp) throws SQLException {
        try (
            Connection conn = DriverManager.getConnection(dbURL);
            PreparedStatement stmt = conn.prepareStatement(updateGamesPlayed);
        ) {
            stmt.setQueryTimeout(timeout);
            stmt.setString(1, new Integer(gp).toString());
            stmt.setString(2, name);
            stmt.executeUpdate();
        }
    }
    
    public void changeWins(String name, int wins) throws SQLException {
        try (
            Connection conn = DriverManager.getConnection(dbURL);
            PreparedStatement stmt = conn.prepareStatement(updateWins);
        ) {
            stmt.setQueryTimeout(timeout);
            stmt.setString(1, new Integer(wins).toString());
            stmt.setString(2, name);
            stmt.executeUpdate();
        }
    }

    public void changeLosses(String name, int losses) throws SQLException {
        try (
            Connection conn = DriverManager.getConnection(dbURL);
            PreparedStatement stmt = conn.prepareStatement(updateLosses);
        ) {
            stmt.setQueryTimeout(timeout);
            stmt.setString(1, new Integer(losses).toString());
            stmt.setString(2, name);
            stmt.executeUpdate();
        }
    }

    public void deleteUser( String name ) throws SQLException {
        try (
                Connection conn = DriverManager.getConnection( dbURL );
                PreparedStatement stmt = conn.prepareStatement( deleteUser );
        ) {
            stmt.setQueryTimeout(timeout);
            stmt.setString(1, name);
            stmt.executeUpdate();
        }
    }

    /* // a simple test framework */
    /* public static voname main( String[] args ) throws SQLException { */
    /*     UserAuthDB db = new UserAuthDBManager( "u.db", 5 ); */
    /*     User u = db.getUserById("foo"); */
    /*     if ( u == null ) { */
    /*         db.addUser( "foo", "bar", "Foo Bar", "admin" ); */
    /*         u = db.getUserById("foo"); */
    /*     } */
    /*     System.out.println("u = " + u ); */
    /*     db.changePassword( "foo", "FB" ); */
    /*     u = db.getUserById("foo"); */
    /*     System.out.println("u = " + u ); */
    /*     db.changeRole("foo", "user" ); */
    /*     u = db.getUserById("foo"); */
    /*     System.out.println("u = " + u ); */
    /*     db.deleteUser("foo"); */
    /* } */
}
