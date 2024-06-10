import { BaseScene } from '../scenes/baseScene';

export class DataResetter extends BaseScene {
    constructor() {
        super();
    }

    execute() {
        if (this.currentPhaseName === "TitlePhase") {
            this.currentScene.gameData.saveAll(this.currentScene, true, true, true).then((success) => {
                if (!success) {
                    return this.currentScene.reset(true);
                }
                this.currentScene.gameData.tryClearSession(
                    this.currentScene,
                    this.currentScene.sessionSlotId
                ).then((success) => {
                    if (!success[0]) {
                        return this.currentScene.reset(true);
                    }
                    this.currentScene.reset();
                    this.currentScene.unshiftPhase(
                        new this.currentScene.constructor(this.scene)
                    );
                    this.currentPhase.end();
                });
            });
        } else {
            console.log("Go back to Title Screen first!");
        }
    }
}
