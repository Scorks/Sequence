package jsonObjects;

import cards.Card;
import java.util.ArrayList;

/**
 * A class used for a JSON object for getting a player's current Hand of cards.
 */
public class Hand {
    public ArrayList<Card> cards;

    public Hand(ArrayList<Card> c) {
        cards = c;
    }
}

