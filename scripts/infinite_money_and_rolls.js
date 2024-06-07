let Rarities = {
    COMMON: 0,
    GREAT: 1,
    ULTRA: 2,
    ROGUE: 3,
    MASTER: 4,
};

let Mode = {
    MESSAGE: 0,
    TITLE: 1,
    COMMAND: 2,
    FIGHT: 3,
    BALL: 4,
    TARGET_SELECT: 5,
    MODIFIER_SELECT: 6,
    SAVE_SLOT: 7,
    PARTY: 8,
    SUMMARY: 9,
    STARTER_SELECT: 10,
    EVOLUTION_SCENE: 11,
    EGG_HATCH_SCENE: 12,
    CONFIRM: 13,
    OPTION_SELECT: 14,
    MENU: 15,
    MENU_OPTION_SELECT: 16,
    SETTINGS: 17,
    SETTINGS_DISPLAY: 18,
    SETTINGS_AUDIO: 19,
    SETTINGS_GAMEPAD: 20,
    GAMEPAD_BINDING: 21,
    SETTINGS_KEYBOARD: 22,
    KEYBOARD_BINDING: 23,
    ACHIEVEMENTS: 24,
    GAME_STATS: 25,
    VOUCHERS: 26,
    EGG_LIST: 27,
    EGG_GACHA: 28,
    LOGIN_FORM: 29,
    REGISTRATION_FORM: 30,
    LOADING: 31,
    SESSION_RELOAD: 32,
    UNAVAILABLE: 33,
    OUTDATED: 34,
};

class Phase {
    constructor(scene) {
        this.scene = scene;
    }

    start() {
        console.log(`%cStart Phase ${this.constructor.name}`, "color:green;");
        if (this.scene.abilityBar.shown) {
            this.scene.abilityBar.resetAutoHideTimer();
        }
    }

    end() {
        this.scene.shiftPhase();
    }
}

class BattlePhase extends Phase {
    constructor(scene) {
        super(scene);
    }

    showEnemyTrainer(trainerSlot = TrainerSlot.NONE) {
        const sprites = this.scene.currentBattle.trainer.getSprites();
        const tintSprites = this.scene.currentBattle.trainer.getTintSprites();
        for (let i = 0; i < sprites.length; i++) {
            const visible =
                !trainerSlot ||
                !i === (trainerSlot === TrainerSlot.TRAINER) ||
                sprites.length < 2;
            [sprites[i], tintSprites[i]].map((sprite) => {
                if (visible) {
                    sprite.x =
                        trainerSlot || sprites.length < 2 ? 0 : i ? 16 : -16;
                }
                sprite.setVisible(visible);
                sprite.clearTint();
            });
            sprites[i].setVisible(visible);
            tintSprites[i].setVisible(visible);
            sprites[i].clearTint();
            tintSprites[i].clearTint();
        }
        this.scene.tweens.add({
            targets: this.scene.currentBattle.trainer,
            x: "-=16",
            y: "+=16",
            alpha: 1,
            ease: "Sine.easeInOut",
            duration: 750,
        });
    }

    hideEnemyTrainer() {
        this.scene.tweens.add({
            targets: this.scene.currentBattle.trainer,
            x: "+=16",
            y: "-=16",
            alpha: 0,
            ease: "Sine.easeInOut",
            duration: 750,
        });
    }
}

class NewBattlePhase extends BattlePhase {
    start() {
        super.start();

        this.scene.newBattle();

        this.end();
    }
}

