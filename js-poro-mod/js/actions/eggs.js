import { BaseScene } from "../scenes/baseScene";
import { showToast } from "../utils/showToast.js";
import { Egg, generateEggs, GachaType, EggTier } from "./egg"; // Import your egg-related modules

export class EggGenerator extends BaseScene {
    constructor() {
        super();
    }

    execute() {
        const gachaTypeInput = document.getElementById("gachaType");
        const hatchWavesInput = document.getElementById("hatchWaves");
        const tierInput = document.getElementById("tier");

        const gachaType = parseInt(gachaTypeInput.value, 10); // Assuming the input values are numerical strings
        const hatchWaves = parseInt(hatchWavesInput.value, 10);
        const tier = parseInt(tierInput.value, 10);

        const eggGenerator = generateEggs(tier, gachaType, hatchWaves);
        const newEgg = eggGenerator.next().value;

        showToast(
            `Generated Egg: ID - ${newEgg.id}, Tier - ${newEgg.tier}, Gacha Type - ${newEgg.gachaType}, Hatch Waves - ${newEgg.hatchWaves}, Timestamp - ${newEgg.timestamp}`
        );

        // Assuming currentTimestamp should be set to the new egg's timestamp
        const currentTimestamp = newEgg.timestamp;

        // Example of updating eggs with the new egg
        if (!this.currentScene.gameData.eggs) {
            this.currentScene.gameData.eggs = [];
        }

        this.currentScene.gameData.eggs.push(newEgg);

        // Save the updated data
        this.save();

        showToast("New egg generated and saved!");
    }

    save() {
        this.currentScene.gameData.saveSystem(); // Ensure your save system method is correctly referenced
    }
}
