import { Board } from './board.js';
import { Renderer } from './renderer.js';
import { BAG_MODES, PieceBag } from "./piece.js";
import { FPS_60_MS, GRAVITY, LINES_PER_LEVEL } from "./constants.js";
import { audioManager } from "./audioManager.js";
import { overlayManager } from "./overlayManager.js";

export class Game {
    constructor() {
        this.renderer = new Renderer(this);
        this.started = false;
        this.paused = true;
        this.reset();
    }

    setInputHandler(handler) {
        this.input = handler;
    }

    start() {
        this.reset();
        this.started = true;
        this.paused = false;
        requestAnimationFrame(this.loop.bind(this));
    }

    pause() {
        this.paused = true;
    }

    reset() {
        this.lastTime = performance.now();
        this.dropInterval = FPS_60_MS;
        this.dropTimer = 0;
        this.gravityTracker = 0;

        this.lockDelay = FPS_60_MS * 30; //60 fps equiv frames worth of time to lock piece
        this.lockCounter = 0;
        this.touchingGround = false;
        this.maxLockResets = 15;
        this.lockResets = 0;

        this.areDelay = FPS_60_MS * 10; //60 fps equiv frames worth of time to lock piece
        this.areCounter = 0;
        this.inARE = false;

        this.board = new Board();
        this.bag = new PieceBag(BAG_MODES.BASIC);
        this.newPiece();
        this.heldPiece = null;
        this.lost = false;
        this.holdSwapped = false;
        this.level = 1;
        this.score = 0;
        this.clearedLines = 0;
    }

    loop(time = 0) {
        if (this.paused) {
            this.lastTime = time; //cancel all time accumulations
            requestAnimationFrame(this.loop.bind(this));
            return;
        }

        if (this.lost) {
            this.renderer.draw(); //show final frame
            if (overlayManager.game === this) {
                overlayManager.showGameOver();
            }
            requestAnimationFrame(this.loop.bind(this));
            return;
        }

        let delta = time - this.lastTime;
        this.lastTime = time;

        if (this.input) {
            this.input.update(delta);
        }

        this.dropTimer += delta;
        if (!this.inARE) {
            let timerExpired = false;
            while (this.dropTimer >= this.dropInterval) {
                this.dropTimer -= this.dropInterval;
                timerExpired = true;
                for (let level in GRAVITY) {
                    if (this.level >= level) {
                        let gravity = GRAVITY[level];
                        this.gravityTracker += gravity;
                    }
                }
            }
            if (timerExpired) {
                this.dropTimer = 0; //reset it so we aren't getting annoying overflow
            }
            while (this.gravityTracker >= 256) {
                this.gravityTracker -= 256;
                this.tryDrop();
            }
        }
        if (this.touchingGround && !this.inARE) {
            this.lockCounter += delta;
            if (this.lockCounter >= this.lockDelay) {
                this.lockPiece();
            }
        }
        if (this.inARE) {
            this.areCounter += delta;
            if (this.areCounter >= this.areDelay) {
                this.inARE = false;
                this.newPiece();
            }
        }

        this.renderer.draw();
        requestAnimationFrame(this.loop.bind(this));
    }

    newPiece() {
        this.currentPiece = this.bag.newPiece(this.board);
        this.holdSwapped = false;
        this.getGhost();

        this.lockCounter = 0;
        this.lockResets = 0;

        //Grounding state is derived from the piece's position
        this.touchingGround = this.isGrounded();
    }


    move(dir) {
        let moved = this.currentPiece.copy();
        moved.x += dir;
        if (!this.board.collides(moved)) {
            this.successfulMove(moved);
            audioManager.move();
        }
    }

    rotateCheck(rotated, offsets) {
        let x_origin = rotated.x;
        let y_origin = rotated.y;
        for (let offset of offsets) {
            rotated.x = x_origin + offset[0];
            rotated.y = y_origin + offset[1];
            if (!this.board.collides(rotated)) {
                this.successfulMove(rotated);
                audioManager.rotate();
                return;
            }
        }
    }

