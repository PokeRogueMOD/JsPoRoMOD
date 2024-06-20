import { DynamicTable } from "../../../components/dynamicTable.js";
import { DynamicFieldset } from "../../../components/dynamicFieldset.js";
import hackInstance from "../../actions/hack";
import { createCheckbox } from "../../../components/checkbox.js";
import { SingleLineContainer } from "../../../components/singleLineContainer.js";
import { Unlockables } from "../../constants/unlockables.js";

// Create a reverse mapping for the Unlockables enum
const UnlockablesReverse = Object.fromEntries(
    Object.entries(Unlockables).map(([key, value]) => [value, key])
);

export function loadGamemodesLayout(subLayoutContainer) {
    const gamemodesTable = new DynamicTable();
    const gamemodeCounts =
        hackInstance.achvUnlocker.currentScene.gameData.unlocks;

    // Function to create a single row with a checkbox
    function createGamemodeRow(id, defaultValue) {
        const fieldset = new DynamicFieldset(UnlockablesReverse[id]);
        const singleLineContainer = new SingleLineContainer();

        const checkbox = createCheckbox(
            `gamemodeCheckbox-${id}`,
            defaultValue,
            (isChecked) => {
                gamemodeCounts[id] = isChecked; // Update the gamemodeCounts with the new value
            }
        );

        singleLineContainer.addElement(checkbox);
        fieldset.addElement(singleLineContainer.getElement());

        return fieldset.getElement();
    }

    // Iterate over the object keys and create a row for each key
    for (const key of Object.keys(gamemodeCounts)) {
        const gamemodeRow = createGamemodeRow(key, gamemodeCounts[key]);
        subLayoutContainer.appendChild(gamemodeRow);
    }

    // Append the gamemodes table
    subLayoutContainer.appendChild(gamemodesTable.getElement());
}
