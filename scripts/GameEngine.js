class GameEngine
{
    constructor()
    {
        this.defaultTileValue=-15;
        this.board=Array.from({ length: boardSize }, () => Array(boardSize).fill(this.defaultTileValue));
        this.moved = false;
        this.lastBoardState=[[],[],[],[]];
        this.combinable= Array.from({ length: boardSize }, () => Array(boardSize).fill(true));
        this.moveBy = Array.from({ length: boardSize }, () => Array(boardSize).fill(0));
    }

    addNewTile()
    {
        let empty=0;
        for(let j=0;j<boardSize;j++)
        {
            for(let i=0;i<boardSize;i++)
            {
                if(this.board[i][j]==this.defaultTileValue)
                    empty++;
            }
        }
        if(empty==0) 
            return -1;

        while(true)
        {
            let x = floor(random(boardSize)); //this will crash if it rolls 4
            let y = floor(random(boardSize));
            if(this.board[x][y]==this.defaultTileValue)
            {
                this.board[x][y]=2;
                return createVector(x,y);
            }
        }
    }

    //return position of a new tile or null on failure to swipe
    swipe(direction)
    {
        this.moveBy = Array.from({ length: boardSize }, () => Array(boardSize).fill(0));
        this.combinable = Array.from({ length: boardSize }, () => Array(boardSize).fill(true));

        this.lastBoardState = JSON.parse(JSON.stringify(this.board));

        this.moved = false;
        if(direction==moveRight)
        {
            for(let j=0;j<boardSize;j++)
            {
                for(let i=boardSize;i>=0;i--)
                {
                    this.move(i,j,direction);
                }
            }
        }
        else if(direction==moveLeft)
        {//DZIAŁAJ!
            for(let j=0;j<boardSize;j++)
            {
                for(let i=0;i<boardSize;i++)
                {
                    this.move(i,j,direction);
                }
            }
        }
        else if(direction==moveTop)
        {
            for(let i=0;i<boardSize;i++)
            {
                for(let j=0;j<boardSize;j++)
                {
                    this.move(i,j,direction);
                }
            }
        }
        else if(direction==moveDown)
        {
            for(let i=0;i<boardSize;i++)
            {
                for(let j=boardSize;j>=0;j--)
                {
                    this.move(i,j,direction);
                }
            }
        }

        if(this.moved)
        {
            let boardPosition = this.addNewTile();
            return boardPosition;
        }
        else
        {
            return null;
        }
        //console.table(this.moveBy);
    }

    move(x,y,dir)
    {
        const x_ = min(x,boardSize-1), y_ = min(y,boardSize-1);
        if(this.board[x_][y_] == -15)
            return;
        while(
                (x+dir.x>-1 &&x+dir.x<boardSize || y+dir.y<boardSize && y+dir>-1) && //jeżeli nie wychodzimy zplanszy oraz
                (
                    (this.board[x+dir.x][y+dir.y]==this.board[x][y]) || this.board[x+dir.x][y+dir.y]==this.defaultTileValue
                ) && //następny kafelek ma taką samą wartość lub jest pusty
                this.board[x][y]>0 //
            )
        {

            //jeżeli następny kafelek ma taką samą wartość i można się z nim połączyć
            if(this.board[x+dir.x][y+dir.y]==this.board[x][y] && this.combinable[x+dir.x][y+dir.y]==true)
            {
                this.combinable[x+dir.x][y+dir.y]=false;
                this.board[x+dir.x][y+dir.y]*=2;
                this.board[x][y]=this.defaultTileValue;
                this.moved=true;
                x+=dir.x;
                y+=dir.y;
                break;
            }
            //jeżeli możemy iść do następnego kafelka
            else if(this.combinable[x+dir.x][y+dir.y]==true)
            {
                this.board[x+dir.x][y+dir.y]=this.board[x][y];
                this.board[x][y]=this.defaultTileValue;
                this.moved = true;
                x+=dir.x;
                y+=dir.y;
            }
            //nie możemy się już poruszać
            else
            {
                break;
            }
            

        }
        this.moveBy[x_][y_] =  createVector(x - x_, y - y_);
    }

    goBack()
    {
        for(let j=0;j<boardSize;j++)
        {
            for(let i=0;i<boardSize;i++)
            {
                this.board[i][j]=this.lastBoardState[i][j];
            }
        }
    }

    reset()
    {
        
    }
}