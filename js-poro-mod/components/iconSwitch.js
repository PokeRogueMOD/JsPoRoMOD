// iconSwitch.js
import iconSwitchHtml from "../html/iconSwitch.html"; // Ensure the path is correct

export function loadIconSwitch(containerId, onChange) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Element with id '${containerId}' not found.`);
        return;
    }

    // Directly insert the imported HTML
    container.innerHTML = iconSwitchHtml;
    const switchElement = container.querySelector(".icon-switch");

    switchElement.addEventListener("change", function () {
        onChange(this.checked);
    });
}
