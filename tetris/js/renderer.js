import {BLOCK_SIZE, COLORS} from './constants.js';

const gameCanvas = document.getElementById('game');
const gameCavnasCtx = gameCanvas.getContext('2d');
const nextCanvas = document.getElementById('next');
const nextCavnasCtx = nextCanvas.getContext('2d');
// const holdCanvas = document.getElementById('hold');
// const holdCavnasCtx = holdCanvas.getContext('2d');

export class Renderer {
    constructor(game) {
        this.gameCtx = gameCavnasCtx;
        this.nextCtx = nextCavnasCtx;
        // this.holdCtx = holdCavnasCtx;
        this.game = game;
    }

    draw() {
        this.gameCtx.fillStyle = COLORS.BLACK;
        this.gameCtx.clearRect(0, 0, 300, 600);
        this.drawMatrix(this.game.board.grid);
        this.drawPiece(this.game.board.currentPiece);

        this.nextCtx.fillStyle = COLORS.BLACK;
        this.nextCtx.clearRect(0, 0, 125, 125);
        this.drawExtraPiece(this.game.board.bag.peekPiece(), this.nextCtx);

        // this.holdCtx.fillStyle = COLORS.BLACK;
        // this.holdCtx.clearRect(0, 0, 125, 125);
        // if (this.game.board.heldPiece)
        //     this.drawExtraPiece(this.game.board.heldPiece, this.holdCtx);
    }

    drawMatrix(matrix) {
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

    drawPiece(piece) {
        piece.matrix.forEach((row, y) => {
            row.forEach((val, x) => {
                if (val) {
                    this.gameCtx.fillStyle = piece.color;
                    this.gameCtx.fillRect(
                        (piece.x + x) * BLOCK_SIZE,
                        (piece.y + y) * BLOCK_SIZE,
                        BLOCK_SIZE,
                        BLOCK_SIZE
                    )
                }
            })
        })
    }

    drawExtraPiece(piece, canvas) {
        let {min_x, min_y, max_x, max_y} = piece.getExtents();
        let width = (max_x - min_x + 1) * BLOCK_SIZE - 1; //minus 1 as otherwise there's slight edges visible, which looks cool
        let height = (max_y - min_y + 1) * BLOCK_SIZE - 1; //but isn't worth doing everywhere
        let off_x = (125 - width) / 2;
        let off_y = (125 - height) / 2;

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
    }
}
