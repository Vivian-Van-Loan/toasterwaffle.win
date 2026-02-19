import {COLORS, COLS} from './constants.js';
import {shuffleArray} from "./funcs.js";

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

    rotate180() {
        return this.copy(this.matrix.map(row => row.slice()).reverse().map(row => row.reverse()));
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
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
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
        [1, 1, 0],
    ]),
    new Piece('L', COLORS.ORANGE, 0, 0, [
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 1],
    ]),
];

const PENT_PIECES = [
    new Piece('I5', COLORS.CYAN, 0, 0, [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
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
    new Piece('X', COLORS.VIOLET, 0, 0, [
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
    BASIC: 0b0000001,
    PENT:  0b0000010,
}

export class PieceBag {
    constructor(mode) {
        this.PIECES = {};
        if (mode === 0 || mode === undefined) mode = BAG_MODES.BASIC; //ensure that the bag has SOMETHING
        if (mode & BAG_MODES.BASIC)
            this.addPiecesToBaseBag(BASIC_PIECES);
        if (mode & BAG_MODES.PENT)
            this.addPiecesToBaseBag(PENT_PIECES);
        this.bag = [];
        this.newBag();
    }

    addPiecesToBaseBag(pieces) { //lets us add extra piece types to the base bag
        for (let piece of pieces) {
            this.PIECES[piece.name] = piece;
        }
    }

    makePiece(name) {
        let piece = this.PIECES[name].copy();
        let {min_x, min_y, max_x, max_y} = piece.getExtents();
        piece.x = Math.floor(COLS / 2 - (max_x - min_x + 1) / 2) - min_x;
        piece.y = 0 - max_y;
        return piece;
    }

    newBag() {
        let new_bag = [];
        for (let pieceName in this.PIECES) {
            let piece = this.makePiece(pieceName);
            new_bag.push(piece);
        }
        shuffleArray(new_bag);
        this.bag = this.bag.concat(new_bag);
    }

    reconstructPiece(piece) {
        return this.makePiece(piece.name);
    }

    peekPiece(idx) {
        if (!idx) idx = 0;
        while (this.bag.length < idx + 1) this.newBag();
        return this.bag[idx];
    }

    getPiece() {
        if (this.bag.length === 0) this.newBag();
        return this.bag.shift();
    }

    newPiece() {
        return this.getPiece();
    }
}
