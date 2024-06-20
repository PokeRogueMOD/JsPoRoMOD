import { DynamicTable } from "../../../components/dynamicTable.js";
import { DynamicFieldset } from "../../../components/dynamicFieldset.js";
import hackInstance from "../../actions/hack";
import { createNumberInput } from "../../../components/numberInput.js";
import { SingleLineContainer } from "../../../components/singleLineContainer.js"; // Import the new SingleLineContainer component
import { VoucherType } from "../../constants/voucherType.js";

// Create a reverse mapping for the VoucherType enum
const VoucherTypeReverse = Object.fromEntries(
    Object.entries(VoucherType).map(([key, value]) => [value, key])
);

// Function to convert enum key to title case string
function formatLabel(enumKey) {
    return enumKey
        .toLowerCase()
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

export function loadVouchersLayout(subLayoutContainer) {
    const vouchersTable = new DynamicTable();
    const voucherCounts = hackInstance.achvUnlocker.currentScene.gameData.voucherCounts;

    // Function to create a single row with number input and set button
    function createVoucherRow(id, defaultValue) {
        const fieldset = new DynamicFieldset(formatLabel(VoucherTypeReverse[id]));
        const singleLineContainer = new SingleLineContainer();

        const numberInput = createNumberInput(`voucherNumberInput-${id}`, 0, defaultValue, Math.pow(2, 31) - 1);

        const setButton = document.createElement("button");
        setButton.className = "set-button";
        setButton.innerHTML = '<span class="material-symbols-outlined">play_arrow</span>';
        
        setButton.addEventListener("click", function () {
            setButton.blur();
            const inputValue = document.getElementById(`voucherNumberInput-${id}`).intValue;
            voucherCounts[id] = inputValue;  // Update the voucherCounts with the new value
        });

        singleLineContainer.addElement(numberInput);
        singleLineContainer.addElement(setButton);
        fieldset.addElement(singleLineContainer.getElement());

        return fieldset.getElement();
    }

    // Iterate over the object keys and create a row for each key
    for (const key of Object.keys(voucherCounts)) {
        const voucherRow = createVoucherRow(key, voucherCounts[key]);
        subLayoutContainer.appendChild(voucherRow);
    }

    // Append the vouchers table
    subLayoutContainer.appendChild(vouchersTable.getElement());
}