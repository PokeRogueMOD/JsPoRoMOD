import { BaseScene } from "./baseScene";
import { showToast } from "../../components/utils/showToast.js";

export class SelectModifierPhaseScene extends BaseScene {
    constructor() {
        super();
    }

    setTeamLuck(luck) {
        if (this.currentPhaseName === "SelectModifierPhase") {
            if (
                Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.keys
                    .battle.gameMode.modeId !== 3
            ) {
                this.currentScene.getParty().forEach((pokemon) => {
                    pokemon.luck = luck;
                });
                // this.currentScene.hideLuckText(250); // Since i cant update the text properly atm!
                showToast(`Set Luck to ${luck} (Won't update the luck Text!)`);
            } else {
                showToast("[ERROR] You cant cheat in daily run!");
            }
        } else {
            showToast("[ERROR] Not in a roll phase!");
        }
    }

    setMoney(value) {
        if (this.currentPhaseName === "SelectModifierPhase") {
            if (
                Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.keys
                    .battle.gameMode.modeId !== 3
            ) {
                this.currentScene.money = value;
                this.currentScene.updateMoneyText();
                this.currentScene.animateMoneyChanged(false);
                showToast(`Set Money to ${value}`);
            } else {
                showToast("[ERROR] You cant cheat in daily run!");
            }
        } else {
            showToast("[ERROR] Not in a roll phase!");
        }
    }

    setRollCount(value) {
        if (this.currentPhaseName === "SelectModifierPhase") {
            if (
                Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.keys
                    .battle.gameMode.modeId !== 3
            ) {
                this.currentPhase.rollCount = value;
                showToast(`Set Roll Count to ${value}`);
            } else {
                showToast("[ERROR] You cant cheat in daily run!");
            }
        } else {
            showToast("[ERROR] Not in a roll phase!");
        }
    }

    lockRarities(value) {
        this.currentScene.lockModifierTiers = value;

        // Update Lock text
        let uiHandler = this.currentScene.ui.getHandler();
        uiHandler?.updateLockRaritiesText();
    }

    rerollPhase(tier, lock, rollCount) {
        // Src Extra Items: https://github.com/pagefaultgames/pokerogue/blob/209a69d098375dcb1f5f5be4be1d674e3b3d585f/src/modifier/modifier.ts#L2063
        const stackCount =
            3 +
            (this.currentScene.modifiers.find(
                (o) => o.constructor.name === "ExtraModifierModifier"
            )?.stackCount ?? 0);

        let uiHandler = this.currentScene.ui.getHandler();
        let currentItemsTiers = uiHandler.options.map(
            (e) => e.modifierTypeOption.type.tier
        );

        this.lockRarities(lock);

        // Define the ModifierTier enum as a plain JavaScript object:
        const ModifierTier = {
            COMMON: 0,
            GREAT: 1,
            ULTRA: 2,
            ROGUE: 3,
            MASTER: 4,
            LUXURY: 5,
        };

        // Example input: An array with some objects missing certain tiers
        const typeOptions = [
            { type: { tier: ModifierTier.COMMON } }, // ModifierTier.COMMON
            { type: { tier: ModifierTier.GREAT } }, // ModifierTier.GREAT
            { type: { tier: ModifierTier.ULTRA } }, // ModifierTier.ULTRA
            { type: { tier: ModifierTier.ROGUE } }, // ModifierTier.ROGUE
            { type: { tier: ModifierTier.MASTER } }, // ModifierTier.LUXURY
            { type: { tier: ModifierTier.LUXURY } }, // ModifierTier.LUXURY
            { type: undefined }, // Missing type
            // MASTER is not present
        ];

        // Old code
        let newModifierTiers =
            lock === true && tier === null
                ? currentItemsTiers
                : tier === null
                ? this.currentPhase
                      .getModifierTypeOptions(stackCount)
                      .map((o) => o.type) // .tier
                : new Array(stackCount).fill(tier);

        if (rollCount === null) {
            rollCount = this.currentPhase.rollCount + 1;
        }

        this.currentScene.reroll = true;
        this.currentScene.unshiftPhase(
            new this.currentPhase.constructor(
                rollCount, // Bug Credit: https://www.youtube.com/@Odou
                newModifierTiers
            )
        );
    }

    execute(tier, lock, money, rollCount, luck) {
        if (this.currentPhaseName === "SelectModifierPhase") {
            if (
                Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.keys
                    .battle.gameMode.modeId !== 3
            ) {
                if (rollCount === null) {
                    rollCount = (this.currentPhase.rerollCount ?? 0) + 1;
                }
                this.rerollPhase(tier, lock, rollCount);
                this.clearUI();
                this.setUIMode(0).then(() => this.currentPhase.end());
                if (luck !== null) {
                    this.setTeamLuck(luck);
                }
                if (money !== null) {
                    this.setMoney(money);
                } else {
                    money = this.currentScene.money;
                }
                this.playBuySound("buy");
                showToast(
                    `Roll Count: ${rollCount ?? "no"}, Item Tier: ${
                        tier ?? "no"
                    }`
                );
            } else {
                showToast("[ERROR] You cant cheat in daily run!");
            }
        } else {
            showToast("[ERROR] Not in a roll phase!");
        }
    }
}
