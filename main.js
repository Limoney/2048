let board=[];
let tileSize=100;

let moveLeft;
let moveRight;
let moveTop;
let moveDown;
let defaultTileValue=-15;
let moved = false;
let lastBoardState=[[],[],[],[]];
let combinable=
[
  [true,true,true,true],
  [true,true,true,true],
  [true,true,true,true],
  [true,true,true,true]
];
let allowToCombine=true;

function setup()
{
   moveLeft=createVector(-1,0);
   moveRight=createVector(1,0);
   moveTop=createVector(0,-1);
   moveDown=createVector(0,1);
  createCanvas(400,400);
  for(let i=0;i<4;i++)
  {
    board[i]=[];
  }
  for(let j=0;j<4;j++)
  {
    for(let i=0;i<4;i++)
    {
      board[i][j]=defaultTileValue;
    }
  }
  for(let i=0;i<2;i++)
  {
    addNewTile()

  }
  //rectMode(CENTER);
  textAlign(CENTER);
  textSize(34)
}

function draw()
{
  background(51);
  for(let j=0;j<4;j++)
  {
    for(let i=0;i<4;i++)
    {
      //fill(map(board[i][j],0,16,215,227),map(board[i][j],0,16,205,200),map(board[i][j],0,16,167,99));
      fill(map(board[i][j],0,2048,40,100),map(board[i][j],0,2048,40,100),map(board[i][j],0,2048,40,100));
      stroke(0)
      strokeWeight(2);
      rect(i*tileSize,j*tileSize,tileSize,tileSize);
      //fill(250,100,100);
      fill(19,111,86);
      noStroke();
      if(board[i][j]!=defaultTileValue)text(board[i][j],i*tileSize+tileSize/2,j*tileSize+tileSize/2)
    }
  }
}
function addNewTile()
{
  let empty=0;
  for(let j=0;j<4;j++)
  {
    for(let i=0;i<4;i++)
    {
      if(board[i][j]==defaultTileValue)empty++;
    }
  }
  if(empty==0) return -1;
  let finished=false;
  while(!finished)
  {
    let x = floor(random(4));
    let y = floor(random(4));
    if(board[x][y]==defaultTileValue){board[x][y]=2;finished=true;}
  }
}
function swipe(direction)
{
  //lastBoardState=board.slice(0,board.length);
  combinable=
  [
    [true,true,true,true],
    [true,true,true,true],
    [true,true,true,true],
    [true,true,true,true]
  ];
  for(let j=0;j<4;j++)
  {
    for(let i=0;i<4;i++)
    {
      lastBoardState[i][j]=board[i][j];
    }
  }
  moved = false;
  if(direction==moveRight)
  {
	  for(let j=0;j<4;j++)
	  {
  		for(let i=4;i>=0;i--)
  		{
  		  move(i,j,direction);
  		}
	  }
  }
  else if(direction==moveLeft)
  {//DZIAŁAJ!
	  for(let j=0;j<4;j++)
	  {
  		for(let i=0;i<4;i++)
  		{
  		  move(i,j,direction);
  		}
	  }
  }
  else if(direction==moveTop)
  {
	  for(let i=0;i<4;i++)
	  {
  		for(let j=0;j<4;j++)
  		{
  		  move(i,j,direction);
  		}
	  }
  }
  else if(direction==moveDown)
  {
	  for(let i=0;i<4;i++)
	  {
  		for(let j=4;j>=0;j--)
  		{
  		  move(i,j,direction);
  		}
	  }
  }
  if(moved){addNewTile();}
  
  //console.table(board);
}
function move(x,y,dir)
{
  while((x+dir.x>-1 &&x+dir.x<4 || y+dir.y<4 && y+dir>-1) &&
       ((board[x+dir.x][y+dir.y]==board[x][y])|| board[x+dir.x][y+dir.y]==defaultTileValue) &&
       board[x][y]>0)
    {
      if(board[x+dir.x][y+dir.y]==board[x][y] && combinable[x+dir.x][y+dir.y]==true)
      {
        combinable[x+dir.x][y+dir.y]=false;
        board[x+dir.x][y+dir.y]*=2;
        board[x][y]=defaultTileValue;
        moved=true;
        break;
      }
      if(combinable[x+dir.x][y+dir.y]==true)
      {
        board[x+dir.x][y+dir.y]=board[x][y];
        board[x][y]=defaultTileValue;
        moved = true;
      }

      x+=dir.x;
      y+=dir.y;

    }
}
function keyPressed()
{
  if(keyCode==UP_ARROW) swipe(moveTop);
  else if(keyCode==RIGHT_ARROW) swipe(moveRight);
  else if(keyCode==DOWN_ARROW) swipe(moveDown);
  else if(keyCode==LEFT_ARROW) swipe(moveLeft);
  if(keyIsDown(90) && keyIsDown(17))
  {
    for(let j=0;j<4;j++)
    {
      for(let i=0;i<4;i++)
      {
        board[i][j]=lastBoardState[i][j];
      }
    }
  }
}
