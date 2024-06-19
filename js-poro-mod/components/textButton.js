// textButton.js
import textButtonHtml from "../html/textButton.html"; // Ensure the path is correct

export function loadTextButton(containerId, buttonText, onSet) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Element with id '${containerId}' not found.`);
        return;
    }

    // Directly insert the imported HTML
    container.innerHTML = textButtonHtml;
    const setButton = container.querySelector(".set-button");
    const textElement = container.querySelector(".text-placeholder");

    // Set the button text
    textElement.textContent = buttonText;

    setButton.addEventListener("click", function () {
        this.blur();
        const inputElement = document.querySelector(".number-input");
        const sanitizeAndStripPlaceholders = (value) => {
            if (value === "-" || value === "") return value;
            return value.replace(/(?!^-)[^0-9]/g, "");
        };

        const value =
            inputElement.value === "" || inputElement.value === "-"
                ? 0
                : parseInt(sanitizeAndStripPlaceholders(inputElement.value), 10);
        onSet(value);
    });
}
