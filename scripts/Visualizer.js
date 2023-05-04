class Visualizer
{
    constructor()
    {
        this.gridCellSize = canvasSize/boardSize;
        this.halfGridCellSize = this.gridCellSize*0.5;
        this.gridBorderColor = color(41, 128, 185)
        this.gridFillColor = color(52, 73, 94)
        this.gridBorderSize = 2;
        this.tiles = Array.from({ length: boardSize }, () => Array(boardSize).fill(null));
        this.swiped = false;
        this.queuedTilePosition = null;
        // for(let j=0;j<4;j++)
        // {
        //     for(let i=0;i<4;i++)
        //     {
        //         let tile = new Tile(i*this.gridCellSize + this.halfGridCellSize,
        //                             j*this.gridCellSize + this.halfGridCellSize, 
        //                             this.gridCellSize - 2* this.gridBorderSize - 25)
        //         this.tiles[i][j] = tile;
        //         tile.appear();
                
        //     }
        // }
        //this.resize();
    }
    update()
    {
        if(this.swiped)
        {
            let finished = true;
            for(let j=0;j<boardSize;j++)
            {
                for(let i=0;i<boardSize;i++)
                {
                    if(this.tiles[i][j])
                    {
                        if(this.tiles[i][j].isAnimating)
                        finished = false;
                    }
                }
            }
            if(finished)
            {
                this.swiped = false;
                let newTiles = Array.from({ length: boardSize }, () => Array(boardSize).fill(null));
                for(let j=0;j<boardSize;j++)
                {
                    for(let i=0;i<boardSize;i++)
                    {
                        let tile = this.tiles[i][j];
                        
                        if(tile)
                        {
                            if(newTiles[tile.boardPosition.x][tile.boardPosition.y] != null)
                                continue;
                            tile.value = gameEngine.board[tile.boardPosition.x][tile.boardPosition.y];
                            // tile.transitionToValue(gameEngine.board[tile.boardPosition.x][tile.boardPosition.y]);
                            gsap.to(tile.value,{})
                            newTiles[tile.boardPosition.x][tile.boardPosition.y] = tile;
                        }
                    }
                }
                this.tiles = newTiles;
                this.addTile(this.queuedTilePosition);
            }
        }
    }

    swipe(moves)
    {
        this.swiped = true;
        for(let j=0;j<boardSize;j++)
        {
            for(let i=0;i<boardSize;i++)
            {
                //i know that the value could have been changed at this point so i should create a timeline in moveBy and start transitioning value if it changed
                if(this.tiles[i][j])
                    this.tiles[i][j].moveBy(moves[i][j]);
            }
        }
        //update position of tiles in this.tiles ei. switch places in array by creating its copy;
    }

    draw()
    {
        for(let j=0;j<boardSize;j++)
        {
            for(let i=0;i<boardSize;i++)
            {
                fill(this.gridFillColor);
                stroke(this.gridBorderColor);
                strokeWeight(this.gridBorderSize);
                rect(i*this.gridCellSize+this.halfGridCellSize,
                     j*this.gridCellSize + this.halfGridCellSize,
                     this.gridCellSize,this.gridCellSize);
                
            }
        }
        for(let j=0;j<boardSize;j++)
        {
            for(let i=0;i<boardSize;i++)
            {
                if(this.tiles[i][j])
                    this.tiles[i][j].show();
            }
        }
    }

    resize()
    {
        
        this.gridCellSize = canvasSize/boardSize;
        // console.log(this.gridCellSize);
        this.halfGridCellSize = this.gridCellSize*0.5;
        for(let j=0;j<boardSize;j++)
        {
            for(let i=0;i<boardSize;i++)
            {
                if(this.tiles[i][j] == null)
                    continue;
                this.tiles[i][j].size = this.gridCellSize - 2* this.gridBorderSize - 25
                this.tiles[i][j].position.x = i*this.gridCellSize + this.halfGridCellSize,
                this.tiles[i][j].position.y = j*this.gridCellSize + this.halfGridCellSize
            }
        }
    }

    addTile(boardPosition)
    {
        let tile = new Tile(boardPosition.x*this.gridCellSize + this.halfGridCellSize,
                            boardPosition.y*this.gridCellSize + this.halfGridCellSize, 
                            this.gridCellSize - 2* this.gridBorderSize - 25,
                            boardPosition)
            this.tiles[boardPosition.x][boardPosition.y] = tile;
            tile.appear();
    }
    
    hardSet()
    {
        console.table(gameEngine.board)
        this.tiles = Array.from({ length: boardSize }, () => Array(boardSize).fill(null));
        for(let j=0;j<boardSize;j++)
        {
            for(let i=0;i<boardSize;i++)
            {
                if(gameEngine.board[i][j] != gameEngine.defaultTileValue)
                {
                    let tile = new Tile(i*this.gridCellSize + this.halfGridCellSize,
                                        j*this.gridCellSize + this.halfGridCellSize, 
                                        this.gridCellSize - 2* this.gridBorderSize - 25,
                                        createVector(i,j)
                                        )
                    this.tiles[i][j] = tile;
                    tile.value = gameEngine.board[i][j];
                }
                //tile.appear();
            }
        }
    }

    queueTile(boardPosition)
    {
        this.queuedTilePosition = boardPosition;
    }
}