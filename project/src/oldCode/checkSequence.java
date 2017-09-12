//A test class used during development. No Longer used. 
public class checkSequence{

    public static void main(String[] args){
        int[][] board = { {99, 1, 0, 1, 1, 0, 1, 1, 1, 99}, 
                          { 1, 2,-2,-2, 0,-1, 2, 0, 1, -2},
                          { 1,-2, 1,-2, 0, 2,-1, 1, 1, -2},
                          { 0, 2, 1,-1, 2, 0, 1, 2, 1, -1},
                          { 1, 2, 1,-2, 0, 1, 2, 2, 2, -2},
                          {-2, 0, 0, 0,-2, 0,-2, 1, 2, -2},
                          { 1,-1,-1, 0,-2,-1, 1, 0,-2,  0},
                          { 1, 1, 1, 2, 0, 1, 0,-2, 1, -2},
                          { 0,-2, 0, 1, 0, 2,-1, 2,-2, -1},
                          {99, 1,-2,-2,-2, 1, 0, 2, 1, 99}
        };
        int i = isSequence(board);
        System.out.println(i);
    }

    public static int isSequence(int[][] board){

    // 1: player1, 2: player2, 0: no chip, -1: player1locked, -2: player2locked, 99: wild

        int p1seq=0;
        int p2seq=0;

        int count=0;
        int player=0;

        // look for overlap with an existing sequence
        boolean foundSeq = false;

    // check horizontal:
        for (int i=0;i<10;i++){
            for (int j=0;j<10;j++){
                if (board[i][j]==99){ count++; }
                else if (board[i][j]==player){ count++; }
                else if (board[i][j]==(-1)*player && !foundSeq) {
                		count++;
                		foundSeq = true;
                	}
                	else if (board[i][j]==(-1)*player && foundSeq) {
                		count=1;
                	}
                else {
                		player = board[i][j];
                		foundSeq=false;
                		if (j>0 && board[i][j-1]==99) {count=2;}
                		else{ count=1; }
                	}
                if (player>0 && count >=5){ lockSeq(i, j, 1); count=0;  foundSeq=false; return player; }
            }
            count=0; player=0;  foundSeq=false;
        }

    // check vertical:
        for (int j=0;j<10;j++){
            for (int i=0;i<10;i++){
                if (board[i][j]==99){ count++; }
                else if (board[i][j]==player){ count++; }
                else if (board[i][j]==(-1)*player && !foundSeq) {
                		count++;
                		foundSeq = true;
                	}
                	else if (board[i][j]==(-1)*player && foundSeq) {
                		count=1;
                	}
                else { player = board[i][j];  foundSeq=false; if (i>0 && board[i-1][j]==99){count=2;} else{ count=1; } }
                if (player>0 && count >=5){ lockSeq(i, j, 2); count=0; foundSeq=false; return player; }
            }
            count=0; player=0; foundSeq=false;
        }

    // check diagonal:
    // top-left to bottom-right:
        for (int j=0;j<10;j++){
            for (int i=0;i<10;i++){
                if (i+j >=10) break;
                if (board[i][j+i]==99){ count++; }
                else if (board[i][j+i]==player){ count++; }
                else if (board[i][j+i]==(-1)*player && !foundSeq) {
                		count++;
                		foundSeq = true;
                	}
                	else if (board[i][j+i]==(-1)*player && foundSeq) {
                		count=1;
                	}
                else { player = board[i][j+i]; count=1; foundSeq=false; }
                if (player>0 && count >=5){ lockSeq(i, j+i, 3); count=0; foundSeq=false; return player; }
            }
            count=0; player=0; foundSeq=false;
        }
        for (int i=0;i<10;i++){
            for (int j=0;j<10;j++){
                if (i+j >=10) break;
                if (board[i+j][j]==99){ count++; }
                else if (board[i+j][j]==player){ count++; }
                else if (board[i+j][j]==(-1)*player && !foundSeq) {
                		count++;
                		foundSeq = true;
                	}
                	else if (board[i+j][j]==(-1)*player && foundSeq) {
                		count=1;
                	}
                else { player = board[i+j][j]; count=1; foundSeq=false; }
                if (player>0 && count >=5){ lockSeq(i+j, j, 3); count=0; foundSeq=false; return player; }
            }
            count=0; player=0; foundSeq=false;
        }

    //top-right to bottom-left:
        for (int j=0;j<10;j++){
            for (int i=0;i<10;i++){
                if (j-i <0 ) break;
                int temp = j-i;
                System.out.println("[" + i + "][" + temp + "]: " + board[i][j-i]);
                if (board[i][j-i]==99){ count++; }
                else if (board[i][j-i]==player){ count++; }
                else if (board[i][j-i]==(-1)*player && !foundSeq) {
                		count++;
                		foundSeq = true;
                	}
                	else if (board[i][j-i]==(-1)*player && foundSeq) {
                		count=1;
                	}
                	else { player = board[i][j-i]; count = (i>0 && j-i<9 && board[i-1][j-i+1]==99) ? 2 : 1; foundSeq=false; }
                System.out.println("count: " + count + "\nplayer: " + player);
                if (player>0 && count >=5){ lockSeq(i, j-i, 4); count=0; foundSeq=false; return player; }
            }
            count=0; player=0; foundSeq=false;
        }
        for (int i=0;i<10;i++){
            for (int j=9;j>=0;j--){
                if (i+9-j >= 10) break;
                if (board[i+9-j][j]==99){ count++; }
                else if (board[i+9-j][j]==player){ count++; }
                else if (board[i+9-j][j]==(-1)*player && !foundSeq) {
                		count++;
                		foundSeq = true;
                	}
                	else if (board[i+9-j][j]==(-1)*player && foundSeq) {
                		count=1;
                	}
                else { player = board[i+9-j][j]; count=1; foundSeq=false; }
                if (player>0 && count >=5){ lockSeq(i+9-j, j, 4); count=0; foundSeq=false; return player; }
            }
            count=0; player=0; foundSeq=false;
        }
        return 0;
    }

    private static void lockSeq(int i, int j, int dir){
        // lock in sequence.
/*		switch(dir) {
			case 1 :
				break;
			case 2 :
				break;
			case 3 :
				break;
			case 4 :
				break;
			default :
				break;
		}
*/      
    }
}
