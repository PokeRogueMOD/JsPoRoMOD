export function createCheckbox(id, isChecked, onChange) {
    // Create the container div
    const container = document.createElement("div");
    container.className = "checkbox-container"; // Add a class for styling the container

    // Create the checkbox input element
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = id;
    checkbox.classList.add("toggle-checkbox");
    checkbox.checked = isChecked;

    // Append the checkbox to the container
    container.appendChild(checkbox);

    // Add change event listener
    checkbox.addEventListener("change", function () {
        checkbox.blur()
        onChange(this.checked);
    });

    return container;
}