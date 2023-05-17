class GameController
{
    GameStates = {
        WON: 0,
        LOST: 1,
        IN_PROGRESS: 2
    }
    
    engine;
    visualizer;
    boardSize;
    gameState;
    closeNotificationBtn;
    constructor(visualizer)
    {
        this.gameState = this.GameStates.IN_PROGRESS;
        this.boardSize = visualizer.getBoardSize();
        this.engine = new GameEngine(this.boardSize);
        this.visualizer = visualizer;

        this.addBeginingTiles();
        this.scoreElement = document.querySelector("#score");
        Tile.engine = this.engine;
        // Tile.visualizer = this.visualizer;
        let gameStateWrapper = document.querySelector("#game-state");
        this.closeNotificationBtn=document.querySelector("#state-close");
        this.closeNotificationBtn.addEventListener("click",()=>{
            gsap.to(gameStateWrapper,{
                maxHeight: '0px',
                padding: '0px',
                duration: 0.5,
                ease: "exp.inOut"
            })
        });
    }

    update()
    {
        
        let result = this.engine.analyzeBoard();
        if(result && this.gameState != this.GameStates.WON)
        {
            this.#setGameState("You Won!");
            this.engine.sandbox = true;
            this.gameState = this.GameStates.WON;
        }
        else if (result == false && this.gameState != this.GameStates.LOST)
        {
            this.#setGameState("You Lost!");
            this.gameState = this.GameStates.LOST;
        }
        this.visualizer.update(this.engine);
    }

    draw()
    {
        this.visualizer.draw();
    }

    swipe(direction)
    {
        let boardPosition = this.engine.swipe(direction);
		if(boardPosition)
		{
            this.scoreElement.innerHTML = `Score: ${this.engine.getScore()}`;
			this.visualizer.swipe(this.engine.getMoves());
			this.visualizer.queueTile(boardPosition);
		}
    }

    addBeginingTiles()
    {
        for(let i=0;i<2;i++)
        {
            let boardPosition = this.engine.addNewTile();
            this.visualizer.addTile(boardPosition);
        }
    }

    reset()
    {
        this.engine.reset();
        this.visualizer.reset()
        this.addBeginingTiles();
        this.scoreElement.innerHTML = "Score: 0";
        this.gameState = this.GameStates.IN_PROGRESS;
        this.closeNotificationBtn.click();
    }

    restoreLastBoard()
    {
        if(this.engine.lastBoardState.length == 0)
            return;
            
        this.engine.goBack();
        this.scoreElement.innerHTML = `Score: ${this.engine.getScore()}`;
        this.visualizer.hardSet(this.engine);
        this.gameState = this.GameStates.IN_PROGRESS;
        this.closeNotificationBtn.click();
        
        if(this.gameState != this.GameStates.WON)
        {
            this.gameState = this.GameStates.IN_PROGRESS;
            // this.engine.sandbox = false;
        }
    }

    setBoardSize(boardSize)
    {
        this.boardSize = boardSize;
        this.engine.setBoardSize(boardSize)
        this.engine.reset();
        this.visualizer.setBoardSize(boardSize);
        this.visualizer.reset();
        this.addBeginingTiles();
    }

    getBoardSize()
    {
        return this.boardSize;
    }

    setVisualizer(visualizer)
    {
        this.visualizer = visualizer;
        this.visualizer.hardSet(this.engine.getBoard());
    }

    getVisualizer()
    {
        return this.visualizer;
    }

    getEngine()
    {
        return this.engine;
    }

    #setGameState(message)
    {
        console.log("fuk");
        document.querySelector(".state").innerHTML = message;
        let gameStateWrapper = document.querySelector("#game-state");
        gsap.to(gameStateWrapper,{
            maxHeight: '200px',
            padding: '9px',
            duration: 0.5,
            ease: "exp.inOut",
            OnComplete: () => {
                this.visualizer.onSwipeFinishOnce(hardResize);
            }
        })
    }
}