import { Board } from './board.js';
import { Renderer } from './renderer.js';

export class Game {
    constructor() {
        this.renderer = new Renderer(this);
        this.reset();
    }

    start() {
        requestAnimationFrame(this.loop.bind(this));
    }

    reset() {
        this.board = new Board();
        this.lastTime = 0;
        this.dropInterval = 1000;
        this.dropCounter = 0;
    }

    loop(time = 0) {
        if (this.board.lost) {
            this.reset();
        }
        const delta = time - this.lastTime;
        this.lastTime = time;
        this.dropCounter += delta;

        if (this.dropCounter > this.dropInterval) {
            this.board.drop();
            this.dropCounter = 0;
        }

        this.renderer.draw();
        requestAnimationFrame(this.loop.bind(this));
    }

    moveLeft()              { this.board.move(-1); }
    moveRight()             { this.board.move(1); }
    rotateClockwise()       { this.board.rotateClockwise(); }
    rotateCounterClockwise(){ this.board.rotateCounterClockwise(); }
    drop()                  { this.board.drop(); }
    hardDrop()              { this.board.hardDrop(); }
    hold()                  { this.board.hold(); }
}
