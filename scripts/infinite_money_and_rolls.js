let Rarities = {
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
        // Src Extra Items: https://github.com/pagefaultgames/pokerogue/blob/209a69d098375dcb1f5f5be4be1d674e3b3d585f/src/modifier/modifier.ts#L2063
        console.log(
            "this.currentPhase.modifierTiers: ",
            this.currentPhase.modifierTiers
        );

        const stackCount =
            3 +
                HACK.selectModifierPhaseScene.currentScene.modifiers.find(
                    (o) => o.constructor.name === "ExtraModifierModifier"
                )?.stackCount ?? 0;

        let itemsRef =
            Phaser.Display.Canvas.CanvasPool.pool[1].parent.parentContainer
                .parentContainer.displayList.list;
        let currentItems = itemsRef[itemsRef.length - 1].list[3].list[17].list
            .slice(0, 6)
            .map((o) => o.modifierTypeOption);
        let currentItemsTiers = currentItems.map((o) => o.type.tier);

        this.currentScene.lockModifierTiers = lock;

        let newModifierTiers =
            lock === true && tier === null
                ? currentItemsTiers
                : tier === null
                ? this.currentPhase
                      .getModifierTypeOptions(stackCount)
                      .map((o) => o.type.tier)
                : [tier, tier, tier, tier, tier, tier];

        console.log("newModifierTiers: ", newModifierTiers);

        console.log("stackCount: ", stackCount);
        console.log("tier: ", tier);
        console.log("lock: ", lock);

        // Update Lock text
        let uiHandler = this.currentPhase.scene.ui.getHandler();
        uiHandler?.updateLockRaritiesText();
        // DEMO: set cursor row:
        // uiHandler.setCursor(2)  // for lock tiers button
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
        if (
            this.currentPhaseName === "SelectModifierPhase"
        ) {
            if (
                Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.keys
                    .battle.gameMode.modeId !== 3
            ) {
                this.rerollPhase(tier, lock);
                this.clearUI();
                this.setUIMode(0).then(() => this.currentPhase.end());
                this.maxTeamLuck();
                this.setMoney(this.maxMoneyInt);
                this.playBuySound("buy");
            } else {
                console.log("You cant cheat in daily run!");
            }
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
// HACK.roll(Rarities.COMMON); // Set shop tier to Common
// HACK.roll(Rarities.GREAT); // Set shop tier to Great
// HACK.roll(Rarities.ULTRA); // Set shop tier to Ultra
// HACK.roll(Rarities.ROGUE); // Set shop tier to Rogue
// HACK.roll(Rarities.MASTER); // Set shop tier to Master
// HACK.roll(); // Roll with locked shop
