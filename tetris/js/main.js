import { Game } from './game.js';
import { Input } from './input.js';
import { overlayManager } from "./overlayManager.js";

const game = new Game();
const input = new Input(game);

overlayManager.setGame(game);
