let moveLeft;
let moveRight;
let moveTop;
let moveDown;
let gameEngine;
let visualizer;
let canvas;
let canvasWrapper;
let canvasSize;
let boardSize = 4;
function setup()
{
	canvasWrapper = document.getElementsByClassName("canvas-wrapper")[0];
	canvasSize = min(canvasWrapper.clientWidth,canvasWrapper.clientHeight);
	canvas = createCanvas(canvasSize,canvasSize);
	canvas.parent("canvas-wrapper");
	gameEngine = new GameEngine();
	visualizer = new Visualizer();
	moveLeft=createVector(-1,0);
	moveRight=createVector(1,0);
	moveTop=createVector(0,-1);
	moveDown=createVector(0,1);

	for(let i=0;i<2;i++)
	{
		let boardPosition = gameEngine.addNewTile();
		visualizer.addTile(boardPosition);
	}

	textAlign(CENTER, CENTER);
	textSize(34);
	rectMode(CENTER);
	angleMode(DEGREES);
}

function draw()
{
	// background(255);
	visualizer.update();
	visualizer.draw();
}

function keyPressed()
{
	if(visualizer.swiped)
		return;
	
	let direcion = null;
	if(keyCode==UP_ARROW) 
		direcion=moveTop;
	else if(keyCode==RIGHT_ARROW) 
		direcion=moveRight;
	else if(keyCode==DOWN_ARROW) 
		direcion = moveDown;
	else if(keyCode==LEFT_ARROW) 
		direcion = moveLeft;
	
	if(direcion)
	{
		let boardPosition = gameEngine.swipe(direcion);
		if(boardPosition)
		{
			visualizer.swipe(gameEngine.moveBy);
			visualizer.queueTile(boardPosition);
		}
	}
		
	if(keyIsDown(90) && keyIsDown(17))
	{
		gameEngine.goBack();
		visualizer.hardSet();
	}

	if(keyIsDown(65))
	{
		board = [ [-15,32,8,2],[-15,-15,8,2],[-15,-15,-15,4],[-15,-15,2,-15] ]
		gameEngine.board = board;
		visualizer.hardSet();
	}
}

window.addEventListener("resize",()=>{
	
	canvasSize = min(canvasWrapper.clientWidth,canvasWrapper.clientHeight);
	canvas.resize(canvasSize,canvasSize);
	visualizer.resize()
	fill(0)
	stroke(0);
  })