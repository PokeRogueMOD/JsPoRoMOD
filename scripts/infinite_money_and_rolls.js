let RollTiers = {
    COMMON: 0,
    GREAT: 1,
    ULTRA: 2,
    ROGUE: 3,
    MASTER: 4,
};

class BaseScene {
    constructor() {
        this.minInt = -Math.pow(2, 31);
        this.maxInt = Math.pow(2, 31) - 1;
        this.maxMoneyInt = Number.MAX_SAFE_INTEGER - this.maxInt;
    }

    get scenes() {
        return Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene
            .scenes;
    }

    get currentScene() {
        // Always get the latest index of the scenes array
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
        console.log("Set all player Pokémon luck to 11!");
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

class SelectModifierPhaseScene extends BaseScene {
    constructor() {
        super();
    }

    rerollPhase(tier, lock) {
        console.log("tier", tier);
        console.log("lock", lock);

        let modifierTiers = this.currentPhase.modifierTiers;

        if (
            modifierTiers === undefined ||
            modifierTiers === null ||
            (lock === false && tier === null)
        ) {
            this.currentScene.lockModifierTiers = false;
        }

        if (modifierTiers === undefined || modifierTiers === null) {
            console.log("modifierTiers === undefined");
            this.currentPhase.modifierTiers =
                tier === null
                    ? this.currentPhase
                          .getModifierTypeOptions(maxSlots)
                          .map((o) => o.type.tier)
                    : [tier, tier, tier, tier, tier, tier];
        }

        console.log(
            "this.currentPhase.modifierTiers",
            this.currentPhase.modifierTiers
        );

        const maxSlots = 6; // Later get the slot by 3 + slot expand item (max +3 slots)

        let newModifierTiers =
            lock === true && tier === null
                ? this.currentPhase.modifierTiers
                : tier === null
                ? this.currentPhase
                      .getModifierTypeOptions(maxSlots)
                      .map((o) => o.type.tier)
                : [tier, tier, tier, tier, tier, tier];

        console.log("newModifierTiers", newModifierTiers);

        this.currentScene.lockModifierTiers = lock;

        console.log(
            "this.currentPhase.lockModifierTiers",
            this.currentPhase.lockModifierTiers
        );

        // Update Lock text
        // let uiHandler = this.currentPhase.scene.ui.getHandler();
        // uiHandler?.updateLockRaritiesText();

        // DEMO: set cursor row:
        // uiHandler.setRowCursor(0)

        this.currentPhase.scene.reroll = true;
        this.currentPhase.scene.unshiftPhase(
            new this.currentPhase.constructor(
                this.currentScene,
                this.minInt,
                newModifierTiers
            )
        );
    }

    execute(tier, lock) {
        if (this.currentPhaseName === "SelectModifierPhase") {
            this.rerollPhase(tier, lock);
            this.clearUI();
            this.setUIMode(0).then(() => this.currentPhase.end());
            this.maxTeamLuck();
            this.setMoney(this.maxMoneyInt);
            this.playBuySound("buy");
        } else {
            console.log("Not in a roll phase.");
        }
    }
}

class Hack {
    constructor() {
        this.selectModifierPhaseScene = new SelectModifierPhaseScene();
    }

    roll(tier = null, lock = true) {
        this.selectModifierPhaseScene.execute(tier, lock);
    }
}

// Add Hack to window and make it accessible as HACK
window.HACK = new Hack();
const HACK = window.HACK;

// Example usage
// HACK.roll(null, false); // Roll without locked shop
// HACK.roll(RollTiers.COMMON); // Set shop tier to Common
// HACK.roll(RollTiers.GREAT); // Set shop tier to Great
// HACK.roll(RollTiers.ULTRA); // Set shop tier to Ultra
// HACK.roll(RollTiers.ROGUE); // Set shop tier to Rogue
// HACK.roll(RollTiers.MASTER); // Set shop tier to Master
// HACK.roll(); // Roll with locked shop
