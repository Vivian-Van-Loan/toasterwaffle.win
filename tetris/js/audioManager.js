class AudioManager {
    constructor() {
        this.ctx = null;
        this.buffers = {};
        this.unlocked = false;
        this.loaded = false;

        this.SOUNDS = {
            move: 'sounds/move.wav',
            rotate: 'sounds/rotate.wav',
            hold: 'sounds/hold.wav',
            lock: 'sounds/lock.wav',
            spun: 'sounds/spun.wav',
            clear1: 'sounds/clear1.wav',
            clear2: 'sounds/clear2.wav',
            clear3: 'sounds/clear3.wav',
            clear4: 'sounds/clear4.wav',
            levelUp: 'sounds/levelUp.wav',
            newGame: 'sounds/newGame.wav',
            gameOver: 'sounds/gameOver.wav',
        };
    }

    /* ---------- MUST be synchronous ---------- */
    unlockSync() {
        if (this.unlocked) return;

        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.ctx.resume(); // resume is sync-safe here
        this.unlocked = true;
    }

    /* ---------- async work happens later ---------- */
    async preload() {
        if (this.loaded)
            return;
        for (const [name, url] of Object.entries(this.SOUNDS)) {
            const res = await fetch(url);
            const data = await res.arrayBuffer();
            this.buffers[name] = await this.ctx.decodeAudioData(data);
        }
        this.loaded = true;
    }

    playBuffer(name, volume = 1.0) {
        if (!this.unlocked) return;
        const buffer = this.buffers[name];
        if (!buffer) return;

        const source = this.ctx.createBufferSource();
        source.buffer = buffer;

        const gain = this.ctx.createGain();
        gain.gain.value = volume;

        source.connect(gain).connect(this.ctx.destination);
        source.start();
    }

    move() { this.playBuffer('move', 0.5); }
    rotate() { this.playBuffer('rotate'); }
    hold() { this.playBuffer('hold'); }
    lock() { this.playBuffer('lock'); }
    spun() { this.playBuffer('spun'); }
    clear(lines) {
        if (lines > 4) lines = 4;
        this.playBuffer(`clear${lines}`);
    }
    levelUp() { this.playBuffer('levelUp'); }
    newGame() { this.playBuffer('newGame'); }
    gameOver() { this.playBuffer('gameOver'); }
}

export const audioManager = new AudioManager();
