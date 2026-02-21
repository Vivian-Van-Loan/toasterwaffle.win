import {BLOCK_SIZE, COLORS, FPS_60_MS, HIDDEN_ROWS, SPRINT_LINES, ULTRA_FRAMES_60} from './constants.js';
import {GAME_MODES} from "./settings.js";

const gameCanvas = document.getElementById('game');
const gameCavnasCtx = gameCanvas.getContext('2d');
const gameWidth = gameCanvas.width;
const gameHeight = gameCanvas.height;

const nextCanvas = document.getElementById('next');
const nextCavnasCtx = nextCanvas.getContext('2d');
const nextWidth = nextCanvas.width;
const nextHeight = nextCanvas.height;

const holdCanvas = document.getElementById('hold');
const holdCavnasCtx = holdCanvas.getContext('2d');
const holdWidth = holdCanvas.width;
const holdHeight = holdCanvas.height;

const scoreLabels = [document.getElementById('score-label'), document.getElementById('score-num-label')];
const highScoreLabels = [document.getElementById('high-score-label'), document.getElementById('high-score-num-label')];
const levelLabels = [document.getElementById('level-label'), document.getElementById('level-num-label')];
const remainingLabels = [document.getElementById('remaining-label'), document.getElementById('remaining-num-label')];
const linesLabels = [document.getElementById('lines-label'), document.getElementById('lines-num-label')];

const heldLabel =  document.getElementById('held-label');
const nextLabel =  document.getElementById('next-label');

export class Renderer {
    constructor(game) {
        this.gameCtx = gameCavnasCtx;
        this.nextCtx = nextCavnasCtx;
        this.holdCtx = holdCavnasCtx;
        this.game = game;
    }

    draw() {
        this.gameCtx.fillStyle = COLORS.BLACK;
        this.gameCtx.clearRect(0, 0, gameWidth, gameHeight);
        this.drawMatrix(this.game.board.grid);
        if (!this.game.inARE) {
            this.drawPiece(this.game.currentPiece);
            this.drawPiece(this.game.ghostPiece, true);
        }
        if (this.game.paused) {
            this.gameCtx.fillStyle = COLORS.WHITE;
            this.gameCtx.fillRect(0, 0, gameWidth, gameHeight);
            this.gameCtx.fillStyle = COLORS.BLACK;
            this.gameCtx.font = "bold 32px sans-serif";
            this.gameCtx.textAlign = "center";
            this.gameCtx.fillText("PAUSED", gameWidth / 2, gameHeight / 2);
        }

        this.nextCtx.fillStyle = COLORS.BLACK;
        this.nextCtx.clearRect(0, 0, nextWidth, nextHeight);
        this.drawExtraPiece(this.game.bag.peekPiece(0), this.nextCtx, nextWidth, nextHeight);

        this.holdCtx.fillStyle = COLORS.BLACK;
        this.holdCtx.clearRect(0, 0, holdWidth, holdHeight);
        if (this.game.heldPiece)
            this.drawExtraPiece(this.game.heldPiece, this.holdCtx, holdWidth, holdHeight);

        this.updateHUD();
    }

    drawMatrix(matrix) {
        matrix = matrix.slice(HIDDEN_ROWS);
        matrix.forEach((row, y) => {
            row.forEach((entry, x) => {
                if (entry.filled) {
                    this.gameCtx.fillStyle = entry.color;
                    this.gameCtx.fillRect(
                        x * BLOCK_SIZE,
                        y * BLOCK_SIZE,
                        BLOCK_SIZE,
                        BLOCK_SIZE
                    );
                }
            });
        });
    }

    drawPiece(piece, transparent = false) {
        if (transparent) this.gameCtx.globalAlpha = 0.333333333;
        piece.matrix.forEach((row, y) => {
            row.forEach((val, x) => {
                if (val) {
                    this.gameCtx.fillStyle = piece.color;
                    this.gameCtx.fillRect(
                        (piece.x + x) * BLOCK_SIZE,
                        (piece.y + y - HIDDEN_ROWS) * BLOCK_SIZE,
                        BLOCK_SIZE,
                        BLOCK_SIZE
                    )
                }
            })
        })
        if (transparent) this.gameCtx.globalAlpha = 1;
    }

