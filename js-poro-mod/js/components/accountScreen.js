import accountScreenHtml from "../../layouts/accountScreen.html"; // Ensure the path is correct
import hackInstance from "../actions/hack"; // Import the instance instead of the class

export function loadAccountScreen() {
    document.getElementById("accountScreen").innerHTML = accountScreenHtml;

    document
        .getElementById("unlockAllButton")
        .addEventListener("click", async function () {
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
}

document.addEventListener("DOMContentLoaded", () => {
    loadAccountScreen(); // Ensure the account screen is loaded when the DOM is ready
});
