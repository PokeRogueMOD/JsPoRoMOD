import dropdownHtml from "./html/dropdown.html"; // Ensure the path is correct

export function createDropdown(options, onChange, id) {
    const container = document.createElement("div");
    container.className = "ele-container";
    container.innerHTML = dropdownHtml;

    // Ensure the HTML contains the .dropdown class
    const selectElement = container.querySelector(".dropdown");
    if (!selectElement) {
        console.error(
            `No element with class 'dropdown' found within the provided HTML.`
        );
        return null;
    }

    selectElement.id = id;
    // Clear existing options if any
    selectElement.innerHTML = "";

    // Populate the dropdown with provided options
    options.forEach((option) => {
        const optionElement = document.createElement("option");
        optionElement.value = option.value;
        optionElement.text = option.text;
        selectElement.add(optionElement);
    });

    // Attach change event listener
    selectElement.addEventListener("change", function () {
        selectElement.blur()
        onChange(this.value);
    });

    // Variable to track if the dropdown is open
    let isDropdownOpen = false;

    selectElement.addEventListener("click", function (event) {
        if (isDropdownOpen) {
            // If the dropdown is already open and click happens on the select, do nothing special
            this.blur();
            isDropdownOpen = false;
        } else {
            isDropdownOpen = true;
        }
    });

    function handleOutsideEvent(event) {
        if (
            !selectElement.contains(event.target)
        ) {
            selectElement.blur();
            isDropdownOpen = false;
        }
    }
    
    // Event listener for clicks outside the inputs
    document.addEventListener("mousedown", handleOutsideEvent);
    document.addEventListener("touchstart", handleOutsideEvent);

    return container;
}