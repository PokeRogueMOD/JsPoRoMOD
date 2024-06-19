// labelSwitch.js
import labelSwitchHtml from "../html/labelSwitch.html"; // Ensure the path is correct

export function loadLabelSwitch(containerId, labelText, onChange) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Element with id '${containerId}' not found.`);
        return;
    }

    // Directly insert the imported HTML
    container.innerHTML = labelSwitchHtml;
    const switchElement = container.querySelector(".label-switch");
    const labelElement = container.querySelector(".switch-label");

    // Set the label text
    labelElement.textContent = labelText;

    switchElement.addEventListener("change", function () {
        onChange(this.checked);
    });
}
