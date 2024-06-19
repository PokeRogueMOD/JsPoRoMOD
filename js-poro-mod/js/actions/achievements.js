import { BaseScene } from "../scenes/baseScene";
import { Achievements } from "../constants/achievements";
import { showToast } from "../../components/utils/showToast.js";

export class AchvUnlocker extends BaseScene {
    constructor() {
        super();
    }

    execute() {
        const timestampInput = document.getElementById("achievementDate");
        const dateValue = timestampInput.value; // returns 2018-07-22 for example
        const dateObject = new Date(dateValue);
        const timestamp = dateObject.getTime(); // converts to timestamp in milliseconds

        showToast(`Date: ${dateValue}, Timestamp: ${timestamp}`);

        // Assuming currentTimestamp should be set to this new timestamp
        const currentTimestamp = timestamp;

        // Example of updating achievements with the new timestamp
        this.currentScene.gameData.achvUnlocks = Object.keys(
            Achievements
        ).reduce((acc, key) => {
            acc[key] = currentTimestamp;
            return acc;
        }, {});

        // Save the updated data
        this.save();

        showToast("All achievements unlocked!");
    }

    save() {
        this.currentScene.gameData.saveSystem(); // https://github.com/pagefaultgames/pokerogue/blob/725df336009157db8af2d75beaf95edba37a8c21/src/system/game-data.ts#L293
    }
}
