import { SelectModifierPhaseScene } from '../scenes/selectModifierPhaseScene';
import { DataResetter } from './reset';
import { AchvUnlocker } from './achievements';

export class Hack {
    constructor() {
        this.selectModifierPhaseScene = new SelectModifierPhaseScene();
        this.dataResetter = new DataResetter();
        this.achvUnlocker = new AchvUnlocker();
    }

    roll(tier = null, lock = true) {
        this.selectModifierPhaseScene.execute(tier, lock);
    }

    allAchievements(hours = 0, minutes = 0, seconds = 0) {
        this.achvUnlocker.execute(hours, minutes, seconds);
    }

    RESET() {
        this.dataResetter.execute();
    }
}

// Add Hack to window and make it accessible as HACK
window.HACK = new Hack();
const HACK = window.HACK;
