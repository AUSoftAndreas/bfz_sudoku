/***************************************************
 * HILFSFUNKTIONEN FÜR DEN WORKER                  *
 **************************************************/
function checkSudoku(x,y) {
    //self.postMessage({'Cmd': 'Console', 'Object': 'checkSudoku für x=' + x + ', y=' + y});
	let zahlenImBlock = ['', false, false, false, false, false, false, false, false, false];
	let zahlenInCol = ['', false, false, false, false, false, false, false, false, false];
	let zahlenInRow = ['', false, false, false, false, false, false, false, false, false];
	// Wir prüfen die Row
	for (let ix = 0; ix < 9; ix++) {
		if (felder[ix][y] > 0) {
			if (zahlenInRow[felder[ix][y]] == true) {return false;} else {zahlenInRow[felder[ix][y]] = true;}
		}
	}
	// Wir prüfen die Col
	for (let iy = 0; iy < 9; iy++) {
		if (felder[x][iy] > 0) {
			if (zahlenInCol[felder[x][iy]] == true) {return false;} else {zahlenInCol[felder[x][iy]] = true;}
		}
	}
	// Wir prüfen den Block
	for (let ix = Math.floor(x/3) * 3; ix < Math.floor(x/3) * 3 + 3; ix++) {
		for (let iy = Math.floor(y/3) * 3; iy < Math.floor(y/3) * 3 + 3; iy++) {
			if (felder[ix][iy] > 0) {
				if (zahlenImBlock[felder[ix][iy]] == true) {return false;} else {zahlenImBlock[felder[ix][iy]] = true;}
			}
		}
	}
	return true;
}

function gotoNext() {
    x = x + 1;
    if (x > 8) {x = 0; y = y + 1;}
    if (vorgaben[x][y] == true) {gotoNext();}
}

function gotoPrev() {
    x = x - 1;
    if (x < 0) {x = 8; y = y - 1;}
    if (vorgaben[x][y] == true) {gotoPrev();}
}

function vorgabe(x, y, n) {
	vorgaben[x][y] = true;
    felder[x][y] = n;
    self.postMessage({'Cmd': 'Vorgabe', 'Object' : {'x' : x, 'y' : y, 'n' : n}});
}


/**********************************************
 * WORKER-THREAD                              *
 *********************************************/
self.postMessage({'Cmd' : 'Started'});
let x = -1, y = 0, felder = []; vorgaben = [];
for (let j = 0; j < 9; j++) {
    felder[j] = [0, 0, 0, 0, 0, 0, 0, 0, 0]; 
    vorgaben[j] = [false, false, false, false, false, false, false, false, false];
}

// PLATZ FÜR VORGABEN

/*
vorgabe(1,0,9);
vorgabe(7,0,1);
vorgabe(0,1,8);
vorgabe(2,1,4);
vorgabe(4,1,2);
vorgabe(6,1,3);
vorgabe(8,1,7);
vorgabe(1,2,6);
vorgabe(3,2,9);
vorgabe(5,2,7);
vorgabe(7,2,2);
vorgabe(2,3,5);
vorgabe(4,3,3);
vorgabe(6,3,1);
vorgabe(1,4,7);
vorgabe(3,4,5);
vorgabe(5,4,1);
vorgabe(7,4,3);
vorgabe(2,5,3);
vorgabe(4,5,9);
vorgabe(6,5,8);
vorgabe(1,6,2);
vorgabe(3,6,8);
vorgabe(5,6,5);
vorgabe(7,6,6);
vorgabe(0,7,1);
vorgabe(2,7,7);
vorgabe(4,7,6);
vorgabe(6,7,4);
vorgabe(8,7,9);
vorgabe(1,8,3);
vorgabe(7,8,8);
*/


/*
vorgabe(0,0,6);
vorgabe(0,4,1);
vorgabe(0,5,9);
vorgabe(0,6,7);
vorgabe(1,6,2);
vorgabe(2,6,3);
vorgabe(2,7,1);
vorgabe(2,8,9);
vorgabe(3,3,4);
vorgabe(3,8,1);
vorgabe(4,0,3);
vorgabe(4,5,2);
vorgabe(4,6,9);
vorgabe(5,4,8);
vorgabe(5,5,5);
vorgabe(5,7,2);
vorgabe(6,0,9);
vorgabe(6,7,6);
vorgabe(6,8,5);
vorgabe(7,2,5);
vorgabe(7,3,3);
vorgabe(7,4,4);
vorgabe(7,5,8);
vorgabe(8,0,8);
vorgabe(8,2,7);
*/


gotoNext();

// WEITER GEHTS
while (y < 9 && x < 9) {
    // Wert für dieses Feld beziehen
    let n = felder[x][y] + 1;
    felder[x][y] = n;
    self.postMessage({'Cmd': 'Update', 'Object' : {'x' : x, 'y' : y, 'n' : n}});
    if (felder[x][y] == 10) {
        // Zu hoch bereits, der vorige Wert ist ungültig
        felder[x][y] = 0; n = 0;
        self.postMessage({'Cmd': 'NotValid', 'Object' : {'x' : x, 'y' : y, 'n' : n}});
        gotoPrev();
    } else if (checkSudoku(x,y)) {
		// Gültigen Wert gefunden, weiter gehts
		// Ggw Feld deaktivieren
		self.postMessage({'Cmd': 'Valid', 'Object' : {'x' : x, 'y' : y, 'n' : n}});
        gotoNext();
    }
}

self.postMessage({'Cmd': 'Finished'});
close();
