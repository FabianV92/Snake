"use strict";


/****************************************************************************
 *                                 MODEL                                    *
 ****************************************************************************/
class Model {
    view = new View();

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    speed = 7;
    tileCount = 20;
    tileSize = this.view.canvasEl.width / this.tileCount - 2;

    headX = 10;
    headY = 10;
    snakeParts = [];
    tailLength = 2;

    appleX = 5;
    appleY = 5;

    xVelocity = 0;
    yVelocity = 0;

    score = 0;

}

/****************************************************************************
 *                                 VIEW                                     *
 ****************************************************************************/
class View {
    canvasEl = document.querySelector(".canvas");
    htmlEl = document.querySelector("html");
    bodyEl = document.querySelector("body");
    ctx = this.canvasEl.getContext('2d');


    windowInit = () => {
        this.canvasEl.width = 400;
        this.canvasEl.height = 400;
        this.htmlEl.style.cssText = "width: 100%; height: 100%;"
        this.bodyEl.style.cssText = "width: 100%; height: 100%; " +
            "background: url(../pictures/background.png) no-repeat center center fixed ; " +
            "display: flex; background-size: cover; justify-content: center; align-items: center; " +
            "overflow: hidden;"

    }

}

/****************************************************************************
 *                                 CONTROLLER                               *
 ****************************************************************************/

class Controller {

    modelData = new Model(this);
    view = new View();

    isGameOver = () => {

        let gameOver = false;

        if (this.modelData.yVelocity === 0 && this.modelData.xVelocity === 0) {
            return false;
        }

        //walls
        if (this.modelData.headX < 0) {
            gameOver = true;
        } else if (this.modelData.headX === this.modelData.tileCount) {
            gameOver = true
        } else if (this.modelData.headY < 0) {
            gameOver = true;
        } else if (this.modelData.headY === this.modelData.tileCount) {
            gameOver = true
        }

        for (let i = 0; i < this.modelData.snakeParts.length; i++) {
            let part = this.modelData.snakeParts[i];
            if (part.x === this.modelData.headX && part.y === this.modelData.headY) {
                gameOver = true;
                break;
            }
        }


        if (gameOver) {
            this.view.ctx.fillStyle = "white";
            this.view.ctx.font = "50px monospace";

            this.view.ctx.fillText("Game Over!", this.view.canvasEl.width / 6.5, this.view.canvasEl.height / 2);
        }

        return gameOver;
    }

    drawScore = () => {

        this.view.ctx.fillStyle = "white";
        this.view.ctx.font = "15px monospace"
        this.view.ctx.fillText("Current score " + this.modelData.score, this.view.canvasEl.width - 275, 20);
    }

    clearScreen = () => {
        this.view.ctx.fillStyle = 'black';
        this.view.ctx.fillRect(0, 0, this.view.canvasEl.width, this.view.canvasEl.height);
    }

    drawSnake = () => {
        this.view.ctx.fillStyle = `#55de65`;
        for (let i = 0; i < this.modelData.snakeParts.length; i++) {
            let part = this.modelData.snakeParts[i];
            this.view.ctx.fillRect(part.x * this.modelData.tileCount, part.y * this.modelData.tileCount,
                this.modelData.tileSize, this.modelData.tileSize);
        }

        this.modelData.snakeParts.push(new Model(this.modelData.headX, this.modelData.headY)); //put an item at the end of the list next to the head
        while (this.modelData.snakeParts.length > this.modelData.tailLength) {
            this.modelData.snakeParts.shift(); // remove the furthet item from the snake parts if have more than our tail size.
        }

        const rndNumber = () => Math.trunc(Math.random()*255);
        this.view.ctx.fillStyle = `rgb(${rndNumber()},${rndNumber()},${rndNumber()})`;
        this.view.ctx.fillRect(this.modelData.headX * this.modelData.tileCount, this.modelData.headY * this.modelData.tileCount,
            this.modelData.tileSize, this.modelData.tileSize);


    }

    changeSnakePosition = () => {
        this.modelData.headX = this.modelData.headX + this.modelData.xVelocity;
        this.modelData.headY = this.modelData.headY + this.modelData.yVelocity;
    }

    drawApple = () => {
        this.view.ctx.fillStyle = "red";
        this.view.ctx.fillRect(this.modelData.appleX * this.modelData.tileCount, this.modelData.appleY * this.modelData.tileCount,
            this.modelData.tileSize, this.modelData.tileSize)
    }

    checkAppleCollision = () => {
        if (this.modelData.appleX === this.modelData.headX && this.modelData.appleY == this.modelData.headY) {
            this.modelData.appleX = Math.floor(Math.random() * this.modelData.tileCount);
            this.modelData.appleY = Math.floor(Math.random() * this.modelData.tileCount);
            this.modelData.tailLength++;
            this.modelData.score++;
        }
    }

     /*Drawing the game with calling methods and update them on 1000/current speed
     The higher the current score, the higher (quicker) the the loop is running, which makes
     the game more difficult*/

    updateLoop = () => {
        this.changeSnakePosition();
        let result = this.isGameOver();
        if (result) {
            return;
        }
        this.view.windowInit();
        this.clearScreen();
        this.checkAppleCollision();
        this.drawApple();
        this.drawSnake();
        this.drawScore();

        if (this.modelData.score > 5) {
            this.modelData.speed = 9;
        }
        if (this.modelData.score > 10) {
            this.modelData.speed = 11;
        }

        setTimeout(this.updateLoop, 1000 / this.modelData.speed);
    }


    snakeKeyController = () => {
        document.body.addEventListener('keydown', (e) => {
            // Up
            if (e.key == "ArrowUp") {
                console.log("up");
                if (this.modelData.yVelocity == 1)
                    return;
                this.modelData.yVelocity = -1;
                this.modelData.xVelocity = 0;
            }

            // Down
            if (e.key == "ArrowDown") {
                console.log("down");
                if (this.modelData.yVelocity == -1)
                    return;
                this.modelData.yVelocity = 1;
                this.modelData.xVelocity = 0;
            }

            // Left
            if (e.key == "ArrowLeft") {
                console.log("left");
                if (this.modelData.xVelocity == 1)
                    return;
                this.modelData.yVelocity = 0;
                this.modelData.xVelocity = -1;
            }

            // Right
            if (e.key == "ArrowRight") {
                console.log("right");
                if (this.modelData.xVelocity == -1)
                    return;
                this.modelData.yVelocity = 0;
                this.modelData.xVelocity = 1;
            }
        })

    }
}

// Main method calling itself and initializing the game
const main = function () {
    // Declaring an initializing
    const init = new Controller();

    // Calling methods
    init.updateLoop();
    init.snakeKeyController();
}();// <-- calling itself

