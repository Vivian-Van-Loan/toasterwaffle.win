import {FPS_60_MS} from "./constants.js";

export class Input {
    constructor(game) {
        this.game = game;
        this.game.setInputHandler(this);
        this.keys = new Set();

        // DAS / ARR (tweak freely)
        this.DAS = FPS_60_MS * 10; //equivalent to 10 frames in 60fps
        this.ARR = FPS_60_MS * 3; //3 frames

        this.leftTimer = 0;
        this.rightTimer = 0;
        this.dropTimer = 0;

        window.addEventListener('keydown', e => this.onKeyDown(e));
        window.addEventListener('keyup',   e => this.onKeyUp(e));
    }

    onKeyDown(e) {
        if (this.game.lost) return;
        if (e.repeat) return;
        this.keys.add(e.code);

        // one-shot actions
        switch (e.code) {
            case 'KeyZ':
                this.game.rotateCounterClockwise();
                break;
            case 'KeyX':
                this.game.rotateClockwise();
                break;
            case 'KeyA':
                this.game.rotate180();
                break;
            case 'ArrowUp':
                this.game.hardDrop();
                break;
            case 'Space':
                this.game.hold();
                break;
            case 'KeyP':
                this.game.togglePause();
                break;
        }
    }

    onKeyUp(e) {
        this.keys.delete(e.code);

        if (e.code === 'ArrowLeft')  this.leftTimer = 0;
        if (e.code === 'ArrowRight') this.rightTimer = 0;
    }

    update(dt) {
        this.handleHorizontal(dt);
        this.handleSoftDrop(dt);
    }

    handleHorizontal(dt) {
        const left  = this.keys.has('ArrowLeft');
        const right = this.keys.has('ArrowRight');

        // ignore opposing directions
        if (left && right) return;

        if (left) {
            this.leftTimer += dt;

            if (this.leftTimer === dt) {
                this.game.move(-1);
            } else if (this.leftTimer > this.DAS) {
                this.game.move(-1);
                this.leftTimer -= this.ARR;
            }
        }

        if (right) {
            this.rightTimer += dt;

            if (this.rightTimer === dt) {
                this.game.move(1);
            } else if (this.rightTimer > this.DAS) {
                this.game.move(1);
                this.rightTimer -= this.ARR;
            }
        }
    }

    handleSoftDrop(dt) {
        if (this.keys.has('ArrowDown')) {
            this.dropTimer += dt;

            if (this.dropTimer === dt) {
                this.game.tryDrop();
            } else if (this.dropTimer > this.DAS) {
                this.game.tryDrop();
                this.dropTimer -= this.ARR;
            }
        }
    }
}
