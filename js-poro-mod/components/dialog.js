// dialog.js
import dialogHtml from "../html/dialog.html"; // Ensure the path is correct

export function loadDialog(containerId, formContentHtml, onClose) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Element with id '${containerId}' not found.`);
        return;
    }

    // Directly insert the imported HTML
    container.innerHTML = dialogHtml;

    const dialogElement = container.querySelector("#dialog-id");
    const formElement = container.querySelector("#form-id");

    // Insert the form content HTML
    formElement.innerHTML = formContentHtml;

    // Attach the close event listener
    dialogElement.addEventListener("close", () => {
        const cancelClicked = dialogElement.returnValue === "cancel";
        const okClicked = dialogElement.returnValue === "ok";
        onClose(cancelClicked, okClicked);
    });
}
