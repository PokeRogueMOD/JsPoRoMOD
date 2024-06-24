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
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

export function loadVouchersLayout(subLayoutContainer) {
    const vouchersTable = new DynamicTable();
    const scene = hackInstance.achvUnlocker.currentScene;
    const voucherCounts = scene.gameData.voucherCounts;

    // Function to create a single row with number input
    function createVoucherRow(id, defaultValue) {
        const fieldset = new DynamicFieldset(
            formatLabel(VoucherTypeReverse[id])
        );
        const singleLineContainer = new SingleLineContainer();

        const numberInput = createNumberInput(
            `voucherNumberInput-${id}`,
            0,
            defaultValue,
            Math.pow(2, 31) - 1,
            (newIntValue) => {
                voucherCounts[id] = newIntValue; // Update the voucherCounts with the new value

                const uiHandler = scene.ui.getHandler();
                if (uiHandler.constructor.name === "EggGachaUiHandler") {
                    uiHandler.updateVoucherCounts();
                }
            }
        );

        singleLineContainer.addElement(numberInput);
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
