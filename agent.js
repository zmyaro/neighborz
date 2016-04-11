'use strict';

function Agent(x, y, type) {
	this.elem = document.createElement('div');
	this.elem.agent = this;
	this.elem.className = 'agent';
	this._x = x || 0;
	this._y = y || 0;
	this.moveTo(this._x, this._y);
	this.type = type;
	this.size = grid.cellSize;
	document.body.appendChild(this.elem);
}

Agent.TYPE_COLORS = [
	'orange',
	'blue',
	'magenta',
	'yellow'
];
Agent.HAPPY_COLOR = 'lime';
Agent.UNHAPPY_COLOR = 'red';

Agent.prototype = {
	destroy: function () {
		this.elem.parentElement.removeChild(this.elem);
	},
	
	get type() {
		return this._type;
	},
	get x() {
		return this._x;
	},
	get y() {
		return this._y;
	},
	set size(val) {
		this.elem.style.width = val + 'px';
		this.elem.style.height = val + 'px';
	},
	set type(val) {
		this.elem.style.backgroundColor = Agent.TYPE_COLORS[val];
		this._type = val;
	},
	set x(val) {
		this.elem.style.transform = 'translate(' + (val * grid.cellSize) + 'px,' + (this._y * grid.cellSize) + 'px) scale(0.9)';
		this._x = val;
	},
	set y(val) {
		this.elem.style.transform = 'translate(' + (this._x * grid.cellSize) + 'px,' + (val * grid.cellSize) + 'px) scale(0.9)';
		this._y = val;
	},
	
	checkHappiness: function () {
		if (this.checkHappinessAt(this.x, this.y)) {
			this.elem.style.borderColor = Agent.HAPPY_COLOR;
			return true;
		} else {
			this.elem.style.borderColor = Agent.UNHAPPY_COLOR;
			return false;
		}
	},
	checkHappinessAt: function (x, y) {
		var neighborSpaces = 0,
			similarNeighbors = 0;
		for (var r = Math.max(0, y - 1); r <= Math.min(grid.height - 1, y + 1); r++) {
			for (var c = Math.max(0, x - 1); c <= Math.min(grid.width - 1, x + 1); c++) {
				if (typeof grid[r][c] !== 'undefined' && !(r === y && c === x)) {
					neighborSpaces++;
					if (grid[r][c].type === this.type) {
						similarNeighbors++;
					}
				}
			}
		}
		if (similarNeighbors / neighborSpaces >= happinessPercentage) {
			return true;
		} else {
			return false;
		}
	},
	
	getFreeSquares: function () {
		var freeSquares = [];
		for (var r = 0; r < grid.height; r++) {
			for (var c = 0; c < grid.width; c++) {
				if (typeof grid[r][c] === 'undefined') {
					freeSquares.push({
						x: c,
						y: r
					});
				}
			}
		}
		return freeSquares;
	},
	
	getOptimalSquare: function (squares) {
		var optimalSquare,
			optimalSquareDist = Number.MAX_VALUE;
		for (var i = 0; i < squares.length; i++) {
			if (this.checkHappinessAt(squares[i].x, squares[i].y)) {
				var newDist = dist(this.x, this.y, squares[i].x, squares[i].y);
				if (newDist < optimalSquareDist) {
					optimalSquareDist = newDist;
					optimalSquare = squares[i];
				}
			}
		}
		return optimalSquare;
	},
	
	move: function () {
		// Do not move if already happy.
		if (this.checkHappiness()) {
			return;
		}
		// Look for a place to move.
		var freeSquares = this.getFreeSquares(),
			optimalSquare = this.getOptimalSquare(freeSquares);
		// Move if one is found.
		if (optimalSquare) {
			this.moveTo(optimalSquare.x, optimalSquare.y);
			return;
		}
		var i = Math.floor(Math.random() * freeSquares.length);
		this.moveTo(freeSquares[i].x, freeSquares[i].y);
	},
	
	moveTo: function (x, y) {
		if (typeof grid[y][x] !== 'undefined' && grid[y][x] !== this) {
			console.error('Tried to move to filled space.');
		}
		grid[this._y][this._x] = undefined;
		grid[y][x] = this;
		if (x >= 0 && x < grid.width) {
			this.x = x;
		}
		if (y >= 0 && y < grid.height) {
			this.y = y;
		}
	}
};