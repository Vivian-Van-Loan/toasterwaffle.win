export class Input {
    constructor(game) {
        window.addEventListener('keydown', e => {
            switch (e.code) {
                case 'ArrowLeft':  game.moveLeft(); break;
                case 'ArrowRight': game.moveRight(); break;
                case 'ArrowUp':    game.hardDrop(); break;
                case 'ArrowDown':  game.drop(); break;
                case 'Space':      game.hold(); break;
                case 'KeyX':       game.rotateClockwise(); break;
                case 'KeyZ':       game.rotateCounterClockwise(); break;
            }
        });
    }
}
