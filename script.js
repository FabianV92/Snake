`use strict`;

/********************************************************
 *                      MODEL CLASS                     *
 * The model class contains all the data                *
 ********************************************************/

window.onload = function () {
    class Model {

        // Variables
        box = 25;
        canvasSize = 23;
        canvasHeight = 600;
        canvasWidth = 600;
        snake = [];
        direction;
        snakeX;
        snakeY;
        score = 0;
        highscore = 0;
        gameState = `Play`;
        gameOverSound = true;
        gameOver = new Audio(`./sounds/gameOver.wav`);
        eatSound = new Audio(`./Sounds/eat.wav`);


        // Giving the food object with the x and y coordinate random generated coordinates
        createRandomFoodCoordinates = () => Math.floor(1 + (Math.random() * (this.canvasSize - 1))) * this.box;
        food = {
            x: this.createRandomFoodCoordinates(),
            y: this.createRandomFoodCoordinates(),
        }

        // Selecting elements
        canvasEl = document.querySelector("canvas");
        bodyEl = document.querySelector("body");
        htmlEl = document.querySelector("html");
        helpBtnEl = document.querySelector("button");
        userInfoTxtDivEl = document.querySelector(".infoDiv");
        closeIconEl = document.querySelector(".closeIcon");
        arrowImgEl = document.querySelector(".arrowKeysImg");
        headTxtInfoTxtEl = document.querySelector("h1");
        controlTxtInfoEl = document.querySelector("h3");

        // Initializing the context variable to the getContext in 2 dimensional
        context = this.canvasEl.getContext("2d");
    }

    /********************************************************
     *                       VIEW CLASS                     *
     * The main function calls itself and calls the game    *
     * initializing methods                                 *
     ********************************************************/

    class View {
        modelData = new Model();

        drawWebsite = () => {

            // Set canvas height and width
            this.modelData.canvasEl.width = this.modelData.canvasWidth;
            this.modelData.canvasEl.height = this.modelData.canvasHeight;

            // Styling elements
            this.modelData.canvasEl.style.cssText = "background-color: black; align-self: center;"
            this.modelData.bodyEl.style.cssText = "display: flex; flex-direction: column; justify-content: center; " +
                "width: 100%; height: 100%; align-items: center; "
            this.modelData.htmlEl.style.cssText = "background: url(./images/backgroundArcade.jpg) no-repeat center center " +
                "fixed; background-size: cover; display: flex; width: 100%; height: 100%; font-family: monospace; " +
                "overflow: hidden;"
            this.modelData.helpBtnEl.style.cssText = " position: absolute; top: 25px; left: 25px; background-color: black;" +
                "border: none; color: white; width: 100px; height: 50px; font-size: 25px; font-family: monospace;" +
                "cursor: pointer; box-shadow: rgb(76 6 6) 1px 1px 2px 3px; outline: none;"
            this.modelData.closeIconEl.style.cssText = "width: 15px; cursor: pointer;";
        }
    }

    /********************************************************
     *                       CONTROLLER CLASS               *
     * The controller class contains game methods which are *
     * used to control the game                             *
     ********************************************************/

    class Controller {

        // Creating an instances
        view = new View();
        modelData = new Model();

        // Snake starting position
        snakeStartPos = this.modelData.snake[0] = {
            // With Math.floor i make sure it will be a whole number
            x: Math.floor(this.modelData.canvasSize / 2) * this.modelData.box,
            y: Math.floor(this.modelData.canvasSize / 2) * this.modelData.box
        }

        // Clearing screen arrow function to avoid duplicated code
        clearScreen = () => {
            this.modelData.context.clearRect(0, 25, this.modelData.canvasEl.width, this.modelData.canvasEl.height);
        }

        // Set Direction by pressed arrow keys
        directionControl = () => {
            document.addEventListener(`keydown`, (e) => {
                if (this.modelData.gameState !== `GameOver`) {
                    if (e.key === `ArrowLeft` && this.modelData.direction !== `RIGHT`)//Only if the direction is not set to
                        this.modelData.direction = `LEFT`;                          // the opposite direction
                    if (e.key === `ArrowRight` && this.modelData.direction !== `LEFT`)
                        this.modelData.direction = `RIGHT`;
                    if (e.key === `ArrowUp` && this.modelData.direction !== `DOWN`)
                        this.modelData.direction = `UP`;
                    if (e.key === `ArrowDown` && this.modelData.direction !== `UP`)
                        this.modelData.direction = `DOWN`;
                }
            })
        }

        // The update function will be called, with the setInterval method and 100ms.
        // Which means it's basically the heart of the game and calls functions over functions and make the game dynamic.
        update = () => {

            // Adding event listener to the help button, if pressed adding style do the displayed info text
            this.modelData.helpBtnEl.addEventListener(`click`, () => {
                this.modelData.canvasEl.classList.add(`hide`);
                this.modelData.helpBtnEl.style.cssText = `display: none`;
                this.modelData.userInfoTxtDivEl.style.cssText = `background-color: white; display: flex; ` +
                    `flex-direction: column; align-items: flex-end; max-width: 500px;` +
                    `box-shadow: 3px 3px 5px 6px rgb(76,6,6); padding: 10px;`
                this.modelData.arrowImgEl.style.cssText = `width: 140px; align-self: center;`
                this.modelData.headTxtInfoTxtEl.style.cssText = `align-self: center;`
                this.modelData.controlTxtInfoEl.style.cssText = `align-self: center;`
            });

            // Adding event listener to the close image icon, if pressed info txt will be closed and canvas displayed
            this.modelData.closeIconEl.addEventListener(`click`, () => {
                this.modelData.userInfoTxtDivEl.style.cssText = `display: none;`;
                this.modelData.helpBtnEl.style.cssText = `display: block;`;
                this.modelData.canvasEl.classList.remove(`hide`);
                this.modelData.helpBtnEl.style.cssText = `position: absolute; top: 25px; left: 25px; ` +
                    `background-color: black; border: none; color: white;` +
                    `width: 100px; height: 50px; font-size: 25px; font-family: monospace; cursor: pointer;` +
                    `box-shadow: rgb(76 6 6) 1px 1px 2px 3px; outline: none;`
            });


            // Adding event listener on the key ESC and remove display none on canvas and add some style
            document.addEventListener(`keydown`, (e) => {
                if (e.key === `Escape`) {
                    this.modelData.userInfoTxtDivEl.style = `display: none;`;
                    this.modelData.helpBtnEl.style.cssText = `display: block`;
                    this.modelData.canvasEl.classList.remove(`hide`);
                    this.modelData.helpBtnEl.style.cssText = `position: absolute; top: 25px; left: 25px;` +
                        `background-color: black; border: none; color: white;` +
                        `width: 100px; height: 50px; font-size: 25px; font-family: monospace; cursor: pointer;` +
                        `box-shadow: rgb(76 6 6) 1px 1px 2px 3px; outline: none;`
                }
            })


            // Draw the background
            this.modelData.context.fillStyle = `white`;
            this.modelData.context.fillRect(this.modelData.box, this.modelData.box, this.modelData.canvasSize *
                this.modelData.box - this.modelData.box,
                this.modelData.canvasSize * this.modelData.box - this.modelData.box);


            // Draw snake head and tail via a for loop, to prevent duplicated code
            if (this.modelData.gameState === `Play`) {
                for (let i = 0; i < this.modelData.snake.length; i++) {
                    this.modelData.context.fillStyle = `black`;
                    this.modelData.context.fillRect(this.modelData.snake[i].x, this.modelData.snake[i].y,
                        this.modelData.box, this.modelData.box)
                }
            }

            // Moving the snake head
            this.modelData.snakeX = this.snakeStartPos.x;
            this.modelData.snakeY = this.snakeStartPos.y;

            // Checking direction and subtract or add to the position
            if (this.modelData.direction === `LEFT`)
                this.snakeStartPos.x -= this.modelData.box;
            if (this.modelData.direction === `RIGHT`)
                this.snakeStartPos.x += this.modelData.box;
            if (this.modelData.direction === `UP`)
                this.snakeStartPos.y -= this.modelData.box;
            if (this.modelData.direction === `DOWN`) {
                this.snakeStartPos.y += this.modelData.box;
            }

            // Collision add food score
            if (this.snakeStartPos.x === this.modelData.food.x &&
                this.snakeStartPos.y === this.modelData.food.y) {
                this.modelData.score += 1;
                {
                    this.modelData.food = {
                        x: this.modelData.createRandomFoodCoordinates(),
                        y: this.modelData.createRandomFoodCoordinates(),
                    }
                    // Playing the eat sound if snake had a collision with the coin
                    this.modelData.eatSound.play().then(r => {
                        return r;
                    });
                }
            } else {
                this.modelData.snake.pop();
            }


            // Draw the score
            this.modelData.context.clearRect(0, 0, 200, 25)
            this.modelData.context.fillStyle = `white`;
            this.modelData.context.font = `15px monospace`;
            this.modelData.context.fillText(`Current score: ` + this.modelData.score,
                this.modelData.canvasEl.width - 575, 20);

            // Draw Highscore
            this.modelData.context.clearRect(300, 0, 280, 25)
            this.modelData.context.fillStyle = `white`;
            this.modelData.context.font = `15px monospace`;

            const drawHighscore = () => {
                this.modelData.context.fillText(`Highscore: ` + this.modelData.highscore,
                    this.modelData.canvasEl.width - 130, 20);
            }

            if (this.modelData.score > this.modelData.highscore) {
                this.modelData.highscore = this.modelData.score;
                drawHighscore();
            } else {
                drawHighscore();
            }

            let newHead = {
                x: this.modelData.snakeX,
                y: this.modelData.snakeY
            }

            // Check collision
            let collision = (head, array) => {
                for (let i = 0; i < array.length; i++) {
                    if (head.x === array[i].x && head.y === array[i].y) {
                        return true;
                    }
                }
                return false;
            }

            // Checking collision for the wall
            if (this.modelData.snakeX < this.modelData.box || this.modelData.snakeY < this.modelData.box
                || this.modelData.snakeX > (this.modelData.canvasSize - 1) * this.modelData.box
                || this.modelData.snakeY > (this.modelData.canvasSize - 1) * this.modelData.box
                || collision(newHead, this.modelData.snake)) {

                // Change game status to game over
                this.modelData.gameState = `GameOver`;

                // If game status is game over will reset all values from here on
                if (this.modelData.gameState === `GameOver`) {
                    this.modelData.score = 0;
                    // Clearing the screen
                    this.clearScreen();

                    // Resetting the snake segments
                    for (let i = 0; i < this.modelData.snake.length; i++) {
                        this.modelData.snake.pop();
                    }

                    // Draw game over text
                    this.modelData.context.fillStyle = `white`;
                    this.modelData.context.font = `60px monospace`;
                    this.modelData.context.fillText(`Game over!`, this.modelData.canvasEl.width / 4.5,
                        this.modelData.canvasEl.height / 3)

                    // Draw play again text
                    this.modelData.context.fillStyle = `white`;
                    this.modelData.context.font = `30px monospace`;
                    this.modelData.context.fillText(`Press enter to play again!`, this.modelData.canvasEl.width / 6.5,
                        this.modelData.canvasEl.height / 2);

                }
                // Playing the game over sound if game over state and game over sound is true
                if (this.modelData.gameState === `GameOver` && this.modelData.gameOverSound) {
                    this.modelData.gameOver.play().then(r => {
                        return r;
                    });
                }
                this.modelData.gameOverSound = false;

                document.addEventListener(`keydown`, (e) => {
                    if (e.key === `Enter` && this.modelData.gameState === `GameOver`) {

                        // Resetting game over sound
                        this.modelData.gameOverSound = true;

                        // Assign the food new random coordinates
                        this.modelData.food = {
                            x: this.modelData.createRandomFoodCoordinates(),
                            y: this.modelData.createRandomFoodCoordinates(),
                        }

                        // Assign the snake position variables back to center of the canvas
                        this.snakeStartPos = {
                            x: Math.floor(this.modelData.canvasSize / 2) * this.modelData.box,
                            y: Math.floor(this.modelData.canvasSize / 2) * this.modelData.box
                        }
                        newHead = {
                            x: this.modelData.snakeX,
                            y: this.modelData.snakeY
                        }
                        // Moving the snake head
                        this.modelData.snakeX = this.snakeStartPos.x;
                        this.modelData.snakeY = this.snakeStartPos.y;

                        this.modelData.direction = `RIGHT`;

                        // Change game status to play
                        this.modelData.gameState = `Play`;
                    }
                })
            }
            if (this.modelData.gameState === `Play`) {
                this.modelData.snake.unshift(newHead);

                // Drawing the food
                this.modelData.context.fillStyle = `red`;
                this.modelData.context.fillRect(this.modelData.food.x,
                    this.modelData.food.y, this.modelData.box, this.modelData.box)
            }
        }

        // Calling the update method every 100 ms
        game = setInterval(this.update, 100);
    }

    /********************************************************
     *                       MAIN FUNCTION                  *
     * The main function calls itself and calls the game    *
     * initializing methods                                 *
     ********************************************************/

    const main = function () {
        const control = new Controller();
        const view = new View();

        // Calling the draw website method and the control method
        view.drawWebsite();
        control.directionControl();
    }(); // Calling here itself
}