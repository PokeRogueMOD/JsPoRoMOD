// Roll Screen
import { sanitizeNumberInput, clampNumber } from "../utils/numberInput.js";
import rollScreen from "../../layouts/rollScreen.html"; // Make sure the path is correct
import { showToast } from "../utils/showToast.js";
import { Rarities } from "../constants/rarities";
import hackInstance from "../actions/hack"; // Import the instance instead of the class

export function loadRollScreen() {
    document.getElementById("rollScreen").innerHTML = rollScreen;

    const luckCheckbox = document.getElementById("luckCheckbox");
    const luckInput = document.getElementById("luckInput");
    const setLuckButton = document.getElementById("setLuckButton");

    const moneyCheckbox = document.getElementById("moneyCheckbox");
    const moneyInput = document.getElementById("moneyInput");
    const setMoneyButton = document.getElementById("setMoneyButton");

    const rollCountCheckbox = document.getElementById("rollCountInput");
    const rollCountInput = document.getElementById("rollCountInput");
    const setRollCountButton = document.getElementById("rollCountInput");

    const itemTierCheckbox = document.getElementById("itemTierCheckbox");
    const itemTierSelect = document.getElementById("itemTierSelect");

    const lockShopToggle = document.getElementById("rollCountInput");
    const rollActionButton = document.getElementById("rollCountInput");

    const formatWithDots = (value) => {
        return value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const sanitizeAndStripPlaceholders = (value) => {
        return value.replace(/[^0-9]/g, "");
    };

    const setInputDefaults = (inputElement, maxValue, defaultValue) => {
        if (inputElement) {
            inputElement.dataset.min = -Math.pow(2, 31);
            inputElement.dataset.max = maxValue;
            inputElement.value = formatWithDots(defaultValue.toString()); // Set default value to max and format it
        }
    };

    setInputDefaults(luckInput, Math.pow(2, 31) - 1, 99);
    setInputDefaults(moneyInput, Number.MAX_SAFE_INTEGER, 10000);
    setInputDefaults(rollCountInput, Math.pow(2, 31) - 1, 10);

    for (var key in Rarities) {
        var option = document.createElement("option");
        option.value = Rarities[key];
        option.innerText = key;
        itemTierSelect.appendChild(option);
    }

    function validateAndClamp(inputElement) {
        const cursorPosition = inputElement.selectionStart;
        const sanitizedValue = sanitizeAndStripPlaceholders(inputElement.value);
        const min = parseInt(inputElement.dataset.min, 10);
        const max = parseInt(inputElement.dataset.max, 10);
        const clampedValue = clampNumber(
            parseInt(sanitizedValue, 10),
            min,
            max
        );
        inputElement.value = formatWithDots(clampedValue.toString());

        // Update cursor position to be after the inserted dot
        let newCursorPosition = cursorPosition;
        const sanitizedBeforeCursor = sanitizeAndStripPlaceholders(
            inputElement.value.substring(0, cursorPosition)
        );
        newCursorPosition =
            sanitizedBeforeCursor.length +
            Math.floor(sanitizedBeforeCursor.length / 3);
        inputElement.setSelectionRange(newCursorPosition, newCursorPosition);
    }

    function handleNumberInput(event) {
        const inputElement = event.target;
        const specialKeys = [
            "Backspace",
            "Delete",
            "ArrowLeft",
            "ArrowRight",
            "Home",
            "End",
        ];

        if (
            !/[\d]/.test(event.key) &&
            !specialKeys.includes(event.key) &&
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
    
    document
        .getElementById("setLuckButton")
        .addEventListener("click", function () {
            this.blur();
            const luck = parseInt(
                sanitizeAndStripPlaceholders(luckInput.value),
                10
            );
            hackInstance.setTeamLuck(luck);
        });

    document
        .getElementById("setMoneyButton")
        .addEventListener("click", function () {
            this.blur();
            const money = parseInt(
                sanitizeAndStripPlaceholders(moneyInput.value),
                10
            );
            hackInstance.setMoney(money);
        });

    document
        .getElementById("setRollCountButton")
        .addEventListener("click", function () {
            this.blur();
            const rollCount = parseInt(
                sanitizeAndStripPlaceholders(rollCountInput.value),
                10
            );
            hackInstance.setRollCount(rollCount);
        });

    document
        .getElementById("rollActionButton")
        .addEventListener("click", async function () {
            this.blur();
            const button = document.getElementById("rollActionButton");
            button.disabled = true; // Disable the button when clicked

            try {
                const luck = parseInt(
                    sanitizeAndStripPlaceholders(luckInput.value),
                    10
                );
                const money = parseInt(
                    sanitizeAndStripPlaceholders(moneyInput.value),
                    10
                );
                const rollCount = parseInt(
                    sanitizeAndStripPlaceholders(rollCountInput.value),
                    10
                );
                const itemTier = parseInt(
                    document.getElementById("itemTierSelect").value
                );

                const itemTierChecked =
                    document.getElementById("itemTierCheckbox").checked;
                const lockChecked =
                    document.getElementById("lockShopToggle").checked;
                const moneyChecked =
                    document.getElementById("moneyCheckbox").checked;
                const rollChecked =
                    document.getElementById("rollCountCheckbox").checked;
                const luckChecked =
                    document.getElementById("luckCheckbox").checked;

                await hackInstance.roll(
                    itemTierChecked ? itemTier : null, // Rarities[itemTier]
                    lockChecked,
                    moneyChecked ? money : null,
                    rollChecked ? rollCount : null,
                    luckChecked ? luck : null
                );

                // If the command runs to the end without an error, keep the button locked for 2 more seconds
                setTimeout(() => {
                    button.disabled = false;
                }, 1250);
            } catch (error) {
                // If an error occurs, re-enable the button instantly
                console.error(error);
                button.disabled = false;
            }
        });

    document
        .getElementById("lockShopToggle")
        .addEventListener("change", function () {
            this.blur();
            const lockShop = lockShopToggle.checked;
            hackInstance.setLockRarities(lockShop);
            showToast(`${lockShop ? "Locked" : "Unlocked"} Shop! `);
        });

    // Variable to track if the dropdown is open
    let isDropdownOpen = false;

    // // Event listener for clicks on the document
    // document.addEventListener("mousedown", function (event) {
    //     if (isDropdownOpen && !itemTierSelect.contains(event.target)) {
    //         // If the dropdown is open and click is outside the select element, blur it
    //         itemTierSelect.blur();
    //     }
    // });

    itemTierSelect.addEventListener("click", function (event) {
        if (isDropdownOpen) {
            // If the dropdown is already open and click happens on the select, do nothing special
            this.blur();
            isDropdownOpen = false;
        } else {
            isDropdownOpen = true;
        }
    });

    // itemTierSelect.addEventListener("change", function () {
    //     // When an option is selected, blur the select element and reset the state
    //     this.blur();
    //     isDropdownOpen = false;
    // });
    // Event listener for clicks outside the inputs
    document.addEventListener("mousedown", function (event) {
        if (
            !luckCheckbox.contains(event.target) &&
            !luckInput.contains(event.target) &&
            !setLuckButton.contains(event.target) &&
            !moneyCheckbox.contains(event.target) &&
            !moneyInput.contains(event.target) &&
            !setMoneyButton.contains(event.target) &&
            !rollCountCheckbox.contains(event.target) &&
            !rollCountInput.contains(event.target) &&
            !setRollCountButton.contains(event.target) &&
            !itemTierCheckbox.contains(event.target) &&
            !itemTierSelect.contains(event.target) &&
            !lockShopToggle.contains(event.target) &&
            !rollActionButton.contains(event.target)
        ) {
            luckCheckbox.blur();
            luckInput.blur();
            setLuckButton.blur();
            moneyCheckbox.blur();
            moneyInput.blur();
            setMoneyButton.blur();
            rollCountCheckbox.blur();
            rollCountInput.blur();
            setRollCountButton.blur();
            itemTierCheckbox.blur();
            itemTierSelect.blur();
            lockShopToggle.blur();
            rollActionButton.blur();
            isDropdownOpen = false;
        }
    });

}

document.addEventListener("DOMContentLoaded", () => {
    loadRollScreen(); // Ensure the roll screen is loaded when the DOM is ready
});
