// Accordion
function myFunction(id) {
    let x = document.getElementById(id);
    if (x.className.indexOf("w3-show") == -1) {
        x.className += " w3-show";
        x.previousElementSibling.className += " w3-theme-d1";
    } else {
        x.className = x.className.replace("w3-show", "");
        x.previousElementSibling.className =
            x.previousElementSibling.className.replace(" w3-theme-d1", "");
    }
}

$(function () {
    $("#drag").draggable();
    $("#icon1").draggable();
    $("#icon2").draggable();
    $("#icon3").draggable();
    $("#resume").draggable();
    $("#clippy").draggable();
    $("#minesweeper").draggable();
    $('#aboutMe').click(function () {
        $('#drag').toggle('slow', function () {
            // Animation complete.
        });
    });

    $('#icon1').dblclick(function () {
        $('#minesweeper').toggle('slow', function () {
            // Animation complete.
        });
    });

    $('#icon3').dblclick(function () {
        $('#resume').toggle('slow', function () {
            // Animation complete.
        });
    });

    $('#exit1').click(function () {
        $('#resume').toggle('slow', function () {
            // Animation complete.
        });
    });

    $('#exit2').click(function () {
        $('#drag').toggle('slow', function () {
            // Animation complete.
        });
    });
    $('#info').click(function () {
        $('#clippy').fadeIn('fast', function () {
            // Animation complete.
        });
    });
    $('#exit3').click(function () {
        $('#clippy').fadeOut('fast', function () {
            // Animation complete.
        });
    });

    $('#icon2').click(toggleIcon);
});

let iconStatus = 0;

function toggleIcon() {
    if (iconStatus == 0) {
        $('#icon2Img').attr("src", "icons/Empty Recycle Bin.ico");
        iconStatus = 1;
    } else {
        $('#icon2Img').attr("src", "icons/Recycle Bin with paper.ico");
        iconStatus = 0;
    }
}
let components = {
    num_of_rows : 12,
    num_of_cols : 24,
    num_of_bombs : 55,
    bomb : '💣',
    alive : true,
    colors : {1: 'blue', 2: 'green', 3: 'red', 4: 'purple', 5: 'maroon', 6: 'turquoise', 7: 'black', 8: 'grey'}
}

function startGame() {
    components.bombs = placeBombs();
    document.getElementById('field').appendChild(createTable());
}

function placeBombs() {
    let i, rows = [];

    for (i=0; i<components.num_of_bombs; i++) {
        placeSingleBomb(rows);
    }
    return rows;
}

function placeSingleBomb(bombs) {

    let nrow, ncol, row, col;
    nrow = Math.floor(Math.random() * components.num_of_rows);
    ncol = Math.floor(Math.random() * components.num_of_cols);
    row = bombs[nrow];

    if (!row) {
        row = [];
        bombs[nrow] = row;
    }

    col = row[ncol];

    if (!col) {
        row[ncol] = true;
        return
    }
    else {
        placeSingleBomb(bombs);
    }
}

function cellID(i, j) {
    return 'cell-' + i + '-' + j;
}

function createTable() {
    let table, row, td, i, j;
    table = document.createElement('table');

    for (i=0; i<components.num_of_rows; i++) {
        row = document.createElement('tr');
        for (j=0; j<components.num_of_cols; j++) {
            td = document.createElement('td');
            td.id = cellID(i, j);
            row.appendChild(td);
            addCellListeners(td, i, j);
        }
        table.appendChild(row);
    }
    return table;
}

function addCellListeners(td, i, j) {
    td.addEventListener('mousedown', function(event) {
        if (!components.alive) {
            return;
        }
        components.mousewhiches += event.which;
        if (event.which === 3) {
            return;
        }
        if (this.flagged) {
            return;
        }
        this.style.backgroundColor = 'lightGrey';
    });

    td.addEventListener('mouseup', function(event) {

        if (!components.alive) {
            return;
        }

        if (this.clicked && components.mousewhiches == 4) {
            performMassClick(this, i, j);
        }

        components.mousewhiches = 0;

        if (event.which === 3) {

            if (this.clicked) {
                return;
            }
            if (this.flagged) {
                this.flagged = false;
                this.textContent = '';
            } else {
                this.flagged = true;
                this.textContent = components.flag;
            }

            event.preventDefault();
            event.stopPropagation();

            return false;
        }
        else {
            handleCellClick(this, i, j);
        }
    });

    td.oncontextmenu = function() {
        return false;
    };
}

function handleCellClick(cell, i, j) {
    if (!components.alive) {
        return;
    }

    if (cell.flagged) {
        return;
    }

    cell.clicked = true;

    if (components.bombs[i][j]) {
        cell.style.color = 'red';
        cell.textContent = components.bomb;
        gameOver();

    }
    else {
        cell.style.backgroundColor = 'lightGrey';
        num_of_bombs = adjacentBombs(i, j);
        if (num_of_bombs) {
            cell.style.color = components.colors[num_of_bombs];
            cell.textContent = num_of_bombs;
        }
        else {
            clickAdjacentBombs(i, j);
        }
    }
}

function adjacentBombs(row, col) {
    let i, j, num_of_bombs;
    num_of_bombs = 0;

    for (i=-1; i<2; i++) {
        for (j=-1; j<2; j++) {
            if (components.bombs[row + i] && components.bombs[row + i][col + j]) {
                num_of_bombs++;
            }
        }
    }
    return num_of_bombs;
}

function adjacentFlags(row, col) {
    let i, j, num_flags;
    num_flags = 0;

    for (i=-1; i<2; i++) {
        for (j=-1; j<2; j++) {
            cell = document.getElementById(cellID(row + i, col + j));
            if (!!cell && cell.flagged) {
                num_flags++;
            }
        }
    }
    return num_flags;
}

function clickAdjacentBombs(row, col) {
    let i, j, cell;

    for (i=-1; i<2; i++) {
        for (j=-1; j<2; j++) {
            if (i === 0 && j === 0) {
                continue;
            }
            cell = document.getElementById(cellID(row + i, col + j));
            if (!!cell && !cell.clicked && !cell.flagged) {
                handleCellClick(cell, row + i, col + j);
            }
        }
    }
}

function performMassClick(cell, row, col) {
    if (adjacentFlags(row, col) === adjacentBombs(row, col)) {
        clickAdjacentBombs(row, col);
    }
}

function gameOver() {
    components.alive = false;
    document.getElementById('lost').style.display="block";

}

function reload(){
    window.location.reload();
}

window.addEventListener('load', function() {
    document.getElementById('lost').style.display="none";
    startGame();
});
