/**************************************************************
 * GRAFIK                                                     *
 *************************************************************/
var WebWorkerRunning = false;

function clickFeld(x , y) {
	if (WebWorkerRunning) {return;}
	var input = window.prompt('Neuer Wert (0=leer)?','');
	if (input.length == 1) {
		if (!isNaN(input)) {
			var el = document.getElementById('feld' + x + y);
			console.log(el);
			el = el.firstChild;
			console.log(el);
			el.innerHTML = input;
		}
	}
}

function sudokuBuild(){
	let s = '';
	for (let iy = 0; iy < 9; iy++) {
		for(let ix = 0; ix < 9; ix++) {
			s = s + '<div id="feld' + ix + iy + '" class="col' + ix + ' row' + iy + '" onclick="clickFeld(' + ix + ', ' + iy + ')"><span class="">0</span></div>'
		}
	}
	document.getElementById('sudokugrid').innerHTML = s;
}

function sudokuUpdateField(x, y, n, cls) {
	console.log('==> Update Field x=' + x + ', y=' + y + ' auf n=' + n + ' mit cls=' + cls);
	document.getElementById('feld' + x + y).innerHTML = '<span class="' + cls + '">' + n + '</span>';
}

function solve() {
	var myWorker = new Worker('worker.js');
	myWorker.addEventListener('message', function(o) {
		if (o.data['Cmd'] == 'Update') {
			sudokuUpdateField(o.data['Object']['x'], o.data['Object']['y'], o.data['Object']['n'], 'active');
		} else if (o.data['Cmd'] == 'Vorgabe') {
			sudokuUpdateField(o.data['Object']['x'], o.data['Object']['y'], o.data['Object']['n'], 'vorgabe');
		} else if (o.data['Cmd'] == 'Console') {
			console.log(o.data['Object']);
		} else if (o.data['Cmd'] == 'NotValid') {
			sudokuUpdateField(o.data['Object']['x'], o.data['Object']['y'], o.data['Object']['n'], '');
		} else if (o.data['Cmd'] == 'Valid') {
			sudokuUpdateField(o.data['Object']['x'], o.data['Object']['y'], o.data['Object']['n'], 'done');
		} else if (o.data['Cmd'] == 'Started') {
			WebWorkerRunning = true;
		} else if (o.data['Cmd'] == 'Finished') {
			WebWorkerRunning = false;
		}
	})
}

sudokuBuild();


