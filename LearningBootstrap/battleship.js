class GuessBoard {
	static UNKNOWN = 0; 
	static HIT = 1;
	static MISS = 2;
	constructor() {
		this.board = [];
		for (let i = 0; i < MAX_ROWS; i++) {
			let row = [];
			for (let j = 0; j < MAX_COLS; j++) {
				row.push(GuessBoard.UNKNOWN);
			}
			this.board.push(row);
		}
	}
}

class Ship {
	static ORIENTATION_HORIZONTAL = 0;
	static ORIENTATION_VERTICAL = 1;
	static SHIP_NAMES = ["aircraft_carrier", "battleship", "destroyer", "patrol", "submarine"];
	constructor(size, isSubmarine=false) {
		this.size = size;
		this.placed = false;
		this.isSubmarine = isSubmarine;
		this.orientation = Ship.ORIENTATION_HORIZONTAL;
		this.name = !this.isSubmarine ? Ship.SHIP_NAMES[5 - size] : Ship.SHIP_NAMES[4];
		this.img = document.createElement('img');
		this.img.classList.add("mx-3", "border", "border-dark", "bg-light", "bg-opacity-50", "rounded-pill");
		this.img.src = this.src;
		this.img.height = SQ_SIZE;
		this.img.width = SQ_SIZE * this.size;
		this.img.addEventListener('click', () => {
			player.selectShip(this);
		});
		this.placedImg = document.createElement('img');
		this.placedImg.src = this.src;
		this.placedImg.height = SQ_SIZE;
		this.placedImg.width = SQ_SIZE * this.size;
		this.placedImg.classList.add("resizable_img", "overlay-image", "border", "border-success");

		this.placedImg.addEventListener('click', () => {
			this.unplaceShip();
			event.stopPropagation(); //prevent the ship from being placed until next click.
		}); 
		RESIZABLE_IMAGES.push(this.img);
		RESIZABLE_IMAGES.push(this.placedImg);
	}


	//returns the correct img file based on orientation
	get src() {
		return "/Images/" + this.name + (this.orientation === Ship.ORIENTATION_VERTICAL ? "-v" : "") + ".png";
	}

	get displayName() {
		return (this.orientation === Ship.ORIENTATION_HORIZONTAL ? "" : "rotated ") + this.name.replace("_", " ").toLocaleUpperCase();
	}

	turnShip() {
		if (gameStarted || this.placed)
			return;

		this.orientation += 1;
		this.orientation %= 2;
		this.placedImg.src = this.src;
		let temp = this.placedImg.width;
		this.placedImg.width = this.placedImg.height;
		this.placedImg.height = temp;
		instructions.innerHTML = "Selected: " + this.displayName + ". <br>Click on the grid to place the ship " +
			"or rotate the ship by pressing the rotate button or pressing 'r' on the keyboard.";
	}

	placeShip(gridItem, startingPosition) {
		if (gameStarted)
			return;
		this.coords = [];
		let r = startingPosition[0];
		let c = startingPosition[1];
		for (let i = 0; i < this.size; i++) {
			//check coords in bound
			if (c < 0 || c >= MAX_COLS || r < 0 || r >= MAX_ROWS) {
				instructions.innerHTML = "<mark>Ship goes out of bounds. Try again.</mark> " +
				"Selected: " + this.displayName + ". <br>Click on the grid to place the ship " +
				"or rotate the ship by pressing the rotate button or pressing 'r' on the keyboard."; 
				throw new Error("Ship goes out of bounds.");
			}
			this.coords.push([r, c]);
			this.orientation === Ship.ORIENTATION_HORIZONTAL ? c++ : r++;	
		}
		//mark ship as placed in list
		let i = player.shipsToPlace.findIndex(ship => ship === this);
		player.shipsPlaced.push(player.shipsToPlace.splice(i, 1)[0]);
		this.placed = true;

		//draw ship on grid
		gridItem.classList.add('overlay-container');
		gridItem.appendChild(this.placedImg);
	}

