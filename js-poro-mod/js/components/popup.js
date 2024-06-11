import { loadRollScreen } from "./rollScreen.js";
import { loadAccountScreen } from "./accountScreen.js";
import { loadDataScreen } from "./dataScreen.js";
import "./generalLayout.js";

let currentLayout = 0; // 0 for roll, 1 for account, 2 for data

function appendToastContainer() {
    if (!document.getElementById("toast-container")) {
        const toastContainer = document.createElement("div");
        toastContainer.id = "toast-container";
        document.body.appendChild(toastContainer);
    }
}

export function initPopup() {
    console.log("Initializing popup");

    // Dynamically add Google Material Icons stylesheet
    const materialIconsLink = document.createElement("link");
    materialIconsLink.rel = "stylesheet";
    materialIconsLink.href =
        "https://fonts.googleapis.com/icon?family=Material+Icons+Outlined";
    materialIconsLink.onload = () =>
        console.log("Material Icons stylesheet loaded.");
    materialIconsLink.onerror = () =>
        console.error("Failed to load Material Icons stylesheet.");
    document.head.appendChild(materialIconsLink);

    // Append toast container
    appendToastContainer();

    // Load all layouts initially
    loadRollScreen();
    loadAccountScreen();
    loadDataScreen();

    // Show the roll layout and hide the others
    document.getElementById("rollScreen").style.display = "block";
    document.getElementById("accountScreen").style.display = "none";
    document.getElementById("dataScreen").style.display = "none";
    document.getElementById("settingsContainer").style.display = "none"; // Hide settings container initially

    // Event listeners for action buttons
    document
        .getElementById("rollButton")
        .addEventListener("click", function () {
            this.blur();
            currentLayout = 0;
            updateSelectedButton("rollButton");
            showLayout("rollScreen");
        });

    document
        .getElementById("accountButton")
        .addEventListener("click", function () {
            this.blur();
            currentLayout = 1;
            updateSelectedButton("accountButton");
            showLayout("accountScreen");
        });

    document
        .getElementById("dataButton")
        .addEventListener("click", function () {
            this.blur();
            currentLayout = 2;
            updateSelectedButton("dataButton");
            showLayout("dataScreen");
        });

    const popupContainer = document.getElementById("popupContainer");
    const logoContainer = document.getElementById("logoContainer");
    let isDragging = false;
    let offsetX, offsetY;

    logoContainer.addEventListener("mousedown", (e) => {
        isDragging = true;
        offsetX = e.clientX - popupContainer.offsetLeft;
        offsetY = e.clientY - popupContainer.offsetTop;
        logoContainer.style.cursor = "grabbing";
    });

    document.addEventListener("mousemove", (e) => {
        if (isDragging) {
            movePopup(e.clientX, e.clientY);
        }
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
        logoContainer.style.cursor = "grab";
    });

    logoContainer.addEventListener(
        "touchstart",
        (e) => {
            isDragging = true;
            const touch = e.touches[0];
            offsetX = touch.clientX - popupContainer.offsetLeft;
            offsetY = touch.clientY - popupContainer.offsetTop;
        },
        { passive: true }
    );

    document.addEventListener(
        "touchmove",
        (e) => {
            if (isDragging) {
                const touch = e.touches[0];
                movePopup(touch.clientX, touch.clientY);
            }
        },
        { passive: true }
    );

    document.addEventListener("touchend", () => {
        isDragging = false;
    });

    function movePopup(clientX, clientY) {
        const newX = clientX - offsetX;
        const newY = clientY - offsetY;
        const minX = 0;
        const minY = 0;
        const maxX = window.innerWidth - popupContainer.offsetWidth;
        const maxY = window.innerHeight - popupContainer.offsetHeight;

        popupContainer.style.left = `${Math.min(Math.max(newX, minX), maxX)}px`;
        popupContainer.style.top = `${Math.min(Math.max(newY, minY), maxY)}px`;
    }

    window.addEventListener("resize", () => {
        const rect = popupContainer.getBoundingClientRect();
        const minX = 0;
        const minY = 0;
        const maxX = window.innerWidth - popupContainer.offsetWidth;
        const maxY = window.innerHeight - popupContainer.offsetHeight;
        const newX = Math.min(Math.max(rect.left, minX), maxX);
        const newY = Math.min(Math.max(rect.top, minY), maxY);

        popupContainer.style.left = `${newX}px`;
        popupContainer.style.top = `${newY}px`;
    });

    const actionToggle = document.getElementById("actionToggle");
    const featureButtons = document.getElementById("featureButtons");
    const socialToggle = document.getElementById("socialToggle");
    const socialLinks = document.getElementById("socialLinks");
    const settingsContainer = document.getElementById("settingsContainer");

    actionToggle.addEventListener("click", function () {
        this.blur();
        const isActive = featureButtons.classList.toggle("active");
        settingsContainer.style.display = isActive ? "block" : "none";
        actionToggle.innerHTML = isActive
            ? '<span class="material-icons-outlined">chevron_left</span>'
            : '<span class="material-icons-outlined">chevron_right</span>';

        if (isActive) {
            showLayoutByCurrent();
        } else {
            hideAllLayouts();
        }
    });

    socialToggle.addEventListener("click", function () {
        this.blur();
        socialLinks.classList.toggle("active");
        socialToggle.innerHTML = socialLinks.classList.contains("active")
            ? '<span class="material-icons-outlined">keyboard_arrow_up</span>'
            : '<span class="material-icons-outlined">keyboard_arrow_down</span>';
    });

    document
        .getElementById("videoButton")
        .addEventListener("click", function () {
            this.blur();
            window.open("https://youtu.be/e-Dvv_VS-kY", "_blank");
        });

    document
        .getElementById("codeButton")
        .addEventListener("click", function () {
            this.blur();
            window.open("https://github.com/PokeRogueMOD/JsPoRoMOD", "_blank");
        });

    document
        .getElementById("twitchButton")
        .addEventListener("click", function () {
            this.blur();
            window.open("https://www.titch.tv/meshpaintbytes", "_blank");
        });

    // Set the roll button as selected by default
    updateSelectedButton("rollButton");

    console.log("Popup initialized");
}

function showLayout(layoutId) {
    hideAllLayouts();
    document.getElementById(layoutId).style.display = "block";
}

function showLayoutByCurrent() {
    switch (currentLayout) {
        case 0:
            showLayout("rollScreen");
            break;
        case 1:
            showLayout("accountScreen");
            break;
        case 2:
            showLayout("dataScreen");
            break;
    }
}

function hideAllLayouts() {
    document.getElementById("rollScreen").style.display = "none";
    document.getElementById("accountScreen").style.display = "none";
    document.getElementById("dataScreen").style.display = "none";
}

function updateSelectedButton(buttonId) {
    // Remove selected class from all buttons
    document.querySelectorAll(".icon-button").forEach((button) => {
        button.classList.remove("selected");
    });
    // Add selected class to the specified button
    document.getElementById(buttonId).classList.add("selected");
}

// Ensure DOM is fully loaded before accessing elements
document.addEventListener("DOMContentLoaded", () => {
    initPopup();
});
