class GameController
{
    engine;
    visualizer;
    boardSize;
    constructor(visualizer)
    {
        this.boardSize = visualizer.getBoardSize();
        this.engine = new GameEngine(this.boardSize);
        this.visualizer = visualizer;

        this.addBeginingTiles();
        this.scoreElement = document.querySelector("#score");
        Tile.engine = this.engine;
        // Tile.visualizer = this.visualizer;
    }

    update()
    {
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
    }

    restoreLastBoard()
    {
        this.engine.goBack();
        this.scoreElement.innerHTML = `Score: ${this.engine.getScore()}`;
        this.visualizer.hardSet(this.engine);
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
}