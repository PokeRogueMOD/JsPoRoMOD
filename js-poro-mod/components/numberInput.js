export function createNumberInput(
    id,
    minValue,
    defaultValue,
    maxValue,
    onChange = undefined
) {
    const container = document.createElement("div");

    const inputElement = document.createElement("input");
    inputElement.type = "text";
    inputElement.className = "number-input";

    if (id.startsWith("IV_")) {
        inputElement.classList.add("iv-input"); // ✅ Only IV fields get this class
    }

    inputElement.id = id;
    container.appendChild(inputElement);

    const formatWithDots = (value) => {
        return value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const sanitizeAndStripPlaceholders = (value) => {
        if (value === "-" || value === "") return value;
        return value.replace(/(?!^-)[^0-9]/g, "");
    };

    const clampNumber = (value, min, max) => {
        return Math.max(min, Math.min(max, value));
    };

    const setInputDefaults = (
        inputElement,
        minValue,
        maxValue,
        defaultValue
    ) => {
        inputElement.dataset.min = minValue;
        inputElement.dataset.max = maxValue;
        inputElement.value = formatWithDots(defaultValue.toString());
    };

    setInputDefaults(inputElement, minValue, maxValue, defaultValue);

    // Initialize custom property intValue
    inputElement.intValue = defaultValue;

    function validateAndClamp(inputElement) {
        const cursorPosition = inputElement.selectionStart;
        let sanitizedValue = sanitizeAndStripPlaceholders(inputElement.value);
        const min = parseInt(inputElement.dataset.min, 10);
        const max = parseInt(inputElement.dataset.max, 10);
        let clampedValue;

        if (sanitizedValue === "" || sanitizedValue === "-") {
            clampedValue = sanitizedValue;
        } else {
            clampedValue = clampNumber(
                parseInt(sanitizedValue, 10),
                min,
                max
            ).toString();
        }

        inputElement.value = clampedValue.startsWith("-")
            ? `-${formatWithDots(clampedValue.substring(1))}`
            : formatWithDots(clampedValue);

        let newCursorPosition = cursorPosition;
        const sanitizedBeforeCursor = sanitizeAndStripPlaceholders(
            inputElement.value.substring(0, cursorPosition)
        );
        newCursorPosition =
            sanitizedBeforeCursor.length +
            Math.floor(sanitizedBeforeCursor.length / 3);
        inputElement.setSelectionRange(newCursorPosition, newCursorPosition);

        // Update custom property intValue only if it has changed
        const newIntValue =
            sanitizedValue === "" || sanitizedValue === "-"
                ? 0
                : parseInt(sanitizedValue, 10);

        if (inputElement.intValue !== newIntValue) {
            inputElement.intValue = newIntValue;
            if (onChange) {
                onChange(newIntValue);
            }
        }
    }

    function handleNumberInput(event) {
        const specialKeys = [
            "Backspace",
            "Delete",
            "ArrowLeft",
            "ArrowRight",
            "Home",
            "End",
        ];

        if (
            event.key === "-" &&
            inputElement.selectionStart === 0 &&
            inputElement.value.indexOf("-") === -1
        ) {
            return;
        }

        if (
            !/[\d]/.test(event.key) &&
            !specialKeys.includes(event.key) &&
            !event.ctrlKey &&
            !event.metaKey
        ) {
            event.preventDefault();
        }
    }

    inputElement.addEventListener("input", () => {
        validateAndClamp(inputElement);
    });
    inputElement.addEventListener("keydown", handleNumberInput);

    inputElement.addEventListener("blur", function () {
        const value =
            inputElement.value === "" || inputElement.value === "-"
                ? 0
                : parseInt(
                      sanitizeAndStripPlaceholders(inputElement.value),
                      10
                  );
        // Update custom property intValue only if it has changed
        if (inputElement.intValue !== value) {
            inputElement.intValue = value;
            if (onChange) {
                onChange(value);
            }
        }
    });

    function handleOutsideEvent(event) {
        if (!inputElement.contains(event.target)) {
            inputElement.blur();
        }
    }

    // Event listener for clicks outside the inputs
    document.addEventListener("mousedown", handleOutsideEvent);
    document.addEventListener("touchstart", handleOutsideEvent);

    return container;
}
