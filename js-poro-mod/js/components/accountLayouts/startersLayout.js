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

    // Create Dropdown
    const options = ["All", ...Object.keys(starterCosts)];
    // add Species keys to options
    const dropdown = createDropdown(
        options.map((option) => ({
            value: option.toLowerCase(),
            text: option,
        })),
        (value) => {
            value;
        },
        "selectPokemonSpecies"
    );

    /*
    Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.keys.battle.ui.getHandler().__proto__.constructor.name: 'StarterSelectUiHandler'

    Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.keys.battle.ui.getHandler().lastSpecies: eY (PokemonSpecies)
        ability1: 66
        ability2: 66
        abilityHidden: 94
        baseExp: 62
        baseFriendship: 50
        baseStats: (6) [39, 52, 43, 60, 50, 65]
        baseTotal: 309
        canChangeForm: false
        catchRate: 45
        forms: []
        genderDiffs: false
        growthRate: 3
        height: 0.6
        isStarterSelectable: false
        legendary: false
        malePercent: 87.5
        mythical: false
        name: "Charmander"
        species: "Lizard Pokémon"
        speciesId: 4
        subLegendary: false
        type1: 9
        type2: null
        weight: 8.5
        _formIndex: 0
        _generation: 1
        formIndex: (...)
        generation: (...)
    */

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

            const selectedValue =
                document.getElementById("selectPokemonSpecies").value; // lowercase value
            const selectedKey = selectedValue.toUpperCase(); // matches Species key
            console.log(selectedKey);

            const { dexData, starterData } =
                hackInstance.achvUnlocker.currentScene.gameData;

            if (selectedKey === "ALL") {
                // --- Unlock ALL starters
                Object.keys(dexData).forEach((key) => {
                    const data = dexData[key];
                    data.seenAttr = BigInt(Number.MAX_SAFE_INTEGER);
                    data.caughtAttr = BigInt(Number.MAX_SAFE_INTEGER);
                    data.natureAttr = bitmaskNature;
                    data.seenCount = SeenCountInputValue;
                    data.caughtCount = CaughtCountInputValue;
                    data.hatchedCount = HatchedCountInputValue;
                    data.ivs = data.ivs.map(() => IVsInputValue);
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
                // --- Unlock ONLY selected Pokémon
                const speciesId = Species[selectedKey]; // numeric ID
                const key = speciesId.toString();

                if (dexData[key]) {
                    const data = dexData[key];
                    data.seenAttr = BigInt(Number.MAX_SAFE_INTEGER);
                    data.caughtAttr = BigInt(Number.MAX_SAFE_INTEGER);
                    data.natureAttr = bitmaskNature;
                    data.seenCount = SeenCountInputValue;
                    data.caughtCount = CaughtCountInputValue;
                    data.hatchedCount = HatchedCountInputValue;
                    data.ivs = data.ivs.map(() => IVsInputValue);
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
                    const uiHandler = hackInstance.achvUnlocker.currentScene.ui.getHandler();
                    const { cursor } = uiHandler;
                    const nextCursor = cursor === 0 ? 1 : cursor - 1;
                    uiHandler.setCursor(nextCursor);
                    uiHandler.setCursor(cursor);
                };
                
                if (Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.keys.battle.ui.getHandler().__proto__.constructor.name  === 'StarterSelectUiHandler') {
                    // Invoke the cursor toggling function
                    toggleCursor();
                }

                showToast(`Only ${selectedKey} modded!`);
            }

            // Save the updated data
            hackInstance.achvUnlocker.save();

            setTimeout(() => {
                button.disabled = false;
            }, 5000);
        } catch (error) {
            console.error("Error unlocking starters:", error);
            button.disabled = false;
        }
    });

    // Add dropdown to the accountScreen
    subLayoutContainer.appendChild(dropdown);

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
