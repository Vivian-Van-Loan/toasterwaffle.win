import { audioManager } from "./audioManager.js";
import { STANDARD_GRAVITY, TGM_LIKE_GRAVITY } from "./gravity.js";

const overlay = document.getElementById('overlay');
const startButton = document.getElementById('start-button');
const presetSelect = document.getElementById('setting-preset-select');

export const GAME_MODES = {
    MARATHON: 'marathon',
    SPRINT: 'sprint',
    ULTRA: 'ultra',
}

export const CLEAR_MODES = {
    GUIDELINE: 'guideline',
    CLASSIC: 'classic',
}

export const GRAVITY_PRESET_MAP = {
    'standard': STANDARD_GRAVITY,
    'tgm': TGM_LIKE_GRAVITY,
}

export class SettingsManager {
    constructor(
        gameMode = GAME_MODES.MARATHON,
        clearMode = CLEAR_MODES.GUIDELINE,
        gravityTable = STANDARD_GRAVITY,
        startingLevel = 1,
        allowHold = true,
        allow180 = true,
        linesPerLevel = 10,
        levelOnLock = false
    ) {
        this.gameMode = gameMode;
        this.clearMode = clearMode;
        this.gravityTable = gravityTable;
        this.startingLevel = startingLevel;
        this.allowHold = allowHold;
        this.allow180 = allow180;
        this.linesPerLevel = linesPerLevel;
        this.levelOnLock = levelOnLock;
    }

    static readFromUI() {
        let mode = document.getElementById('setting-game-mode').value;
        // let clear = document.getElementById('clear-mode').value; //doesn't exist yet
        let gravity = document.getElementById('setting-gravity-table').value;
        // for (const [value, name] of GAME_MODES) {
        //     if (name === mode) {
        //         mode = value;
        //         break;
        //     }
        // }
        gravity = GRAVITY_PRESET_MAP[gravity];

        let level = document.getElementById('setting-starting-level').value;
        let lines = document.getElementById('setting-lines-per-level').value;
        let hold = document.getElementById('setting-allow-hold').checked;
        let rotate = document.getElementById('setting-allow-180').checked;
        let levelOnLock = document.getElementById('setting-level-on-lock').checked;
        return new SettingsManager(mode, CLEAR_MODES.GUIDELINE, gravity, level, hold, rotate, lines, levelOnLock);
    }

    writeToUI() {
        // let mode = GAME_MODES[this.gameMode];
        let gravity;
        for (const [name, value] of Object.entries(GRAVITY_PRESET_MAP)) {
            if (value === this.gravityTable) {
                gravity = name;
                break;
            }
        }
        document.getElementById('setting-game-mode').value = this.gameMode;
        // document.getElementById('clear-mode').value = clear; //still doesn't exist
        document.getElementById('setting-gravity-table').value = gravity;
        document.getElementById('setting-starting-level').value = this.startingLevel;
        document.getElementById('setting-lines-per-level').value = this.linesPerLevel;
        document.getElementById('setting-allow-hold').checked = this.allowHold;
        document.getElementById('setting-allow-180').checked = this.allow180;
        document.getElementById('setting-level-on-lock').checked = this.levelOnLock;
    }
}

export const DEFAULT_SETTINGS = new SettingsManager();
export const TGM_LIKE_SETTINGS = new SettingsManager(
    GAME_MODES.MARATHON,
    CLEAR_MODES.GUIDELINE,
    TGM_LIKE_GRAVITY,
    1,
    true,
    true,
    1,
    true
);
// export const CUSTOM_SETTINGS = loadSettings(DEFAULT_SETTINGS);

export const SETTINGS_PRESETS = {
    "Standard": DEFAULT_SETTINGS,
    "TGM2 Like": TGM_LIKE_SETTINGS,
}

class OverlayManager {
    constructor() {
        fillUIPresets();
        startButton.addEventListener('pointerdown', () => this.startOrRestartGame());
    }

    setGame(game) {
        this.game = game;
    }

    startOrRestartGame() {
        // REQUIRED for Firefox audio
        audioManager.unlockSync();
        audioManager.preload();

        let settings = SettingsManager.readFromUI();

        if (this.game.started) {
            this.game.reset(settings);
        } else {
            this.game.start(settings);
        }

        overlay.classList.add('hidden');
    }

    showGameOver() {
        overlay.classList.remove('hidden');
    }
}

export const overlayManager = new OverlayManager();

function fillUIPresets() {
    for (const [name, settings] of Object.entries(SETTINGS_PRESETS)) {
        let option = document.createElement('option');
        option.value = name;
        option.innerText = name;
        presetSelect.appendChild(option);
    }
}

presetSelect.addEventListener('change', () => {
    const presetName = presetSelect.value;
    const settings = SETTINGS_PRESETS[presetName];
    settings.writeToUI();
});

// const STORAGE_KEYS = {
//     SETTINGS: 'tetris.settings.v1',
//     BEST_SCORE: 'tetris.bestScore.v1',
// };
//
// export function saveSettings() {
//     localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
// }
//
// export function loadSettings(defaultSettings) {
//     const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
//     if (!raw) return structuredClone(defaultSettings);
//
//     try {
//         return {
//             ...structuredClone(defaultSettings),
//             ...JSON.parse(raw),
//         };
//     } catch {
//         return structuredClone(defaultSettings);
//     }
// }
