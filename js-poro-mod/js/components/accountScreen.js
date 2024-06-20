import { createDropdown } from "../../components/dropdown.js";
import { loadAchievementsLayout } from "./accountLayouts/achievementsLayout.js";
import { loadEggModLayout } from "./accountLayouts/eggModLayout.js";
import { loadGamemodesLayout } from "./accountLayouts/gamemodesLayout.js";
import { loadGamestatsLayout } from "./accountLayouts/gamestatsLayout.js";
import { loadStartersLayout } from "./accountLayouts/startersLayout.js";
import { loadVoucherUnlocksLayout } from "./accountLayouts/voucherUnlocksLayout.js";
import { loadVouchersLayout } from "./accountLayouts/vouchersLayout.js";
import { loadEggPityLayout } from "./accountLayouts/eggPityLayout.js";
import { loadUnlockPityLayout } from "./accountLayouts/unlockPityLayout.js";

export function loadAccountScreen() {
    const settingsContainer = document.getElementById("layoutContainer");
    if (!settingsContainer) {
        console.error("Element with id 'settingsContainer' not found.");
        return;
    }

    // Create the accountScreen container
    const accountScreenElement = document.createElement("div");
    accountScreenElement.id = "accountScreen";
    accountScreenElement.className = "container";
    accountScreenElement.style.display = "none";
    settingsContainer.appendChild(accountScreenElement);

    // Create Dropdown for selecting sublayout
    const options = [
        "Achievements",
        "Starters",
        "Gamemodes",
        "Vouchers",
        "Voucher Unlocks",
        "Egg MOD",
        "Gamestats",
        "Egg Pity",
        "Unlock Pity",
    ];
    const dropdown = createDropdown(
        options.map((option) => ({
            value: option.toLowerCase(),
            text: option,
        })),
        (value) => {
            loadSubLayout(value);
        },
        "accountOptionsSelect"
    );

    // Add dropdown to the accountScreen
    accountScreenElement.appendChild(dropdown);

    // Create a container for the sublayouts
    const subLayoutContainer = document.createElement("div");
    subLayoutContainer.id = "subLayoutContainer";
    accountScreenElement.appendChild(subLayoutContainer);

    // Function to load sublayouts based on selection
    function loadSubLayout(layout) {
        subLayoutContainer.innerHTML = ""; // Clear previous layout

        switch (layout) {
            case "achievements":
                loadAchievementsLayout(subLayoutContainer);
                break;
            case "starters":
                loadStartersLayout(subLayoutContainer);
                break;
            case "gamemodes":
                loadGamemodesLayout(subLayoutContainer);
                break;
            case "vouchers":
                loadVouchersLayout(subLayoutContainer);
                break;
            case "voucher unlocks":
                loadVoucherUnlocksLayout(subLayoutContainer);
                break;
            case "egg mod":
                loadEggModLayout(subLayoutContainer);
                break;
            case "gamestats":
                loadGamestatsLayout(subLayoutContainer);
                break;
            case "egg pity":
                loadEggPityLayout(subLayoutContainer);
                break;
            case "unlock pity":
                loadUnlockPityLayout(subLayoutContainer);
                break;
            default:
                console.error("Unknown layout selected.");
        }
    }

    console.log("Account screen initialized with dropdown and sublayouts.");

    // Show the accountScreen element
    accountScreenElement.style.display = "flex";

    loadSubLayout("achievements");
}

document.addEventListener("DOMContentLoaded", () => {
    loadAccountScreen(); // Ensure the account screen is loaded when the DOM is ready
});
