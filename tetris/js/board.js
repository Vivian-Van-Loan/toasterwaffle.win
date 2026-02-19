import {COLORS, COLS, ROWS} from './constants.js';
import {BAG_MODES, Piece, PieceBag} from './piece.js';

export class Board {
    constructor() {
        this.grid = this.createGrid();
        this.bag = new PieceBag(BAG_MODES.BASIC);
        this.currentPiece = this.bag.getPiece();
        this.heldPiece = null;
        this.lost = false;
    }

    createGrid() {
        return Array.from({ length: ROWS }, () =>
            // Array(COLS).fill(0)
            Array(COLS).fill({color: COLORS.BLACK, filled: false})
        );
    }

    newPiece() {
        this.currentPiece = this.bag.getPiece();
        if (this.collides(this.currentPiece)) {
            this.lost = true;
        }
    }

    move(dir) {
        let moved = this.currentPiece.copy();
        moved.x += dir;
        if (!this.collides(moved)) {
            this.currentPiece = moved;
        }
    }

    drop() {
        let moved = this.currentPiece.copy();
        moved.y++;
        if (!this.collides(moved)) {
            this.currentPiece = moved;
        } else {
            this.lockPiece(this.currentPiece);
            this.newPiece();
            return true;
        }
        return false;
    }

    hardDrop() {
        while (!this.drop());
    }

    hold() {
        if (this.heldPiece) {

        }
        this.heldPiece = this.currentPiece;
    }

    rotateClockwise() {
        let rotated = this.currentPiece.rotateClockwise();
        if (!this.collides(rotated)) {
            this.currentPiece = rotated;
            return;
        }
        let x_origin = rotated.x;
        const offsets = [+1, -1, +2, -2]
        for (let i = 0; i < offsets.length; i++) {
            rotated.x = x_origin + offsets[i];
            if (!this.collides(rotated)) {
                this.currentPiece = rotated;
                return;
            }
        }
    }

    rotateCounterClockwise() {
        let rotated = this.currentPiece.rotateCounterClockwise();
        if (!this.collides(rotated)) {
            this.currentPiece = rotated;
            return;
        }
        let x_origin = rotated.x;
        const offsets = [-1, +1, -2, +2]
        for (let i = 0; i < offsets.length; i++) {
            rotated.x = x_origin + offsets[i];
            if (!this.collides(rotated)) {
                this.currentPiece = rotated;
                return;
            }
        }
    }

    collides(piece) {
        let offset_y = piece.y;
        let offset_x = piece.x;
        let {min_x, min_y, max_x, max_y} = piece.getExtents();
        for (let y = 0; y < piece.matrix.length; y++) {
            let row = piece.matrix[y];
            for (let x = 0; x < row.length; x++) {
                if (row[x]) {
                    if (y + offset_y < 0) continue;
                    if (y + offset_y >= ROWS || x + offset_x >= COLS ||
                      /*y + offset_y <  0    || */x + offset_x <  0    ||
                      this.grid[y + offset_y][x + offset_x].filled) {
                        return true;
                    }
                }
            }
        }
        // if (offset_y + min_y < 0) return true;
        if (offset_y + max_y >= ROWS) return true;
        if (offset_x + min_x < 0) return true;
        if (offset_x + max_x >= COLS) return true;
    }

    lockPiece(piece) {
        piece.matrix.forEach((row, y) => {
            row.forEach((val, x) => {
                if (val !== 0) {
                    if (!(y + piece.y >= ROWS || x + piece.x >= COLS || x + piece.x < 0 || y + piece.y < 0)) {
                        this.grid[y + piece.y][x + piece.x] = {color: piece.color, filled: true};
                    }
                }
            })
        })
        this.clearLines();
    }

    clearLines() {
        for (let y = 0; y < ROWS; y++) {
            let row = this.grid[y];
            if (!row.some(entry => !entry.filled)) {
                this.grid.splice(y, 1);
                this.grid.unshift(Array(COLS).fill({color: COLORS.BLACK, filled: false}));
                y--;
            }
        }
    }
}
