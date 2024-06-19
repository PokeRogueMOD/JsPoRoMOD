// divider.js
import dividerHtml from "../html/divider.html"; // Ensure the path is correct

export function loadDivider(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Element with id '${containerId}' not found.`);
        return;
    }

    // Directly insert the imported HTML
    container.innerHTML = dividerHtml;
}
