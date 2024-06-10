import { BaseScene } from '../scenes/baseScene';
import { Achievements } from '../constants/achievements';

export class AchvUnlocker extends BaseScene {
    constructor() {
        super();
    }

    execute(hours, minutes, seconds) {
        const currentTimestamp = Date.now() - (hours * 3600 + minutes * 60 + seconds) * 1000;
        this.currentScene.gameData.achvUnlocks = Object.keys(Achievements).reduce((acc, key) => {
            acc[key] = currentTimestamp;
            return acc;
        }, {});
        console.log("All achievements unlocked!");
    }
}
