import { BaseScene } from "./baseScene";
import { showToast } from "../utils/showToast.js";

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
                showToast(`Set Roll Count to ${rollCount}`);
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
        let uiHandler = this.currentPhase.scene.ui.getHandler();
        uiHandler?.updateLockRaritiesText();
    }

    rerollPhase(tier, lock, rollCount) {
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

        this.lockRarities(lock);

        let newModifierTiers =
            lock === true && tier === null
                ? currentItemsTiers
                : tier === null
                ? this.currentPhase
                      .getModifierTypeOptions(stackCount)
                      .map((o) => o.type.tier)
                : new Array(stackCount).fill(tier);

        if (rollCount === null) {
            rollCount = this.currentPhase.rollCount + 1;
        }

        this.currentPhase.scene.reroll = true;
        this.currentPhase.scene.unshiftPhase(
            new this.currentPhase.constructor(
                this.currentScene,
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