	unplaceShip() {
		if (gameStarted)
			return;
		if (this.placed) {
			this.placedImg.parentElement.removeChild(this.placedImg);
			this.img.style.opacity = 1.0;
			this.img.style.visibility = "visible";
			this.coords = [];
			this.placed = false;

			//move it back to ships to place list
			let i = player.shipsPlaced.findIndex(ship => ship === this);
			player.shipsToPlace.push(player.shipsPlaced.splice(i, 1)[0]);

			startButton.disabled = true;

			if (player.selectedShip != null) 
				instructions.innerHTML = "Selected: " + player.selectedShip.displayName + ". <br>Click on the grid to place the ship " +
					"or rotate the ship by pressing the rotate button or pressing 'r' on the keyboard.";
			else if (player.shipsPlaced.length >= 1)
				instructions.innerHTML = "Select a ship to place. <br>Click on a ship to remove it from the grid.";
			else
				instructions.innerHTML = "Select a ship to place.";

		}
	}

	collidingWith(otherShip) {
		for (let i = 0; i < this.coords.length; i++) {
			let coord = this.coords[i];
			for (let j = 0; j < otherShip.coords.length; j++) {
				let otherCoord = otherShip.coords[j];
				if (coord[0] === otherCoord[0] && coord[1] === otherCoord[1])
					return true;
			}
		}
		return false;
	}
}

class Player {
	constructor(){
		this.shipsPlaced = [];
		this.ships = [new Ship(AIRCRAFT_CARRIER), new Ship(BATTLESHIP), new Ship(SUBMARINE, true),
					  new Ship(DESTROYER), new Ship(PATROL_BOAT)];
		
		this.shipsToPlace = [];
		this.ships.forEach(ship => this.shipsToPlace.push(ship));

		this.guessBoard = new GuessBoard();
		this.selectedShip = null;
	}

	rotateSelectedShip() {
		if (gameStarted)
			return;
		if (this.selectedShip !== null)
			this.selectedShip.turnShip();
	}

	selectShip(ship) {
		if (gameStarted)
			return;

		//current selection isn't placed
		if (this.selectedShip !== null && !this.selectedShip.placed) {
			this.selectedShip.img.style.opacity = 1.0;
			this.selectedShip.img.style.visibility = "visible";
		}

		if (ship === null) {
			if (this.shipsToPlace.length == 0)
				instructions.innerHTML = "All ships placed.<br> Click the 'start game' button to begin, or click on a ship to remove it from the grid.";
			else
				instructions.innerHTML = "Select a ship to place.<br> Click on a ship to remove it from the grid.";
			this.selectedShip = null;
			return;
		}

		this.selectedShip = ship;
		this.selectedShip.img.style.opacity = 0.5;

		instructions.innerHTML = "Selected: " + this.selectedShip.displayName + ".<br> Click on the grid to place the ship " +
			"or rotate the ship by pressing the rotate button or pressing 'r' on the keyboard.";


		//check if already placed and unplace it
		let foundIndex = this.shipsPlaced.findIndex(ship => ship === this.selectedShip);
		if (foundIndex != -1) {
			this.shipsPlaced.splice(foundIndex, 1);
			this.shipsToPlace.push(this.selectedShip);
		}
	}

	placeShip(gridItem, position) {
		if (gameStarted)
			return;
		if (this.selectedShip !== null) {
			try {
				this.selectedShip.placeShip(gridItem, position);
				//check collisions with other ships
				for (let i = this.shipsPlaced.length - 1; i >= 0; i--) {
					let otherShip = this.shipsPlaced[i];
					if (otherShip === this.selectedShip) //skip ship itself
						continue;
					if (this.selectedShip.collidingWith(otherShip)) {
						console.log('collide');
						otherShip.unplaceShip();
					}
				}
			}
			catch (error) {
				console.log(error);
				return;
			}
		}
		if (this.selectedShip !== null)
			this.selectedShip.img.style.visibility = "hidden";
		this.selectShip(null); //deselect ship
		this.checkShipsPlaced();
	}

	checkShipsPlaced() {
		startButton.disabled = this.shipsPlaced.length != 5;
	}
	
	startGame() {
		document.getElementById('gameStartedAlert').style.display = 'block';
		setTimeout(function () {
			document.getElementById('gameStartedAlert').style.display = 'none';
		}, 3000);
		gameStarted = true;
		rotateButton.style.display = "none";
		startButton.style.display = "none";
		document.getElementById("guess-grid").style.display = "grid";
		this.ships.forEach(ship => {
			ship.img.style.visibility = "visible";
			ship.img.style.opacity = 1;
		});
		instructions.innerHTML = "Let the game begin! Good luck!<br>On the second grid, click a square to attack your opponent.";
	}

