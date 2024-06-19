export function loadIconButton(icon, onSet) {
    const container = document.createElement("div");
    container.classList.add("button-container");

    // Create the button element
    const setButton = document.createElement("button");
    setButton.classList.add("icon-button", "set-button");

    // Create the icon element
    const iconElement = document.createElement("span");
    iconElement.classList.add("material-symbols-outlined", "icon-placeholder");
    iconElement.textContent = icon;

    // Append the icon to the button
    setButton.appendChild(iconElement);
    // Append the button to the container
    container.appendChild(setButton);

    // Create the input element
    const inputElement = document.createElement("input");
    inputElement.type = "text";
    inputElement.classList.add("number-input");
    container.appendChild(inputElement);

    setButton.addEventListener("click", function () {
        this.blur();
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

    return container;
}
