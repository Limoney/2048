class GameEngine
{
    static defaultTileValue = -15;

    board;
    moved;
    lastBoardState;
    combinable;
    moveBy;
    boardSize;
    score;
    lastScore;
    sandbox;

    constructor(boardSize = 4)
    {
        this.boardSize = boardSize;
        this.reset();
    }

    addNewTile()
    {
        let empty=0;
        for(let j=0;j<this.boardSize;j++)
        {
            for(let i=0;i<this.boardSize;i++)
            {
                if(this.board[i][j]==GameEngine.defaultTileValue)
                    empty++;
            }
        }
        if(empty==0) 
            return -1;

        while(true)
        {
            let x = floor(random(this.boardSize)); //this will crash if it rolls 4
            let y = floor(random(this.boardSize));
            if(this.board[x][y]==GameEngine.defaultTileValue)
            {
                this.board[x][y]=2;
                return createVector(x,y);
            }
        }
    }

    //return position of a new tile or null on failure to swipe
    swipe(direction)
    {
        this.moveBy = Array.from({ length: this.boardSize }, () => Array(this.boardSize).fill(0));
        this.combinable = Array.from({ length: this.boardSize }, () => Array(this.boardSize).fill(true));
        let preSwipeBoardCopy = JSON.parse(JSON.stringify(this.board));
        this.lastScore = this.score;

        this.moved = false;
        if(direction.equals(moveRight))
        {
            for(let j=0;j<this.boardSize;j++)
            {
                for(let i=this.boardSize;i>=0;i--)
                {
                    this.move(i,j,direction);
                }
            }
        }
        else if(direction.equals(moveLeft))
        {//DZIAŁAJ!
            for(let j=0;j<this.boardSize;j++)
            {
                for(let i=0;i<this.boardSize;i++)
                {
                    this.move(i,j,direction);
                }
            }
        }
        else if(direction.equals(moveTop))
        {
            for(let i=0;i<this.boardSize;i++)
            {
                for(let j=0;j<this.boardSize;j++)
                {
                    this.move(i,j,direction);
                }
            }
        }
        else if(direction.equals(moveDown))
        {
            for(let i=0;i<this.boardSize;i++)
            {
                for(let j=this.boardSize;j>=0;j--)
                {
                    this.move(i,j,direction);
                }
            }
        }

        if(this.moved)
        {
            this.lastBoardState = preSwipeBoardCopy;
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
        const x_ = min(x,this.boardSize-1), y_ = min(y,this.boardSize-1);
        if(this.board[x_][y_] == -15)
            return;
        while(
                (x+dir.x>-1 &&x+dir.x<this.boardSize || y+dir.y<this.boardSize && y+dir>-1) && //jeżeli nie wychodzimy zplanszy oraz
                (
                    (this.board[x+dir.x][y+dir.y]==this.board[x][y]) || this.board[x+dir.x][y+dir.y]==GameEngine.defaultTileValue
                ) && //następny kafelek ma taką samą wartość lub jest pusty
                this.board[x][y]>0 //
            )
        {

            //jeżeli następny kafelek ma taką samą wartość i można się z nim połączyć
            if(this.board[x+dir.x][y+dir.y]==this.board[x][y] && this.combinable[x+dir.x][y+dir.y]==true)
            {
                this.combinable[x+dir.x][y+dir.y]=false;
                this.board[x+dir.x][y+dir.y]*=2;
                this.score+=this.board[x+dir.x][y+dir.y];
                this.board[x][y]=GameEngine.defaultTileValue;
                this.moved=true;
                x+=dir.x;
                y+=dir.y;
                break;
            }
            //jeżeli możemy iść do następnego kafelka
            else if(this.combinable[x+dir.x][y+dir.y]==true)
            {
                this.board[x+dir.x][y+dir.y]=this.board[x][y];
                this.board[x][y]=GameEngine.defaultTileValue;
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
        for(let j=0;j<this.boardSize;j++)
        {
            for(let i=0;i<this.boardSize;i++)
            {
                this.board[i][j]=this.lastBoardState[i][j];
            }
        }
        this.score = this.lastScore;
    }

    reset()
    {
        this.board=Array.from({ length: this.boardSize }, () => Array(this.boardSize).fill(GameEngine.defaultTileValue));
        this.moved = false;
        this.lastBoardState=[];
        this.combinable= Array.from({ length: this.boardSize }, () => Array(this.boardSize).fill(true));
        this.moveBy = Array.from({ length: this.boardSize }, () => Array(this.boardSize).fill(0));
        this.score = 0;
        this.sandbox = false;
    }

    getBoard()
    {
        return this.board;
    }

    setBoard(board)
    {
        this.board = board;
    }

    getLastBoard()
    {
        return this.lastBoardState;
    }

    getMoves()
    {
        return this.moveBy;
    }

    getCombined()
    {
        return this.combinable;
    }

    setBoardSize(boardSize)
    {
        this.boardSize = boardSize;
    }

    getBoardSize()
    {
        return this.boardSize;
    }

    getScore()
    {
        return this.score;
    }

    //returns true on win, false on lose or null if the game is still in progress
    analyzeBoard()
    {
        let lost = false;
        for(let j=0;j<this.boardSize;j++)
        {
            for(let i=0;i<this.boardSize;i++)
            {
                // console.log(this.board[i][j] == 2048)
                // debugger;
                let value = this.board[i][j];
                if(value == 2048 && !this.sandbox)
                {
                    return true;
                }
                else if (this.board[i][j] == GameEngine.defaultTileValue)
                {
                    lost = null;
                }
                else
                {
                    for(let value of this.#getNeighbourValues(i,j))
                    {
                        if(value == this.board[i][j])
                            lost = null;
                    }
                }
            }
        }
        return lost;
    }

    #getNeighbourValues(col, row) {
        let values = [];
      
        if (col > 0) 
            values.push(this.board[col - 1][row]);
      
        if (col < this.boardSize - 1) 
            values.push(this.board[col + 1][row]);
        
        if (row > 0) 
            values.push(this.board[col][row - 1]);
        
        if (row < this.boardSize - 1) 
            values.push(this.board[col][row + 1]);
      
        return values;
      }
      
}