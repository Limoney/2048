let moveLeft;
let moveRight;
let moveTop;
let moveDown;
// https://coolors.co/palettes/popular/pastel pog color site
let canvas;
let canvasWrapper;
let canvasSize;
let resizeTimeoutHandle = null;
let gameController;
let touchDirection;
let themes = [];
let defaultTheme = {
    "name": "colorful-dark",
    "grid": {
        "fillColor": "#34495e",
        "borderColor": "#2c3e50",
        "borderSize": 2

    },
    "tile": {
        "colors": {
            "fill": "#2c3e50",
            "combine": "#FFD700",
            "2": "#2980b9",
            "4": "#3498db",
            "8": "#8e44ad",
            "16": "#9b59b6",
            "32": "#f39c12",
            "64": "#f1c40f",
            "128": "#d35400",
            "256": "#e67e22",
            "512": "#c0392b",
            "1024": "#e74c3c",
            "2048": "#27ae60",
            "4096": "#2ecc71",
            "final": "#f8c291"
        },
        "easings": {
            "appear": "bounce.out",
            "move": "expo.out",
            "combine": "sine.inOut"
        },
        "borderSize": 2,
        "shape": "rect"
    },
	"site": {
        "primary": "#3498db",
        "primary-dark": "#2980b9",
        "primary-darker": "#175d8a",
        "secondary": "#34495e",
        "secondary-dark": "#2c3e50",
        "secondary-darker": "#293a4b"
    }
};
function preload()
{
	themes.push(defaultTheme);
	themes.push(loadJSON("themes/ice-cream.json"));
	themes.push(loadJSON("themes/pastel.json"));
}
function setup()
{
	canvasWrapper = document.getElementsByClassName("canvas-wrapper")[0];
	canvasSize = min(canvasWrapper.clientWidth,canvasWrapper.clientHeight);
	canvas = createCanvas(canvasSize,canvasSize);
	canvas.parent("canvas-wrapper");

	let visualizer = new Visualizer(4,defaultTheme);
	gameController = new GameController(visualizer);

	moveLeft=createVector(-1,0);
	moveRight=createVector(1,0);
	moveTop=createVector(0,-1);
	moveDown=createVector(0,1);

	textAlign(CENTER, CENTER);
	textSize(34);
	rectMode(CENTER);
	angleMode(DEGREES);

	createThemeButtons();

	document.querySelector("#reset-btn").addEventListener("click",()=>{
		gameController.reset();
	});

	
	initEditUI();
	refreshEditUI();

	let hammer = new Hammer(canvas.canvas, {preventDefault: true});
	hammer.get('swipe').set({
		direction: Hammer.DIRECTION_ALL
	});

  hammer.on("swipe", touchSwipe);

  
  new ResizeObserver(softResize).observe(document.querySelector(".game-canvas"));
	
}

function draw()
{
	gameController.update();
	gameController.draw();
}

function keyPressed()
{
	if(gameController.getVisualizer().isAnimating())
		return;
	
	let direction = null;
	if(keyCode==UP_ARROW) 
		direction=moveTop;
	else if(keyCode==RIGHT_ARROW) 
		direction=moveRight;
	else if(keyCode==DOWN_ARROW) 
		direction = moveDown;
	else if(keyCode==LEFT_ARROW) 
		direction = moveLeft;
	
	if(direction)
	{
		gameController.swipe(direction);
		console.log("key swipe");
	}
		
	if(keyIsDown(90) && keyIsDown(17))
	{
		gameController.restoreLastBoard();
	}

	if(keyIsDown(65))
	{
		//board = [ [-15,32,8,2],[-15,-15,8,2],[-15,-15,-15,4],[-15,-15,2,-15] ]
		board = [ [8192,4096,2048,1024],[512,256,128,64],[32,16,8,4],[2,-15,-15,-15] ]
		board = [ [1024,1024,-15,2],[-15,-15,-15,-15],[-15,-15,-15,-15],[-15,-15,-15,-15] ]
		gameController.getEngine().setBoard(board)
		gameController.getVisualizer().hardSet(gameController.getEngine());
		
	}
}

function touchSwipe(event) 
{
	if(gameController.getVisualizer().isAnimating())
			return;

	const swipeDir = event.direction;
	let direction;
	// Handle the swipe direction
	switch (swipeDir) {
		case Hammer.DIRECTION_LEFT:
			direction = moveLeft;
		break;
		case Hammer.DIRECTION_RIGHT:
			direction = moveRight;
		break;
		case Hammer.DIRECTION_UP:
			direction = moveTop;
		break;
		case Hammer.DIRECTION_DOWN:
			direction = moveDown;
		break;
		default:
			return;
	}

	gameController.swipe(direction);
	console.log("touch swipe");
}

