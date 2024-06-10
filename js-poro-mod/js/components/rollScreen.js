import { sanitizeNumberInput, clampNumber } from "../utils/numberInput.js";
import rollScreen from "../../layouts/rollScreen.html"; // Make sure the path is correct
import { showToast } from "../utils/showToast.js";
import { Rarities } from "../constants/rarities";
import { Hack } from "../actions/hack"; // Ensure correct path

export function loadRollScreen() {
    document.getElementById("rollScreen").innerHTML = rollScreen;

    const luckInput = document.getElementById("luckInput");
    if (luckInput) {
        luckInput.dataset.min = -Math.pow(2, 31);
        luckInput.dataset.max = Math.pow(2, 31) - 1;
        luckInput.value = luckInput.dataset.max; // Set default value to max
    }

    const moneyInput = document.getElementById("moneyInput");
    if (moneyInput) {
        moneyInput.dataset.min = -Number.MAX_SAFE_INTEGER;
        moneyInput.dataset.max = Number.MAX_SAFE_INTEGER;
        moneyInput.value = moneyInput.dataset.max; // Set default value to max
    }

    const rollCountInput = document.getElementById("rollCountInput");
    if (rollCountInput) {
        rollCountInput.dataset.min = -Math.pow(2, 31);
        rollCountInput.dataset.max = Math.pow(2, 31) - 1;
        rollCountInput.value = rollCountInput.dataset.max; // Set default value to max
    }

    const checkboxes = document.querySelectorAll(".toggle-checkbox");
    checkboxes.forEach((checkbox) => {
        checkbox.checked = true; // Enable all checkboxes
    });

    function validateAndClamp(inputElement) {
        const sanitizedValue = sanitizeNumberInput(inputElement.value);
        inputElement.value = sanitizedValue;
        const min = parseInt(inputElement.dataset.min, 10);
        const max = parseInt(inputElement.dataset.max, 10);
        inputElement.value = clampNumber(
            parseInt(inputElement.value, 10),
            min,
            max
        );
    }

    function handleNumberInput(event) {
        const inputElement = event.target;
        const validChars = "0123456789-,.";
        if (
            !validChars.includes(event.key) &&
            !event.ctrlKey &&
            !event.metaKey
        ) {
            event.preventDefault();
        }
    }

    luckInput.addEventListener("input", () => validateAndClamp(luckInput));
    luckInput.addEventListener("keydown", handleNumberInput);

    moneyInput.addEventListener("input", () => validateAndClamp(moneyInput));
    moneyInput.addEventListener("keydown", handleNumberInput);

    rollCountInput.addEventListener("input", () =>
        validateAndClamp(rollCountInput)
    );
    rollCountInput.addEventListener("keydown", handleNumberInput);

    document.getElementById("setLuckButton").addEventListener("click", () => {
        const luck = parseInt(sanitizeNumberInput(luckInput.value), 10);
        showToast(`Set Luck: ${luck}`);
        // Add your logic to set luck here
    });

    document.getElementById("setMoneyButton").addEventListener("click", () => {
        const money = parseInt(sanitizeNumberInput(moneyInput.value), 10);
        showToast(`Set Money: ${money}`);
        // Add your logic to set money here
    });

    document
        .getElementById("setRollCountButton")
        .addEventListener("click", () => {
            const rollCount = parseInt(
                sanitizeNumberInput(rollCountInput.value),
                10
            );
            showToast(`Set Roll Count: ${rollCount}`);
            // Add your logic to set roll count here
        });

    document.getElementById("rollActionButton").addEventListener("click", () => {
        const luck = parseInt(sanitizeNumberInput(luckInput.value), 10);
        const money = parseInt(sanitizeNumberInput(moneyInput.value), 10);
        const rollCount = parseInt(
            sanitizeNumberInput(rollCountInput.value),
            10
        );
        const itemTier = document.getElementById("itemTierSelect").value;

        showToast(
            `Luck: ${luck}, Money: ${money}, Roll Count: ${rollCount}, Item Tier: ${itemTier}`
        );
        Hack.roll(itemTier === "null" ? null : Rarities[itemTier], true);
        // Add your roll logic here
    });

    const lockShopToggle = document.getElementById("lockShopToggle");
    lockShopToggle.addEventListener("change", () => {
        const lockShop = lockShopToggle.checked;
        showToast(`Lock Shop: ${lockShop}`);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    loadRollScreen(); // Ensure the roll screen is loaded when the DOM is ready
});
