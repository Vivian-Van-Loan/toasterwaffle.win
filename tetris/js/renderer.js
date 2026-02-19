import {BLOCK_SIZE, COLORS, HIDDEN_ROWS, LINES_PER_LEVEL} from './constants.js';

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

const scoreLabel = document.getElementById('score-label');
const levelLabel = document.getElementById('level-label');
const linesLabel = document.getElementById('lines-label');
const heldLabel = document.getElementById('held-label');
const nextLabel = document.getElementById('next-label');

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

        this.nextCtx.fillStyle = COLORS.BLACK;
        this.nextCtx.clearRect(0, 0, nextWidth, nextHeight);
        this.drawExtraPiece(this.game.bag.peekPiece(0), this.nextCtx, nextWidth, nextHeight);

        this.holdCtx.fillStyle = COLORS.BLACK;
        this.holdCtx.clearRect(0, 0, holdWidth, holdHeight);
        if (this.game.heldPiece)
            this.drawExtraPiece(this.game.heldPiece, this.holdCtx, holdWidth, holdHeight);

        scoreLabel.innerText = "SCORE: " + this.game.score.toString();
        levelLabel.innerText = "LEVEL: " + this.game.level.toString();
        linesLabel.innerText = "LINES: " + this.game.totalClearedLines.toString();
        heldLabel.innerText = (this.game.heldPiece ? "HELD: " + this.game.heldPiece.name : "");
        nextLabel.innerText = "NEXT: " + this.game.bag.peekPiece(0).name;
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
}
