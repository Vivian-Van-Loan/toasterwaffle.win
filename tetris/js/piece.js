import {COLORS, COLS, ROWS} from './constants.js';
import {randInt, shuffleArray} from "./funcs.js";

export class Piece {
    constructor(name, color, x, y, matrix) {
        this.name = name;
        this.color = color;
        this.x = x;
        this.y = y;
        this.matrix = matrix.map(row => row.slice());
    }

    copy(matrix) {
        if (!matrix) matrix = this.matrix;
        return new Piece(this.name, this.color, this.x, this.y, matrix);
    }

    rotateClockwise() {
        return this.copy(this.matrix[0].map((val, index) => this.matrix.map(row => row[index]).reverse()));
    }

    rotateCounterClockwise() {
        return this.copy(this.matrix[0].map((val, index) => this.matrix.map(row => row[row.length - 1 - index])));
    }

    getExtents() {
        let min_y = Infinity;
        let min_x = Infinity;
        let max_y = -Infinity;
        let max_x = -Infinity;
        for (let y = 0; y < this.matrix.length; y++) {
            let row = this.matrix[y];
            for (let x = 0; x < row.length; x++) {
                if (row[x]) {
                    if (x < min_x) min_x = x;
                    if (x > max_x) max_x = x;
                    if (y > max_y) max_y = y;
                    if (y < min_y) min_y = y;
                }
            }
        }
        return {min_x, min_y, max_x, max_y};
    }
}

const BASIC_PIECES = [
    new Piece('I', COLORS.CYAN, 0, 0, [
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
    ]),
    new Piece('O', COLORS.YELLOW, 0, 0, [
        [1, 1],
        [1, 1],
    ]),
    new Piece('T', COLORS.VIOLET, 0, 0, [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0],
    ]),
    new Piece('S', COLORS.GREEN, 0, 0, [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0],
    ]),
    new Piece('Z', COLORS.RED, 0, 0, [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0],
    ]),
    new Piece('J', COLORS.BLUE, 0, 0, [
        [0, 1, 0],
        [0, 1, 0],
        [1, 1, 0]
    ]),
    new Piece('L', COLORS.ORANGE, 0, 0, [
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 1]
    ]),
];

const PENT_PIECES = [
    new Piece('I5', COLORS.CYAN, 0, 0, [
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
    ]),
    new Piece('T5', COLORS.VIOLET, 0, 0, [
        [1, 1, 1],
        [0, 1, 0],
        [0, 1, 0],
    ]),
    new Piece('U', COLORS.WHITE, 0, 0, [
        [1, 0, 1],
        [1, 1, 1],
        [0, 0, 0],
    ]),
    new Piece('V', COLORS.ORANGE, 0, 0, [
        [1, 0, 0],
        [1, 0, 0],
        [1, 1, 1],
    ]),
    new Piece('W', COLORS.ORANGE, 0, 0, [
        [1, 0, 0],
        [1, 1, 0],
        [0, 1, 1],
    ]),
    new Piece('X', COLORS.PURPLE, 0, 0, [
        [0, 1, 0],
        [1, 1, 1],
        [0, 1, 0],
    ]),
    new Piece('F', COLORS.BLUE, 0, 0, [
        [1, 0, 0],
        [1, 1, 1],
        [0, 1, 0],
    ]),
    new Piece('K', COLORS.ORANGE, 0, 0, [
        [0, 0, 1],
        [1, 1, 1],
        [0, 1, 0],
    ]),
    new Piece('S5', COLORS.GREEN, 0, 0, [
        [0, 1, 1],
        [0, 1, 0],
        [1, 1, 0],
    ]),
    new Piece('Z5', COLORS.RED, 0, 0, [
        [1, 1, 0],
        [0, 1, 0],
        [0, 1, 1],
    ]),
    new Piece('J5', COLORS.BLUE, 0, 0, [
        [1, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ]),
    new Piece('L5', COLORS.ORANGE, 0, 0, [
        [0, 0, 0, 1],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ]),
    new Piece('Y', COLORS.CYAN, 0, 0, [
        [0, 0, 1, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ]),
    new Piece('R', COLORS.CYAN, 0, 0, [
        [0, 1, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ]),
    new Piece('H', COLORS.GREEN, 0, 0, [
        [0, 0, 1, 1],
        [1, 1, 1, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ]),
    new Piece('N', COLORS.RED, 0, 0, [
        [1, 1, 0, 0],
        [0, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ]),
    new Piece('D', COLORS.YELLOW, 0, 0, [
        [1, 1, 0, 0],
        [1, 1, 1, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ]),
    new Piece('B', COLORS.YELLOW, 0, 0, [
        [0, 0, 1, 1],
        [0, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ]),
];

export const BAG_MODES = {
    BASIC: 0b0000000,
    PENT:  0b0000001,
}

export class PieceBag {
    constructor(mode) {
        this.PIECES = BASIC_PIECES; //in case we want extra pieces in the future, we can concat the arrays into one
        if (mode & BAG_MODES.PENT)
            this.PIECES = this.PIECES.concat(PENT_PIECES);
        this.newBag();
    }

    newBag() {
        this.bag = [];
        this.PIECES.forEach(piece => {
            piece = piece.copy();
            piece.x = Math.floor(COLS / 2 - piece.matrix[0].length / 2);
            piece.y = -2;
            this.bag.push(piece);
        });
        shuffleArray(this.bag);
    }

    peekPiece() {
        if (this.bag.length === 0) this.newBag();
        return this.bag[this.bag.length - 1];
    }

    getPiece() {
        if (this.bag.length === 0) this.newBag();
        return this.bag.pop();
    }
}