class BattleEndPhase extends BattlePhase {
    start() {
        super.start();

        this.scene.currentBattle.addBattleScore(this.scene);

        this.scene.gameData.gameStats.battles++;
        if (this.scene.currentBattle.trainer) {
            this.scene.gameData.gameStats.trainersDefeated++;
        }
        if (
            this.scene.gameMode.isEndless &&
            this.scene.currentBattle.waveIndex + 1 >
                this.scene.gameData.gameStats.highestEndlessWave
        ) {
            this.scene.gameData.gameStats.highestEndlessWave =
                this.scene.currentBattle.waveIndex + 1;
        }

        // Endless graceful end
        if (
            this.scene.gameMode.isEndless &&
            this.scene.currentBattle.waveIndex >= 5850
        ) {
            this.scene.clearPhaseQueue();
            this.scene.unshiftPhase(new GameOverPhase(this.scene, true));
        }

        for (const pokemon of this.scene.getField()) {
            if (pokemon) {
                pokemon.resetBattleSummonData();
            }
        }

        for (const pokemon of this.scene
            .getParty()
            .filter((p) => !p.isFainted())) {
            applyPostBattleAbAttrs(PostBattleAbAttr, pokemon);
        }

        if (this.scene.currentBattle.moneyScattered) {
            this.scene.currentBattle.pickUpScatteredMoney(this.scene);
        }

        this.scene.clearEnemyHeldItemModifiers();

        const lapsingModifiers = this.scene.findModifiers(
            (m) =>
                m.constructor.name === "LapsingPersistentModifier" ||
                m.constructor.name === "LapsingPokemonHeldItemModifier"
        );
        for (const m of lapsingModifiers) {
            const args = [];
            if (m.constructor.name === "LapsingPokemonHeldItemModifier") {
                args.push(this.scene.getPokemonById(m.pokemonId));
            }
            if (!m.lapse(args)) {
                this.scene.removeModifier(m);
            }
        }

        this.scene.updateModifiers().then(() => this.end());
    }
}

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

class SelectModifierPhaseScene extends BaseScene {
    constructor() {
        super();
    }

    rerollPhase(tier, lock) {
        // Src Extra Items: https://github.com/pagefaultgames/pokerogue/blob/209a69d098375dcb1f5f5be4be1d674e3b3d585f/src/modifier/modifier.ts#L2063

        const stackCount =
            3 +
            (this.currentScene.modifiers.find(
                (o) => o.constructor.name === "ExtraModifierModifier"
            )?.stackCount ?? 0);

        let itemsRef =
            Phaser.Display.Canvas.CanvasPool.pool[1].parent.parentContainer
                .parentContainer.displayList.list;

        let UIRef = itemsRef[itemsRef.length - 1].list.find(
            (o) => o.constructor.name == "UI"
        );

        let currentItems = UIRef.list[17].list
            .slice(0, stackCount)
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
                : new Array(stackCount).fill(tier);

        // console.log("tier: ", tier);
        // console.log("lock: ", lock);

        // console.log(
        //     "this.currentPhase.modifierTiers: ",
        //     this.currentPhase.modifierTiers
        // );
        // console.log("stackCount: ", stackCount);
        // console.log("itemsRef: ", itemsRef);
        // console.log("UIRef: ", UIRef);
        // console.log("currentItems: ", currentItems);
        // console.log("currentItemsTiers: ", currentItemsTiers);
        // console.log("newModifierTiers: ", newModifierTiers);

        // Update Lock text
        let uiHandler = this.currentPhase.scene.ui.getHandler();
        uiHandler?.updateLockRaritiesText();

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

class BattleSkip extends BaseScene {
    constructor() {
        super();
    }

    execute() {
        this.currentScene.clearPhaseQueue();
        // this.currentScene.unshiftPhase(new BattleEndPhase());
        this.currentScene.unshiftPhase(new BattleEndPhase(this.currentScene));
        this.currentScene.unshiftPhase(new NewBattlePhase(this.currentScene));
    }
}

// Integrate the ReloadSessionPhase with your Hack class
class Hack {
    constructor() {
        this.selectModifierPhaseScene = new SelectModifierPhaseScene();
        this.battleskip = new BattleSkip();
    }

    roll(tier = null, lock = true) {
        this.selectModifierPhaseScene.execute(tier, lock);
    }

    nextWave() {
        this.battleskip.execute();
    }
}

// Add Hack to window and make it accessible as HACK
window.HACK = new Hack();
const HACK = window.HACK;

// Example usage
// HACK.nextWave(); // Skip to the next wave (NOT WORKING!)

// HACK.roll(null, false); // Roll without locked shop
// HACK.roll(Rarities.COMMON); // Set shop tier to Common
// HACK.roll(Rarities.GREAT); // Set shop tier to Great
// HACK.roll(Rarities.ULTRA); // Set shop tier to Ultra
// HACK.roll(Rarities.ROGUE); // Set shop tier to Rogue
// HACK.roll(Rarities.MASTER); // Set shop tier to Master
// HACK.roll(); // Roll with locked shop