	makeGuess(gridItem, r, c) {
		if (gameStarted) {
			let b = player.guessBoard.board;
			if (b[r][c] === GuessBoard.UNKNOWN) {
				let hit = false;
				let sunk = false;
				for (let i = 0; i < computer.coordsPlaced.length; i++)
				{
					let coords = computer.coordsPlaced[i];
					for (let j = 0; j < coords.length; j++)
					{
						if (coords[j][0] == r && coords[j][1] == c) {
							hit = true;
							sunk = computer.trackHit(i, j);
							break;
						}

					}
					if (hit) break;
				}
				if (!hit) {
					document.getElementById('missedAlert').style.display = 'block';
					setTimeout(function () {
						document.getElementById('missedAlert').style.display = 'none';
					}, 3000);
				}
				else {
					document.getElementById('hitAlert').style.display = 'block';
					setTimeout(function () {
						document.getElementById('hitAlert').style.display = 'none';
					}, 3000);
				}

				b[r][c] = hit ? GuessBoard.HIT : GuessBoard.MISS;
				gridItem.style.backgroundColor = hit ? "green" : "red";
				instructions.innerHTML = hit ? (sunk == false ? "Hit! Nice shot!" : "Hit! You sunk the enemy " + sunk + ".") : "You missed...get 'em next time.";
				computer.guess();
				checkWinner();
			} else {
				//already guessed
				instructions.innerHTML = "You already attacked that square. Click a different square to attack.";
			}
		}
	}

	shipsLeft() {
		let b = computer.guessBoard.board;
		for (let i = 0; i < this.ships.length; i++) {
			let coords = this.ships[i].coords;
			for (let j = 0; j < coords.length; j++) {
				let coord = coords[j];
				let r = coord[0];
				let c = coord[1];
				if (b[r][c] != GuessBoard.HIT)
					return true;
			}
		}
		return false;
	}
}


//Control computer
class ComputerBoard {
	constructor() {
		this.coordsPlaced = [];
		this.guessBoard = new GuessBoard();

		[AIRCRAFT_CARRIER, BATTLESHIP, SUBMARINE, DESTROYER, PATROL_BOAT].forEach(ship => this.placeShipRandomly(ship));
	}

	shipsLeft() {
		for (let i = 0; i < this.coordsPlaced.length; i++) {
			if (this.coordsPlaced[i].length > 0)
				return true;
		}
		return false;
	}

	trackHit(i, j) {
		//use this to announce when a ship is gone
		this.coordsPlaced[i].splice(j, 1);
		if (this.coordsPlaced[i].length == 0) {
			player.ships[i].img.style.visibility = "hidden";

			//adjust i to get the right name
			if (i == 2)
				i = 4;
			else if (i == 3)
				i = 2;
			else if (i == 4)
				i = 3;
			return Ship.SHIP_NAMES[i].replace("_", " ");
		}
		return false;
	}

