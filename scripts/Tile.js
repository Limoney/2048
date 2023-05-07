class Tile
{
    static visualizer;
    static engine;
    static appearEasing;
    static moveEasing;
    static combineEasing;
    static borderSize;
    static shape;

    constructor(x,y,size,boardPosition)
    {
        console.log(`creating with size: ${size}`);
        this.position = createVector(x,y);
        this.size = size;
        this.value = 2;
        this.boardPosition = boardPosition;
        this.isAnimating = false;
        this.oldBoardPosition = null;
        this.reloadTheme();
    }

    show()
    {
        textSize(this.size*0.5);
        fill(this.fillColor);
        stroke(this.borderColor);
        strokeWeight(Tile.borderSize);
        this.shapeFunction(this.position.x,
            this.position.y,
            this.size,this.size)
        fill(this.borderColor);
        noStroke();
        text(this.value,this.position.x,this.position.y);
    }

    appear()
    {
        gsap.fromTo(this, 
            { 
                size: 0 
            },
            { 
                size: this.size,
                ease: Tile.appearEasing,
                duration: 0.3
            },
        );
    }

    moveBy(boardPositionVector)
    {
        this.isAnimating = true;
        //make sure size isnt being animated!
        let newPosition= createVector(this.position.x + boardPositionVector.x * gameController.getVisualizer().gridCellSize,
                                      this.position.y + boardPositionVector.y * gameController.getVisualizer().gridCellSize)

        let newBoardPosition = this.boardPosition.copy().add(boardPositionVector);

        const timeline = new TimelineLite();
        timeline.to(this.position, { 
                    x: newPosition.x,
                    y: newPosition.y,
                    ease: Tile.moveEasing,
                    duration: 0.5,
                    onComplete: () => {
                        this.oldBoardPosition = this.boardPosition.copy();
                        this.boardPosition = newBoardPosition;
                        this.isAnimating = false;
                        console.log("value updated");
                    }
                });
                // redo later
                // if (gameController.getEngine().getBoard()[newBoardPosition.x][newBoardPosition.y] !== this.value) {
                //     timeline.add(() => {
                //       const nestedTimeline = gsap.timeline();
                //       nestedTimeline.to(this, {
                //         borderColor: "#f1c40f",
                //         duration: 0.2,
                //         yoyo: 2,
                //         repeat: 1,
                //         onComplete: () => {
                //           this.value = gameController.getEngine().getBoard()[newBoardPosition.x][newBoardPosition.y]; //refactor this later
                //           console.log("value updated");
                //         }
                //       });
                //     }, "<");
                //   }
                if (Tile.engine.getBoard()[newBoardPosition.x][newBoardPosition.y] !== this.value) 
                {
                    timeline.add(() => {
                      const nestedTimeline = gsap.timeline();
                      if(Tile.visualizer.flashOnCombine)
                      {
                        nestedTimeline.to(this, {
                            borderColor: Tile.visualizer.valueColors["combine"],
                            duration: 0.2,
                            ease: Tile.combineEasing
                          });
                      }
                      nestedTimeline.to(this, {
                        borderColor: Tile.visualizer.valueColors[this.value * 2] ?? Tile.visualizer.valueColors["final"],
                        duration: 0.2,
                        ease: Tile.combineEasing,
                        onComplete: () => {
                            this.value = Tile.engine.getBoard()[newBoardPosition.x][newBoardPosition.y]; //refactor this later
                            this.borderColor = Tile.visualizer.valueColors[this.value] ?? Tile.visualizer.valueColors["final"];
                          }
                      })
                      
                    }, "<");
                }
            timeline.play();
    }

    setValue(newValue)
    {
        this.value = newValue;
        this.borderColor = Tile.visualizer.valueColors[this.value] ?? Tile.visualizer.valueColors["final"];
    }

    reloadTheme()
    {
        this.borderColor = Tile.visualizer.valueColors[this.value] ?? Tile.visualizer.valueColors["final"];
        this.fillColor = Tile.visualizer.valueColors["fill"];
        if(Tile.shape == "circle")
            this.shapeFunction = circle;
        else
            this.shapeFunction = rect;
    }
}