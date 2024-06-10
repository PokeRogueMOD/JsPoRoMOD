import { BaseScene } from './baseScene';

export class SelectModifierPhaseScene extends BaseScene {
    constructor() {
        super();
    }

    rerollPhase(tier, lock) {
        // Src Extra Items: https://github.com/pagefaultgames/pokerogue/blob/209a69d098375dcb1f5f5be4be1d674e3b3d585f/src/modifier/modifier.ts#L2063

        const stackCount = 3 + (this.currentScene.modifiers.find(
            (o) => o.constructor.name === "ExtraModifierModifier"
        )?.stackCount ?? 0);

        let itemsRef = Phaser.Display.Canvas.CanvasPool.pool[1].parent.parentContainer
            .parentContainer.displayList.list;

        let UIRef = itemsRef[itemsRef.length - 1].list.find(
            (o) => o.constructor.name == "UI"
        );

        let currentItems = UIRef.list[17].list
            .slice(0, stackCount)
            .map((o) => o.modifierTypeOption);

        let currentItemsTiers = currentItems.map((o) => o.type.tier);

        this.currentScene.lockModifierTiers = lock;

        let newModifierTiers = lock === true && tier === null
            ? currentItemsTiers
            : tier === null
                ? this.currentPhase.getModifierTypeOptions(stackCount).map((o) => o.type.tier)
                : new Array(stackCount).fill(tier);

        // Update Lock text
        let uiHandler = this.currentPhase.scene.ui.getHandler();
        uiHandler?.updateLockRaritiesText();

        this.currentPhase.scene.reroll = true;
        this.currentPhase.scene.unshiftPhase(
            new this.currentPhase.constructor(
                this.currentScene,
                this.maxInt, // Bug Credit: https://www.youtube.com/@Odou
                newModifierTiers
            )
        );
    }

    execute(tier, lock) {
        if (this.currentPhaseName === "SelectModifierPhase") {
            if (Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.keys
                .battle.gameMode.modeId !== 3) {
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
