import { loadRollScreen } from "./rollScreen.js";
import { loadAccountScreen } from "./accountScreen.js";
import { loadDataScreen } from "./dataScreen.js";

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

    document
        .getElementById("rollButton")
        .addEventListener("click", loadRollScreen);
    document
        .getElementById("accountButton")
        .addEventListener("click", loadAccountScreen);
    document
        .getElementById("dataButton")
        .addEventListener("click", loadDataScreen);

    loadRollScreen();

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

    actionToggle.addEventListener("click", () => {
        featureButtons.classList.toggle("active");
        actionToggle.innerHTML = featureButtons.classList.contains("active")
            ? '<span class="material-icons-outlined">chevron_left</span>'
            : '<span class="material-icons-outlined">chevron_right</span>';
    });

    socialToggle.addEventListener("click", () => {
        socialLinks.classList.toggle("active");
        socialToggle.innerHTML = socialLinks.classList.contains("active")
            ? '<span class="material-icons-outlined">keyboard_arrow_up</span>'
            : '<span class="material-icons-outlined">keyboard_arrow_down</span>';
    });

    document.getElementById("videoButton").addEventListener("click", () => {
        window.open("https://www.youtube.com", "_blank");
    });

    document.getElementById("codeButton").addEventListener("click", () => {
        window.open("https://example.com/repo", "_blank");
    });

    document.getElementById("twitchButton").addEventListener("click", () => {
        window.open("https://www.twitch.tv", "_blank");
    });

    console.log("Popup initialized");
}
