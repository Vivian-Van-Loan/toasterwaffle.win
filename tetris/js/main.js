import { Game } from './game.js';
import { Input } from './input.js';

const game = new Game();
const input = new Input(game);

game.start();
