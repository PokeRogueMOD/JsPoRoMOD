import { DynamicTable } from "../../../components/dynamicTable.js";
import { createDateComponent } from "../../../components/dateSelect.js";
import hackInstance from "../../actions/hack";

// Functions for different sublayouts
export function loadAchievementsLayout(subLayoutContainer) {
    const achievementsTable = new DynamicTable();
    const dateComponent = createDateComponent(
        "achievementDate"
    );

    const unlockAllButton = document.createElement("button");
    unlockAllButton.id = "unlockAllButton";
    unlockAllButton.textContent = "Unlock All";

    unlockAllButton.addEventListener("click", async function () {
        this.blur();
        const button = document.getElementById("unlockAllButton");
        button.disabled = true; // Disable the button when clicked

        try {
            await hackInstance.allAchievements();

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
