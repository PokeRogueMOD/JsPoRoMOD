export class BaseScene {
    constructor() {
        this.minInt = -Math.pow(2, 31);
        this.maxInt = Math.pow(2, 31) - 1;
        this.maxMoneyInt = Number.MAX_SAFE_INTEGER - this.maxInt;
    }

    get scenes() {
        return Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.scenes;
    }

    get currentScene() {
        return this.scenes[this.scenes.length > 1 ? this.scenes.length - 1 : 0];
    }

    get currentPhase() {
        return this.currentScene.currentPhase;
    }

    get currentPhaseName() {
        return this.currentPhase.constructor.name;
    }

    maxTeamLuck() {
        this.currentPhase.scene.getParty().forEach((pokemon) => {
            pokemon.luck = 11;
        });
        // console.log("Set all player Pokémon luck to 11!");
    }

    setMoney(value) {
        this.currentPhase.scene.money = value;
        this.currentPhase.scene.updateMoneyText();
        this.currentPhase.scene.animateMoneyChanged(false);
    }

    playBuySound(sound_name) {
        this.currentPhase.scene.playSound(sound_name);
    }

    clearUI() {
        this.currentPhase.scene.ui.clearText();
    }

    setUIMode(mode) {
        return this.currentPhase.scene.ui.setMode(mode);
    }
}
