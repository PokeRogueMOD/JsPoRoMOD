import { DynamicTable } from "../../../components/dynamicTable.js";
import { DynamicFieldset } from "../../../components/dynamicFieldset.js";
import { SingleLineContainer } from "../../../components/singleLineContainer.js";
import { createNumberInput } from "../../../components/numberInput.js";
import hackInstance from "../../actions/hack";
import { showToast } from "../../../components/utils/showToast.js";
import { bitmaskNature } from "../../constants/nature.js";
import { noPassive } from "../../constants/noPassive.js";
import { speciesEggMoves } from "../../constants/speciesEggMoves.js";
import { AbilityAttr } from "../../constants/abilityAttr.js";
import { MAX_INT } from "../../constants/maxInt.js";

export function loadStartersLayout(subLayoutContainer) {
    const achievementsTable = new DynamicTable();

    // Function to create a single row with number input and set button
    function createUnlockRow(idName, minValue, defaultValue, maxValue) {
        const fieldset = new DynamicFieldset(idName);
        const singleLineContainer = new SingleLineContainer();

        const numberInput = createNumberInput(
            `${idName}Input`,
            minValue,
            defaultValue,
            maxValue
        );

        singleLineContainer.addElement(numberInput);
        fieldset.addElement(singleLineContainer.getElement());

        return fieldset.getElement();
    }

    // ivs, candys, friendship, value reduction, seen count cought count und hatched count
    const setIVsInput = createUnlockRow("IVs", 0, 31, Number.MAX_SAFE_INTEGER);
    const setCandyCountInput = createUnlockRow(
        "Candys",
        Number.MIN_SAFE_INTEGER,
        999,
        999
    );
    const setFriendshipInput = createUnlockRow(
        "Friendship",
        Number.MIN_SAFE_INTEGER,
        Number.MAX_SAFE_INTEGER,
        Number.MAX_SAFE_INTEGER
    );
    const setValueReductionInput = createUnlockRow(
        "ValueReduction",
        Number.MIN_SAFE_INTEGER,
        10,
        99
    );
    const setSeenCountInput = createUnlockRow("SeenCount", 0, 1, MAX_INT);
    const setCaughtCountInput = createUnlockRow("CaughtCount", 0, 1, MAX_INT);
    const setHatchedCountInput = createUnlockRow("HatchedCount", 0, 1, MAX_INT);

    const unlockAllButton = document.createElement("button");
    unlockAllButton.id = "unlockAllButton";
    unlockAllButton.textContent = "⚠️ Unlock ∞ ⚠️";

    unlockAllButton.addEventListener("click", function () {
        unlockAllButton.blur();
        const button = document.getElementById("unlockAllButton");
        button.disabled = true; // Disable the button when clicked

        try {
            const IVsInputValue = document.getElementById("IVsInput").intValue;
            const CandysInputValue =
                document.getElementById("CandysInput").intValue;
            const FriendshipInputValue =
                document.getElementById("FriendshipInput").intValue;
            const ValueReductionInputValue = document.getElementById(
                "ValueReductionInput"
            ).intValue;
            const SeenCountInputValue =
                document.getElementById("SeenCountInput").intValue;
            const CaughtCountInputValue =
                document.getElementById("CaughtCountInput").intValue;
            const HatchedCountInputValue =
                document.getElementById("HatchedCountInput").intValue;

            // Retrieve the current dexData
            const { dexData, starterData } =
                hackInstance.achvUnlocker.currentScene.gameData;

            // Unlock all forms and variants for all Pokémon (shiny T3)
            Object.keys(dexData).forEach((key) => {
                const data = dexData[key];
                data.seenAttr = BigInt(Number.MAX_SAFE_INTEGER);
                data.caughtAttr = BigInt(Number.MAX_SAFE_INTEGER);
                data.natureAttr = bitmaskNature;
                data.seenCount = SeenCountInputValue;
                data.caughtCount = CaughtCountInputValue;
                data.hatchedCount = HatchedCountInputValue;
                data.ivs = data.ivs.map(() => IVsInputValue); // Credit: My Community!
            });

            // Unlock all starter Pokémon
            Object.keys(starterData).forEach((key) => {
                const data = starterData[key];
                data.moveset = speciesEggMoves[key] || null;
                data.eggMoves = speciesEggMoves.hasOwnProperty(key)
                    ? (1 << 4) - 1
                    : 0;
                data.candyCount = CandysInputValue; // Credit: My Community!
                data.friendship = FriendshipInputValue;
                data.abilityAttr =
                    AbilityAttr.ABILITY_1 |
                    AbilityAttr.ABILITY_2 |
                    AbilityAttr.ABILITY_HIDDEN;
                data.passiveAttr = noPassive.includes(key) ? 0 : 3;
                data.valueReduction = ValueReductionInputValue;

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
            }, 5000);
        } catch (error) {
            // If an error occurs, re-enable the button instantly
            console.error("Error unlocking all starters:", error);
            button.disabled = false;
        }
    });

    subLayoutContainer.appendChild(setIVsInput);
    subLayoutContainer.appendChild(setCandyCountInput);
    subLayoutContainer.appendChild(setFriendshipInput);
    subLayoutContainer.appendChild(setValueReductionInput);
    subLayoutContainer.appendChild(setSeenCountInput);
    subLayoutContainer.appendChild(setCaughtCountInput);
    subLayoutContainer.appendChild(setHatchedCountInput);

    subLayoutContainer.appendChild(unlockAllButton);
    subLayoutContainer.appendChild(achievementsTable.getElement());
}
