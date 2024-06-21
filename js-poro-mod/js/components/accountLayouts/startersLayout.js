import { DynamicTable } from "../../../components/dynamicTable.js";
import hackInstance from "../../actions/hack";
import { showToast } from "../../../components/utils/showToast.js";
import { bitmaskNature } from "../../constants/nature.js";
import { noPassive } from "../../constants/noPassive.js";
import { speciesEggMoves } from "../../constants/speciesEggMoves.js";

export function loadStartersLayout(subLayoutContainer) {
    const achievementsTable = new DynamicTable();

    const unlockAllButton = document.createElement("button");
    unlockAllButton.id = "unlockAllButton";
    unlockAllButton.textContent = "⚠️ Unlock ∞ ⚠️";

    unlockAllButton.addEventListener("click", function () {
        unlockAllButton.blur();
        const button = document.getElementById("unlockAllButton");
        button.disabled = true; // Disable the button when clicked

        try {
            // Retrieve the current dexData
            const { dexData, starterData } =
                hackInstance.achvUnlocker.currentScene.gameData;

            // Unlock all forms and variants for all Pokémon (shiny T3)
            Object.keys(dexData).forEach((key) => {
                const data = dexData[key];
                data.seenAttr = BigInt(Number.MAX_SAFE_INTEGER);
                data.caughtAttr = BigInt(Number.MAX_SAFE_INTEGER);
                data.natureAttr = bitmaskNature;
                data.seenCount += 1;
                data.caughtCount += 1;
                data.hatchedCount += 1;
                data.ivs = data.ivs.map(() => Number.MAX_SAFE_INTEGER); // Credit: My Community!
            });

            // Unlock all starter Pokémon
            Object.keys(starterData).forEach((key) => {
                const data = dexData[key];
                data.moveset = speciesEggMoves[key] || null;
                data.eggMoves = Number.MAX_SAFE_INTEGER;
                data.candyCount = 9999;
                data.friendship = Number.MAX_SAFE_INTEGER;
                data.abilityAttr = Number.MAX_SAFE_INTEGER;
                data.passiveAttr = noPassive.includes(key) ? 0 : 3;
                data.valueReduction = 10;
                
                // Check if classicWinCount is NaN, if so set it to 1, else add 1
                if (isNaN(data.classicWinCount)) {
                    data.classicWinCount = 1;
                } else {
                    data.classicWinCount += 1;
                }
            });

            // Save the updated data
            hackInstance.achvUnlocker.save();

            showToast("All starters modded!");

            // If the command runs to the end without an error, keep the button locked for 10 more seconds
            setTimeout(() => {
                button.disabled = false;
            }, 10000);
        } catch (error) {
            // If an error occurs, re-enable the button instantly
            console.error("Error unlocking all starters:", error);
            button.disabled = false;
        }
    });

    subLayoutContainer.appendChild(unlockAllButton);
    subLayoutContainer.appendChild(achievementsTable.getElement());
}
