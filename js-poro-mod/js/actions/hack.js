import { SelectModifierPhaseScene } from "../scenes/selectModifierPhaseScene";
import { DataResetter } from "./reset";
import { AchvUnlocker } from "./achievements";

class Hack {
    constructor() {
        this.selectModifierPhaseScene = new SelectModifierPhaseScene();
        this.dataResetter = new DataResetter();
        this.achvUnlocker = new AchvUnlocker();
    }

    roll(tier = null, lock = true, money = null, rollCount = null, luck = null) {
        this.selectModifierPhaseScene.execute(tier, lock, money, rollCount, luck);
    }

    setMoney(money) {
        this.selectModifierPhaseScene.setMoney(money);
    }

    setTeamLuck(luck) {
        this.selectModifierPhaseScene.setTeamLuck(luck);
    }

    setRollCount(rollCount) {
        this.selectModifierPhaseScene.setRollCount(rollCount);
    }

    setLockRarities(value) {
        this.selectModifierPhaseScene.lockRarities(value);
    }

    allAchievements() {
        this.achvUnlocker.execute();
    }

    RESET() {
        this.dataResetter.execute();
    }
}

const hackInstance = new Hack();
export default hackInstance;

// Ensure HACK is accessible globally if needed
window.HACK = hackInstance;
