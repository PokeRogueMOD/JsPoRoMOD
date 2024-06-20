import { DynamicFieldset } from "../../../components/dynamicFieldset.js";
import hackInstance from "../../actions/hack";
import { createNumberInput } from "../../../components/numberInput.js";
import { SingleLineContainer } from "../../../components/singleLineContainer.js";
import { VoucherType } from "../../constants/voucherType.js";

// Create a reverse mapping for the VoucherType enum
const VoucherTypeReverse = Object.fromEntries(
    Object.entries(VoucherType).map(([key, value]) => [value, key])
);

export function loadUnlockPityLayout(subLayoutContainer) {
    const unlockPity = hackInstance.achvUnlocker.currentScene.gameData.unlockPity;

    // Function to create a single row with number input and set button
    function createUnlockRow(index, defaultValue) {
        const fieldset = new DynamicFieldset(VoucherTypeReverse[index]);
        const singleLineContainer = new SingleLineContainer();

        const numberInput = createNumberInput(
            `unlockNumberInput-${index}`,
            0,
            defaultValue,
            Math.pow(2, 31) - 1
        );

        // Set the intValue property for the number input
        numberInput.intValue = defaultValue;

        const setButton = document.createElement("button");
        setButton.className = "set-button";
        setButton.innerHTML =
            '<span class="material-symbols-outlined">play_arrow</span>';

        setButton.addEventListener("click", function () {
            setButton.blur();
            const inputValue = document.getElementById(
                `unlockNumberInput-${index}`
            ).intValue; // Use the custom intValue property
            unlockPity[parseInt(index)] = inputValue; // Update the unlockPity list with the new value
        });

        singleLineContainer.addElement(numberInput);
        singleLineContainer.addElement(setButton);
        fieldset.addElement(singleLineContainer.getElement());

        return fieldset.getElement();
    }

    // Iterate over the list and create a row for each index
    unlockPity.forEach((value, index) => {
        const unlockRow = createUnlockRow(index, value);
        subLayoutContainer.appendChild(unlockRow);
    });
}
