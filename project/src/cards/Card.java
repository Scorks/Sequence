/*
 * Models a standard playing card.
 */

package cards;

public class Card {
    
    public enum Color {
        BLUE(1), GREEN(2), PURPLE(3), RED(4);

        private int value;
        
        private Color(int v) {
            value = v;
        }

        public int getValue() {
            return value;
        }
    }

    // "JACK" == wildcard
    public enum Number {
        KING(13), QUEEN(12), JACK(11), TEN(10), NINE(9), EIGHT(8), SEVEN(7),
            SIX(6), FIVE(5), FOUR(4), THREE(3), TWO(2), ACE(1);

        private int value;
        
        private Number(int v) {
            value = v;
        }

        public int getValue() {
            return value;
        }
    }

    private Color color;
    private Number number;

    public Card(Color s, Number n) {
        color = s;
        number = n;
    }

    public Color getColor() {
        return color;
    }

    public Number getNumber() {
        return number;
    }

    public String toString() {
        return "" + number + " " + color;
    }

}
