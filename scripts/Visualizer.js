class Visualizer
{
    gridCellSize;
    halfGridCellSize;
    gridBorderColor;
    gridFillColor;
    gridBorderSize;
    tiles;
    animating;
    queuedTilePosition;
    boardSize;
    valueColors;
    flashOnCombine;
    theme;

    constructor(boardSize = 4,theme)
    {
        this.boardSize = boardSize;
        this.setTheme(theme);
        this.reset();
    }

    update(engine)
    {
        if(this.animating)
        {
            let finished = true;
            for(let j=0;j<this.boardSize;j++)
            {
                for(let i=0;i<this.boardSize;i++)
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
                this.animating = false;
                let newTiles = Array.from({ length: this.boardSize }, () => Array(this.boardSize).fill(null));
                for(let j=0;j<this.boardSize;j++)
                {
                    for(let i=0;i<this.boardSize;i++)
                    {
                        let tile = this.tiles[i][j];
                        
                        if(tile)
                        {
                            if(newTiles[tile.boardPosition.x][tile.boardPosition.y] != null)
                                continue;

                            tile.value = engine.getBoard()[tile.boardPosition.x][tile.boardPosition.y];
                            newTiles[tile.boardPosition.x][tile.boardPosition.y] = tile;
                        }
                    }
                }
                this.tiles = newTiles;
                if(this.swipeFinishOnceCallback)
                {
                    this.swipeFinishOnceCallback();
                    this.swipeFinishOnceCallback = null;
                }
                this.addTile(this.queuedTilePosition);

                
            }
        }
    }

    swipe(moves)
    {
        this.animating = true;
        for(let j=0;j<this.boardSize;j++)
        {
            for(let i=0;i<this.boardSize;i++)
            {
                if(this.tiles[i][j])
                    this.tiles[i][j].moveBy(moves[i][j]);
            }
        }
    }

    draw()
    {
        for(let j=0;j<this.boardSize;j++)
        {
            for(let i=0;i<this.boardSize;i++)
            {
                fill(this.theme.grid.fillColor);
                stroke(this.theme.grid.borderColor);
                strokeWeight(this.gridBorderSize);
                rect(i*this.gridCellSize+this.halfGridCellSize,
                     j*this.gridCellSize + this.halfGridCellSize,
                     this.gridCellSize,this.gridCellSize);
                
            }
        }
        for(let j=0;j<this.boardSize;j++)
        {
            for(let i=0;i<this.boardSize;i++)
            {
                if(this.tiles[i][j])
                    this.tiles[i][j].show();
            }
        }
    }

    resize(canvasSize)
    {
        
        this.gridCellSize = canvasSize/this.boardSize;
        this.halfGridCellSize = this.gridCellSize*0.5;
        let tileSize = this.computeTileSize();
        for(let j=0;j<this.boardSize;j++)
        {
            for(let i=0;i<this.boardSize;i++)
            {
                if(this.tiles[i][j] == null)
                    continue;
                this.tiles[i][j].size = tileSize;
                this.tiles[i][j].position.x = i*this.gridCellSize + this.halfGridCellSize;
                this.tiles[i][j].position.y = j*this.gridCellSize + this.halfGridCellSize;
            }
        }
    }

    addTile(boardPosition)
    {
        let tile = new Tile(boardPosition.x*this.gridCellSize + this.halfGridCellSize,
                            boardPosition.y*this.gridCellSize + this.halfGridCellSize, 
                            this.computeTileSize(),
                            boardPosition)
            this.tiles[boardPosition.x][boardPosition.y] = tile;
            tile.appear();
    }
    
    hardSet(engine)
    {
        this.tiles = Array.from({ length: this.boardSize }, () => Array(this.boardSize).fill(null));
        for(let j=0;j<this.boardSize;j++)
        {
            for(let i=0;i<this.boardSize;i++)
            {
                if(engine.board[i][j] != GameEngine.defaultTileValue)
                {
                    let tile = new Tile(i*this.gridCellSize + this.halfGridCellSize,
                                        j*this.gridCellSize + this.halfGridCellSize, 
                                        this.gridCellSize - 2* this.gridBorderSize - 25,
                                        createVector(i,j)
                                        )
                    this.tiles[i][j] = tile;
                    tile.setValue(engine.getBoard()[i][j]);
                }
            }
        }
    }

    queueTile(boardPosition)
    {
        this.queuedTilePosition = boardPosition;
    }

    reset()
    {
        Tile.visualizer = this;
        this.tiles = Array.from({ length: this.boardSize }, () => Array(this.boardSize).fill(null));
        this.animating = false;
        this.queuedTilePosition = null;
        this.flashOnCombine = true;
        this.swipeFinishOnceCallback = null;
        this.setTheme(this.theme); //very inefficinet refactor this
    }

    setBoardSize(boardSize)
    {
        this.boardSize = boardSize;
    }

    getBoardSize()
    {
        return this.boardSize;
    }

    isAnimating()
    {
        return this.animating;
    }

    setTheme(theme)
    {
        this.theme = theme;
        this.gridBorderSize = this.theme.grid.borderSize;
        this.valueColors = this.theme.tile.colors;
        this.gridCellSize = canvasSize/this.boardSize;
        this.halfGridCellSize = this.gridCellSize*0.5;
        Tile.appearEasing = this.theme.tile.easings.appear;
        Tile.moveEasing = this.theme.tile.easings.move;
        Tile.combineEasing = this.theme.tile.easings.combine;
        Tile.borderSize = this.theme.tile.borderSize;
        Tile.shape = this.theme.tile.shape;
        this.setCSSVariables();
        if(this.tiles)
        {
            this.reloadThemeForTiles();
        }
    }

    reloadThemeForTiles()
    {
        let tileSize = this.computeTileSize();
        this.tiles.forEach(col => {
            col.forEach(tile => {
                if(tile)
                {
                    tile.reloadTheme();
                    tile.size = tileSize;
                }
            });
            });
    }

    computeTileSize()
    {
        return this.gridCellSize - 2* this.gridBorderSize - 25;
    }

    setCSSVariables()
    {
        const root = document.documentElement;
        for(let colorName in this.theme.site)
        {
            root.style.setProperty("--" + colorName, this.theme.site[colorName]);
        }
        
    }

    onSwipeFinishOnce(callback)
    {
        this.swipeFinishOnceCallback = callback;
    }
}