    drawExtraPiece(piece, canvas, canvWidth, canvHeight, transparent = false) {
        let {min_x, min_y, max_x, max_y} = piece.getExtents();
        let width = (max_x - min_x + 1) * BLOCK_SIZE;
        let height = (max_y - min_y + 1) * BLOCK_SIZE;
        let off_x = (canvWidth - width) / 2;
        let off_y = (canvHeight - height) / 2;

        if (transparent) canvas.globalAlpha = 0.333333333;
        piece.matrix.forEach((row, y) => {
            row.forEach((val, x) => {
                if (val) {
                    canvas.fillStyle = piece.color;
                    canvas.fillRect(
                        (x - min_x) * BLOCK_SIZE + off_x,
                        (y - min_y) * BLOCK_SIZE + off_y,
                        BLOCK_SIZE,
                        BLOCK_SIZE
                    )
                }
            })
        })
        if (transparent) canvas.globalAlpha = 1;
    }

    presetHUD() {
        if (this.game.settings.gameMode === GAME_MODES.MARATHON) {
            scoreLabels[0].innerText = "SCORE";
            highScoreLabels[0].innerText = "HIGH SCORE";
            levelLabels[0].innerText = "LEVEL";
            remainingLabels[0].innerText = " ";
            remainingLabels[1].innerText = " ";
            linesLabels[0].innerText = "LINES";
        } else if (this.game.settings.gameMode === GAME_MODES.SPRINT) {
            scoreLabels[0].innerText = "TIME";
            highScoreLabels[0].innerText = "BEST TIME";
            levelLabels[0].innerText = "LEVEL";
            remainingLabels[0].innerText = "REMAINING";
            linesLabels[0].innerText = "LINES";
        } else if (this.game.settings.gameMode === GAME_MODES.ULTRA) {
            scoreLabels[0].innerText = "SCORE";
            highScoreLabels[0].innerText = "HIGH SCORE";
            levelLabels[0].innerText = "LEVEL";
            remainingLabels[0].innerText = "REMAINING";
        }
    }

    updateHUD() {
        if (this.game.settings.gameMode === GAME_MODES.MARATHON) {
            scoreLabels[1].innerText = this.game.score.toString();
            // highScoreLabels[1].innerText = this.game.score.toString(); //todo FIGURE OUT HIGH SCORES
            levelLabels[1].innerText = this.game.level.toString();
            linesLabels[1].innerText = this.game.totalClearedLines.toString();
        } else if (this.game.settings.gameMode === GAME_MODES.SPRINT) {
            scoreLabels[1].innerText = Renderer.formatTime(this.game.frameCount60);
            // highScoreLabels[1].innerText = Renderer.formatTime(this.game.frameCount60); //todo: also figure out high scores
            levelLabels[1].innerText = this.game.level.toString();
            remainingLabels[1].innerText = (SPRINT_LINES - this.game.totalClearedLines).toString();
            linesLabels[1].innerText = this.game.totalClearedLines.toString();
        } else if (this.game.settings.gameMode === GAME_MODES.ULTRA) {
            scoreLabels[1].innerText = this.game.score.toString();
            // highScoreLabels[1].innerText = this.game.score.toString(); //todo ditto
            levelLabels[1].innerText = this.game.level.toString();
            remainingLabels[1].innerText = Renderer.formatTime(ULTRA_FRAMES_60 - this.game.frameCount60);
            linesLabels[1].innerText = this.game.totalClearedLines.toString();
        }

        heldLabel.innerText = (this.game.heldPiece ? this.game.heldPiece.name : "");
        nextLabel.innerText = this.game.bag.peekPiece(0).name;
    }

    static formatTime(frames) {
        return (frames * FPS_60_MS / 1000).toFixed(4); //todo: improve via seconds and minutes
    }
}
