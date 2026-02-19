import { audioManager } from './audioManager.js';

const overlay = document.getElementById('overlay');
const overlayText = document.getElementById('overlay-text');

class OverlayManager {
    constructor() {
        this.started = false;
        overlay.addEventListener('pointerdown', this.startOrRestartGame.bind(this));
    }

    setGame(game) {
        this.game = game;
    }

    startOrRestartGame() {
        audioManager.unlockSync();
        audioManager.preload();

        if (!this.started) {
            this.started = true;
            this.game.start();
            overlay.classList.add('hidden');
        } else if (this.game.lost) {
            this.game.reset();
            this.game.paused = false;
            overlay.classList.add('hidden');
        }
    }

    showGameOver() {
        overlayText.innerText = "GAME OVER\nClick to Restart";
        overlay.classList.remove('hidden');
        this.game.pause();
    }
}

export const overlayManager = new OverlayManager();