	guess() {
		let b = this.guessBoard.board;
		let guesses = 0;
		while (true) {
			let r, c;

			// Logic for searching near hits
			for (let i = 0; i < MAX_ROWS; i++) {
				for (let j = 0; j < MAX_COLS; j++) {
					if (b[i][j] === GuessBoard.HIT) {
						// Check nearby spots (up, down, left, right)
						const directions = [
							[-1, 0], // up
							[1, 0],  // down
							[0, -1], // left
							[0, 1]   // right
						];

						for (const [dr, dc] of directions) {
							const newRow = i + dr;
							const newCol = j + dc;

							if (newRow >= 0 && newRow < MAX_ROWS && newCol >= 0 && newCol < MAX_COLS) {
								if (b[newRow][newCol] === GuessBoard.UNKNOWN) {
									r = newRow;
									c = newCol;
									break;
								}
							}
						}

						if (r !== undefined && c !== undefined) {
							break;
						}
					}
				}

				if (r !== undefined && c !== undefined) {
					break;
				}
			}

			let nearMiss = false;
			// If no nearby spots around hits are found, fallback to random guessing
			if (r === undefined || c === undefined) {
				r = Math.floor(Math.random() * MAX_ROWS);
				c = Math.floor(Math.random() * MAX_COLS);
				guesses += 1;

				if (guesses < 500) { //only check for near miss 500 times, then just pick a random number
					// Check if the spot is near a miss
					for (let i = Math.max(0, r - 1); i <= Math.min(r + 1, MAX_ROWS - 1); i++) {
						for (let j = Math.max(0, c - 1); j <= Math.min(c + 1, MAX_COLS - 1); j++) {
							if (b[i][j] === GuessBoard.MISS) {
								nearMiss = true;
								break;
							}
						}
						if (nearMiss) break;
					}
				}
			}

			if (!nearMiss && b[r][c] === GuessBoard.UNKNOWN) {
				const index = r * MAX_COLS + c;
				const shipGrid = document.getElementById('ship-grid');
				const gridItems = shipGrid.querySelectorAll('.grid-item');
				const gridItem = gridItems[index];

				//check hit
				let hit = false;
				for (let i = 0; i < player.shipsPlaced.length; i++) {
					let coords = player.shipsPlaced[i].coords;
					for (let j = 0; j < coords.length; j++) {
						if (coords[j][0] == r && coords[j][1] == c) {
							hit = true;
							break;
						}

					}
					if (hit) break;
				}
				
				gridItem.style.backgroundColor = hit ? "red" : "green";
				b[r][c] = hit ? GuessBoard.HIT : GuessBoard.MISS;
				instructions.innerHTML += "<br>The computer attacked (" + r + ", " + c + ") and it was a " +
					(hit ? "hit" : "miss") + ".";
				break;
			}
		}
	}



	placeShipRandomly(size) {
		while (true) {
			let coords = [];
			let outOfBounds = false;
			let r = Math.floor(Math.random() * MAX_ROWS);
			let c = Math.floor(Math.random() * MAX_COLS);
			let orientation = Math.floor(Math.random() * 2);
			for (let i = 0; i < size; i++) {
				//check coords in bound
				if (c < 0 || c >= MAX_COLS || r < 0 || r >= MAX_ROWS) {
					outOfBounds = true;
					break;
				}
				coords.push([r, c]);
				orientation === Ship.ORIENTATION_HORIZONTAL ? c++ : r++;
			}
			if (outOfBounds) //try again
				continue;

			let colliding = false;
			for (let i = 0; i < this.coordsPlaced.length; i++) {
				let otherCoords = this.coordsPlaced[i]; //compare to other coordinates
				for (let j = 0; j < coords.length; j++) { //go through new coordinates
					let coord = coords[j]; 
					for (let k = 0; k < otherCoords.length; k++) {
						let otherCoord = otherCoords[k];
						if (coord[0] === otherCoord[0] && coord[1] === otherCoord[1]) {
							colliding = true;
							break;
						}
					}
					if (colliding)
						break;
				}
				if (colliding)
					break;
			}
			if (colliding)
				continue;

			this.coordsPlaced.push(coords); //placed without conflict
			console.log(coords);

			break; 
		}
	}
}

//functions
function checkScreenSize() {
	let curr_size = SQ_SIZE;
	let factor = 1.3333333333333333;
	if (window.innerWidth <= 768) {
		SQ_SIZE = 30;
		factor = 0.75;
	} else {
		SQ_SIZE = 40;
		factor = 1.333333333333333;
	}
	if (curr_size != SQ_SIZE) {
		RESIZABLE_IMAGES.forEach(img => {
			img.height *= factor;
			img.width *= factor;
		});

	}
}

function checkWinner() {
	let computerWin = !player.shipsLeft();
	let playerWin = !computer.shipsLeft();
	if (computerWin || playerWin) {
		gameOver(computerWin, playerWin);
		modal.style.display = 'block';
	}
}

function gameOver(computerWin, playerWin) {
	let text = "";
	if (computerWin && playerWin)
		text = "It's a tie! Play again?";
	else if (computerWin)
		text = "The computer wins... try again?";
	else
		text = "You won, nice work! Play again?";
	gameOverMessage.innerHTML = text;
}

