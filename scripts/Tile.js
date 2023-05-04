class Tile
{
    constructor(x,y,size,boardPosition)
    {
        this.position = createVector(x,y);
        this.size = size;
        this.value = 2;
        this.boardPosition = boardPosition;
        this.isAnimating = false;
        this.oldBoardPosition = null;
        this.valueColor = "#3498db";
        this.fillColor = "#2c3e50";
    }

    show()
    {
        
        textSize(this.size*0.5);
        fill(this.fillColor);
        rect(this.position.x,
            this.position.y,
            this.size,this.size)
        fill(this.valueColor);
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
                ease: "bounce.out", // Add bounce easing
                duration: 0.3
            },
        );
    }

    moveBy(boardPositionVector)
    {
        this.isAnimating = true;
        //make sure size isnt being animated!
        let newPosition= createVector(this.position.x + boardPositionVector.x * visualizer.gridCellSize,
                                      this.position.y + boardPositionVector.y * visualizer.gridCellSize)

        let newBoardPosition = this.boardPosition.copy().add(boardPositionVector);

        // gsap.to(this.position, { 
        //         x: newPosition.x,
        //         y: newPosition.y,
        //         ease: "expo.out", // Add bounce easing
        //         duration: 0.5,
        //         onComplete: () => {
        //             //this must be done in visualizer one every tile has finished animating
        //             // visualizer.tiles[newBoardPosition.x][newBoardPosition.y] = this;
        //             // visualizer.tiles[this.boardPosition.x][this.boardPosition.y] = null;
        //             this.oldBoardPosition = this.boardPosition.copy();
        //             this.boardPosition = newBoardPosition;
        //             this.isAnimating = false;
        //         }
        //     });
        const timeline = new TimelineLite();
        timeline.to(this.position, { 
                    x: newPosition.x,
                    y: newPosition.y,
                    ease: "expo.out", // Add bounce easing
                    duration: 0.5,
                    onComplete: () => {
                        //this must be done in visualizer one every tile has finished animating
                        // visualizer.tiles[newBoardPosition.x][newBoardPosition.y] = this;
                        // visualizer.tiles[this.boardPosition.x][this.boardPosition.y] = null;
                        this.oldBoardPosition = this.boardPosition.copy();
                        this.boardPosition = newBoardPosition;
                        this.isAnimating = false;
                        console.log("value updated");
                    }
                });
                if (gameEngine.board[newBoardPosition.x][newBoardPosition.y] !== this.value) {
                    timeline.add(() => {
                      const nestedTimeline = gsap.timeline();
                      nestedTimeline.to(this, {
                        valueColor: "#f1c40f",
                        duration: 0.3,
                        onComplete: () => {
                          this.value = gameEngine.board[newBoardPosition.x][newBoardPosition.y];
                          console.log("value updated");
                        }
                      });
                    }, "<");
                  }
            timeline.play();
    }

    transitionToValue(value)
    {
        if(value == this.value)
            return;

        // gsap.to(this, {
        //     valueColor: "#f1c40f",
        //     duration: 0.5,
        //     onComplete: () => {
        //         this.value = value;
        //     }
        // });
    //     gsap.fromTo(
    //         this,
    //         {
    //             valueColor: "#f1c40fff"
    //         },
    //         {
    //           duration: 2,
    //           valueColor: "#f1c40f00",
    //           yoyo: true, // Causes the animation to reverse back to the initial state
    //           ease: "power2.out", // Easing function (optional),
    //           onComplete: () => {
    //                 this.value = value;
    //             }
    //         }
            
    //       );
    }
}