    rotateClockwise() {
        let rotated = this.currentPiece.rotateClockwise();
        const offsets = [[0, 0], [+1, 0], [0, +1], [-1, 0], [0, -1], [+1, +1], [+1, -1], [-1, +1], [-1, -1], [+2, 0], [-2, 0], [0, +2], [0, -2]];
        this.rotateCheck(rotated, offsets);
    }

    rotateCounterClockwise() {
        let rotated = this.currentPiece.rotateCounterClockwise();
        const offsets = [[0, 0], [-1, 0], [0, -1], [+1, 0], [0, +1], [-1, -1], [-1, +1], [+1, -1], [+1, +1], [-2, 0], [0, -2], [+2, 0], [0, +2]];
        this.rotateCheck(rotated, offsets);
    }

    tryDrop() {
        let moved = this.currentPiece.copy();
        moved.y++;

        if (!this.board.collides(moved)) {
            this.successfulMove(moved);
            return false; //piece moved down
        }

        this.touchingGround = true;
        return true;
    }

    successfulMove(piece) {
        this.currentPiece = piece;
        this.getGhost();

        this.touchingGround = this.isGrounded(piece);

        if (this.touchingGround) this.resetLockDelay();
    }

    isGrounded(piece = this.currentPiece) {
        const test = piece.copy();
        test.y++;
        return this.board.collides(test);
    }

    resetLockDelay() {
        if (!this.touchingGround) return;
        if (this.lockResets >= this.maxLockResets) return;

        this.lockCounter = 0;
        this.lockResets++;
    }

    checkSpun() {
        let copy = this.currentPiece.copy();
        let origin_x = copy.x;
        let origin_y = copy.y;
        const offsets = [[-1, 0], [+1, 0], [0, -1], [0, +1]];
        for (let offset of offsets) {
            copy.x = origin_x + offset[0];
            copy.y = origin_y + offset[1];
            if (!this.board.collides(copy)) {
                return false;
            }
        }
        return true;
    }

    lockPiece() {
        let spun = this.checkSpun();
        let {cleared, lost} = this.board.lockPiece(this.currentPiece);
        this.lost = this.lost || lost;

        const clearScores = [0, 100, 300, 500, 800, 1500, 2000, 4000, 8000]; //again past a certain post shouldn't even be possible
        this.score += clearScores[cleared] * this.level * (this.board.isEmpty() ? 2 : 1);
        const spinScores = [100, 100, 1200, 1600, 2400, 3500, 5000, 10000];
        if (spun) {
            this.score += spinScores[cleared] * (this.level + 1) * (this.board.isEmpty() ? 2 : 1);
        }

        this.clearedLines += cleared;
        while (this.clearedLines >= LINES_PER_LEVEL) {
            this.clearedLines -= LINES_PER_LEVEL;
            this.level++;
            audioManager.levelUp();
        }

        this.inARE = true;
        this.areCounter = 0;

        //Reset lock state for next piece
        this.lockCounter = 0;
        this.lockResets = 0;
        this.touchingGround = false; //piece is gone

        audioManager.lock();
        if (cleared > 0) audioManager.clear(cleared);
        if (spun) audioManager.spun();
    }

    hardDrop() {
        if (this.inARE) {
            return;
        }
        while (!this.tryDrop());
        this.lockPiece();
    }

    getGhost() {
        this.ghostPiece = this.currentPiece.copy();
        let collided = false;
        while (!collided) {
            this.ghostPiece.y++;
            if (this.board.collides(this.ghostPiece)) {
                this.ghostPiece.y--;
                collided = true;
            }
        }
    }

    hold() {
        if (this.holdSwapped)
            return;
        this.holdSwapped = true;
        let cur = this.bag.reconstructPiece(this.currentPiece);
        if (this.heldPiece) {
            this.currentPiece = this.heldPiece;
        } else {
            this.newPiece();
            this.holdSwapped = true;
        }
        this.heldPiece = cur;
        this.getGhost();
        audioManager.hold();
    }
}
