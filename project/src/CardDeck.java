import java.util.ArrayList;
import cards.Card;
import cards.Card.Color;
import cards.Card.Number;
import java.util.Random;

/*
* Models a deck of cards for the game, which consists of two standard 52-card
* decks without jokers. Jacks are actually "wildcards" in this game.
*/
public class CardDeck {
    private ArrayList<Card> cards;
    private Random r;

    // make a card deck with the required number of each card
    public CardDeck() {
        cards = new ArrayList<Card>(); 
        // add two of each card to deck
        for(Color s : Color.values()) {
            for(Number n : Number.values()) {
                cards.add(new Card(s, n));
                cards.add(new Card(s, n));
            }
        }
        r = new Random(System.currentTimeMillis());
    }

    // randomly draws a card from the deck
    public Card drawCard() {
        return cards.remove(r.nextInt(cards.size()));
    }

    //used for quick game playing during debugging
    public Card getWildcard() {
        return new Card(Color.RED, Number.JACK);
    }

}
