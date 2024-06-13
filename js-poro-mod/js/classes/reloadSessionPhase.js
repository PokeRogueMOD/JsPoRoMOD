import { Phase } from "./phase";
import { fixedInt } from "./utils";

export class ReloadSessionPhase extends Phase {
    constructor(scene, systemDataStr) {
        super(scene);
        this.systemDataStr = systemDataStr;
    }

    start() {
        this.scene.ui.setMode(Mode.SESSION_RELOAD);

        let delayElapsed = false;
        let loaded = false;

        this.scene.time.delayedCall(fixedInt(1500), () => {
            if (loaded) {
                this.end();
            } else {
                delayElapsed = true;
            }
        });

        this.scene.gameData.clearLocalData();

        const systemInitPromise = this.scene.gameData.initSystem(this.systemDataStr);

        systemInitPromise.then(() => {
            if (delayElapsed) {
                this.end();
            } else {
                loaded = true;
            }
        });
    }
}
