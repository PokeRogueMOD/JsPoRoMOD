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
