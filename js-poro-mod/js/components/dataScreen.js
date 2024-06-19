export function loadDataScreen() {
    const settingsContainer = document.getElementById("layoutContainer");
    if (!settingsContainer) {
        console.error("Element with id 'settingsContainer' not found.");
        return;
    }

    // Create the rollScreen container
    const rollScreenElement = document.createElement("div");
    rollScreenElement.id = "dataScreen";
    rollScreenElement.style.display = "none";
    settingsContainer.appendChild(rollScreenElement);
}