function createThemeButtons()
{
	let themeLoadScreen = document.querySelector("#theme-load-screen");
	let themesParent = document.querySelector(".themes");
	for(let theme of themes)
	{
		let button = document.createElement("button");
		button.classList.add(theme.name)
		button.classList.add("theme-icon");
		button.addEventListener("click",()=>{
			themeLoadScreen.className = "";
			void themeLoadScreen.offsetWidth;
			themeLoadScreen.classList.add("show-load-screen");
			themeLoadScreen.classList.add(theme.name);
			setTimeout(()=> {
				gameController.getVisualizer().setTheme(theme);
				refreshEditUI();
			},500);
		});
		themesParent.appendChild(button);
	}
}
function initEditUI()
{
	let visualizer = gameController.getVisualizer();
	let boardSizeInput = document.querySelector("#board-size-input");
	boardSizeInput.addEventListener("change",()=>{
		if(boardSizeInput.value<2)
			boardSizeInput.value = 4;
		gameController.setBoardSize(parseInt(boardSizeInput.value));
	})

	let gridBackgroundInput = document.querySelector("#grid-background-input");
	gridBackgroundInput.addEventListener("input",()=>{
		visualizer.theme.grid.fillColor=gridBackgroundInput.value;//save in localStorage
	})

	let gridBorderInput = document.querySelector("#grid-border-input");
	gridBorderInput.addEventListener("input",()=>{
		visualizer.theme.grid.borderColor=gridBorderInput.value;
	})

	let flashCheckbox = document.querySelector("#flash-on-combine");
	flashCheckbox.addEventListener("click",() => {
		visualizer.flashOnCombine = flashCheckbox.checked;
	})

	let colorParent = document.querySelector("#tile-properties-wrapper");
	let valueColorElementTemplate = document.querySelector("#dropdown-item-color");
	for(let propertyName in defaultTheme.tile.colors)
	{
		let clone = valueColorElementTemplate.content.cloneNode(true);
		let li = clone.children[0];
		let input = li.querySelector("input");
		let label = li.querySelector("label");

		input.addEventListener("input",()=>{
			let propName = input.parentElement.getAttribute("data-property-name");
			console.log(propName);
			visualizer.theme.tile.colors[propName] = input.value;
			visualizer.reloadThemeForTiles();
		})

		input.id.replace("X",propertyName);
		label.htmlFor = input.id;
		label.innerText = propertyName;
		li.setAttribute("data-property-name",propertyName);

		colorParent.appendChild(clone);

		let settingsElement = document.querySelector('.settings');
		let hamburger = document.querySelector('.hamburger');
		let updateNav = () => {
			let navOpen = JSON.parse(localStorage.getItem("openNav"));
			localStorage.setItem('openNav',!navOpen);

			if(!navOpen)
				openNav()
			else
				closeNav();
		};
		let navState = JSON.parse(localStorage.getItem("openNav")) ?? true;
		if(!navState)
			closeNav();

		hamburger.addEventListener('click',updateNav);

		function closeNav() {settingsElement.classList.add('settings-hidden');}
		function openNav() {settingsElement.classList.remove('settings-hidden');}
	}

	document.querySelector(".redo").addEventListener("click",()=>{
		gameController.restoreLastBoard();
	});

	document.querySelector("#save-btn").addEventListener("click",() => {
		let copy = JSON.parse(JSON.stringify(visualizer.theme));
		copy.name = "custom";
		saveJSON(copy,"2048-theme.json");
	})

	let themeInput = document.querySelector("#theme-input");
	document.querySelector("#load-btn").addEventListener("change",(event) => {
		const file = themeInput.files[0];
		let reader = new FileReader();
		reader.onload = (event) => {
			console.log("start");
			const fileContents = event.target.result;
			const jsonData = JSON.parse(fileContents);
			gameController.getVisualizer().setTheme(jsonData);
			console.log("done");
			refreshEditUI();
		};
		reader.readAsText(file);
	})

	// canvas.canvas.addEventListener("resize",()=>{
	// 	// console.log("owo");	
	// 	canvasSize = min(canvasWrapper.clientWidth,canvasWrapper.clientHeight);
	// 	canvas.resize(canvasSize,canvasSize);
	// 	gameController.getVisualizer().resize(canvasSize)
	// 	fill(0)
	// 	stroke(0);
	//   })
}
function hardResize()
{	
	canvas.resize(canvasSize,canvasSize);
	gameController.getVisualizer().resize(canvasSize)
	console.log("hard resize");
}

function softResize()
{
	console.log("soft");
	canvasSize = min(canvasWrapper.clientWidth,canvasWrapper.clientHeight);
	canvas.canvas.style.width=`${canvasSize}px`;
	canvas.canvas.style.height=`${canvasSize}px`; 
	clearTimeout(resizeTimeoutHandle)
	resizeTimeoutHandle = setTimeout(hardResize,150);
}

function refreshEditUI()
{
	let visualizer = gameController.getVisualizer();
	let boardSizeInput = document.querySelector("#board-size-input");
	boardSizeInput.value=4;

	//check if there already are new colors set, in a localStorage for instance
	let gridBackgroundInput = document.querySelector("#grid-background-input");
	gridBackgroundInput.value = visualizer.theme.grid.fillColor.toString("#rrggbb"); // cookie or this value


	let gridBorderInput = document.querySelector("#grid-border-input");
	gridBorderInput.value = visualizer.theme.grid.borderColor.toString("#rrggbb");


	let flashCheckbox = document.querySelector("#flash-on-combine");
	visualizer.flashOnCombine = flashCheckbox.checked;

	let colorParent = document.querySelector("#tile-properties-wrapper");
	for(let element of colorParent.children)
	{
		let propName = element.getAttribute("data-property-name");
		let input = element.querySelector("input");
		input.value = visualizer.theme.tile.colors[propName];
	}
}