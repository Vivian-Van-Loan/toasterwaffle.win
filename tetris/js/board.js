import {COLORS, COLS, HIDDEN_ROWS, ROWS} from './constants.js';
import {BAG_MODES, Piece, PieceBag} from './piece.js';

export class Board {
    constructor() {
        this.grid = this.createGrid();
    }

    createGrid() {
        return Array.from({ length: ROWS }, () =>
            // Array(COLS).fill(0)
            Array(COLS).fill({color: COLORS.BLACK, filled: false})
        );
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
        let cleared = this.clearLines();
        for (let y = 0; y < HIDDEN_ROWS; y++) {
            let row = this.grid[y];
            if (row.some(entry => entry.filled)) {
                return {cleared: cleared, lost: true};
            }
        }
        return {cleared: cleared, lost: false};
    }

    clearLines() {
        let cleared = 0;
        for (let y = 0; y < ROWS; y++) {
            let row = this.grid[y];
            if (!row.some(entry => !entry.filled)) {
                this.grid.splice(y, 1);
                this.grid.unshift(Array(COLS).fill({color: COLORS.BLACK, filled: false}));
                y--;
                cleared++;
            }
        }
        return cleared;
    }

    isEmpty() {
        return !this.grid.some(row => row.some(entry => entry.filled));
    }
}
