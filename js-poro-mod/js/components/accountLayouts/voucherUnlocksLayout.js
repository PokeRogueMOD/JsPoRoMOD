import { DynamicTable } from "../../../components/dynamicTable.js";
import { createDateComponent } from "../../../components/dateSelect.js";
import hackInstance from "../../actions/hack";
import { showToast } from "../../../components/utils/showToast.js";
import { SignatureSpecies } from "../../constants/signatureSpecies.js";

// Functions for different sublayouts
export function loadVoucherUnlocksLayout(subLayoutContainer) {
    const achievementsTable = new DynamicTable();
    const dateComponent = createDateComponent(
        "voucherDate"
    );

    const unlockAllButton = document.createElement("button");
    unlockAllButton.id = "unlockAllButton";
    unlockAllButton.textContent = "Unlock All";

    unlockAllButton.addEventListener("click", async function () {
        this.blur();
        const button = document.getElementById("unlockAllButton");
        button.disabled = true; // Disable the button when clicked

        try {
            const timestampInput = document.getElementById("voucherDate");
            const dateValue = timestampInput.value; // returns 2018-07-22 for example
            const dateObject = new Date(dateValue);
            const timestamp = dateObject.getTime(); // converts to timestamp in milliseconds

            showToast(`Date: ${dateValue}, Timestamp: ${timestamp}`);

            // Assuming currentTimestamp should be set to this new timestamp
            const currentTimestamp = timestamp;

            // Example of updating achievements with the new timestamp
            hackInstance.achvUnlocker.currentScene.gameData.voucherUnlocks = Object.keys(
                SignatureSpecies
            ).reduce((acc, key) => {
                acc[key] = currentTimestamp;
                return acc;
            }, {});

            // Save the updated data
            hackInstance.achvUnlocker.save();

            showToast("All vouchers unlocked!");

            // If the command runs to the end without an error, keep the button locked for 5 more seconds
            setTimeout(() => {
                button.disabled = false;
            }, 5000);
        } catch (error) {
            // If an error occurs, re-enable the button instantly
            console.error(error);
            button.disabled = false;
        }
    });

    subLayoutContainer.appendChild(dateComponent);
    subLayoutContainer.appendChild(unlockAllButton);
    subLayoutContainer.appendChild(achievementsTable.getElement());
}
