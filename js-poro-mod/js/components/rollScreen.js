import { DynamicTable } from "../../components/dynamicTable.js";
import { DynamicFieldset } from "../../components/dynamicFieldset.js";
import { createNumberInput } from "../../components/numberInput.js";
import { createDropdown } from "../../components/dropdown.js";
import { showToast } from "../../components/utils/showToast.js";
import { Rarities } from "../constants/rarities";
import hackInstance from "../actions/hack";
import { loadHeader } from "../../components/header.js";
import { createCheckbox } from "../../components/checkbox.js";
import { SingleLineContainer } from "../../components/singleLineContainer.js";

export function loadRollScreen() {
    const settingsContainer = document.getElementById("layoutContainer");
    if (!settingsContainer) {
        console.error("Element with id 'layoutContainer' not found.");
        return;
    }

    const rollScreenElement = document.createElement("div");
    rollScreenElement.id = "rollScreen";
    rollScreenElement.className = "container";
    rollScreenElement.style.display = "none";
    settingsContainer.appendChild(rollScreenElement);

    const mainTable = new DynamicTable();

    const createSingleLineFieldset = (
        labelText,
        inputId,
        min,
        defaultVal,
        max,
        callback,
        checkboxId
    ) => {
        const fieldset = new DynamicFieldset(labelText);
        const singleLineContainer = new SingleLineContainer();

        const checkbox = createCheckbox(checkboxId, false, (isChecked) => {
            console.log(`${labelText} checkbox:`, isChecked);
        });

        const input = createNumberInput(inputId, min, defaultVal, max);
        input.classList.add("ele-container");

        const setButton = document.createElement("button");
        setButton.className = "set-button";
        setButton.innerHTML =
            '<span class="material-symbols-outlined">play_arrow</span>';
        setButton.addEventListener("click", () => {
            setButton.blur();
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

    const luckFieldset = createSingleLineFieldset(
        "Luck",
        "luck-input",
        minInt,
        99,
        maxInt,
        (value) => {
            hackInstance.setTeamLuck(value);
        },
        "luckCheckbox"
    );

    const moneyFieldset = createSingleLineFieldset(
        "Money",
        "money-input",
        minBigInt,
        10000,
        maxBigInt,
        (value) => {
            hackInstance.setMoney(value);
        },
        "moneyCheckbox"
    );

    const rollCountFieldset = createSingleLineFieldset(
        "Count",
        "rollCount-input",
        minInt,
        10,
        maxInt,
        (value) => {
            hackInstance.setRollCount(value);
        },
        "rollCountCheckbox"
    );

    const tierLocksingleLineContainer = new SingleLineContainer();

    const itemTierFieldset = new DynamicFieldset("Tier");
    const itemTierDropdown = createDropdown(
        Object.keys(Rarities).map((key) => ({
            value: Rarities[key],
            text: key,
        })),
        (value) => {
            console.log("Selected item tier:", value);
        },
        "itemTierSelect"
    );

    const lockfieldset = new DynamicFieldset("Lock");
    const locksingleLineContainer = new SingleLineContainer();
    const lockCheckbox = createCheckbox(
        "lockShopToggle",
        false,
        (isChecked) => {
            hackInstance.setLockRarities(isChecked);
            showToast(`${isChecked ? "Locked" : "Unlocked"} Shop!`);
        }
    );

    locksingleLineContainer.addElement(lockCheckbox);
    lockfieldset.addElement(locksingleLineContainer.getElement());

    const itemTierContainer = new SingleLineContainer();
    const itemTierCheckbox = createCheckbox(
        "itemTierCheckbox",
        false,
        () => {}
    );
    itemTierContainer.addElement(itemTierCheckbox);
    itemTierContainer.addElement(itemTierDropdown);
    itemTierFieldset.addElement(itemTierContainer.getElement());

    tierLocksingleLineContainer.addElement(lockfieldset.getElement());
    tierLocksingleLineContainer.addElement(itemTierFieldset.getElement());

    const endSet = tierLocksingleLineContainer.getElement();
    endSet.className = "flex-end";

    mainTable.addRow(luckFieldset.getElement());
    mainTable.addRow(moneyFieldset.getElement());
    mainTable.addRow(rollCountFieldset.getElement());
    mainTable.addRow(endSet);

    // Fieldset toggle
    const settingsFieldset = document.createElement("fieldset");
    settingsFieldset.className = "settings-fieldset";

    const legend = document.createElement("legend");
    legend.id = "settingsToggle";
    legend.style.cursor = "pointer";
    legend.style.userSelect = "none";
    legend.innerHTML = `
        <span class="material-symbols-outlined">settings</span>
        <span class="material-symbols-outlined" id="settingsToggleIcon">keyboard_arrow_down</span>
    `;

    const settingsContent = document.createElement("div");
    settingsContent.id = "settingsContent";
    settingsContent.style.display = "block";
    settingsContent.appendChild(mainTable.getElement());

    settingsFieldset.appendChild(legend);
    settingsFieldset.appendChild(settingsContent);

    // Roll button
    const rollButton = document.createElement("button");
    rollButton.id = "rollActionButton";
    rollButton.className = "roll-button";
    rollButton.textContent = "Roll";

    const buttonRow = document.createElement("div");
    buttonRow.className = "single-line-container";
    buttonRow.appendChild(rollButton);

    rollScreenElement.appendChild(settingsFieldset);
    rollScreenElement.appendChild(buttonRow);
    rollScreenElement.style.display = "flex";
    // const rollScreenClass = document.getElementsByClassName("rollScreen")[0];

    // Toggle logic
    const toggleIcon = document.getElementById("settingsToggleIcon");
    legend.addEventListener("click", () => {
        const isVisible = settingsContent.style.display !== "none";
        settingsContent.style.display = isVisible ? "none" : "block";
        toggleIcon.textContent = isVisible
            ? "keyboard_arrow_down"
            : "";
        toggleIcon.hidden = isVisible
            ? true
            : false;


        if (!isVisible) {
            rollButton.textContent = "Roll";
            rollButton.classList.remove("round-roll");
            rollScreenElement.style.flexGrow = 1;
        } else {
            rollButton.innerHTML =
                '<span class="material-icons-outlined">casino</span>';
            rollButton.classList.add("round-roll");
            rollScreenElement.style.flexGrow = 0;
        }
    });

    // Roll Action
    rollButton.addEventListener("click", async function () {
        this.blur();
        rollButton.disabled = true;

        try {
            const luck =
                parseInt(document.getElementById("luck-input").intValue, 10) ||
                0;
            const money =
                parseInt(document.getElementById("money-input").intValue, 10) ||
                0;
            const rollCount =
                parseInt(
                    document.getElementById("rollCount-input").intValue,
                    10
                ) || 0;
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
            const luckChecked = document.getElementById("luckCheckbox").checked;

            await hackInstance.roll(
                itemTierChecked ? itemTier : null,
                lockChecked,
                moneyChecked ? money : null,
                rollChecked ? rollCount : null,
                luckChecked ? luck : null
            );

            setTimeout(() => {
                rollButton.disabled = false;
            }, 1250);
        } catch (error) {
            console.error(error);
            rollButton.disabled = false;
        }
    });
}
