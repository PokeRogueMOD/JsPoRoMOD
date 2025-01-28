export class BaseScene {
    constructor() {
        this.minInt = -Math.pow(2, 31);
        this.maxInt = Math.pow(2, 31) - 1;
        this.maxMoneyInt = Number.MAX_SAFE_INTEGER - this.maxInt;
    }

    get currentScene() {
        return Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.keys.battle;
    }

    get currentPhase() {
        return this.currentScene.currentPhase;
    }

    get currentPhaseName() {
        return this.currentPhase.constructor.name;
    }

    playBuySound(sound_name) {
        this.currentScene.playSound(sound_name);
    }

    clearUI() {
        this.currentScene.ui.clearText();
    }

    setUIMode(mode) {
        return this.currentScene.ui.setMode(mode);
    }
}