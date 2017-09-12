
// initialize event listeners
function init() {
    var userName = document.getElementById("userName");
    var gamesPlayed = document.getElementById("gamesPlayed");
    var wins = document.getElementById("wins");
    var losses = document.getElementById("losses");

    userName.addEventListener("click", sortByUser);
    gamesPlayed.addEventListener("click", sortByGamesPlayed);
    wins.addEventListener("click", sortByWins);
    losses.addEventListener("click", sortByLosses);

    // default: sort by name
    sortByUser();
}

var userAsc = 1;
var gamesPlayedAsc = 1;
var winsAsc = 1;
var lossesAsc = 1;

function sortByUser(evt) {
    var tbody = document.getElementById("leaderboard"); 
    sort(tbody, 0, userAsc);
    userAsc *= -1;
}

function sortByGamesPlayed(evt) {
    var tbody = document.getElementById("leaderboard"); 
    sort(tbody, 1, gamesPlayedAsc);
    gamesPlayedAsc *= -1;
}

function sortByWins(evt) {
    var tbody = document.getElementById("leaderboard"); 
    sort(tbody, 2, winsAsc);
    winsAsc *= -1;
}

function sortByLosses(evt) {
    var tbody = document.getElementById("leaderboard"); 
    sort(tbody, 3, lossesAsc);
    lossesAsc *= -1;
}

// sorts the table contents based on column and the asc parameter
// tbody: tbody DOM object
// column: column number [0,3]
// asc: 1 if sort is ascending, -1 if descending
function sort(tbody, column, asc) {
    var rows = tbody.rows;
    var arr = new Array();

    // create array from tbody contents - skip row 1, which is the headers
    for(var i = 1; i < rows.length; i++) {
        cells = rows[i].cells;
        arr[i - 1] = new Array();
        for(var j = 0; j < cells.length; j++) {
            arr[i - 1][j] = cells[j].innerHTML;
        }
    }

    // sort array by column number
    arr.sort(function(a, b) {
        if(column == 0)
            return asc * a[column].localeCompare(b[column]);
        if(a[column] == b[column])
            return 0;
        else if(a[column] > b[column]) {
            return asc;
        }
        else { // a[column] < b[column]
            return -1 * asc;
        }
    });
    
    // replace tbody contents with sorted array contents
    for(var i = 1; i < rows.length; i++) {
        cells = rows[i].cells;
        for(var j = 0; j < cells.length; j++) {
            cells[j].innerHTML = arr[i - 1][j];
        }
    }
}
