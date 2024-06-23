import { DynamicTable } from "../../components/dynamicTable.js";
import { DynamicFieldset } from "../../components/dynamicFieldset.js";
import { createNumberInput } from "../../components/numberInput.js";
import { createDropdown } from "../../components/dropdown.js";
import { showToast } from "../../components/utils/showToast.js";
import { Rarities } from "../constants/rarities";
import hackInstance from "../actions/hack";
import { loadHeader } from "../../components/header.js";
import { createCheckbox } from "../../components/checkbox.js"; // Import the new createCheckbox function
import { SingleLineContainer } from "../../components/singleLineContainer.js"; // Import the new SingleLineContainer component

export function loadRollScreen() {
    const settingsContainer = document.getElementById("layoutContainer");
    if (!settingsContainer) {
        console.error("Element with id 'settingsContainer' not found.");
        return;
    }

    // Create the rollScreen container
    const rollScreenElement = document.createElement("div");
    rollScreenElement.id = "rollScreen";
    rollScreenElement.className = "container";
    rollScreenElement.style.display = "none";
    settingsContainer.appendChild(rollScreenElement);

    // Load the header
    loadHeader("rollScreen", "Roll MOD");

    // Create Dynamic Table
    const mainTable = new DynamicTable();

    const createSingleLineFieldset = (labelText, inputId, min, defaultVal, max, callback, checkboxId) => {
        const fieldset = new DynamicFieldset(labelText);

        const singleLineContainer = new SingleLineContainer();
        
        const checkbox = createCheckbox(checkboxId, false, (isChecked) => {
            console.log(`${labelText} checkbox:`, isChecked);
        });

        const input = createNumberInput(
            inputId,
            min,
            defaultVal,
            max
        );
        input.classList.add("ele-container");

        const setButton = document.createElement("button");
        setButton.className = "set-button";
        setButton.innerHTML = '<span class="material-symbols-outlined">play_arrow</span>';
        
        setButton.addEventListener("click", () => {
            setButton.blur()
            callback(input.firstChild.intValue);
        });

        singleLineContainer.addElement(checkbox);
        singleLineContainer.addElement(input);
        singleLineContainer.addElement(setButton);

        fieldset.addElement(singleLineContainer.getElement());
        return fieldset;
    };

    const minInt = -Math.pow(2, 31);
    const maxInt = Math.pow(2, 31) - 1;

    const minBigInt = -Math.pow(2, 53);
    const maxBigInt = Math.pow(2, 53) - 1;

    const luckFieldset = createSingleLineFieldset("Luck", "luck-input", minInt, 99, maxInt, (value) => {
        hackInstance.setTeamLuck(value);
    }, "luckCheckbox");

    const moneyFieldset = createSingleLineFieldset("Money", "money-input", minBigInt, 10000, maxBigInt, (value) => {
        hackInstance.setMoney(value);
    }, "moneyCheckbox");

    const rollCountFieldset = createSingleLineFieldset("Count", "rollCount-input", minInt, 10, maxInt, (value) => {
        hackInstance.setRollCount(value);
    }, "rollCountCheckbox");

    const tierLocksingleLineContainer = new SingleLineContainer();
    const itemTierFieldset = new DynamicFieldset("Tier");
    const itemTierDropdown = createDropdown(Object.keys(Rarities).map((key) => ({
        value: Rarities[key],
        text: key,
    })), (value) => {
        console.log("Selected item tier:", value);
    },
    "itemTierSelect");

    const lockfieldset = new DynamicFieldset("Lock");

    const locksingleLineContainer = new SingleLineContainer();
    
    // Create Button Row
    const buttonRow = document.createElement("div");
    buttonRow.className = "single-line-container";

    const lockCheckbox = createCheckbox("lockShopToggle", false, (isChecked) => {
        hackInstance.setLockRarities(isChecked);
        showToast(`${isChecked ? "Locked" : "Unlocked"} Shop!`);
    });

    locksingleLineContainer.addElement(lockCheckbox);
    lockfieldset.addElement(locksingleLineContainer.getElement());

    const itemTierContainer = new SingleLineContainer();
    const itemTierCheckbox = createCheckbox("itemTierCheckbox", false, (isChecked) => {
        console.log("Item tier checkbox:", isChecked);
    });

    itemTierContainer.addElement(itemTierCheckbox);
    itemTierContainer.addElement(itemTierDropdown);
    itemTierFieldset.addElement(itemTierContainer.getElement());



    const eleLocksingleLineContainer = lockfieldset.getElement();
    eleLocksingleLineContainer.className = "flex-lock";



    tierLocksingleLineContainer.addElement(eleLocksingleLineContainer)

    tierLocksingleLineContainer.addElement(itemTierFieldset.getElement())

    mainTable.addRow(luckFieldset.getElement());
    mainTable.addRow(moneyFieldset.getElement());
    mainTable.addRow(rollCountFieldset.getElement());

    
    const endSet = tierLocksingleLineContainer.getElement()
    endSet.className = "flex-end";

    mainTable.addRow(endSet);

    const rollButton = document.createElement("button");
    rollButton.id = "rollActionButton";
    rollButton.className = "roll-button";
    rollButton.textContent = "Roll";
    buttonRow.appendChild(rollButton);

    mainTable.addRow(buttonRow);

    // Append elements to the roll screen
    rollScreenElement.appendChild(mainTable.getElement());

    console.log("Roll screen initialized with inputs and buttons.");

    // Show the rollScreen element
    rollScreenElement.style.display = "flex";

    // Event Listeners
    document.getElementById("rollActionButton").addEventListener("click", async function () {
        this.blur();
        const button = document.getElementById("rollActionButton");
        button.disabled = true;

        try {
            const luckInput = document.getElementById("luck-input");
            const moneyInput = document.getElementById("money-input");
            const rollCountInput = document.getElementById("rollCount-input");
            const itemTierSelect = document.getElementById("itemTierSelect");

            const luck = parseInt(luckInput.intValue, 10) || 0;
            const money = parseInt(moneyInput.intValue, 10) || 0;
            const rollCount = parseInt(rollCountInput.intValue, 10) || 0;
            const itemTier = parseInt(itemTierSelect.value);

            const itemTierChecked = document.getElementById("itemTierCheckbox").checked;
            const lockChecked = document.getElementById("lockShopToggle").checked;
            const moneyChecked = document.getElementById("moneyCheckbox").checked;
            const rollChecked = document.getElementById("rollCountCheckbox").checked;
            const luckChecked = document.getElementById("luckCheckbox").checked;

            console.log("Rolling with values:", {
                luck,
                money,
                rollCount,
                itemTier,
            });

            await hackInstance.roll(
                itemTierChecked ? itemTier : null,
                lockChecked,
                moneyChecked ? money : null,
                rollChecked ? rollCount : null,
                luckChecked ? luck : null
            );

            setTimeout(() => {
                button.disabled = false;
            }, 1250);
        } catch (error) {
            console.error(error);
            button.disabled = false;
        }
    });
}