function restartGame() {
	player = new Player();
	computer = new ComputerBoard();
	gameStarted = false;
	rotateButton.style.display = "inline";
	startButton.style.display = "inline";
	instructions.innerHTML = "Select a ship from the five ships above.";
	guessGridContainer.style.display = "none";
	
	//setup grid elements
	guessGridContainer.style.gridTemplateColumns = "repeat(" + MAX_COLS + ", 1fr)";
	shipGridContainer.style.gridTemplateColumns = "repeat(" + MAX_COLS + ", 1fr)";

	//remove all children
	while (guessGridContainer.firstChild) {
		guessGridContainer.removeChild(guessGridContainer.firstChild);
	}

	//add divs to guess grid
	for (let i = 0; i < MAX_ROWS; i++) {
		for (let j = 0; j < MAX_COLS; j++) {
			const gridItem = document.createElement('div');
			gridItem.classList.add('grid-item', 'rounded');

			// Add hover effect using Bootstrap classes
			gridItem.classList.add('shadow');
			gridItem.addEventListener('mouseenter', function () {
				gridItem.classList.remove('shadow');
				gridItem.classList.add('shadow-lg');
			});
			gridItem.addEventListener('mouseleave', function () {
				gridItem.classList.remove('shadow-lg');
				gridItem.classList.add('shadow');
			});

			gridItem.width = SQ_SIZE;
			gridItem.height = SQ_SIZE;
			gridItem.style.maxWidth = SQ_SIZE;
			gridItem.style.maxHeight = SQ_SIZE;
			//event for clicking on guess
			gridItem.addEventListener('click', function () {
				player.makeGuess(gridItem, i, j);
			});
			guessGridContainer.appendChild(gridItem);
		}
	}

	while (shipGridContainer.firstChild) {
		shipGridContainer.removeChild(shipGridContainer.firstChild);
	}
	//add squares to ship grid
	for (let i = 0; i < MAX_ROWS; i++) {
		for (let j = 0; j < MAX_COLS; j++) {
			const gridItem = document.createElement('div');
			gridItem.classList.add('grid-item', 'rounded');

			// Add hover effect using Bootstrap classes
			gridItem.classList.add('shadow');
			gridItem.addEventListener('mouseenter', function () {
				gridItem.classList.remove('shadow');
				gridItem.classList.add('shadow-lg');
			});
			gridItem.addEventListener('mouseleave', function () {
				gridItem.classList.remove('shadow-lg');
				gridItem.classList.add('shadow');
			});

			gridItem.width = SQ_SIZE;
			gridItem.height = SQ_SIZE;
			gridItem.style.maxWidth = SQ_SIZE;
			gridItem.style.maxHeight = SQ_SIZE;
			//event for clicking on player grid
			gridItem.addEventListener('click', function () {
				player.placeShip(gridItem, [i, j]);
			});
			shipGridContainer.appendChild(gridItem);
		}
	}

	//add images to ship box
	const shipBox = document.getElementById('ship-box');
	//delete old images
	while (shipBox.firstChild) {
		shipBox.removeChild(shipBox.firstChild);
	}
	player.ships.forEach(ship => {
		shipBox.appendChild(ship.img);
	});

}

//setup game
let SQ_SIZE = 40;
let gameStarted = false;
const AIRCRAFT_CARRIER = 5;
const BATTLESHIP = 4;
const SUBMARINE = 3;
const DESTROYER = 3;
const PATROL_BOAT = 2;
const MAX_ROWS = 10;
const MAX_COLS = 10;
const RESIZABLE_IMAGES = [];
const guessGridContainer = document.getElementById('guess-grid');
const shipGridContainer = document.getElementById('ship-grid');
const modal = document.getElementById('myModal');
const gameOverMessage = document.getElementById('gameOverMessage');
const restartBtn = document.getElementById('restartBtn');
const startButton = document.getElementById("startButton");
const rotateButton = document.getElementById('rotateButton')
const instructions = document.getElementById("instructions");
let player;
let computer;
checkScreenSize();

//Event Listeners
window.addEventListener('resize', checkScreenSize);
window.onclick = function (event) {
	if (event.target === modal) {
		modal.style.display = 'none';
	}
};

restartBtn.addEventListener('click', function () {
	restartGame();
	modal.style.display = 'none'; // Close the modal after restarting the game
});

document.addEventListener('keydown', function (event) {
	// Check if the pressed key is 'r' for rotate
	if (event.keyCode === 82) {
		player.rotateSelectedShip();
	}
});
rotateButton.addEventListener('click', () => { player.rotateSelectedShip(); });
startButton.addEventListener('click', () => { player.startGame(); });

document.addEventListener('DOMContentLoaded', () => {
	restartGame();
});