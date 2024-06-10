export function sanitizeNumberInput(input) {
    // Remove non-numeric characters except for allowed ones
    input = input.replace(/[^\d.,-]/g, "");
    // Replace ',' and ' ' with empty string
    input = input.replace(/[,\s]/g, "");
    return input;
}

export function clampNumber(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

document.querySelectorAll(".number-input").forEach((input) => {
    input.addEventListener("input", (event) => {
        const sanitizedValue = sanitizeNumberInput(event.target.value);
        event.target.value = sanitizedValue;
    });

    input.addEventListener("blur", (event) => {
        const sanitizedValue = sanitizeNumberInput(event.target.value);
        const numberValue = parseFloat(sanitizedValue);
        const min = parseFloat(input.dataset.min);
        const max = parseFloat(input.dataset.max);
        if (!isNaN(numberValue)) {
            const clampedValue = clampNumber(numberValue, min, max);
            event.target.value = clampedValue;
        } else {
            event.target.value = "";
        }
    });
});
