import { DynamicTable } from "../../../components/dynamicTable.js";
import { DynamicFieldset } from "../../../components/dynamicFieldset.js";
import { SingleLineContainer } from "../../../components/singleLineContainer.js";
import { createNumberInput } from "../../../components/numberInput.js";
import hackInstance from "../../actions/hack";
import { showToast } from "../../../components/utils/showToast.js";
import { createDropdown } from "../../../components/dropdown.js";
import { bitmaskNature } from "../../constants/nature.js";
import { noPassive } from "../../constants/noPassive.js";
import { speciesEggMoves } from "../../constants/speciesEggMoves.js";
import { AbilityAttr } from "../../constants/abilityAttr.js";
import { MAX_INT } from "../../constants/maxInt.js";
import { starterCosts } from "../../constants/starterCosts.js";
import { Species } from "../../constants/species.js";

export function loadStartersLayout(subLayoutContainer) {
    const achievementsTable = new DynamicTable();

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

    // Create dropdown fieldset
    const starterSelectFieldset = new DynamicFieldset("Select Starter");
    const options = ["All", ...Object.keys(starterCosts)];
    const dropdown = createDropdown(
        options.map((option) => ({
            value: option.toLowerCase(),
            text: option,
        })),
        (value) => {
            if (value.toLowerCase() === "all") return;

            const selectedKey = value.toUpperCase();
            const speciesId = Species[selectedKey];
            const key = speciesId.toString();
            const { dexData, starterData } =
                hackInstance.achvUnlocker.currentScene.gameData;

            if (dexData[key]) {
                const data = dexData[key];
                const ivLabels = ["Hp", "Atk", "Def", "SpAtk", "SpDef", "Spd"];
                ivLabels.forEach((label, index) => {
                    const input = document.getElementById(`IV_${label}`);
                    if (input && data.ivs?.[index] != null) {
                        input.value = data.ivs[index];
                    }
                });
                document.getElementById("SeenCountInput").intValue =
                    data.seenCount ?? 0;
                document.getElementById("CaughtCountInput").intValue =
                    data.caughtCount ?? 0;
                document.getElementById("HatchedCountInput").intValue =
                    data.hatchedCount ?? 0;
            }

            if (starterData[key]) {
                const data = starterData[key];
                document.getElementById("CandysInput").intValue =
                    data.candyCount ?? 0;
                document.getElementById("FriendshipInput").intValue =
                    data.friendship ?? 0;
                document.getElementById("ValueReductionInput").intValue =
                    data.valueReduction ?? 0;
            }
        },
        "selectPokemonSpecies"
    );
    starterSelectFieldset.addElement(dropdown);

    // Custom IV layout: one row per stat, full width, prefixed label
    const createIVsFieldset = () => {
        const labels = ["Hp", "Atk", "Def", "SpAtk", "SpDef", "Spd"];
        const ivsFieldset = new DynamicFieldset("IVs"); // Main container for all IVs

        // Flex wrapper to arrange IV fields vertically
        const ivList = document.createElement("div");
        ivList.style.display = "flex";
        ivList.style.flexDirection = "column";
        ivList.style.gap = "4px";

        labels.forEach((label) => {
            const fieldset = new DynamicFieldset(label);
            fieldset.getElement().style.maxWidth = "80px"; // Make compact

            const line = new SingleLineContainer();
            const input = createNumberInput(`IV_${label}`, 0, 31, 31);
            line.addElement(input);
            fieldset.addElement(line.getElement());

            ivList.appendChild(fieldset.getElement());
        });

        ivsFieldset.addElement(ivList);
        return ivsFieldset.getElement();
    };

    const setIVsInput = createIVsFieldset();
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
    unlockAllButton.textContent = "⚠️ Save ⚠️";

    unlockAllButton.addEventListener("click", function () {
        unlockAllButton.blur();
        const button = document.getElementById("unlockAllButton");
        button.disabled = true;

        try {
            const ivLabels = ["Hp", "Atk", "Def", "SpAtk", "SpDef", "Spd"];
            const IVsInputValue = ivLabels.map((label) => {
                const input = document.getElementById(`IV_${label}`);
                return input ? parseInt(input.value, 10) || 0 : 0;
            });

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

            const selectedValue = document.getElementById(
                "selectPokemonSpecies"
            ).value;
            const selectedKey = selectedValue.toUpperCase();
            const { dexData, starterData } =
                hackInstance.achvUnlocker.currentScene.gameData;

            if (selectedKey === "ALL") {
                Object.keys(dexData).forEach((key) => {
                    const data = dexData[key];
                    data.seenAttr = BigInt(Number.MAX_SAFE_INTEGER);
                    data.caughtAttr = BigInt(Number.MAX_SAFE_INTEGER);
                    data.natureAttr = bitmaskNature;
                    data.seenCount = SeenCountInputValue;
                    data.caughtCount = CaughtCountInputValue;
                    data.hatchedCount = HatchedCountInputValue;
                    data.ivs = [...IVsInputValue];
                });

                Object.keys(starterData).forEach((key) => {
                    const data = starterData[key];
                    data.moveset = speciesEggMoves[key] || null;
                    data.eggMoves = speciesEggMoves.hasOwnProperty(key)
                        ? (1 << 4) - 1
                        : 0;
                    data.candyCount = CandysInputValue;
                    data.friendship = FriendshipInputValue;
                    data.abilityAttr =
                        AbilityAttr.ABILITY_1 |
                        AbilityAttr.ABILITY_2 |
                        AbilityAttr.ABILITY_HIDDEN;
                    data.passiveAttr = noPassive.includes(key) ? 0 : 3;
                    data.valueReduction = ValueReductionInputValue;
                    data.classicWinCount = isNaN(data.classicWinCount)
                        ? 1
                        : data.classicWinCount + 1;
                });

                showToast("All starters modded!");
            } else {
                const speciesId = Species[selectedKey];
                const key = speciesId.toString();

                if (dexData[key]) {
                    const data = dexData[key];
                    data.seenAttr = BigInt(Number.MAX_SAFE_INTEGER);
                    data.caughtAttr = BigInt(Number.MAX_SAFE_INTEGER);
                    data.natureAttr = bitmaskNature;
                    data.seenCount = SeenCountInputValue;
                    data.caughtCount = CaughtCountInputValue;
                    data.hatchedCount = HatchedCountInputValue;
                    data.ivs = [...IVsInputValue];
                }

                if (starterData[key]) {
                    const data = starterData[key];
                    data.moveset = speciesEggMoves[key] || null;
                    data.eggMoves = speciesEggMoves.hasOwnProperty(key)
                        ? (1 << 4) - 1
                        : 0;
                    data.candyCount = CandysInputValue;
                    data.friendship = FriendshipInputValue;
                    data.abilityAttr =
                        AbilityAttr.ABILITY_1 |
                        AbilityAttr.ABILITY_2 |
                        AbilityAttr.ABILITY_HIDDEN;
                    data.passiveAttr = noPassive.includes(key) ? 0 : 3;
                    data.valueReduction = ValueReductionInputValue;
                    data.classicWinCount = isNaN(data.classicWinCount)
                        ? 1
                        : data.classicWinCount + 1;
                }

                const toggleCursor = () => {
                    const uiHandler =
                        hackInstance.achvUnlocker.currentScene.ui.getHandler();
                    const { cursor } = uiHandler;
                    const nextCursor = cursor === 0 ? 1 : cursor - 1;
                    uiHandler.setCursor(nextCursor);
                    uiHandler.setCursor(cursor);
                };

                if (
                    Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.keys.battle.ui.getHandler()
                        .__proto__.constructor.name === "StarterSelectUiHandler"
                ) {
                    toggleCursor();
                }

                showToast(`Only ${selectedKey} modded!`);
            }

            hackInstance.achvUnlocker.save();
            setTimeout(() => {
                button.disabled = false;
            }, 5000);
        } catch (error) {
            console.error("Error unlocking starters:", error);
            button.disabled = false;
        }
    });

    // Add dropdown first (full width)
    subLayoutContainer.appendChild(starterSelectFieldset.getElement());

    // Create main horizontal flex layout
    const layoutWrapper = document.createElement("div");
    layoutWrapper.style.display = "flex";
    layoutWrapper.style.gap = "8px";
    layoutWrapper.style.marginBottom = "8px";

    // Left column (IVs)
    const leftColumn = document.createElement("div");
    leftColumn.style.display = "flex";
    leftColumn.style.flexDirection = "column";
    leftColumn.appendChild(setIVsInput);

    // Right column (other stats)
    const rightColumn = document.createElement("div");
    rightColumn.style.display = "flex";
    rightColumn.style.flexDirection = "column";
    rightColumn.appendChild(setCandyCountInput);
    rightColumn.appendChild(setFriendshipInput);
    rightColumn.appendChild(setValueReductionInput);
    rightColumn.appendChild(setSeenCountInput);
    rightColumn.appendChild(setCaughtCountInput);
    rightColumn.appendChild(setHatchedCountInput);

    // Combine layout
    layoutWrapper.appendChild(leftColumn);
    layoutWrapper.appendChild(rightColumn);
    subLayoutContainer.appendChild(layoutWrapper);

    // Add the unlock button and table
    unlockAllButton.style.gap = "8px";
    subLayoutContainer.appendChild(unlockAllButton);
    subLayoutContainer.appendChild(achievementsTable.getElement());
}
