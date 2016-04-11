'use strict';

var agentTypes = 2,
	happinessPercentage = 0.4,
	playing = false,
	timer,
	grid = [];

grid.width = 10;
grid.height = 10;
grid.cellSize = 64;
for (var r = 0; r < grid.height; r++) {
	grid[r] = new Array(grid.width);
}

window.onload = function () {
	document.getElementById('aboutBtn').onclick = function (e) {
		alert('NeighborZ explores prejudice and segregation based on tolerence of those we perceive as different from us.  As tolerance of neighbors who are different decreases, AIs fairly consistently end up clustering into segregated neighborhoods, sometimes even when they are 70% or 80% tolerant.');
	}
	document.getElementById('widthInput').oninput = 
	document.getElementById('heightInput').oninput = function () {
		grid.width = parseInt(document.getElementById('widthInput').value);
		grid.height = parseInt(document.getElementById('heightInput').value);
		resizeGrid();
	};
	document.getElementById('agentTypesInput').oninput = function (e) {
		agentTypes = parseInt(e.target.value);
	};
	document.getElementById('toleranceInput').oninput = function (e) {
		happinessPercentage = 1 - parseFloat(e.target.value);
	};
	document.getElementById('restartBtn').onclick = function () {
		initAgents();
	};
	document.getElementById('checkStatusBtn').onclick = function () {
		checkStatus();
	};
	document.getElementById('runBtn').onclick = function () {
		runStep();
	};
	document.getElementById('playPauseBtn').onclick = function () {
		playing = !playing;
		if (playing) {
			runStep();
		} else {
			clearTimeout(timer);
		}
	};
	
	grid.elem = document.getElementById('gridCanvas');
	resizeGrid();
	initAgents();
}

function resizeGrid() {
	grid.elem.width = grid.cellSize * grid.width + 1;
	grid.elem.height = grid.cellSize * grid.height + 1;
	var ctx = grid.elem.getContext('2d');
	ctx.strokeStyle = 'rgba(0,0,0,0.5)';
	for (var r = 0; r < grid.height; r++) {
		if (typeof grid[r] === 'undefined') {
			grid[r] = new Array(grid.width);
		}
		for (var c = 0; c < grid.width; c++) {
			ctx.strokeRect(
				r * grid.cellSize,
				c * grid.cellSize,
				grid.cellSize,
				grid.cellSize);
		}
		if (typeof grid[r][c] !== 'undefined') {
			grid[r][c].size = grid.cellSize;
		}
	}
}

function initAgents() {
	
	// Delete the old agents.
	for (var r = 0; r < grid.length; r++) {
		for (var c = 0; c < grid[r].length; c++) {
			if (typeof grid[r][c] !== 'undefined') {
				grid[r][c].destroy();
				grid[r][c] = undefined;
			}
		}
	}
	
	// Create a new agents array and populate all but the four corners.
	for (var r = 0; r < grid.height; r++) {
		grid[r] = new Array(grid.width);
		for (var c = 0; c < grid.width; c++) {
			if ((r === 0 && c === 0) ||
					(r === grid.height - 1 && c === 0) ||
					(r === 0 && c === grid.width - 1) ||
					(r === grid.height - 1 && c === grid.width - 1)) {
				continue;
			}
			var type = (r * grid.width + c) % agentTypes;
			grid[r][c] = new Agent(c, r, type);
		}
	}
	
	// Delete twenty more at random.
	for (var i = 0; i < Math.floor(0.3125 * grid.width * grid.height); i++) {
		var r = Math.floor(Math.random() * grid.height),
			c = Math.floor(Math.random() * grid.width);
		if (typeof grid[r][c] !== 'undefined') {
			grid[r][c].destroy();
			grid[r][c] = undefined;
		} else {
			i--;
		}
	}
	// Add five back in at random.
	for (var i = 0; i < Math.floor(0.078125 * grid.width * grid.height); i++) {
		var r = Math.floor(Math.random() * grid.height),
			c = Math.floor(Math.random() * grid.width);
		if (typeof grid[r][c] === 'undefined') {
			grid[r][c] = new Agent(c, r, Math.floor(Math.random() * agentTypes));
		} else {
			i--;
		}
	}
}

function checkStatus() {
	for (var r = 0; r < grid.height; r++) {
		for (var c = 0; c < grid.width; c++) {
			if (typeof grid[r][c] !== 'undefined') {
				grid[r][c].checkHappiness();
			}
		}
	}
}
function runStep() {
	for (var r = 0; r < grid.height; r++) {
		for (var c = 0; c < grid.width; c++) {
			if (typeof grid[r][c] !== 'undefined') {
				grid[r][c].move();
			}
		}
	}
	checkStatus();
	if (playing) {
		timer = console.log(setTimeout(runStep, 500));
	}
}

function dist(x1, y1, x2, y2) {
	return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}
